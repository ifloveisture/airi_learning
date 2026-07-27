# 云端服务

> **管什么**：`apps/server` 账号、同步、计费、OpenAI 兼容网关、认证 UI、Admin、可观测导读
> **不管什么**：本机 Channel Hub（`pnpm dev:server` / server-runtime）是另一条栈；Stage 本地 IDB 会话在角色对话域

可只跑本地 Stage、完全不启云端。本域专题尽量自洽；深水细节以 `apps/server/docs/ai-context/` 为权威。

## 从这里开始

→ [学习路径](./学习路径.md)

## 专题

| 文档 | 内容 |
|------|------|
| [学习路径](./学习路径.md) | 跟读与本地启动 |
| [本地启动](./本地启动.md) | env · DB · 命令 · 无云能用什么 |
| [路由与能力](./路由与能力.md) | 路由组 · Chat WS · 网关面 |
| [认证与OIDC](./认证与OIDC.md) | Better Auth · OIDC · token |
| [鉴权界面](./鉴权界面.md) | `apps/ui-server-auth` |
| [计费与Flux](./计费与Flux.md) | 余额 · 扣费 · Stripe |
| [Admin与发放](./Admin与发放.md) | Flux grant · ban 指针 |
| [可观测与分析](./可观测与分析.md) | OTel · Langfuse · PostHog |
| [ai-context导读](./ai-context导读.md) | server 内 35 篇索引怎么用 |
| [与通道边界](./与通道边界.md) | 和 server-runtime 分工（自洽说明） |
