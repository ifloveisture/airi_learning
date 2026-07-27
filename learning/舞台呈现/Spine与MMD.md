# Spine与MMD

## 定位

相对 Live2D/VRM 的**可启用**展示路径：Spine Zip → `stage-ui-spine`；PMX/PMD → `stage-ui-mmd`。由展示模型 `format` 映射到 `stageModelRenderer`。

## 真源

| 项 | 路径 |
|----|------|
| Spine 包 | `packages/stage-ui-spine`（`SpineScene`、stores/utils） |
| MMD 包 | `packages/stage-ui-mmd`（`MMDScene`、stores/utils） |
| 选型 | `packages/stage-ui/src/stores/settings/stage-model.ts`（`resolveBuiltInStageModelRenderer`） |
| 挂载 | `packages/stage-ui/src/components/scenes/Stage.vue` |
| 模型库 | `packages/stage-ui/src/stores/display-models.ts` |

## 跟读

1. `DisplayModelFormat` 枚举里 Spine / PMX / PMD
2. `resolveBuiltInStageModelRenderer` 映射表
3. `Stage.vue` 分支渲染 `SpineScene` / `MMDScene`
4. 对应包 `src/index.ts` 导出
5. 设置里导入模型试一次（桌宠或 Web）

## 现状

可启用 / 实验体验；主推仍是 Live2D + VRM。

## 边界

- 与 Live2D/VRM：**同一时间一种 renderer**，由 format 切换。
- **Godot**：独立 sidecar 路径，不走 Spine/MMD 包。
- 口型/动捕对 Spine/MMD 的覆盖弱于主路径，勿默认全功能。
