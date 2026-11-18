# 角色对话

> **管什么**：聊天编排、会话、角色卡、Providers、对话工具、core-agent、记忆边界
> **边界**：Hearing/TTS 在语音交互域；网关 HTTP 实现在云端服务域；本域写 Stage 侧契约与消费方式

## 从这里开始

→ [学习路径](./学习路径.md)

## 专题

| 文档 | 内容 |
|------|------|
| [学习路径](./学习路径.md) | 跟读顺序 |
| [聊天编排](./聊天编排.md) | Orchestrator · 子 store · ingest |
| [编排内核core-agent](./编排内核core-agent.md) | 包边界 · 与 Pinia 壳 |
| [会话与云同步](./会话与云同步.md) | IDB · outbox · `/ws/chat` |
| [角色卡片](./角色卡片.md) | ccc · airi-card |
| [模型提供商](./模型提供商.md) | 定义表 · runtime · consciousness |
| [对话工具](./对话工具.md) | Web Search · HA（桌宠）· 记忆/Recipes · 工具 UI · Artistry |
| [ComfyUI 工作流](./ComfyUI工作流.md) | 本地 Artistry：API JSON 模板 · 暴露字段 · 启用步骤 |
| [长期记忆边界](./长期记忆边界.md) | Stage 本地条目 · TG 向量 · pgvector 空壳 |

## 能力速览

主路径：流式对话、本地 IDB、意识模型、角色卡、Provider、**Stage 本地长期记忆**（条目 + 工具）、工具调用 UI。可启用：Web Search、桌宠 HA、Recipes/后台任务、Artistry（须接生图后端）、云同步。进行中：`memory-pgvector`、短期记忆设置页。
