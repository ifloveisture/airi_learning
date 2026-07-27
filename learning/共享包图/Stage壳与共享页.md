# Stage 壳与共享页

## 定位

多端 Stage 的**页面 / 布局 / 业务核 / 跨端小工具**。改聊天、设置、Provider、舞台业务编排，十有八九落在本域。
你不改包源码时，用法是：**在 apps 里挂载 + 从约定 `exports` 路径 import**。

## 查阅

| 要找 | 去 |
|------|-----|
| 任务→文件 | [任务速查](./任务速查.md)（舞台 / 设置段） |
| 端到包 | [最短调用链](./最短调用链.md) · 链 A（聊天）· A′（云同步）· 链 C（路由） |

## 真源（按频率）

| 目录 | npm | 依赖数 | 触及文件 | 入口 |
|------|-----|--------|----------|------|
| `stage-ui` | `@proj-airi/stage-ui` | 8 | 286 | 多入口 `exports`（components / stores / composables…） |
| `stage-shared` | `@proj-airi/stage-shared` | 11 | 176 | `src/index.ts` |
| `stage-layouts` | `@proj-airi/stage-layouts` | 4 | 24 | `layouts/`、`components/Layouts/` |
| `stage-pages` | `@proj-airi/stage-pages` | 2 | 21 | `pages/`（进路由） |

## 怎么用（不改包源码）

### 1. 端壳如何挂上 pages / layouts

以 Web 为例（桌宠同理，看 `electron.vite.config`）：

- `routesFolder` 同时包含本端 `pages` **和** `packages/stage-pages/src/pages`
- `layoutsDirs` 指向 `packages/stage-layouts/src/layouts`
- 端上可用 alias 把 `@proj-airi/stage-pages` / `stage-layouts` 指到源码，热更友好

新增**共享设置页**：在 `stage-pages` 加页面文件 → 两端自动吃到（除非端上 exclude）。
新增**仅一端**页：放进对应 `apps/.../pages`。

### 2. 在页面里用布局组件

```ts
import Header from '@proj-airi/stage-layouts/components/Layouts/Header.vue'
import InteractiveArea from '@proj-airi/stage-layouts/components/Layouts/InteractiveArea.vue'

import { useBackgroundStore } from '@proj-airi/stage-layouts/stores/background'
```

首页拼装可参考 `apps/stage-web/src/pages/index.vue`。

### 3. 用 stage-ui 的业务能力

按子路径 import（不要假设只有一个桶导出）：

```ts
import { useChatOrchestratorStore } from '@proj-airi/stage-ui/stores/chat'
import { useChatSessionStore } from '@proj-airi/stage-ui/stores/chat/session-store'
import { useProvidersStore } from '@proj-airi/stage-ui/stores/providers'
```

发消息整链、路由挂载见上方「查阅」。

完整 `exports` 见 `packages/stage-ui/package.json`。常见面：

| 需求 | 从哪进 |
|------|--------|
| Provider / 模型 | `stores/providers`、`stores/settings` |
| 聊天编排 | `stores/chat`（`useChatOrchestratorStore`） |
| 会话 | `stores/chat/session-store` |
| 角色 / 展示模型 | `stores/character`、`stores/display-models` |
| 场景壳 | `components/scenes` |
| VAD worker | `workers/vad` |

### 4. stage-shared

跨端小工具（auth 辅助、快捷键、Godot、WebGPU 等）。端或 `stage-ui` 会依赖它；**你新增业务 store 不要塞进 shared**。

## 演示入口

| 方式 | 入口 |
|------|------|
| 整端 | https://airi.moeru.ai · 本地 `pnpm dev:web` / `pnpm dev:tamagotchi` |
| 组件故事 | https://airi.moeru.ai/ui/#/ · `pnpm dev:ui` |
| 包概述（慎用示例） | [Mintlify stage-ui](https://moeru-ai-airi.mintlify.app/api/packages/stage-ui) |

pages/layouts **没有**独立故事站：在完整端上点设置路由最直观。

## 跟读

1. `apps/stage-web/vite.config.ts` 的 `routesFolder` / `layoutsDirs`
2. `packages/stage-ui/package.json` → `exports`
3. `stage-ui/src/stores/modules/` 与 `stores/providers/`
4. 对照一端 `pages/settings` 与 `stage-pages` 同名路径

## 命令

```bash
pnpm dev:web
pnpm dev:ui
pnpm -F @proj-airi/stage-ui typecheck
```

## 现状

| 包 | 状态 |
|----|------|
| 四者 | 已实现；三端（及鉴权 UI）主路径 |

## 边界

| 是 | 不是 |
|----|------|
| 挂载与 import 用法 | 渲染实现（`stage-ui-*`） |
| pages/layouts 被 apps 消费 | stage-ui **不能**依赖 pages/layouts |
| Histoire 里的业务组件 | 完整聊天闭环仍要起端 + Provider |
