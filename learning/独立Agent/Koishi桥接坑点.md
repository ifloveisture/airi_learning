# Koishi 桥接坑点

> 接 QQ（或其它平台）时，**坑主要在 Koishi 一侧**，不在 `services/satori-bot`。
> **跟做教程**：[Koishi接入教程](./Koishi接入教程.md)（里程碑 M1–M5）。
> Satori bot 只认 Satori 协议（默认 `localhost:5140`）。专章：[Satori专章](./Satori专章.md)。

## 为什么感觉「坑很多」

完整链路是三截，每一截都有自己的版本、鉴权、群权限：

```text
QQ 协议实现（Lagrange / NTQQ / 其它 onebot 实现…）
  → Koishi 适配器（常见 onebot）
  → Koishi 插件 server-satori（对外暴露 Satori WS/HTTP）
  → @proj-airi/satori-bot（本仓）
```

AIRI 仓内**几乎不写**前两截怎么过 QQ 风控；官方集成文只要求：「已运行启用 **server-satori** 的 Koishi」。
所以你会感觉坑多：**那是平台桥生态的坑，不是 Mini-Core 文档没写完。**

EVENT 样例里也能看出历史路径：`platform: onebot`，`_data.raw` 带 NTQQ/Lagrange 字段——证明 bot 假定上游已经把群消息**标准化成 Satori 事件**。

## 责任边界

| 层 | 谁负责 | AIRI learning 深度 |
|----|--------|-------------------|
| QQ 登录 / 扫码 / 风控 / 群权限 | 协议端 + Koishi 适配器 | 教程只给 OneBot **模式**；具体实现跟外仓文档 |
| `server-satori` 端口、Token、`path` | Koishi 配置 | 教程 M2：**与 AIRI `/satori` 默认对齐** |
| IDENTIFY → 未读 → Action | `satori-bot` | **主教材** |

| 适合现在做的 | 不适合和 bot 源码搅在一起的 |
|--------------|------------------------------|
| 按 [Koishi接入教程](./Koishi接入教程.md) 过里程碑 | 调试「为什么扫码上不了 QQ」的实现细节 |
| 确认 READY 后事件长什么样 | 换 onebot 实现、改协议端版本当 bot bug |
| 沙盒先通再上 QQ | 把 Telegram 式「一键起 bot」期待套到 QQ |

## 排查顺序（QQ 群失败时）

从上到下，**先证明上一层活着再怪下一层**：

| # | 验收 | 挂了多半是 |
|---|------|------------|
| 1 | 协议端 / 适配器显示账号在线 | QQ 协议、登录态、实现版本 |
| 2 | Koishi 能收到该群消息（控制台/插件日志） | 群权限、未收群消息、适配器过滤 |
| 3 | `server-satori` 在听（叙事默认 `5140`） | 插件未启用、端口冲突、**path 与 AIRI 不一致** |
| 4 | `satori-bot` 发出 IDENTIFY 并收到 READY | `SATORI_WS_URL` / `SATORI_TOKEN` 与 Koishi 不一致 |
| 5 | bot 日志出现 `message-created` 入队 | 事件类型/过滤；或仍停在桥 |
| 6 | 有 `read_unread` / `send_message` | LLM 配置或 loop 策略（这才是 bot 域） |

常见误判：第 1～3 步失败，却去改 `satori-bot` 的 planner。

**最高频配置坑：** AIRI 默认带 `/satori` 前缀，而官方 `server-satori` 文档里 `path` 默认可能是空字符串——必须二选一对齐。详见教程 M2。

## 和 Telegram 对照（为什么 TG 感觉「好接」）

| | Telegram bot | Satori + QQ |
|--|--------------|-------------|
| 平台 SDK | 本仓直接 grammy | **仓外** Koishi + 协议端 |
| 进程数 | 基本 1 | 至少：协议端 + Koishi + satori-bot |
| 群能力 | BotFather / 隐私模式等一套文档 | QQ 侧权限与实现差异大 |
| learning 主路径 | [Telegram专章](./Telegram专章.md) | [Koishi接入教程](./Koishi接入教程.md) + [Satori专章](./Satori专章.md) |

## 学习策略建议

1. **先深挖 bot**：按 [Satori专章](./Satori专章.md) 读 HANDLER / Adapter / loop——不必先打通 QQ。
2. **再单独开 Koishi 战役**：跟 [Koishi接入教程](./Koishi接入教程.md) 到 M2（沙盒）再决定是否上 M4 QQ。
3. **两里程碑都绿**，再拼 `SATORI_*` 与 LLM，验收群内一轮 `read` → `send`。

调度常数与 INTERRUPT → [Agent调度](../算法主线/Agent调度.md)。

## 仓内可对照的文件

| 文件 | 用途 |
|------|------|
| [Koishi接入教程](./Koishi接入教程.md) | 逐步跟做 |
| `services/satori-bot/README.md` | 前置：Koishi + `server-satori` |
| `docs/content/zh-Hans/docs/integrations/satori.md` | 官方短文 |
| `services/satori-bot/docs/EVENT.md` | 事件字段；含 onebot / NTQQ·Lagrange 痕迹 |
| `services/satori-bot/src/config.ts` | `SATORI_WS_URL` 默认 5140 |

QQ 协议实现的安装与排错，以各组件自己的文档为准；本页管**边界与误判**，教程管**跟做步骤**。
