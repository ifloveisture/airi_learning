# Factorio 模块

> Stage 内 **gaming 模块 store 实验**。无对等 `services/factorio` 包。

## 定位

与 Minecraft bot / Channel 插件**不是**同一加载链。只是设置里可配「游戏模组连接」形态的 store，经 Channel configurator 下发。

## 真源

| 项 | 路径 |
|----|------|
| Store | `packages/stage-ui/src/stores/modules/gaming-factorio.ts` |
| 工厂 | `gaming-module-factory.ts`（`createGamingModuleStore('factorio', 34197)`） |
| 配置键 | `enabled` · `serverAddress` · `serverPort`（默认 34197）· `username` |
| 下发 | `useConfiguratorByModsChannelServer().updateFor('factorio', …)` |

## 印象

```text
设置打开 Factorio 模块
  → localStorage 持久化
  → saveSettings → Channel module:configure（factorio）
  →（若有外部监听方）按地址/端口/用户名连接
```

仓内**没有**完整 Factorio 游戏 Agent 服务专章；外部进程是否存在以源码与设置页为准。

## 跟读

1. `gaming-factorio.ts` + `gaming-module-factory.ts`
2. 设置里对应模块页是否仍 WIP
3. 对照 Minecraft（有 `services/minecraft`）→ [游戏与操控](./游戏与操控.md)

## 现状

| 项 | 状态 |
|----|------|
| Store / 配置下发 | **进行中**（实验） |
| 独立 Factorio service | **无** |

## 边界

- Home Assistant、computer-use、Discord 均不经此 store。
- WIP 总表一句见 [WIP插件索引](./WIP插件索引.md)。
