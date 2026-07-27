# Telegram 独立 Agent

> 路径：`services/telegram-bot` · 包名 `@proj-airi/telegram-bot`
> **定位**：进程内自主 Agent（grammy + xsAI + Postgres/pgvector）。**不**经 `server-sdk` / Stage Channel。
> 选型对照：[对照总览](./对照总览.md) · Channel 样本请走 [通道机器人/Discord竖切](../通道机器人/Discord竖切.md)

## 目录地图

```text
services/telegram-bot/
├── README.md / .env / docker-compose.yaml / drizzle/
└── src/
    ├── index.ts              # OTel → initDb → startTelegramBot
    ├── types.ts              # BotContext / ChatContext / Action
    ├── bots/telegram/        # grammy + 入队 + handleLoopStep + dispatch
    │   └── agent/actions/    # read-message / send-message
    ├── llm/                  # imagineAnAction；贴纸/照片 vision
    ├── db/ · models/         # Drizzle schema + 读写
    ├── prompts/              # Velin：人格 / ticking / 拆句 / 读消息
    └── utils/
```

| 区 | 职责 |
|----|------|
| `bots/telegram` | 宿主与 Agent 循环 |
| `llm` | JSON 决策与多模态解读 |
| `db` / `models` | 消息、贴纸、图、joined chats；向量列 |
| `prompts` | 工具清单与人格（非 Stage 角色卡） |

依赖有 grammy、`@xsai/*`、drizzle、pg、OTel；**无** `server-sdk` / Stage UI。

## 启动链

1. `src/index.ts`：Pretty 日志 + OpenTelemetry（默认 OTLP `localhost:4318`）
2. `initDb()`（`db/index.ts`）；业务侧多用 `useDrizzle()` 惰性连接
3. `startTelegramBot()`（`bots/telegram/index.ts`）：
   - `new Bot(TELEGRAM_BOT_TOKEN)`
   - 建 `BotContext`（队列、未读、`processedIds`、`chats`）
   - 注册 sticker/photo/text → 入队；`/add_sticker_pack`（需 `ADMIN_USER_IDS`）
   - `init` + `start({ drop_pending_updates: true })`
   - `loopPeriodic`：每 **60s** 对已有/无 chat 再 tick

启动命令（见 README）：`tsx --env-file=.env --env-file-if-exists=.env.local … src/index.ts`。

## 消息 → Agent 循环

### 入队与去重

键：`` `${chat.id}-${message_id}` `` → `processedIds`。

| 事件 | 初始 status | 后续 |
|------|-------------|------|
| text | `ready` | 直接处理 |
| sticker / photo | `pending` | interpret 后再 `ready` |

`onMessageArrival`（单飞）：interpret → `recordJoinedChat` → `recordMessage`（含 embedding）→ `unreadMessages[chatId]`（单聊约截最近 100）→ **立刻** `loopIterationForChat` → `shift` 队头。

### 循环骨架

```text
handleLoopStep
  → imagineAnAction（LLM → JSON Action）
  → dispatchAction
      → 若返回 () => handleLoopStep，则 while 链式续跑
  → 直到非 function

另：每 60s loopPeriodic 主动想一轮
```

`handleLoopStep` 还会：新 `AbortController`；截断过长 `messages`/`actions`；压缩重复 `read_unread_messages` 结果。

### `imagineAnAction`

`llm/actions.ts`：

- System：`system-ticking-v1` + `personality-v1`（Velin）
- User：incoming、历史 actions、未读计数、时间
- `@xsai/generate-text`；剥 `<think>` / markdown 围栏；`best-effort-json-parser`
- 归一化：`parameters` 展平、action/字段别名

这是「prompt + 容错 JSON」的工具调用，不是 Stage 的正式 tool schema。

## Action 一览

定义：`types.ts` · Prompt：`prompts/system-ticking-v1.velin.md` · 分发：`dispatchAction`

| action | 行为 | 续跑 |
|--------|------|------|
| `read_unread_messages` | 最近消息 + **向量相关**回忆；清该聊未读 | 成功则是 |
| `send_message` | 再 LLM 拆句 → typing → 发送 → `recordMessage` | 是 |
| `send_sticker` | 校验 fileId 后发送 | 是 |
| `list_stickers` / `list_chats` | 结果推入 actions | 否 |
| `continue` | 等到下一 tick | 否 |
| `break` | 清空该 chat 的 messages/actions | 否 |
| `sleep` | 实现约固定 30s | 是 |
| `search_google` / `read_history_messages` | 类型有，**dispatch 未实现** | — |

`come_up_ideas` / `come_up_goals` 出现在部分 prompt，**不在** Action 联合类型 → default「未实现」。

`attention-handler` / `interruption` 代码在，主循环里**注释未接**。

## DB / Embedding

`db/schema.ts` 要点：

| 表 | 用途 |
|----|------|
| `chat_messages` | 正文 + `content_vector_{1536,1024,768}` + HNSW |
| `stickers` / packs / recent | 贴纸 |
| `photos` | 图描述 + 向量 |
| `joined_chats` | 已知会话 |
| `memory_*` | **表已建**，主路径几乎未用 |

`EMBEDDING_DIMENSION` 决定写哪列。读未读时：`findRelevantMessages`（余弦 + 时间衰减）。
公式、权重、Top-K、上下文窗 → [算法主线/记忆检索](../算法主线/记忆检索.md)。
公式与 Top-K → [算法主线/记忆检索](../算法主线/记忆检索.md)；loop 调度 → [Agent调度](../算法主线/Agent调度.md)。

批量回填：`pnpm -F @proj-airi/telegram-bot script:embed-chat`。

## 环境变量（`.env` → `.env.local`）

| 变量 | 用途 |
|------|------|
| `TELEGRAM_BOT_TOKEN` | BotFather |
| `DATABASE_URL` | Postgres；compose 宿主机多为 **5433** |
| `LLM_API_*` / `LLM_MODEL` / `LLM_RESPONSE_LANGUAGE` | 决策与拆句 |
| `LLM_VISION_*` | 贴纸/照片描述 |
| `EMBEDDING_*` / `EMBEDDING_DIMENSION` | 向量（例：Ollama `nomic-embed-text` + `768`） |
| `ADMIN_USER_IDS` | 贴纸包命令 |
| `LLM_OLLAMA_DISABLE_THINK` | 可选 |
| `OTEL_EXPORTER_OTLP_*` | 可选覆盖 4318 |

## docker-compose

`docker-compose.yaml` **不跑 bot**，只提供：

| 服务 | 端口 | 作用 |
|------|------|------|
| pgvector | 5433→5432 | 向量库 |
| otel-collector | 4317 / 4318 | OTLP |
| tempo / prometheus / grafana | 3200 / 9090 / 3000 | 观测 |

起来后：`pnpm -F @proj-airi/telegram-bot db:push`，再 `start`。

## 本地跑通

```bash
pnpm i && pnpm run build:packages
ollama pull nomic-embed-text   # 示例

cd services/telegram-bot
cp .env .env.local             # 改 TOKEN、DATABASE_URL(5433)、LLM_*、EMBEDDING_*
docker compose up -d
cd ../..
pnpm -F @proj-airi/telegram-bot db:push
pnpm -F @proj-airi/telegram-bot start
```

可选：Grafana `http://localhost:3000`。

## 提示词分层（prompts/）

| 文件 | 作用 |
|------|------|
| `personality-v1.velin.md` | 人格「ReLU/热卤」；刻意反 helpful-assistant |
| `system-ticking-v1.velin.md` | Ticking 工具清单 + JSON Action 协议 |
| `message-split-v1.velin.md` | `send_message` 二次 LLM：拟人拆句、可选 reply_to |
| `action-read-messages.velin.md` | 读未读结果模板：最近消息 + 向量回忆 |
| `index.ts` / `utils.ts` | Velin 加载与 `div`/`vif` 拼装 |

Prompt 里可能出现 `come_up_ideas` / `come_up_goals`，但 **不在** `Action` 联合类型 → 走 default「未实现」。

## models/ 数据访问

| 文件 | 职责 |
|------|------|
| `chat-message.ts` | `recordMessage`（写 embedding 列）、`findLastNMessages`、`findRelevantMessages`（余弦 + 时间衰减） |
| `chats.ts` | `joined_chats` 登记 / 列表 |
| `stickers.ts` / `sticker-packs.ts` | 贴纸描述与包（含 `/add_sticker_pack`） |
| `photos.ts` | 图片描述 |
| `common.ts` | DB/grammy 消息 → 一行文本（喂 LLM） |
| `chat-completions-history.ts` | LLM 请求旁路落库（审计） |

## Action 实现要点

- **read_unread**（`agent/actions/read-message.ts`）：最近 30 条 + embed 未读 → 向量检索 → 拼 `action-read-messages`；带 OTel 子 span。
- **send_message**（`agent/actions/send-message.ts`）：`message-split` → typing 抖动 → 逐条发送 → `recordMessage`。注释写明「发送中打断」已外提给 loop。
- **dispatchAction** 在 `bots/telegram/index.ts` 内，无独立 dispatcher 文件。

## 未接线实验（读代码时别当现网）

| 模块 | 路径 | 状态 |
|------|------|------|
| 群聊注意力 | `agent/attention-handler.ts` | 私聊必回、@/触发词/冷却等；**从未挂上**，调用处注释 |
| 长任务打断 | `agent/interruption.ts` | 按时长×新消息量估打断概率；`handleLoopStep` 内注释 |

含义：设计过「群吵不回 / 可打断」，当前主线仍是「有未读就 tick」。

## OTel 与 drizzle 细节

| 项 | 事实 |
|----|------|
| SDK 入口 | `src/index.ts`：`NodeSDK`，service `moeru_ai.airi.telegram_bot` → OTLP `4318` |
| 业务 span | `llm/actions.ts`（生成/解析）、`read-message.ts`（检索链） |
| auto-instrumentations | 在 package.json，**入口未挂载** |
| 生成迁移 | `pnpm -F @proj-airi/telegram-bot db:generate` |
| 日常推库 | `db:push`（dotenvx + drizzle-kit）；**无**运行时自动 migrate |
| SQL 历史 | `services/telegram-bot/drizzle/0000_*.sql` … |

`initDb()` / `useDrizzle()` 只连库；务必先 compose + `db:push` 再 `start`。

## 阅读顺序

1. `README.md` + `docs/content/zh-Hans/docs/integrations/telegram.md`
2. `src/index.ts` + `db/schema.ts` + `types.ts`
3. `bots/telegram/index.ts`（入队 → loop → dispatch）
4. `llm/actions.ts` + `prompts/system-ticking-v1.velin.md` + `personality-v1.velin.md`
5. `agent/actions/read-message.ts` + `models/chat-message.ts`
6. `agent/actions/send-message.ts` + `message-split-v1.velin.md`
7. （可选）`llm/sticker.ts` / `photo.ts`；`attention-handler`（未接线）；compose 观测
8. 对照 [Satori专章](./Satori专章.md) · [services全景](./services全景.md) · [通道机器人/Discord竖切](../通道机器人/Discord竖切.md)

## 适合 / 不适合

| 适合 | 不适合 |
|------|--------|
| 独立 Agent loop、JSON 工具分发 | Stage Channel / `server-sdk` |
| grammy、多模态预处理、打字模拟 | Stage UI 设置模块、context-bridge |
| pgvector 检索、Velin 提示分层 | 把本 bot 当成 AIRI 主产品陪聊架构 |
| 服务侧 OTel | 完整 memory_* 产品闭环（尚未接上） |
| 读「未接线」注意力/打断设计 | 当成现网行为 |
