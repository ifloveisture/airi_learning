# 认证与OIDC

## 定位

`apps/server` 用 Better Auth 做用户认证后端，并作为 OIDC Provider（PKCE）。Web / Electron / Pocket 持 Bearer access token 调受保护 API。

## 真源

| 项 | 路径 |
|----|------|
| 设计文 | `apps/server/docs/ai-context/auth-and-oidc.md` |
| Auth 装配 | `apps/server/src/libs/auth.ts` |
| 路由 | `apps/server/src/routes/auth/index.ts`（`/api/auth/*`） |
| Electron 回调 | `apps/server/src/routes/auth/oidc/electron-callback.ts` |
| 请求鉴权 | `apps/server/src/libs/request-auth.ts` |
| 客户端 | `packages/stage-ui/src/libs/auth-oidc.ts` · `stores/auth.ts` |
| 邮件 | `apps/server/docs/ai-context/email-auth-resend.md` |

## 跟读

1. `auth-and-oidc.md`
2. `libs/auth.ts`
3. `routes/auth/index.ts`
4. Stage 客户端 `auth-oidc.ts` + `stores/auth.ts`
5. （可选）邮件四条路径：`email-auth-resend.md`

## 命令 / env（摘）

```bash
pnpm -F @proj-airi/server dev
```

常见：`AUTH_GOOGLE_*` / `AUTH_GITHUB_*` · `OIDC_CLIENT_ID_WEB|ELECTRON|POCKET` · `AUTH_UI_URL`（指向认证 SPA）

## 现状

已实现。

## 边界

- **认证 SPA**（`apps/ui-server-auth`）：用户看得见的登录/注册页与 Electron 回调中继，不是 API 本身。
- **Flux 余额**：鉴权通过后另走计费；token 校验不读账本。
- **Discord/Telegram bots**：独立 service 身份，不走终端用户 OIDC。
