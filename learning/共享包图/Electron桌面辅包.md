# Electron 桌面辅包

## 定位

桌宠专用的 **IPC 契约、VueUse 风格助手、屏幕捕获**。网页上没法演示；用法绑定 `stage-tamagotchi` 主进程 / 渲染进程。

## 查阅

| 要找 | 去 |
|------|-----|
| 任务→文件 | [任务速查](./任务速查.md)（Electron 段） |
| 业务 IPC 名 | `apps/stage-tamagotchi/src/shared/eventa/`（不在本域复抄） |

## 真源（按频率）

| 目录 | npm | 依赖数 | 触及文件 | 入口 |
|------|-----|--------|----------|------|
| `electron-vueuse` | `@proj-airi/electron-vueuse` | 1 | 55 | composables · `main` |
| `electron-eventa` | `@proj-airi/electron-eventa` | 2 | 21 | electron · updater |
| `electron-screen-capture` | `@proj-airi/electron-screen-capture` | 2 | 14 | main · vue |

## 怎么用

### 契约 + 渲染调用（包 README）

```ts
import { electron } from '@proj-airi/electron-eventa'
import { useElectronEventaInvoke } from '@proj-airi/electron-vueuse'

const openSettings = useElectronEventaInvoke(electron.window.getBounds)
```

- 契约定义：优先 `@proj-airi/electron-eventa` + 应用内 `apps/stage-tamagotchi/src/shared`
- 渲染侧：`useElectronEventaContext` / `useElectronEventaInvoke`、鼠标/窗口/更新器等 composable
- 主进程循环：`@proj-airi/electron-vueuse/main` 的 `createRendererLoop` 等

### 屏幕捕获

```ts
// 主进程 / Vue 封装以包 exports 为准
import { /* capture APIs */ } from '@proj-airi/electron-screen-capture'
```

与 Vishot scenarios、`stage-shared` 引用相关；出文档图走 `pnpm capture:tamagotchi`，不是手点产品按钮那么简单。

## 演示入口

| 方式 | 说明 |
|------|------|
| **唯一真演示** | `pnpm dev:tamagotchi` |
| Devtools | 桌宠 settings 布局下窗口/鼠标/更新器等页 |
| 公开 HTTPS demo | **无**（必须 Electron） |

## 跟读

1. `electron-vueuse` / `electron-eventa` README
2. `apps/stage-tamagotchi/src/shared` 业务契约
3. 渲染进程里搜索 `useElectronEventaInvoke`

## 命令

```bash
pnpm dev:tamagotchi
pnpm -F @proj-airi/electron-vueuse typecheck
```

## 现状

已实现；主消费者桌宠。

## 边界

| 是 | 不是 |
|----|------|
| Electron 共享库 | Web / Pocket |
| Eventa 包装 | injeca 主进程装配仍在 app |
