# 服务端文档导读

## 定位

旧单体下的 `apps/server/docs/ai-context/` **已不在仓内**。现在权威协作文档是：

| 层 | 路径 |
|----|------|
| API 包说明 | `server/apps/api/README.md` · `server/apps/api/AGENTS.md` |
| Auth 包说明 | `server/apps/auth`（README / AGENTS 以目录为准） |
| 决策记录 | `server/docs/ai/adr/*.md` |
| 仓级规则 | `server/AGENTS.md` |

learning 云端专题是入门；改高风险链路前应读 ADR + 对应 app README。

## 按问题选文

| 你想弄清 | 先读 |
|----------|------|
| Auth vs API vs Channel | [与通道边界](./与通道边界.md) |
| API 职责 / Redis / Streams | `server/apps/api/README.md` |
| HTTP 响应形状 | ADR `2026-10-19-http-response-conventions.md` |
| OIDC / JWT 边界 | ADR `2026-09-20-oidc-jwt-session-boundary.md` |
| Capacitor / RevenueCat | ADR `2026-10-04-subscription-credits.md` · `2026-10-14-revenuecat-sandbox-subscriptions.md` |
| Stripe checkout 客户 | ADR `2026-09-29-stripe-checkout-customer.md` |
| Flux usage / 缓存 | ADR `2026-10-04-flux-usage.md` · `2026-09-17-flux-cache-ttl.md` |
| 账号事件流 | ADR `2026-10-18-account-events-stream.md` |
| 统一错误 | ADR `2026-10-09-shared-error-response.md` · `http-error-shared` |

完整列表：扫 `server/docs/ai/adr/` 文件名。

## 跟读

1. [与通道边界](./与通道边界.md)
2. `server/apps/api/README.md`「快速结论」式段落
3. 按上表打开 1–2 篇 ADR
4. 对照 `server/apps/api/src/app.ts` 路由挂载

## 现状

ADR 活跃；与代码可能略有先后，以源码 + ADR 状态（accepted）为准。

## 边界

- **learning 云端其它篇**：帮助建立地图；冲突时以 ADR + 源码为准。
- **VitePress 用户手册**（`docs/content/.../manual/`）：面向配置 Provider 的终端用户，不是服务端内部设计。
