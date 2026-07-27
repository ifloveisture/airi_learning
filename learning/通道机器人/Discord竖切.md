# Discord 竖切

Discord 是仓库里 **经 Channel 接到 Stage 最完整** 的 bot 样本：外部进程只做桥，大脑在 Stage 聊天编排。

## 路径索引

| 项 | 路径 |
|----|------|
| 入口 | `services/discord-bot/src/index.ts` |
| Adapter | `services/discord-bot/src/adapters/airi-adapter.ts` |
| 斜杠命令 | `…/bots/discord/commands/`（`ping` / `summon`） |
| Stage 模块 | `packages/stage-ui/src/stores/modules/discord.ts` |
| UI | `packages/stage-ui/src/components/modules/MessagingDiscord.vue` |
| 设置页 | `packages/stage-pages/src/pages/settings/modules/messaging-discord.vue` |
| 元数据 | `packages/plugin-protocol` 中 `Discord` 类型 |
| README | `services/discord-bot/README.md` |
| 中文集成 | `docs/content/zh-Hans/docs/integrations/discord.md` |

包名：`@proj-airi/discord-bot`。

## Client 怎么连

在 `airi-adapter.ts`（`Client` 常 alias 为 `ServerChannel`）：

```ts
const client = new Client({
  name: 'discord',
  possibleEvents: [
    'input:text',
    'input:text:voice',
    'input:voice',
    'module:configure',
    'output:gen-ai:chat:message',
  ],
  token: config.airiToken,
  url: config.airiUrl, // 默认 ws://localhost:6121/ws
})
```

- 默认 `autoConnect: true`，构造即连 Hub 并 announce
- `start()` 侧重 Discord `login`；`stop()` 销毁 Discord + `airiClient.close()`
- 环境：`DISCORD_TOKEN`、`AIRI_URL`、`AIRI_TOKEN`（示例里 token 可能是 `'abcd'`）

## 数据流

### Discord → Stage

1. **文字**：`MessageCreate`；@机器人或 DM 才转发
   `send({ type: 'input:text', data: { text, textRaw, overrides: { messagePrefix, sessionId }, discord } })`
   - session：`discord-guild-{guildId}` 或 `discord-dm-{userId}`
2. **语音**：`/summon` → `VoiceManager` 收 Opus → STT → `input:text:voice` + 再发 `input:text`

Stage：`context-bridge` 消费 `input:text` → `ingest` 聊天。

### Stage → Discord

1. 听 `module:configure`：应用 UI 的 `{ token, enabled }`，可重连/销毁 Discord
2. 听 `output:gen-ai:chat:message`：取 `message.content` 与 `discord.channelId`，频道 `send`（>2000 字切块）

### UI 配置转发

```text
discord.ts saveSettings
  → configurator.updateFor('discord', { token, enabled })
  → ui:configure
  → runtime 转 module:configure
  → DiscordAdapter.onEvent('module:configure')
```

## 本地跑通

1. `pnpm i`；先起 Channel：桌宠 **或** `pnpm dev:server`（6121）
2. Discord Developer Portal：开 **Server Members Intent**、**Message Content Intent**
3. `cp services/discord-bot/.env …/.env.local`，填 `DISCORD_TOKEN` 等
4. `pnpm -F @proj-airi/discord-bot start`
5. （可选）Web/桌宠设置页打开 Discord 模块并保存 Token
6. 文字：@bot；语音：进语音频道后 `/summon`

建议同时开 `pnpm dev:web` 或桌宠，方便看 Stage 是否吃到 `input:text`、是否回 `output:gen-ai:chat:message`。

## 阅读顺序

1. [Channel事件速查](./Channel事件速查.md)
2. `index.ts` → `airi-adapter.ts`
3. `modules/discord.ts` + `MessagingDiscord.vue`
4. （可选）`summon.ts` 语音支线
5. 实跑闭环：@bot → Stage 出字 → Discord 回帖
