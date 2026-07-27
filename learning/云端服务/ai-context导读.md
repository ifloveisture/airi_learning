# ai-context导读

## 定位

`apps/server/docs/ai-context/` 是**服务端权威协作文档**（装配、路由、账本、验证证据）。learning 云端专题是入门；改高风险链路前应读本目录原文。

## 真源

| 项 | 路径 |
|----|------|
| 索引 | `apps/server/docs/ai-context/README.md` |
| 装配入口 | `apps/server/src/app.ts` |

## 按问题选文

| 你想弄清 | 先读 |
|----------|------|
| 怎么启动/注入 | `architecture-overview.md` |
| 某 API 落到哪 | `transport-and-routes.md` |
| 表 / 缓存谁为准 | `data-model-and-state.md` |
| 能不能加后台 loop | `workers-and-runtime.md` |
| Redis key / PubSub | `redis-boundaries-and-pubsub.md` |
| 计费 / Stripe | `billing-architecture.md` · `stripe-pricing.md` · `flux-meter.md` |
| Auth / OIDC | `auth-and-oidc.md` · `email-auth-resend.md` |
| 注销 / 封禁 | `account-deletion.md` · `account-ban.md` |
| Admin 发币 | `admin-flux-grants.md` |
| 指标归谁 | `metrics-ownership.md` → conventions / metrics / langfuse |
| 产品埋点 | `product-analytics-*.md` |
| 是否验过 | `verifications/*.md` |

## 跟读

1. 读 ai-context `README.md`「快速结论」
2. 按上表打开 1–2 篇
3. 对照 `app.ts` 路由挂载
4. 需要证据时打开对应 `verifications/`

## 现状

文档活跃维护；与代码可能略有先后，以源码 + verification 日期为准。

## 边界

- **learning 云端其它篇**：帮助建立地图；冲突时以 ai-context + 源码为准。
- **VitePress 用户手册**（`docs/content/.../manual/`）：面向配置 Provider 的终端用户，不是服务端内部设计。
