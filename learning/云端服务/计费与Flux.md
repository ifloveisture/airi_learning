# 计费与 Flux

> 云端「额度账本 + 支付入账 + 网关扣费」。真源在 **`server/apps/api`**（`@proj-airi/api-server`）。
> 深文：API README · ADR `server/docs/ai/adr/2026-10-04-subscription-credits.md`（Capacitor）· `2026-10-14-revenuecat-sandbox-subscriptions.md` · `2026-09-29-stripe-checkout-customer.md` 等。
> 本页只给 **learning 可读闭环**；边界见 [路由与能力](./路由与能力.md)。

## 状态

| 面 | 状态 |
|----|------|
| Flux 余额 / 事务账本 | **已实现**（Postgres 真源，Redis 旁路缓存） |
| Stripe checkout / webhook 入账 | **已实现**（缺 Key 时路由可 503） |
| RevenueCat → Capacitor Flux | **已实现**（订阅配额桶；Web Billing / 移动向） |
| Chat / TTS Official 网关扣费 | **已实现**（Capacitor 优先，再视策略扣购买 Flux） |
| LLM tiktoken 精细计价兜底 | 仍可能标 Phase / WIP；以 ADR 为准 |

## 两个额度桶（同一钱包）

`user_flux` 一行里两桶（微 Flux；1 Flux = 1_000_000 micro）：

| 桶 | 含义 |
|----|------|
| `flux` | 购买 / 发放的 Flux；**不过期** |
| `capacitor_flux` | 订阅 Capacitor 配额；按周期 refill 到 `capacitor_quota` |

扣费：`postFluxUsage` 一类路径先扣 Capacitor，不足时再按 `fallback_to_flux` 等策略扣购买 Flux。详情见 Capacitor ADR。

## 核心符号

| 符号 | 路径（均在 `server/apps/api/src/`） |
|------|------|
| `createBillingService` / 账本写 | `services/domain/billing/billing-service.ts` |
| Flux 读 / 缓存 | `services/domain/flux.ts` · `flux-cache.ts` |
| OpenAI 计费中间件 | `routes/openai/v1/middlewares/billing.ts` |
| Stripe 路由 | `routes/stripe/` |
| RevenueCat 路由 | `routes/revenuecat/` |
| 订阅对账 | `services/adapters/revenuecat-subscriptions.ts` |
| Stage 客户端 | `packages/stage-ui/src/composables/use-subscription.ts` |

表：`user_flux` · `flux_transaction` · `flux_usage` · LLM request 日志（以 drizzle / ADR 为准）。

## 钱流

```text
查余额
  GET /api/v1/flux → Flux 读服务（可带 Capacitor 字段）

扣费（LLM / TTS Official）
  → 预检可负担（两桶规则）
  → 上游成功后 settle / postFluxUsage（幂等：userId + requestId 等）

入账 · Stripe（买断 / 充值向）
  Stripe webhook → credit 购买 Flux
  或 Admin credit / setFlux

入账 · RevenueCat（订阅 Capacitor）
  POST /api/v1/revenuecat/webhook
    → 不按事件类型猜规则；读 RevenueCat 客户订阅 → BillingService.syncCapacitor
  POST /api/v1/revenuecat/sync（需登录）
    → 客户端购后 / Capacitor 页打开时补对账（防迟到 webhook）
  GET /api/v1/revenuecat/catalog · /capacitors
    → 套餐 / 产品列表（需登录）
```

TTS WS / Official Speech 产品侧挂 Flux，见 [语音合成](../语音交互/语音合成.md)。

## Stripe 路由

| 路由 | 作用 |
|------|------|
| `GET /api/v1/stripe/packages` | 套餐 |
| `POST /api/v1/stripe/checkout` | 创建 checkout |
| `POST /api/v1/stripe/webhook` | 入账 |
| `POST /api/v1/stripe/portal` | 客户门户 |

挂载：`server/apps/api/src/app.ts` → `/api/v1/stripe`。

## RevenueCat / Capacitor

| 项 | 事实 |
|----|------|
| 权威 | RevenueCat 存订阅状态；**本库不**存订阅行 / webhook 事件表 |
| 环境过滤 | `REVENUECAT_ENVIRONMENT`（默认 production）+ 可选 `REVENUECAT_SANDBOX_USER_IDS`；只给对应环境发 Capacitor |
| 客户端 | `@revenuecat/purchases-js` + `use-subscription`；购后调 `revenuecat.sync` |
| 与 Stripe | **并列入账通道**：Stripe 偏购买 Flux；RevenueCat 偏周期 Capacitor |

## 配置要点

| 名 | 角色 |
|----|------|
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Stripe；缺则该面不可用 |
| `REVENUECAT_WEBHOOK_AUTH` / `REVENUECAT_WEBHOOK_SECRET` | webhook 鉴权 / 签名 |
| `REVENUECAT_ENVIRONMENT` · `REVENUECAT_SANDBOX_USER_IDS` | 沙箱订阅是否入账 |
| 前端 `REVENUECAT_WEB_KEY`（或构建注入名以 stage-shared 为准） | Purchases JS |
| `FLUX_*` / `INITIAL_USER_FLUX` 等 | ConfigKV 或 env：预检与计价 |
| `WEB_APP_URL` 等 | checkout / portal 回跳 |

本地无 Stripe / RevenueCat Key 时：Auth / Chat WS / 自管 Provider 仍可学；**Official 扣费与充值 / 订阅**链路需配齐对应面。

## 阅读顺序

1. 本页：两桶 + 两路入账
2. ADR `2026-10-04-subscription-credits.md` · `2026-10-14-revenuecat-sandbox-subscriptions.md`
3. `billing-service.ts` + `routes/openai/v1` 某一条
4. `routes/stripe` · `routes/revenuecat`
5. （可选）`use-subscription.ts`
6. 回 [学习路径](./学习路径.md)
