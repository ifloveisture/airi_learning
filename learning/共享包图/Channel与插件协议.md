# Channel 与插件协议

## 定位

本机 / 局域网 **模块 Channel** 与 **Extension 插件** 的协议与运行时。用法核心：起 Hub → 用 `server-sdk` 当客户端 → 插件走 `plugin-sdk`（桌宠再叠 `plugin-sdk-tamagotchi`）。
**不是**云端账号 API。

## 查阅

| 要找 | 去 |
|------|-----|
| 任务→文件 | [任务速查](./任务速查.md)（Channel / 插件段） |
| 端到包 | [最短调用链](./最短调用链.md) · 链 B |

## 真源（按频率）

| 目录 | npm | 依赖数 | 触及文件 | 入口 |
|------|-----|--------|----------|------|
| `server-sdk` | `@proj-airi/server-sdk` | 16 | 82 | `Client` |
| `plugin-sdk` | `@proj-airi/plugin-sdk` | 4 | 39 | kit / extension |
| `server-shared` | `@proj-airi/server-shared` | 4 | 43 | types |
| `plugin-protocol` | `@proj-airi/plugin-protocol` | 3 | 13 | `./types` |
| `plugin-sdk-tamagotchi` | `@proj-airi/plugin-sdk-tamagotchi` | 2 | 15 | gamelet / widgets |
| `better-ws` | `@proj-airi/better-ws` | 2 | 12 | createClient / createServer |
| `server-runtime` | `@proj-airi/server-runtime` | 1 | 16 | Hub |

## 怎么用

### 起 Channel Hub

```bash
pnpm dev:server   # @proj-airi/server-runtime；不是 apps/server
```

桌宠也可内嵌 runtime（依赖图里有 `server-runtime`）。端到 `Client` 见上方「查阅」。

### 客户端 `server-sdk`（包 README）

```ts
import { Client } from '@proj-airi/server-sdk'

const client = new Client({
  name: 'your airi plugin',
  autoConnect: false,
})

await client.connect() // ready = 开socket + 可选鉴权 + announce

client.onEvent('input:text', async (event) => {
  console.info(event.data.text)
})

client.send(/* ... */) // 不可用时返回 false
client.sendOrThrow(/* ... */)
```

关注：`connectionStatus`、`isReady`、`onEvent` 返回反订阅函数。

### 协议类型

```ts
import type { /* 事件形状 */ } from '@proj-airi/plugin-protocol/types'
// server-shared 再包一层 Channel 错误/共享类型
```

自下而上：`plugin-protocol` → `server-shared` → sdk/runtime。

### 插件 `plugin-sdk`

扩展作者用 **kit**，不要自造 RPC 名：

```ts
const gamelets = await ctx.kits.use(gameletKit)
await gamelets.mount(input)
```

命名约定见包 README（`defineKit`、`gameletKitApis` + Eventa `defineInvokeEventa`）。
桌宠 widgets/gamelet：`plugin-sdk-tamagotchi`。
仓内样例：`apps/stage-tamagotchi/.../plugins/examples/`。

### `better-ws`

仅要可靠 WS、不要 AIRI 事件协议时用：

```ts
import { createClient } from '@proj-airi/better-ws'

const client = createClient({ url: 'ws://localhost:3000/ws' })
await client.connect()
```

Channel 栈内部已用；业务优先 `server-sdk`。

## 演示入口

| 方式 | 说明 |
|------|------|
| 本地 Hub | `pnpm dev:server` |
| 桌宠 + 模块 | `pnpm dev:tamagotchi` |
| README 可复制片段 | `packages/server-sdk/README.md`、`better-ws`、`plugin-sdk` |
| 公开 Web playground | **无**（协议是 WS/进程向，不适合静态站） |
| 插件样例 | 桌宠 `plugins/examples` |

## 跟读

1. server-sdk README 全文
2. `pnpm dev:server` 后用最小 Client 脚本连一次
3. plugin-sdk Kit 命名表 → 对照 Host 跟做学习文（插件扩展域）

## 命令

```bash
pnpm dev:server
pnpm -F @proj-airi/server-sdk typecheck
pnpm -F @proj-airi/plugin-sdk typecheck
```

## 现状

协议栈已实现；扩展生态随桌宠 Host 演进。

## 边界

| 是 | 不是 |
|----|------|
| Channel / 插件 | `server-schema` / 云端计费 |
| MCP computer-use | 独立 stdio，不经 Channel 主链 |
