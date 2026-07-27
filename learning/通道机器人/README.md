# 通道机器人

> **研究线：Bot（Channel 桥）** — Discord 等经 `server-sdk` 接到 Stage
> **不是** Telegram/Satori 那种进程内 Agent。

## 从这里开始

→ [学习路径](./学习路径.md) · 实跑 → [运营Runbook](./运营Runbook.md)

## 专题

| 文档 | 内容 |
|------|------|
| [学习路径](./学习路径.md) | Channel 通识 → Discord 竖切 |
| [Channel事件速查](./Channel事件速查.md) | 握手与 input/output |
| [Discord竖切](./Discord竖切.md) | 完整闭环与实跑 |
| [运营Runbook](./运营Runbook.md) | 联调检查清单 |

## 边界（本页写清即可）

| 管什么 | 不管什么 |
|--------|----------|
| Channel 事件、Discord 桥、Stage 模块接线 | 独立 LLM loop（Telegram/Satori） |
| `pnpm dev:server` / 桌面 channel-server | 云端账号计费（`apps/server`） |
| | 游戏 Playwright / MCP 执行基板 |

## 命令

```bash
pnpm dev:server
pnpm -F @proj-airi/discord-bot start
```
