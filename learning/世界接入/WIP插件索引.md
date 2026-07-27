# WIP插件索引

## 定位

Channel 向周边插件的**状态清单**（非 Host gamelet）。每条自洽：路径、现状、怎么判断能不能跑。

## 清单

| 包 | 现状 | 真源 | 备注 |
|----|------|------|------|
| `airi-plugin-web-extension` | 可启用 | 见同域《浏览器扩展》 | WXT + Channel |
| `airi-plugin-claude-code` | 可启用 CLI | `plugins/airi-plugin-claude-code/src/{run,cli}.ts` | hook → stdin → server-sdk；`pnpm -F …` 的 `dev`/`send` |
| `airi-plugin-homeassistant` | WIP | `plugins/airi-plugin-homeassistant/src/index.ts` | 仅 warn + sdk 骨架 |
| `airi-plugin-bilibili-laplace` | WIP | `plugins/airi-plugin-bilibili-laplace/` | LAPLACE Event Bridge 意向；入口仍 WIP |
| `airi-plugin-game-chess` | Host 样例意向 | `plugins/airi-plugin-game-chess` 几乎仅 package.json | 完整 manifest/挂载见桌宠 ExtensionHost 测试与《Host扩展跟做》 |

## Factorio 等模块

Stage 内 `packages/stage-ui/src/stores/modules/gaming-factorio.ts` 一类为**模块 store 实验**；与上表 Channel 插件不是同一加载链。跟读：搜 `gaming-factorio` / 设置里对应模块页是否 WIP。

## 跟读建议

1. 先看上表「现状」列，WIP 不要当产品承诺
2. 可启用项打开 README/`src/index.ts`
3. 连 Hub 的插件统一需要 Channel 地址可达

## 边界

- **Discord bot**：`services/discord-bot`，不是 `plugins/`。
- **Twitter**：`services/twitter-services`，见《Twitter服务》。
- **ExtensionHost kits**：桌宠 main 插件宿主，另文。
