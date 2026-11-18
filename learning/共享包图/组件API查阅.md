# 组件 API 查阅

> **不**在 learning 复抄 `@proj-airi/ui` 全表。本页只给查阅顺序。

## 去哪查

| 需求 | 去 |
|------|-----|
| 控件怎么用 / 变体 | https://airi.moeru.ai/ui/#/ （Histoire） |
| 本地故事 | `pnpm dev:ui` → [Histoire与Devtools](../工程工具/Histoire与Devtools.md) |
| 组件清单文 | `docs/ai/context/ui-components.md` |
| 包边界与字体 | [UI原语与字体](./UI原语与字体.md) |
| 业务场景组件 | `packages/stage-ui/src/components/scenarios/`（有业务，不进 ui 原语全表） |

## 怎么跟

1. 先判：原语（`@proj-airi/ui`）还是业务（`stage-ui` / scenarios）
2. 原语 → Histoire 或 `ui-components.md`，再打开 `packages/ui/src/components/`
3. 业务 → 对应域专题或 `stage-ui` 源码；不要指望 learning 有逐 prop 手册

## 边界

- Mintlify 包页可能滞后，以本仓 `exports` 与源码为准 → [演示与用例入口](./演示与用例入口.md)。
- 不建独立「packages 用例外仓」（同文结论）。
