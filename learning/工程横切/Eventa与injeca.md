# Eventa与injeca

## 定位

桌宠 **main 进程**两条正交机制：`injeca` 装配服务图；`@moeru/eventa` 定义跨进程 RPC/事件。本页只给最短读码闭环。

## 真源

| 项 | 路径 |
|----|------|
| DI 入口 | `apps/stage-tamagotchi/src/main/index.ts`（`injeca.provide` → `injeca.start`） |
| 契约目录 | `apps/stage-tamagotchi/src/shared/eventa/` |
| 接线示例 | `apps/stage-tamagotchi/src/main/services/airi/plugins/index.ts`（`defineInvokeHandler`） |
| 窗口/Electron 服务 | `apps/stage-tamagotchi/src/main/services/electron/` |

## 跟读

1. `main/index.ts`：扫一遍 `provide` 名字（config、channel、plugin-host、windows…）
2. `shared/eventa` 里挑一个 `defineInvokeEventa` 契约
3. main 侧找对应 `defineInvokeHandler`
4. renderer 侧搜同一事件名的 invoke（`@moeru/eventa/adapters/electron/renderer`）
5. （可选）仓库 skill：`.agents/skills/eventa/SKILL.md`

## 命令

```bash
pnpm dev:tamagotchi
pnpm -F @proj-airi/stage-tamagotchi typecheck
```

## 现状

已实现；桌宠主路径依赖二者。Web 无 injeca main 图；Web 侧 Eventa 用法较少。

## 边界

- **injeca**：只解决 main（及部分模块）**构造顺序与依赖注入**，不是业务状态机。
- **Eventa**：契约与传输，**不是** Channel Hub 的 `server-sdk` 协议（那是另一条 WebSocket 总线）。
- **Pinia stores**：renderer 业务状态；不要把 store 塞进 injeca provide 表。
