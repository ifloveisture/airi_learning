# Host扩展跟做

## 定位

桌宠 **ExtensionHost** 加载 `extension.airi.json`，经 `kit.gamelet` 把扩展 UI 挂到 widget 窗。与 Channel `server-sdk` 插件加载链完全不同。

## 真源

| 项 | 路径 |
|----|------|
| 装配 | `apps/stage-tamagotchi/src/main/index.ts` → `modules:plugin-host` |
| Host | `apps/stage-tamagotchi/src/main/services/airi/plugins/`（`setupExtensionHost`、`host/`、`kits/`） |
| Manifest 样例 | `…/plugins/examples/devtools-sample-plugin/extension.airi.json` |
| 测试中的象棋 manifest | `…/plugins/index.test.ts`（搜 gamelet / chess 相关 fixture） |
| SDK | `packages/plugin-sdk-tamagotchi`（`createGamelet` 等） |
| 编排挂窗 | `kits/gamelet/orchestration.ts` → `widgetsManager.pushWidget('extension-ui')` |

## 跟做顺序

1. 读 sample `extension.airi.json` 字段（id、入口、kits）
2. `plugins/index.ts`：Host 如何 discover / load
3. `host/registry.ts`：manifest 校验
4. `plugin-sdk-tamagotchi` 的 `createGamelet`
5. `orchestration.ts`：mount 后如何进 widgets 窗
6. 跑相关 unit/smoke（`index.test.ts`）确认契约

## 命令

```bash
pnpm dev:tamagotchi
pnpm -F @proj-airi/stage-tamagotchi exec vitest run path/to/plugins/index.test.ts
```

## 现状

Host + kit **已实现**；仓内 `plugins/airi-plugin-game-chess` 源码不完整，以测试 fixture / sample 为准跟读。

## 边界

- **Channel 插件**（web-extension、claude-code）：连 Hub WebSocket，无 `extension.airi.json`。
- **主舞台路由**：gamelet UI 在 widget 窗，不是 `/` Stage 页。
- **API 稳定子集**：Host 面仍标实验；跟做以现网 sample + 测试为准，勿假设长期 freeze。
