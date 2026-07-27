# UI 原语与字体

## 定位

无业务逻辑的 **控件原语、过渡、加载屏、字体 CSS**。全仓最热的是 `@proj-airi/ui`；可视化验收优先走 Histoire，而不是每次起全端。

## 查阅

| 要找 | 去 |
|------|-----|
| 任务→文件 | [任务速查](./任务速查.md)（无业务原语 / 文案） |
| 控件演示 | https://airi.moeru.ai/ui/#/ |

## 真源（按频率）

| 目录 | npm | 依赖数 | 触及文件 | 入口 |
|------|-----|--------|----------|------|
| `ui` | `@proj-airi/ui` | 15 | 249 | `src/components/` |
| `font-cjkfonts-allseto` 等 | `@proj-airi/font-*` | 见总表 | — | `dist/index.css` |
| `ui-transitions` | `@proj-airi/ui-transitions` | 3 | 13 | `src/components/` |
| `ui-loading-screens` | `@proj-airi/ui-loading-screens` | 0 | 8 | `src/components/` |
| `unocss-preset-fonts` | `@proj-airi/unocss-preset-fonts` | 0 | 1 | Uno preset |

## 怎么用

### `@proj-airi/ui`

前置：UnoCSS + Attributify；入口引入 reset（包 README）：

```ts
import '@unocss/reset/tailwind.css'
```

```vue
<script setup lang="ts">
import { Button } from '@proj-airi/ui'
</script>

<template>
  <Button>OK</Button>
</template>
```

- **Props / 槽位全表**：`docs/ai/context/ui-components.md`（改 ui 包时要同步这份）
- **禁止**让 `ui` 依赖任何 `stage-*`
- 业务外观组件在 `stage-ui`，底层仍尽量用 `ui` 原语

### 字体

在应用入口或全局 CSS：

```ts
import '@proj-airi/font-xiaolai/index.css'
// 或 chillroundm / cjkfonts-allseto / departure-mono
```

`unocss-preset-fonts`：在根 `uno.config.ts` 挂 preset，用 Uno 规则引用上述字体，而不是每个组件手写 `@font-face`。

### 过渡 / 加载屏

```ts
import { /* 加载屏 */ } from '@proj-airi/ui-loading-screens'
import { /* 过渡组件 */ } from '@proj-airi/ui-transitions'
```

加载屏 workspace 直接依赖少，多在展示/启动路径按需引。

## 演示入口

| 方式 | 入口 |
|------|------|
| **主推** | https://airi.moeru.ai/ui/#/ （Design System / Form / Misc…） |
| 本地 | `pnpm dev:ui` |
| API 文 | `docs/ai/context/ui-components.md` |
| 字体上游 | [Departure Mono](https://departuremono.com/) · [CJKFonts 全瀨體介绍](https://cjkfonts.io/blog/cjkfonts_allseto) · 寒蝉/小赖见各包 `homepage` |

这是全仓**唯一成熟的公开组件演示站**；不必为 ui 再开用例仓。

## 跟读

1. Histoire 挑一个 Form 控件对照源码
2. `packages/ui/README.md` + `ui-components.md`
3. 根 `uno.config.ts` 字体 preset 段

## 命令

```bash
pnpm dev:ui
pnpm -F @proj-airi/ui typecheck
```

## 现状

已实现。Histoire 覆盖 stage-ui 故事为主，底层大量即 `ui` 原语变体。

## 边界

| 是 | 不是 |
|----|------|
| 无业务原语 | Provider 设置块（那是 stage-ui scenarios） |
| 字体 CSS 资产 | 气质文案（界面设计域） |
