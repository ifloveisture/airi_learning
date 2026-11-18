# PWA（Web）

> Web 端的 Service Worker / 更新提示。**薄专章**：不写完整离线产品设计。

## 定位

`apps/stage-web` 经 Vite PWA 插件注册 SW；运行时用 `usePWAStore` 在可更新时弹 toast。

## 真源

| 项 | 路径 |
|----|------|
| Vite 插件 | `apps/stage-web/vite.config.ts`（PWA 段） |
| 注册 | `apps/stage-web/src/modules/pwa.ts`（`registerSW`） |
| Store | `apps/stage-web/src/stores/pwa.ts`（`usePWAStore`） |
| UI | `@proj-airi/stage-ui` `ToasterPWAUpdateReady` |
| 挂载 | `App.vue` 启动时拉 `usePWAStore()` |

## 行为印象

```text
首屏后 registerSW
  → onNeedRefresh → toast（ToasterPWAUpdateReady）
  → 用户确认 → updateSW()
```

| 条件 | 行为 |
|------|------|
| `VITE_APP_TARGET_HUGGINGFACE_SPACE` 为真 | **不**注册 PWA 更新流 |
| SSR | store 直接 return |
| Hugging Face / 部分嵌入目标 | 以 env 为准，勿假设必有安装横幅 |

## 跟读

1. `stores/pwa.ts`
2. `vite.config.ts` 里 PWA 配置键
3. 本地 `pnpm dev:web` 一般难完整验 SW；用 preview / 部署环境验更新提示

## 边界

- Pocket 也有 `modules/pwa.ts`，主叙事是 Capacitor → [移动端](../移动端/)。
- 本页**不**承诺离线可玩全套 Stage；事实以 SW 策略与源码为准。
