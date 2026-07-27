# 算法主线

> **管什么**：把各功能域串成一条**决策规则**链——何时切段、何时入队、如何调度、如何回忆、如何播控与口型
> **不管什么**：目录分层与功能清单（根级架构/地图）；包级读码步骤（各功能域）

事实以源码为准。本域只写**可复述的判定规则与常数**。

## 为什么单独成域

按「端 / 包」切开的笔记容易只见链路不见决策。本域回答：**同一条用户话语经过哪些阈值 / 队列 / 评分**。

## 文档索引

| 文档 | 串哪一段 |
|------|----------|
| [端到端闭环](./端到端闭环.md) | 总图：麦 → 聊天 → TTS → 口型；旁路 Bot / 独立 Agent |
| [切段与播控](./切段与播控.md) | VAD · TranscriptBuffer · TTS chunker · 播放优先级 |
| [编排与上下文](./编排与上下文.md) | FIFO · generation 作废 · 上下文长度 |
| [Agent调度](./Agent调度.md) | Telegram / Satori：arrival · tick · 单飞 · 硬顶 |
| [记忆检索](./记忆检索.md) | Telegram：余弦 + 时间衰减 · Top-K |
| [口型驱动](./口型驱动.md) | 音量 × 元音 morph · 平滑与帧率 |

## 规则落点（包路径，不强制跳域）

| 算法块 | 主要源码 |
|--------|----------|
| 切段 / 缓冲 / 播控 | `stage-ui/workers/vad` · `pipelines-audio` |
| 编排队列 / 上下文 | `core-agent` · `stage-ui/stores/chat` |
| Channel 桥进编排 | `context-bridge` → `ingest` |
| 独立 loop + 记忆 | `services/telegram-bot` · `satori-bot` |
| 口型 morph | `model-driver-lipsync` |

## 建议读法

1. [端到端闭环](./端到端闭环.md)
2. 按问题下钻专题
3. 改参数 / 排「为什么没进聊天」时回本域阈值表，再打开对应源码文件
