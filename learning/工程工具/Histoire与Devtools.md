# Histoire 与 Devtools

## Histoire（组件故事）

| 项 | 事实 |
|----|------|
| 包 | `packages/stage-ui` |
| 配置 | `histoire.config.ts` |
| 故事 | `stories/`；绑死某组件的可放旁路 `*.story.vue` |
| 命令 | `pnpm dev:ui` → `pnpm -F @proj-airi/stage-ui run story:dev` |

改通用 Stage UI 时优先 Histoire，避免每次起 Web/桌宠全栈。

## Devtools 页

| 端 | 路径 |
|----|------|
| Web | `apps/stage-web/src/pages/devtools/` |
| Desktop | `apps/stage-tamagotchi/src/renderer/pages/devtools/` |

用途：音频、动捕（MediaPipe）、窗口/鼠标、快捷键、更新器等实验能力。
路由 meta 常 `layout: settings`。桌宠部分页 **exclude** 共享 `stage-pages` 的 `devtools/index`，以本端为准 → [桌宠启动与配置](../多端应用/桌宠端/启动与配置.md)。

## 其它实验壳

`apps/component-calling`：组件调用实验，非主产品。

## 何时用哪个

| 场景 | 工具 |
|------|------|
| 纯 UI 变体 | Histoire |
| 需真实 Provider / 麦 / 窗 | 对应端 devtools 或全 app |
| 截产品图 | [场景截图](./场景截图.md) |
