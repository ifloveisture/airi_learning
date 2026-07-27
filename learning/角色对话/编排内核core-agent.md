# 编排内核core-agent

## 定位

`packages/core-agent`：框架无关的聊天编排内核（LLM 流、消息类型、context registry、hooks、spark-notify agent）。**无 Vue/Pinia/IDB**。

## 真源

| 项 | 路径 |
|----|------|
| 导出 | `packages/core-agent/src/index.ts` |
| 运行时 | `src/runtime/`（orchestrator、llm-service、context-registry） |
| 契约 | `src/contracts/` |
| 消息 | `src/messages/` |
| Agent | `src/agents/spark-notify/` |
| Stage 消费方 | `packages/stage-ui/src/stores/chat.ts`（`createChatOrchestratorRuntime`） |

## 跟读

1. `index.ts` 看公开 API
2. `runtime/chat-orchestrator-runtime.ts`（或同名 orchestrator）
3. `stage-ui/stores/chat.ts`：哪些依赖被注入（provider、session、analytics…）
4. （可选）`agents/spark-notify/`

## 现状

已实现；Stage 主聊天路径依赖它。`packages/core-character` 仍是空壳（`export {}`），规划中的表现管线，**未**接管 TTS/口型。

## 边界

| 层 | 职责 |
|----|------|
| core-agent | 编排、流式、上下文注册、generation 作废等纯逻辑 |
| stage-ui chat store | Pinia、IDB 会话、云 sync、模块、UI 状态 |
| core-character | 空包；将来角色表现，今天不要 import 期望行为 |

队列/上下文长度等**判定常数**若你要调参，可在同文件与 `stores/chat` 对照；算法主线有规则摘要，本页以包边界为准。
