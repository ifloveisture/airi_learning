# 运营Runbook

## 定位

Telegram / Satori **独立 Agent** 实跑检查清单（进程内 LLM loop）。

## Telegram

| 步骤 | 动作 |
|------|------|
| 1 | 准备 Postgres（含向量相关迁移，按 `services/telegram-bot` 文档/schema） |
| 2 | 配置 bot token、模型/embed 相关 env（见服务 `.env.example`） |
| 3 | `pnpm -F @proj-airi/telegram-bot …` 以 package.json scripts 为准启动 |
| 4 | 私聊/群测：消息是否进入 agent actions |
| 5 | 需要记忆时：确认 embed 与 DB 连通（`findRelevantMessages` 路径） |

真源：`services/telegram-bot/` · 同域《Telegram专章》。

## Satori

| 步骤 | 动作 |
|------|------|
| 1 | 起 Satori 兼容上游（如 Koishi + server-satori，步骤见《Koishi接入教程》） |
| 2 | 配 `services/satori-bot` 指向上游 |
| 3 | 启动 satori-bot，看 session/context 是否增长 |
| 4 | 平台坑（QQ 等）优先查桥，不先改 bot 核心 |

真源：`services/satori-bot/` · 《Satori专章》·《Koishi桥接坑点》。

## 常见失败

| 现象 | 先查 |
|------|------|
| 无回复 | 模型 key、单飞/队列是否卡住、prompt 硬顶 |
| 记忆不命中 | 仅 Telegram 有向量；Satori 无同一套检索 |
| 与 Stage 不同步 | 独立 Agent **默认不**经 Stage chat store；不要用 Stage 云同步预期套 bot |

## 边界

- Discord Channel 桥用通道机器人 Runbook。
- Minecraft/Twitter 是其它 services，不在本页。
