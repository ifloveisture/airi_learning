# Agent 调度

> 串：独立进程如何把「未读消息」变成 Action 链。
> 与 Stage `ingest` 正交。教材：[Telegram专章](../独立Agent/Telegram专章.md) · [Satori专章](../独立Agent/Satori专章.md)。

## 共用骨架

```text
消息到达
  → 写入未读池（超限截断）
  → 若该通道/全局未在跑 → 立即 loop
  → 周期性 tick：扫仍有未读的通道
  → 每轮：imagineAnAction → dispatch → continue / break / sleep
```

| 概念 | Telegram | Satori |
|------|----------|--------|
| 未读结构 | `unreadMessages[chatId]` | `unreadEvents[channelId]` |
| 单飞锁 | 全局 `processing` | **频道级** `isProcessing` |
| 周期间隔 | `60s` | `PERIODIC_LOOP_INTERVAL_MS = 60s` |
| 未读上限 | 约截最近 **100** | `MAX_UNREAD_EVENTS = 100` |
| 轮间延迟 | Action 链 / sleep | `LOOP_CONTINUE_DELAY_MS = 2500` |
| 硬顶 | while 链式（无统一 5） | `MAX_LOOP_ITERATIONS = 5` |
| 记忆 | 有向量 → [记忆检索](./记忆检索.md) | 无向量主路径 |

## Telegram：arrival 优先

源码：`services/telegram-bot/src/bots/telegram/index.ts`

```text
onMessageArrival
  if processing: 只入未读，不重入
  else:
    processing = true
    解释/落库（含 embedding）→ 未读 push
    未读 > 100 → slice(-100)
    立刻 loopIterationForChat → shift 队头
    finally: processing = false

另：setTimeout 周期 60s
  → 有会话 / 无会话 两套 periodic
```

`imagineAnAction`（`llm/actions.ts`）根据未读计数与提示词产出 JSON Action；`read_unread_messages` 会清该聊未读并拼最近消息 + 向量回忆。

### 打断（代码在，主路径未接）

`agent/interruption.ts`：

| 条件 | 结果 |
|------|------|
| `processingTime < 1000` | 永不打断 |
| `processingTime > 30000` | 必打断 |
| 中间 | `P = (messageCount/5) * (1 - min(processingTime/10000, 1))`，再 `random < P` |

Telegram 专章注明：attention / interruption **主循环里注释未接**——学现网行为时不要当成已上线策略。

## Satori：频道锁 + 硬顶

源码：`services/satori-bot/src/core/constants.ts` · `core/loop/scheduler.ts`

| 常数 | 值 | 作用 |
|------|----|------|
| `PERIODIC_LOOP_INTERVAL_MS` | 60000 | 周期扫未读频道 |
| `LOOP_CONTINUE_DELAY_MS` | 2500 | 同轮迭代间隔 |
| `MAX_LOOP_ITERATIONS` | 5 | 单次触发硬顶，防刷 API |
| `MAX_UNREAD_EVENTS` | 100 | 未读池截断 |
| `MAX_ACTIONS_IN_CONTEXT` | 50 | actions 上限 |
| `ACTIONS_KEEP_ON_TRIM` | 20 | 超限保留条数（保成对链） |
| `SLEEP_DURATION_MS` | 30000 | sleep Action 默认量级 |

调度要点：

- arrival 与 periodic **可并存**；忙碌中只追加未读
- `isProcessing` 按 **channel** 隔离，避免全局一把锁堵死
- `send_message` 路径可发 `[INTERRUPT]`：发现新未读则中止发送，要求先 `read_unread_messages`

## 和 Stage 主轴的分界

| | Stage 编排 | 独立 Agent |
|--|------------|------------|
| 入口 | `ingest` FIFO | 未读池 + loop |
| 大脑位置 | 端内 / 云端 Provider | bot 进程内 LLM |
| 典型桥 | Discord Channel | 无（或自建协议） |

Channel 机器人走 Stage，**不要**在 Discord 竖切里找本篇 loop。
对照：[对照总览](../独立Agent/对照总览.md) · [通道机器人/学习路径](../通道机器人/学习路径.md)。

## 阅读顺序

1. [对照总览](../独立Agent/对照总览.md)
2. Telegram：`index.ts` 的 `onMessageArrival` / periodic
3. Satori：`constants.ts` → `scheduler.ts` → `queue.ts`
4. 需要回忆质量 → [记忆检索](./记忆检索.md)
5. [独立Agent/学习路径](../独立Agent/学习路径.md)
