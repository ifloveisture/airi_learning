# WIP插件索引

## 定位

Channel 向周边插件的**状态清单**（非 Host gamelet）。每条自洽：路径、现状、怎么判断能不能跑。

## 清单

| 包 | 现状 | 真源 | 备注 |
|----|------|------|------|
| `airi-plugin-web-extension` | 可启用 | 见同域《浏览器扩展》 | WXT + Channel |
| `airi-plugin-claude-code` | 可启用 CLI | `plugins/airi-plugin-claude-code/src/{run,cli}.ts` | hook → stdin → server-sdk；`pnpm -F …` 的 `dev`/`send` |
| `airi-plugin-homeassistant` | **已撤源码** | 目录若残留仅 `node_modules` | **不要**再跟 Channel 插件；产品 HA 见下节 |
| `airi-plugin-bilibili-laplace` | WIP | `plugins/airi-plugin-bilibili-laplace/` | LAPLACE Event Bridge 意向；入口仍 WIP |
| `airi-plugin-game-chess` | Host 样例意向 | `plugins/airi-plugin-game-chess` 几乎仅 package.json | 完整 manifest/挂载见桌宠 ExtensionHost 测试与《Host扩展跟做》 |

## Home Assistant（勿与上表 WIP 混谈）

| 面 | 现状 | 真源 |
|----|------|------|
| Stage 桌宠工具 | **可启用** | `stage-ui` HA 模块 + `apps/stage-tamagotchi` tools / main 服务；见 [对话工具](../角色对话/对话工具.md) · Home Assistant |
| Channel 插件 | 已撤 | 上表 `airi-plugin-homeassistant` |

Web 不写凭证标志，集成保持关；跟读以桌宠设置为准。

## Factorio 等模块

Stage 内 gaming 模块 store 实验；与上表 Channel 插件不是同一加载链。竖切 → [Factorio模块](./Factorio模块.md)。

## 跟读建议

1. 先看上表「现状」列；WIP / 已撤不要当产品承诺
2. 可启用项打开 README/`src/index.ts`
3. 连 Hub 的插件统一需要 Channel 地址可达
4. 要控智能家居 → 走 Stage 桌宠 HA，不走已撤 Channel 包

## 边界

- **Discord bot**：`services/discord-bot`，不是 `plugins/`。
- **Twitter**：`services/twitter-services`，见《Twitter服务》。
- **ExtensionHost kits**：桌宠 main 插件宿主，另文。
