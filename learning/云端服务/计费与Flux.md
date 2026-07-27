# 计费与 Flux

> 云端「额度账本 + 支付入账 + 网关扣费」。包内深文：`apps/server/docs/ai-context/billing-architecture.md`、`flux-meter.md`、`stripe-pricing.md`。
> 本页只给 **learning 可读闭环**；边界见 [路由与能力](./路由与能力.md)。

## 状态

| 面 | 状态 |
|----|------|
| Flux 余额 / 事务账本 | **已实现**（Postgres 真源，Redis 旁路缓存） |
| Stripe checkout / webhook 入账 | **已实现**（缺 Key 时路由可 503） |
| Chat / TTS Official 网关扣费 | **已实现** |
| LLM tiktoken 精细计价兜底 | 架构文标 Phase 4 / WIP |

## 核心符号

| 符号 | 路径 |
|------|------|
| `createBillingService`（`debitFlux` / `consumeFluxForLLM` / `creditFlux*`） | `apps/server/src/services/domain/billing/billing-service.ts` |
| `createFluxService`（`getFlux`） | `…/services/domain/flux.ts` |
| `createFluxMeter`（`assertCanAfford` / `accumulate`） | `…/billing/flux-meter.ts` |
| OpenAI 路由计费中间件 | `routes/openai/v1/middlewares/billing.ts` |
| Stripe 路由 | `routes/stripe/` |

表：`user_flux` · `flux_transaction` · `llm_request_log`（见 billing-architecture）。

## 三条钱流

```text
查余额
  GET /api/v1/flux → FluxService.getFlux()

扣费（LLM）
  POST /api/v1/openai/chat/completions
    → 预检余额（如 FLUX_PER_REQUEST）
    → 上游生成
    → priceChatUsage → settle → consumeFluxForLLM
      （同一 Postgres tx：锁定余额 → 写事务；按 userId+requestId 幂等）

扣费（TTS）
  POST /api/v1/audio/speech
    → assertCanAfford
    → 上游 OK 后 FluxMeter.accumulate（跨阈值再 consume）

入账
  Stripe webhook（checkout.session.completed 等）
    → creditFluxFromStripeCheckout / invoice 路径
  或 Admin credit / setFlux
```

TTS WS / Official Speech 产品侧挂 Flux，见 [语音合成](../语音交互/语音合成.md)。

## Stripe 路由

| 路由 | 作用 |
|------|------|
| `GET /api/v1/stripe/packages` | 套餐（`STRIPE_FLUX_PRODUCT_ID` 等 ConfigKV） |
| `POST /api/v1/stripe/checkout` | 创建 checkout |
| `POST /api/v1/stripe/webhook` | 入账 |
| `POST /api/v1/stripe/portal` | 客户门户 |

挂载：`apps/server/src/app.ts` → `/api/v1/stripe`。

## 配置要点

| 名 | 角色 |
|----|------|
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | 支付；缺则 Stripe 面不可用 |
| `STRIPE_FLUX_PRODUCT_ID` | ConfigKV（非纯 env） |
| `FLUX_PER_REQUEST`（默认约 5）等 | ConfigKV：预检与计价系数 |
| `FLUX_PER_1K_CHARS_TTS` | TTS 计价相关 |
| `INITIAL_USER_FLUX` | 新用户初始额度 |
| `WEB_APP_URL` 等 | checkout / portal 回跳 |

本地无 Stripe Key 时：Auth / Chat WS / 自管 Provider 仍可学；**Official 扣费与充值**链路需配齐。

## 阅读顺序

1. 本页建立三流
2. `billing-architecture.md`
3. `billing-service.ts` + `routes/openai/v1` 某一条 operation
4. `routes/stripe` webhook
5. 回 [学习路径](./学习路径.md)
