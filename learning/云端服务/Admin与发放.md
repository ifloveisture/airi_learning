# Admin与发放

## 定位

运维向「给人发 Flux / 改余额」在**账本语义**上落在 `server/apps/api` 的 `BillingService`。
本仓 **api-server 不挂专用 Admin HTTP / Admin UI**（见下「现状」）。

## 真源（现仓）

| 项 | 路径 / 事实 |
|----|-------------|
| 入账 | `BillingService.creditFlux`（`server/apps/api/src/services/domain/billing/billing-service.ts`） |
| 绝对改余额 | `BillingService.setFlux` → ledger `type: 'admin_set'` |
| 发放区分 | `creditFlux` 可传 `type: 'promo'`（注释：Admin promo；默认 `'credit'` 给购买入账） |
| 购买入账调用方 | `services/domain/payment`（Stripe 等）→ `creditFlux`，**不是** admin 路由 |
| 账本表 | `flux_transaction`（含 `promo` / `admin_set` 等 type） |
| 路由否定证据 | `server/apps/api/src/app.test.ts`：`/admin`、`/admin/users`、`/api/admin/metrics`、`/api/admin/graphql` 期望 **404** |
| 旧文 | `apps/server/docs/ai-context/admin-flux-grants.md`、`/api/admin/flux-grants` **已不在本 API 面** |

用户付费入账（Stripe / RevenueCat）见 [计费与Flux](./计费与Flux.md)。

## 读码前印象

```text
（外置 Admin 或脚本，若存在）
  → 调 BillingService.creditFlux({ type: 'promo', … })
     或 setFlux({ …, issuedByUserId })
  → Postgres user_flux + flux_transaction
  →（可选）Redis Flux 缓存失效

本仓已接好的入账
  → Stripe / RevenueCat webhook 与 payment 域 → creditFlux / Capacitor sync
```

本仓学习跟读：**认账本 API，不认本仓 Admin 页面。**

## 跟读

1. `billing-service.ts`：`creditFlux` · `setFlux`
2. `payment` 如何调用 `creditFlux`（购买路径）
3. `app.test.ts` 里对 `/admin*` 的 404 断言（确认无挂载）
4. （可选）Capacitor admin reset 字段 → Capacitor ADR

## 现状

| 项 | 说明 |
|----|------|
| `creditFlux` / `setFlux` 账本能力 | **已实现**（服务层 + 测试覆盖） |
| 购买 / 订阅入账 HTTP | **已实现**（Stripe · RevenueCat；见计费文） |
| 本仓专用 Admin HTTP / UI | **无**（api-server 显式 404；若外仓 Admin 存在，learning 不收录其路由） |

## 边界

- **Stripe / RevenueCat**：用户付费入账，不是 admin grant。
- **用户账单查询**：`flux_transaction` / usage；本仓无单独 admin 报表路由。
- **封禁 / 注销**：Auth 面与相关 ADR；不在本页展开。
