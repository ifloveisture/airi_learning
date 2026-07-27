# Live2D 与 VRM

## 包与核心导出

| 包 | 入口 | 核心组件 / API |
|----|------|----------------|
| `@proj-airi/stage-ui-live2d` | `packages/stage-ui-live2d/src/index.ts` | `Live2DScene`、`Live2DCanvas`、`Live2DModel` + composables/stores；zip/OPFS loaders |
| `@proj-airi/stage-ui-three` | `packages/stage-ui-three/src/index.ts` | `ThreeScene`；VRM：`components/Model/VRMModel.vue`；`useModelStore` |
| `@proj-airi/stage-ui-mmd` | `packages/stage-ui-mmd` | `MMDScene`（实验） |
| `@proj-airi/stage-ui-spine` | `packages/stage-ui-spine` | `SpineScene`、`SpineCanvas`、`SpineModel`（实验） |

技术底座：Live2D → Pixi + `pixi-live2d-display`；VRM → Three.js + `@pixiv/three-vrm` + TresJS。

## 边界

- 渲染包依赖 `stage-shared` / `ui`，**不**反向依赖 `stage-ui` 业务编排
- 谁在何时挂这些组件 → [场景组装](./场景组装.md)

## 口型（渲染侧）

| 方向 | 路径 |
|------|------|
| Live2D | `@proj-airi/model-driver-lipsync`；Stage 可 `createLive2DLipSync` |
| VRM / MMD | `stage-ui-three/.../lip-sync.ts`、`stage-ui-mmd/.../lip-sync.ts` |

总览见 [视觉动捕](./视觉动捕.md)；公式与默认参数见 [口型驱动](../算法主线/口型驱动.md)。

## 阅读顺序

1. 对应包 `src/index.ts`
2. [场景组装](./场景组装.md)
3. 端上首页如何嵌 Stage
4. 需要口型 / 动捕再读 [视觉动捕](./视觉动捕.md)
