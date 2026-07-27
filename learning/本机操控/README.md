# 本机操控

> **研究线：`services/computer-use-mcp`**
> AIRI 的本机 **确定性执行基板**（MCP stdio），不是陪聊 Agent，也不是 Channel 桥。

## 从这里开始

1. [学习路径](./学习路径.md)
2. [边界与定位](./边界与定位.md)
3. [宿主接入](./宿主接入.md)（桌宠 MCP 附着 + 审批）
4. [终端泳道](./终端泳道.md)（当前产品主线）

## 专题

| 文档 | 内容 |
|------|------|
| [学习路径](./学习路径.md) | 跟读顺序与命令 |
| [边界与定位](./边界与定位.md) | 控制面 vs 执行面；与 Bot / 游戏域对照 |
| [宿主接入](./宿主接入.md) | `mcp-servers` · overlay · 审批作用域 |
| [终端泳道](./终端泳道.md) | exec / PTY / self-acquire / release gate |

## 边界

| 管什么 | 不管什么 |
|--------|----------|
| computer-use MCP 工具面、workflow、审批/审计契约 | Discord / TG / Satori → 通道 / 独立 Agent |
| 桌宠侧 MCP 附着与 `pty_session` 语义 | Minecraft / Twitter 正文 → [世界接入](../世界接入/) |
| macOS 执行后端（`macos-local`）主叙事 | 把本包当成「鼠标玩具」或独立 LLM loop |

## 源码锚点

| 层 | 路径 |
|----|------|
| 服务 | `services/computer-use-mcp`（`@proj-airi/computer-use-mcp`） |
| 包内真相 | `README.md` · `AGENTS.md` · `src/support-matrix.ts` |
| 宿主附着 | `apps/stage-tamagotchi/src/main/services/airi/mcp-servers` |
| 审批 UI | `apps/stage-tamagotchi/src/renderer/modules/computer-use-approval.ts` |
