# 认证与OIDC

## 定位

**`server/apps/auth`**（`@proj-airi/auth-server`）用 Better Auth 做用户认证后端，并作为 OIDC Provider（PKCE）。Web / Electron / Pocket 持 Bearer access token 调 **API** 受保护路由。

资源 API（`server/apps/api`）**不**实例化 Better Auth；只校验 Auth 签发的 JWT（JWKS）。

## 真源

| 项 | 路径 |
|----|------|
| Auth 进程 | `server/apps/auth/src/`（`auth.ts` · `routes.ts` · `server.ts` · `main.ts`） |
| OIDC / 会话边界 ADR | `server/docs/ai/adr/2026-09-20-oidc-jwt-session-boundary.md` |
| 共享 schema | `server/packages/auth-shared` |
| API 侧鉴权 | `server/apps/api` 的 `sessionMiddleware` / `authGuard`（包内 middlewares） |
| Stage 客户端 | `packages/stage-ui/src/libs/auth-oidc.ts` · `stores/auth.ts` |
| 认证 SPA | `apps/ui-server-auth` → [鉴权界面](./鉴权界面.md) |

旧路径 `apps/server/src/libs/auth*` / `docs/ai-context/auth-and-oidc.md` **已迁走**；以本表与 ADR 为准。

## 跟读

1. ADR `2026-09-20-oidc-jwt-session-boundary.md`
2. Auth `auth.ts` + `routes.ts`
3. API 侧 middleware：JWT 如何进 context
4. Stage `auth-oidc.ts` + `stores/auth.ts`
5. （可选）邮件 / 注销相关 ADR

## 命令 / env（摘）

```bash
pnpm -F @proj-airi/auth-server dev
pnpm -F @proj-airi/api-server dev   # 验证受保护 API 时
```

常见：`AUTH_GOOGLE_*` / `AUTH_GITHUB_*` · `OIDC_CLIENT_ID_WEB|ELECTRON|POCKET` · `AUTH_UI_URL`（指向认证 SPA）；以 Auth `env` schema 为准。

## 现状

已实现（Auth / API 分进程）。

## 边界

- **认证 SPA**（`apps/ui-server-auth`）：用户看得见的登录/注册页与 Electron 回调中继，不是 API 账本。
- **Flux 余额**：鉴权通过后另走 API 计费；token 校验不读账本。
- **Discord/Telegram bots**：独立 service 身份，不走终端用户 OIDC。
