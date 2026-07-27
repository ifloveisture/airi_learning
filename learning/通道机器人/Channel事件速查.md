# Channel 事件速查（Bot）

学 Bot 前先分清：**模块 Channel ≠ 云端 `apps/server`**。
根脚本 `pnpm dev:server` 与桌面内嵌 `channel-server` 都是 **Channel Hub**（默认 `ws://localhost:6121/ws`）。

详解见 [模块通道](../插件扩展/模块通道.md)。

## 竖切示意

```text
Bot / 插件进程
  new Client({ name, possibleEvents, token?, url? })
  → connect：authenticate? → extension:module:announce → announced / ready

  Bot  send: input:text | input:text:voice | …
  Hub  投递给 chat-ingestion 消费者
  Stage context-bridge → 聊天编排
  Stage send: output:gen-ai:chat:message | …:complete | …:tool-call
  Hub  广播给订阅模块（如 discord）
```

## 事件名

| 阶段 | 事件 | 说明 |
|------|------|------|
| 握手 | `module:authenticate` / `module:authenticated` | 有 token 时 |
| 握手 | `extension:module:announce` → `extension:module:announced` | Client 默认 announce |
| 配置 | Stage `ui:configure` → Hub 转 `module:configure` | UI 改 bot 开关/Token |
| 入 | `input:text` / `input:text:voice` / `input:voice` | 进聊天 |
| 出 | `output:gen-ai:chat:message` 等 | Stage 回复回写平台 |
| 消费 | `module:consumer:register` / `unregister` | Stage 注册吃 input |

## Stage 关键文件

| 文件 | 角色 |
|------|------|
| `packages/stage-ui/src/stores/mods/api/channel-server.ts` | Channel Client store |
| `packages/stage-ui/src/stores/mods/api/context-bridge.ts` | `input:text` → 编排；发 `output:gen-ai:chat:*` |
| `packages/stage-ui/src/stores/configurator.ts` | `ui:configure` |
| 桌面 Hub | `apps/stage-tamagotchi/src/main/services/airi/channel-server/` |

## 谁走 Channel、谁不走

| 服务 | Channel |
|------|---------|
| discord-bot | **是**（学对接首选） |
| twitter-services | 可选（`ENABLE_AIRI`） |
| telegram-bot | **否**（→ [独立Agent](../独立Agent/)） |
| satori-bot | **否**（→ [独立Agent](../独立Agent/)） |
