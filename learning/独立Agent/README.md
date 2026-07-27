# 独立 Agent

> **研究线：进程内 LLM loop** — 主要是 Telegram / Satori
> `services/` 里其它包先看 [services全景](./services全景.md)，不要默认都算本域。

## 从这里开始

1. [services全景](./services全景.md) — 六个服务怎么归类
2. [学习路径](./学习路径.md)
3. [Telegram专章](./Telegram专章.md) / [Satori专章](./Satori专章.md)

## 专题

| 文档 | 内容 |
|------|------|
| [services全景](./services全景.md) | `services/*` 选型表 |
| [学习路径](./学习路径.md) | 跟读与实跑顺序 |
| [运营Runbook](./运营Runbook.md) | TG / Satori 检查清单 |
| [对照总览](./对照总览.md) | 与 Channel 桥、同构模型 |
| [Telegram专章](./Telegram专章.md) | grammy · pgvector · OTel · prompts |
| [Satori专章](./Satori专章.md) | Adapter · Mini-Core · capabilities |
| [Koishi接入教程](./Koishi接入教程.md) | 安装 → server-satori → satori-bot |
| [Koishi桥接坑点](./Koishi桥接坑点.md) | 平台坑在桥 |

## 边界

| 管什么 | 不管什么 |
|--------|----------|
| Telegram / Satori 独立 loop 深挖 | Discord Channel 桥 → [通道机器人](../通道机器人/) |
| services 归类与选型 | Minecraft / Twitter → [世界接入](../世界接入/)；MCP 执行基板 → [本机操控](../本机操控/) |
| | Web → [多端应用/网页端](../多端应用/网页端/) |

## 算法

| 专题 | 文档 |
|------|------|
| arrival / tick / 单飞 / 硬顶 | [Agent调度](../算法主线/Agent调度.md) |
| 余弦 + 时间衰减（Telegram） | [记忆检索](../算法主线/记忆检索.md) |
| 与 Stage 主轴对照 | [端到端闭环](../算法主线/端到端闭环.md) |
