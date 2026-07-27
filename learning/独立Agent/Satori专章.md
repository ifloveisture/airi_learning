# Satori 独立 Agent

> 路径：`services/satori-bot` · 包名 `@proj-airi/satori-bot`
> **定位**：经 Satori 协议 + Koishi 桥接多平台的独立进程；`src/core/` 是 **temporary Mini-Core**。
> **不**经 Stage Channel。选型：[对照总览](./对照总览.md)

## 永久 vs 临时（必记）

摘自 `services/satori-bot/README.md` 叙事：

| 区域 | 路径 | 命运 |
|------|------|------|
| Adapter | `src/adapter/satori/` | **保留** |
| Capabilities | `src/capabilities/` | **保留**（将来作工具模块给 AIRI Core） |
| Dispatcher + DB | `core/dispatcher.ts`、`lib/` | 意图保留 |
| Loop / Planner | `core/loop/`、`core/planner/` | **将删除**，认知交回主 Core |

学本篇时：把 loop 当「占位认知」，把 Adapter + Actions 当「将来还会留下的边界」。

## 目录地图

```text
services/satori-bot/
├── README.md / docs/{HANDLER,EVENT,PERSISTENCE,PROMPTS}.md
└── src/
    ├── index.ts
    ├── config.ts                 # Valibot 环境变量
    ├── adapter/satori/           # WS + HTTP
    ├── core/                     # 临时 Mini-Core
    │   ├── loop/                 # queue + scheduler
    │   ├── planner/              # imagineAnAction
    │   ├── dispatcher.ts
    │   └── session/context.ts
    ├── capabilities/actions/     # send / read / system
    └── lib/                      # PGlite + schema
```

服务内文档优先读：`docs/HANDLER.md`（端到端）。

## 启动链

`src/index.ts`：

```text
initDb()                                  # PGlite migrate
  → new SatoriClient({ wsUrl, token, apiBaseUrl })
  → createBotContext（可从 DB 恢复队列/未读）
  → setupReadyEventHandler / setupMessageEventHandler
  → satoriClient.connect()                # IDENTIFY → READY
  → globalRegistry.loadStandardActions
  → startPeriodicLoop（每 60s）
```

```bash
pnpm -F @proj-airi/satori-bot dev    # tsx watch + .env/.env.local
pnpm -F @proj-airi/satori-bot start
```

## Adapter：协议与入队

### Opcode（`adapter/satori/types.ts`）

| op | 名 | 作用 |
|----|-----|------|
| 3 → 4 | IDENTIFY → READY | 鉴权；READY 带 `logins[]`，据此建 HTTP API |
| 0 | EVENT | 业务事件（如 `message-created`） |
| 1 / 2 | PING / PONG | 心跳约 10s |
| 5 | META | 元信息 |

WS 收事件；**发消息走 HTTP**（`SatoriAPI.sendMessage` → `message.create`，头带 Platform / User-ID）。

断线约 5s 自动重连。字段说明见 `docs/EVENT.md`。

### 入队（`core/loop/queue.ts`）

1. 订 `message-created`
2. 去重键 `` `${channelId}-${message.id}` `` → `processedIds`（进程内 Set）
3. `pushToEventQueue` 落 DB + 内存队列
4. `onMessageArrival`：record → unread → `loopIterationForChannel`

自消息（`user.id === selfId`）出队但不进 unread。

## Loop / Planner / Dispatcher

```text
onMessageArrival / periodic
  → handleLoopStep（最多 MAX_LOOP_ITERATIONS=5）
      → imagineAnAction（planner/llm-client.ts）
      → dispatchAction → capabilities
      → shouldContinue ? 等 ~2.5s 再 tick
```

| 层 | 职责 |
|----|------|
| Loop | 入队、频道锁、周期扫未读 |
| Planner | Prompt + 历史 + unread → JSON Action（非原生 FC） |
| Dispatcher | Valibot 校验 → `globalRegistry` 执行 → 写入 `chatCtx.actions` |

**Action 集合：** `send_message` · `read_unread_messages` · `continue` · `break` · `sleep` · `list_channels`。

范式：先看 Unread Pool，常先 `read_unread_messages` 再 `send_message`；发送前若有新未读可 INTERRUPT（`send-message.ts`）。

常量见 `core/constants.ts`（60s 周期、上下文裁剪等）。

## 持久化（PGlite）

`lib/db.ts` + `lib/schema.ts`：嵌入式 Postgres，**无需** docker PG。

表：`channels` · `messages` · `event_queue` · `unread_events`。

Memory-First：会话上下文在 RAM；队列/未读/消息落盘可恢复。详见 `docs/PERSISTENCE.md`。

**没有** Telegram 那套 pgvector embedding 主路径。

## 环境变量（`config.ts`）

| 变量 | 用途 |
|------|------|
| `SATORI_WS_URL` | 默认 `ws://localhost:5140/satori/v1/events` |
| `SATORI_API_BASE_URL` | 可选；可从 WS 推导 |
| `SATORI_TOKEN` | 可选 |
| `LLM_API_KEY` / `LLM_API_BASE_URL` / `LLM_MODEL` | **必填** |
| `LLM_OLLAMA_DISABLE_THINK` | 可选 |
| `DB_PATH` | PGlite 目录 |

README 若提到 `LLM_RESPONSE_LANGUAGE`，**当前 config 未接入**。

## 本地跑通

前置：**Koishi + `server-satori`**（默认叙事端口 5140）+ OpenAI 兼容 LLM。
跟做安装与对齐：[Koishi接入教程](./Koishi接入教程.md)；排障边界：[Koishi桥接坑点](./Koishi桥接坑点.md)。

```bash
pnpm i
cp services/satori-bot/.env services/satori-bot/.env.local
# 填 SATORI_*、LLM_*
pnpm -F @proj-airi/satori-bot dev
```

**不需要** `pnpm dev:server`（6121）或 Stage。DB 日常靠启动 migrate；也可用 `db:generate` / `db:push`。

## Capabilities 细节

| 路径 | 职责 |
|------|------|
| `capabilities/definition.ts` | `ActionHandler` / `ActionResult`（`success` / `shouldContinue` / `result`） |
| `capabilities/registry.ts` | `globalRegistry.loadStandardActions(client)` |
| `actions/send-message.ts` | 未读非空则 **INTERRUPT** 拒发；HTTP 发送 + `recordMessage` |
| `actions/read-messages.ts` | 按 **event id** 精准删未读（内存+DB），防竞态丢消息 |
| `actions/system.ts` | `continue` / `break` / `sleep`（可 `duration`）/ `list_channels` |

Prompt 分层见 `docs/PROMPTS.md`：Static（system + personality）→ History → Dynamic State（unread / 时间）→ 强制 JSON（非原生 Function Calling）。

## 常量全表（`core/constants.ts`）

| 常量 | 值 | 含义 |
|------|-----|------|
| `LOOP_CONTINUE_DELAY_MS` | 2500 | 续跑间隔 |
| `PERIODIC_LOOP_INTERVAL_MS` | 60000 | 周期 tick |
| `SLEEP_DURATION_MS` | 30000 | sleep 默认 |
| `MAX_LOOP_ITERATIONS` | 5 | 单轮硬顶（防刷 API） |
| `MAX_ACTIONS_IN_CONTEXT` | 50 | actions 上限 |
| `ACTIONS_KEEP_ON_TRIM` | 20 | 截断保留 |
| `MAX_UNREAD_EVENTS` | 100 | 未读池 |
| `MAX_RECENT_INTERACTED_CHANNELS` | 5 | 最近互动频道 |

调度语义（arrival / 频道锁 / 与 Telegram 对照）→ [算法主线/Agent调度](../算法主线/Agent调度.md)。

## todolist 已完成项 → 学习含义

见 `services/satori-bot/todolist.md`：

| 已完成 | 说明 |
|--------|------|
| 按 ID 删未读 | 异步入队下「整池清空」会丢消息 |
| Channel 级锁 + finally | 并发以频道为界，避免全局死锁 |
| 非阻塞调度 | arrival 与周期 tick 可并存 |
| `trimActions` 保成对链 | 截断不能切断 `send`+`continue` |
| `MAX_LOOP_ITERATIONS=5` | 硬顶 |
| PGlite 增量队列 I/O | Memory-First 可恢复 |
| 去掉粗暴 `process.exit(1)` | 温和失败 |

未完成债（可读）：actions Summary 压缩、更细 Trace、清 `as any`。

迁移：启动时 `drizzle-orm/pglite/migrator` 读 `services/satori-bot/drizzle/`（与 Telegram 的 **push** 习惯不同）。

## 与 Telegram Action 对照

| Action | Telegram | Satori |
|--------|----------|--------|
| `send_message` | 拆句 + typing | 发前 INTERRUPT |
| `read_unread_messages` | + 向量回忆 | 无向量 |
| `continue` / `break` / `sleep` | 有 | 有（sleep 可 duration） |
| `list_chats` | 有 | → `list_channels` |
| `send_sticker` / `list_stickers` | 有 | 无 |
| 未实现类型债 | `search_google` 等 | 较少 |
| 续跑上限 | while 链式 | 硬顶 5 + 2.5s |

## 阅读顺序

1. `README.md`（temporary 边界）
2. `docs/HANDLER.md`
3. `src/index.ts`
4. `adapter/satori/client.ts` + `types.ts`
5. `core/loop/queue.ts` → `scheduler.ts`
6. `planner/llm-client.ts` + `docs/PROMPTS.md`
7. `dispatcher.ts` + `capabilities/**`
8. `docs/PERSISTENCE.md` + `lib/db.ts` + `todolist.md`
9. 对照 [Telegram专章](./Telegram专章.md) · [services全景](./services全景.md) · [通道机器人/Discord竖切](../通道机器人/Discord竖切.md)

## 与 Telegram 同构点

```text
平台事件 → 去重队列 → unread 池 → handleLoopStep
  → imagineAnAction(JSON) → dispatch → 可续跑 / 周期 tick
```

差异：Satori 把平台抽象成协议（靠 Koishi）；Telegram 写死 grammy，并多出向量记忆与 OTel 重栈。

## 适合 / 不适合

| 适合 | 不适合 |
|------|--------|
| Satori 协议、WS+HTTP 双通道 | Channel / `input:text` 闭环（用 Discord） |
| 轻量 Agentic loop、观察-再行动 | 把 Mini-Core 当最终 AIRI 认知架构 |
| 临时 Core 边界意识、合并叙事 | embedding / 长期记忆（看 Telegram） |
| PGlite 嵌入式持久化、竞态未读删除 | 语音、Live2D、桌宠 IPC |
