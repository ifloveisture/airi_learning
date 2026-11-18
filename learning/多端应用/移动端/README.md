# 移动端（Pocket）

> 只写 **`apps/stage-pocket`**（Capacitor）。发布面 **WIP**：可跟启动链与原生差异，**不**当与 Web/桌宠同级的完整产品专章。

## 定位

与 Web 同属 Vue + Vite 舞台壳，复用 `stage-ui` / `stage-layouts` / `stage-pages`。
差异在 **Capacitor 原生壳**：权限、深链、Host WebSocket 桥、本端 settings/devtools。

## 读码前印象

```text
cap-vite / Vite 起 WebView
  → main.ts（Hash/History · Pinia · i18n · Tres）
  → 复用 stage-pages（exclude 部分页）+ 本端 pages
  → Stage 舞台与聊天核同 Web
  → 原生：权限 · deep link · Auth handler · AiriHostBridge（WS）
```

| 层 | 真源 |
|----|------|
| 包 | `apps/stage-pocket`（`@proj-airi/stage-pocket`） |
| 入口 | `src/main.ts` · `src/App.vue` · `src/pages/index.vue` |
| Capacitor | `capacitor.config.ts` · `ios/` · `android/` |
| 路由 exclude | `vite.config.ts`：排除共享 `settings/connection/index`、`beat-sync` 等；本端自备 connection |
| WS 桥 | `src/modules/websocket-bridge.ts`（原生持 socket；`server-sdk` 管协议态） |
| 深链 / Auth | `modules/deep-links.ts` · `modules/web-authentication.ts` |
| 权限 UI | `pages/settings/system/permissions.vue` · `components/permissions/` |
| Hearing 模型 | 包 README：Sherpaw / Paraformer 等经共享 Vite 插件拉取 |

## 命令

```bash
pnpm -F @proj-airi/stage-pocket run dev:web      # 浏览器里先跑壳
pnpm -F @proj-airi/stage-pocket run dev:ios
pnpm -F @proj-airi/stage-pocket run dev:android
```

CI 名：`release-pocket-ios.yml` · `release-pocket-android.yml`（见工程横切发布地图）。

## 跟读

→ [学习路径](./学习路径.md)

网页主路径仍先读 [网页端](../网页端/)。订阅 / Flux Capacitor 桶见云端 [计费与Flux](../../云端服务/计费与Flux.md)。

## 现状

| 项 | 状态 |
|----|------|
| 与 Web 共享 Stage 核 | **已实现**（壳侧） |
| iOS / Android 打包与权限面 | **进行中 / 可源码启用** |
| 与桌宠同级产品文档 | **故意不写**；本页只给 WIP 跟读 |

## 边界

- **不是** PWA 专章：Web PWA 见 [网页端/PWA](../网页端/PWA.md)；Pocket 另有 `src/modules/pwa.ts`，主叙事仍是 Capacitor。
- **不是** Kirie / Godot 宿主。
- Channel 扫码连接：本端 `settings/connection`（共享 connection 页被 exclude）。
