# Godot 旁路

> 桌宠可选的 **渲染 sidecar**：只换画布，不换聊天 / Agent / 主 IPC。
> 实验面。主舞台 Live2D/VRM 仍见 [场景组装](./场景组装.md) · [Live2D与VRM](./Live2D与VRM.md)。

## 状态

| 标记 | 含义 |
|------|------|
| Experimental | 设置页 / `Stage.vue` 有 Godot Callout；非默认主路径 |
| 仅桌宠 | Web / Pocket 不走此进程 |

## 分层

| 层 | 路径 |
|----|------|
| Godot 工程（C#） | `engines/stage-tamagotchi-godot` |
| Electron 生命周期 | `apps/stage-tamagotchi/src/main/services/airi/godot-stage` |
| WS 载荷契约 | `packages/stage-shared/src/godot-stage/` |
| Renderer 开关 | `stage-ui` `stores/settings/stage-model.ts` · `Stage.vue` |
| UI | `stage-ui/.../model-settings/godot.vue`；桌宠 settings/models |
| 打包 | electron-builder → `extraResources/godot-stage` |

## 何时切入

```text
设置开启 Godot
  → electronGodotStageStart
  → stageModelRenderer = 'godot'
  → Stage.vue 显示实验占位（不再挂 Vue Live2D/VRM 主画布）
  → 可选：VRM 字节落到 userData/godot-stage/models/ → WS host.scene.apply
停止 / 出错
  → restoreBuiltInStageModelRenderer()（App.vue）
```

## 进程与协议

`createGodotStageManager().start()`：

1. 本机起 H3 WS（`127.0.0.1:随机端口` + token）
2. **Dev**：`GODOT4` 指向 Godot 4.x .NET，`--path engines/stage-tamagotchi-godot`
3. **安装包**：跑 `resources/godot-stage/godot-stage(.exe)`
4. 参数：`--airi-ws-url=…` · `--airi-storage-root=…`
5. Godot `StageBridge` 连上后交换 envelope `{ type, payload }`

| 方向 | 类型例 |
|------|--------|
| Godot → Electron | `stage.ready` · `stage.fatal` · `scene.applied` · `scene.error` · `stage.view.*` |
| Electron → Godot | `host.scene.apply` · `host.view.patch` · `host.view.request_snapshot` · `host.shutdown` |

## 和 Vue 舞台的关系

| | Vue Live2D/VRM/… | Godot |
|--|------------------|-------|
| 职责 | 默认渲染主路径 | 旁路 3D 场景 |
| 编排 / 聊天 / TTS | 仍在 stage-ui | **不**拥有 |
| 切换 | `stageModelRenderer` 枚举 | 取值为 `godot` 时替换画布 |

引擎内 C# 风格另见仓库 skill `stage-tamagotchi-godot-csharp`（仅改该引擎时用）。

## 环境变量

| 名 | 用途 |
|----|------|
| `GODOT4` | Dev 必填：Godot 可执行文件 |
| `GODOT_STAGE_REMOTE_DEBUG` / `_URI` | 远程调试 |
| `AIRI_GODOT_STAGE_DEV_MODE` | 开发模式开关 |

## 阅读顺序

1. 本页建立「只换画布」边界
2. `godot-stage/index.ts` 启动与 WS
3. `stage-shared/godot-stage` 类型
4. 引擎 `StageBridge.cs` / README
5. 回 [视觉动捕](./视觉动捕.md) · [桌宠宿主](../多端应用/桌宠端/桌宠宿主.md)
