# 云端服务

> **管什么**：`server/apps/auth` + `server/apps/api` 账号、同步、计费（Stripe / RevenueCat）、OpenAI 兼容网关、认证 UI、Admin、可观测 / ADR 导读
> **不管什么**：本机 Channel Hub（`pnpm dev:server` / server-runtime）是另一条栈；Stage 本地 IDB 会话在角色对话域

可只跑本地 Stage、完全不启云端。本域专题尽量自洽；深水细节以 `server/apps/*/README`、`server/docs/ai/adr/`、`server/AGENTS.md` 为权威。

**旧单体 `apps/server` / `@proj-airi/server` 已拆掉** → 先读 [与通道边界](./与通道边界.md)。

## 从这里开始

→ [学习路径](./学习路径.md)

## 专题

| 文档 | 内容 |
|------|------|
| [学习路径](./学习路径.md) | 跟读与本地启动 |
| [与通道边界](./与通道边界.md) | Auth · API · Channel 三套勿混 |
| [本地启动](./本地启动.md) | compose · 两进程 · 易混命令 |
| [路由与能力](./路由与能力.md) | 路由组 · Chat WS · 网关面 |
| [认证与OIDC](./认证与OIDC.md) | Better Auth · OIDC · token |
| [鉴权界面](./鉴权界面.md) | `apps/ui-server-auth` |
| [计费与Flux](./计费与Flux.md) | 两桶 · Stripe · RevenueCat Capacitor |
| [Admin与发放](./Admin与发放.md) | 账本 `creditFlux` / `setFlux`；本仓无 Admin HTTP |
| [可观测与分析](./可观测与分析.md) | OTel · Langfuse · PostHog |
| [服务端文档导读](./ai-context导读.md) | ADR / README 怎么用（旧 ai-context 目录已迁；文件名暂保留） |
