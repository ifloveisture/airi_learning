# services 全景

> `services/` 下 **6** 个包并不都是「独立 Agent」。先按表选型，再进对应研究域。

## 总表

| 服务 | 包名 | 路径 | server-sdk | 认知在哪 | 文档域 |
|------|------|------|-----------|----------|--------|
| Discord | `@proj-airi/discord-bot` | `services/discord-bot` | 是 | Stage（本进程只做桥） | [通道机器人](../通道机器人/) |
| Telegram | `@proj-airi/telegram-bot` | `services/telegram-bot` | **否** | **本进程** Agent loop | **本域** [Telegram专章](./Telegram专章.md) |
| Satori | `@proj-airi/satori-bot` | `services/satori-bot` | **否** | **本进程** 临时 Mini-Core | **本域** [Satori专章](./Satori专章.md) |
| Minecraft | `@proj-airi/minecraft-bot` | `services/minecraft` | 是 | **本进程认知栈** + Channel 回 Stage | [世界接入/游戏与操控](../世界接入/游戏与操控.md) · [迁移背景](../世界接入/Minecraft迁移背景.md) |
| Twitter | （见包内） | `services/twitter-services` | 是（可选） | 无自主 loop；命令/MCP | [世界接入/游戏与操控](../世界接入/游戏与操控.md) |
| Computer Use | `@proj-airi/computer-use-mcp` | `services/computer-use-mcp` | 否 | 宿主规划；本包是 MCP 执行基板 | **[本机操控](../本机操控/)** |

## 各包先看什么（扫 `services/` 时用）

| 服务 | 建议入口 | 一句话 |
|------|----------|--------|
| Discord | `src/bots/discord/` + sdk 接线 | `input:text` / `output:text` 桥，大脑在 Stage |
| Telegram | `bots/telegram/index.ts` → `llm/actions.ts` | grammy + JSON Action + pgvector + OTel |
| Satori | `core/loop/` + `docs/HANDLER.md` | Satori WS/HTTP + 临时 Mini-Core + PGlite |
| Minecraft | `src/cognitive/` + README Deprecation | 四层认知经 Channel；Mineflayer 路径在迁 |
| Twitter | `docs/architecture-*.md` + 双 Adapter | Playwright 自动化，不是陪聊 tick |
| Computer Use | [本机操控/学习路径](../本机操控/学习路径.md) · 包 `AGENTS.md` | stdio MCP 执行基板，规划在桌宠 |

## 怎么记

```text
独立 Agent（本域）
  = 进程内自己跑 LLM loop，且当前不把「大脑」交给 Stage
  → Telegram、Satori

通道机器人
  = 感官/执行器，大脑在 Stage
  → Discord（标杆）

世界接入 · 其它
  = 游戏认知（Minecraft，经 Channel）、社交自动化（Twitter）

本机操控
  = MCP 执行基板（规划在 Stage / 桌宠）
  → [本机操控](../本机操控/)
```

## 学习优先级（独立 Agent 线）

1. [对照总览](./对照总览.md) + 本页
2. [Telegram专章](./Telegram专章.md)（重型样本）
3. [Satori专章](./Satori专章.md)（协议 + 临时 Core）
4. 游戏 / 社交 → [世界接入](../世界接入/)；本机 MCP → [本机操控](../本机操控/)

不要把 Discord / computer-use 硬塞进「独立 Agent」同构模型。
