# Admin与发放

## 定位

管理员同步 HTTP 给用户发放 FLUX（活动赠送）：**单次 POST，无 batch 表、无后台轮询**。封禁等能力见 better-auth admin 插件相关文档。

## 真源

| 项 | 路径 |
|----|------|
| 发放设计 | `apps/server/docs/ai-context/admin-flux-grants.md` |
| 路由 | `apps/server/src/routes/admin/flux-grants/index.ts` → `/api/admin/flux-grants` |
| 领域服务 | `apps/server/src/services/domain/admin/flux-grants.ts` |
| 封禁 | `apps/server/docs/ai-context/account-ban.md` |
| 验证 | `apps/server/docs/ai-context/verifications/admin-flux-grants.md` 等 |

## 跟读

1. `admin-flux-grants.md`
2. 路由 + `adminGuard`
3. service → `BillingService.creditFlux`
4. （可选）`account-ban.md` 热路径

## 调用要点

- `POST /api/admin/flux-grants?dryRun=true|false`
- Body 概念：`description` · `amount` · `emails[]` · 可选 `idempotencyKey`
- 权限：admin 角色 / 白名单机制以现网 `account-ban` / adminGuard 实现为准（文档有演进：从 `ADMIN_EMAILS` 迁到 role）

## 现状

已实现（同步 grant 替换旧异步 batch）。

## 边界

- **Stripe 充值**：用户付费入账走 webhook + ledger，不是 admin grant。
- **用户账单查询**：`flux_transaction`（grant 多为 `promo` 类），无单独 admin 报表表。
- **Admin UI**：可能在独立前端仓；本页管 API/服务语义。
