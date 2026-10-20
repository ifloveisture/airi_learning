# TypeScript 命名

## 定位

梳理本仓 TypeScript（`.ts`）实际命名习惯：文件与目录、变量与函数、类型与接口、HTTP / Eventa / Kit 等 API 面。事实来自源码抽样；新代码跟邻域目录对齐。

本篇不含：样式类名；`.vue` 文件命名。

## 真源

| 项 | 路径 |
|----|------|
| Stage 业务 TS | `packages/stage-ui/src/`（`composables/` · `stores/` · `services/` · `libs/`） |
| 编排内核 | `packages/core-agent/src/` |
| 云端路由 / 服务 | `apps/server/src/routes/` · `services/` · `utils/redis-keys.ts` |
| 云端 HTTP / Redis | `apps/server/docs/ai-context/config-and-naming-conventions.md` |
| 桌宠 IPC 契约 | `apps/stage-tamagotchi/src/shared/eventa/` |
| 扩展 Kit | `packages/plugin-sdk/` · `packages/plugin-sdk-tamagotchi/` · 包 README Kit 表 |
| Hono 客户端 | `packages/stage-ui/src/composables/api.ts` |

## 跟读

1. 扫本页各节，弄清「文件 / 符号 / 类型 / API」四层
2. 在将改的邻域各打开 1～2 个同层 `.ts` 对照
3. 改云端路径或 Redis：再读 `config-and-naming-conventions.md`
4. 改桌宠 IPC：对照 `shared/eventa/` 既有 `defineInvokeEventa` 符号与字符串

## 文件与目录（仅 `.ts`）

### 默认

| 项 | 约定 | 示例 |
|----|------|------|
| 目录 | kebab-case | `chat-sync/`、`audio-speech-ws/`、`provider-catalog/` |
| `.ts` 文件 | kebab-case | `ws-client.ts`、`flux-meter.ts`、`use-duck-db.ts` |
| 入口桶 | `index.ts` | 包 / 功能文件夹出口 |
| 同域常见拆分 | `types.ts` · `schema.ts` · `constants.ts` · `route.ts` | server 路由夹；worker 夹 |

厂商 / 能力子目录同样 kebab（含数字前缀）：`302-ai/`、`openai-compatible/`、`cloudflare-workers-ai/`。

### 后缀与特化文件名

| 模式 | 用途 |
|------|------|
| `*.test.ts` | Vitest 单测（与被测同 stem 或邻域） |
| `*.browser.test.ts` / `*.contract.browser.test.ts` | 浏览器 / 契约测 |
| `*.electron.ts` / `*.electron.test.ts` | Electron RPC 实现与测 |
| `*.worklet.ts` | Audio worklet |
| `worker.ts` | Worker 入口（如 `workers/vad/`） |
| `route.ts` | server 路由实现（常与 `route.test.ts` 成对） |

Composable 文件常见两种：

- `use-foo-bar.ts` → 主导出 `useFooBar`（推荐新文件）
- 领域名文件仍导出 `use*`：`audio-recorder.ts` → `useAudioRecorder`；`markdown.ts` → `useMarkdown`

### 已知例外（勿扩散）

| 例外 | 路径提示 |
|------|----------|
| camelCase 贴 Electron API | `…/electron/powerMonitor.ts` |
| camelCase 复合测名 | `setupApp.liveness.test.ts` |
| 组件旁路 Pascal 测名 | `PoppinText.web.browser.test.ts`（目录仍 kebab） |

新 `.ts` 默认 kebab；只有对齐第三方符号或既有例外目录时才偏离。

### 文件名与主导出

| 模式 | 对齐方式 |
|------|----------|
| Composable | `use-foo.ts` ↔ `useFoo` |
| 工厂模块 | 文件偏领域；导出 `createXxx` |
| Service / Store | 文件可短于导出名（`context-store.ts` → `useChatContextStore`） |
| Eventa 契约夹 | 按域分文件（`plugin/host.ts`）；符号在文件内 camelCase |

## 变量、函数、常量

### 大小写

| 类别 | 形式 | 示例 |
|------|------|------|
| 局部 / 参数 / 属性 | camelCase | `userId`、`abortSignal`、`refreshToken` |
| 函数 / 方法 | camelCase，动作在前 | `listChats`、`fetchRemote`、`mount` |
| 模块级稳定标量 | UPPER_SNAKE（词间 `_`） | `WS_CLOSE_UNAUTHORIZED`、`OIDC_CLIENT_ID`、`RECONNECT_BASE_MS` |
| 配置键字符串（非 TS 标识） | UPPER_SNAKE 字面量 | `'FLUX_PER_1K_TOKENS'`（走 `configKV`） |
| Eventa / 协议对象 | camelCase const | `electronPluginList`、`pluginKitApiListEventName` |

缩写跟邻域：`id` / `Id`；URL 多在常量里（`SERVER_URL`）；服务端 UI 路由工厂用 `Ui`（`createAdminUiRoutes`）而非 `UI`。

**常量用 `_` 拼接没有问题**：模块级稳定标量、指标名、configKV 键等一律 `UPPER_SNAKE`，词与词之间用下划线连接（如 `METRIC_AIRI_GEN_AI_GATEWAY_POOL_SATURATION_MARKED`）。这与下一节「`_` 前缀」不是同一回事——前者是常量命名惯例，后者是未使用参数等写法。

### `_` 前缀

不是「私有成员」惯例，也**不是**在否定常量里的 `_`。本仓几乎只用于：

- 未使用参数：`_input`、`_event`
- 解构丢弃：`const { image: _image, ...rest } = …`
- 偶发 backing 字段（极少）
- 外部协议自带的 `_meta` 一类字段名

不要新建 `_doWork` 式私有方法命名。

### 布尔与谓词

优先 `is*` / `has*` / `should*` / `can*` / `needs*`：

- `isStaleGeneration`、`hasAttachments`、`shouldAbort`、`needsLogin`

### 异步与读写动词

| 动词 | 常见含义 | 示例 |
|------|----------|------|
| `fetch*` | 网络 / 远程 IO | `fetchSession`、`fetchRemote`、`fetchModelsForProvider` |
| `list*` | 集合读取 | `listSessions`、`listChats`、`listVoices` |
| `get*` | 同步或廉价查找 | `getAuthToken`、`getChat`、`getProviderInstance` |
| `load*` | 重资源 / 本地水合 / 模型加载 | `loadModel`、`loadSession`、`loadEnabled` |
| `create*` / `update*` / `delete*` | 领域 CRUD（服务端尤甚） | `createChat`、`updateChat`、`deleteChat` |
| `remove*` | 客户端门面删除（常见于 `*Remote`） | `removeRemote` |
| `sync*` / `reconcile*` | 与远端对齐 | `syncAuthenticatedProviders`、`reconcileCloudSessions` |
| `apply*` | 应用令牌 / 补丁结果 | `applyOIDCTokens`、`ApplyResult` |

同一资源：服务端多用 `delete*`，stage-ui remote 门面多用 `removeRemote`。跟邻域，不要混出第三套。

### 回调与处理器

| 形式 | 用途 | 示例 |
|------|------|------|
| `on*` | 生命周期 / 钩子参数 | `onBeforeSend`、`onTokenRefreshed`、`onStatusChange` |
| 领域动词 | 网关 / 业务入口 | `chatCompletions`、`authorizeChat`（不必强行 `handle*`） |
| `defineInvokeHandler(…, handler)` | Electron 侧注册 | handler 常内联，不一定叫 `handleFoo` |

### 工厂与声明式前缀

| 前缀 | 何时用 | 示例 |
|------|--------|------|
| `create*` | 组装依赖并返回实例 / 服务 / 路由 / 客户端 | `createFluxService`、`createChatWsClient`、`createKits` |
| `define*` | 声明契约或注册表项 | `defineStore`、`defineKit`、`defineProvider`、`defineInvokeEventa` |
| `use*` | Vue composable / 部分 Pinia 导出 | `useModulesList`、`useChatContextStore` |

`createXService` 仅当 `X` 确有策略、校验、状态、重试或 IO 边界时使用；禁止空壳透传。

### 符号哲学

1. 目录已表达的范围（包名、产品名、传输层）不要再叠进每个符号
2. 按领域动作命名，不按「当前文件碰巧在哪一层」
3. 短名优先；跨模块边界再补上下文
4. 解析后的概念用名词；变换与副作用用动词
5. 类型从拥有契约的包导入，不为窄用本地重声明外部公开契约

**长名何时可以**：协议契约与消歧义允许写长名（如 `moduleContributeCapabilityConfigurationValidateResponse`、`resolveActiveVoiceInputRecordingSegmentAfterStop`）；模块内局部变量仍宜短，不要把全路径限定词堆进每个临时名。

## 类型与接口

### `interface` vs `type`

| 用 | 场景 |
|----|------|
| `interface` | 对象形状、Deps、Options、带方法的服务契约 |
| `type` | 联合、别名、`ReturnType<typeof createX>`、Valibot/Drizzle `Infer*`、事件联合 |

服务表面常见：

```ts
export type FluxService = ReturnType<typeof createFluxService>
```

### 角色后缀（高频）

| 后缀 | 含义 | 示例 |
|------|------|------|
| `Options` | 调用可选旋钮 | `CreateChatWsClientOptions`、`StreamOptions` |
| `Config` | 结构化配置 | `EmailConfig`、`LlmRouterConfig`、`VisionAgentConfig` |
| `Context` | 请求期 / 运行期上下文袋 | `V1GatewayContext`、`RouteContext` |
| `Deps` | 注入依赖袋 | `V1RouteDeps`、`AuthRoutesDeps`、`CheckoutOperationDeps` |
| `Payload` | 事件或写操作体 | `CreateCharacterPayload`、`PluginCapabilityPayload` |
| `State` | 快照 / 会话态 | `ChatOrchestratorRuntimeState`、`PluginCapabilityState` |
| `Event` | 领域或流事件 | `StreamEvent`、`SegmentDomainEvent` |
| `Result` | 结构化结果（含成败联合） | `KitUseResult`、`GrantResult`、`ApplyResult` |
| `Error` / `*Error` | 错误选项或错误类 | `KitUnavailableError`、`InvalidEventErrorOptions` |
| `Service` | 服务表面 | `CharacterService`、`VoicePackService` |
| `Client` | 客户端形状 | `StageApiClient`、`ChatWsClient`、`GameletKitClient` |
| `Runtime` | 运行中句柄 | `KitClientRuntime`、`V1GatewayRuntime` |
| `Port` | core-agent 边界端口 | `AgentLLMPort`、`AgentSessionPort` |
| `Input` | Valibot / 运营写入入参 | `CreateVoicePackInput`、`CheckoutOperationInput`、`GrantInput` |
| `Request` / `Response` | 操作或协议 IO | `OpenAiSpeechRequest`、`PullMessagesRequest`、`LoadModelRequest` |
| `Params` | 路径 / 查询参数形状 | `VoicePackParams`、`PatchConfigParams` |

Composable 选项常带 `Use` 前缀：`UseOptimisticMutationOptions`、`UseLocalFirstRequestOptions`。

### 泛型参数

用 `T` + 概念，避免无意义单字母堆叠：

- `TClient`、`TKit`、`TSession`、`TResponse`
- 约束：`V1GatewayContext<Name extends V1GatewayOperationName>`

### 领域实体

列表行 / 聚合根用稳定领域名（`Character`、`WireMessage`、`ChatHistoryItem`），不必套 `XxxItem` / `XxxForm`。由 schema 推导时：

- `CreateXxxPayload` / `UpdateXxxPayload`（stage-ui 角色卡）
- `CreateXxxInput` / `UpdateXxxInput`（server Valibot）
- Drizzle：`Xxx` + `NewXxx`（`InferSelectModel` / `InferInsertModel`）

### 命名空间与前缀

- 顶层跨目录契约可带域前缀（`V1Gateway*`、`ElectronPlugin*`）
- 仅挂在某一根下的内部形状，避免重复叠同一前缀
- 客户端门面：`CharactersRemoteClient`；Hono 实例：`StageApiClient`

## API 相关命名

本仓「API」不是单一 `apis/type.ts` 层，而是多面并行。按面起名。

### HTTP 路径（云端）

约定摘要（详见 `apps/server/docs/ai-context/config-and-naming-conventions.md`）：

| 原则 | 做法 |
|------|------|
| 版本树 | 稳定对外契约挂 `/api/v1/...`（兼容面如 `/api/v1/openai/...`） |
| 资源名 | 复数 kebab：`/api/v1/chats`、`/api/v1/voice-packs` |
| 从属资源 | 挂父下：`/:id/members`、`/:id/members/:memberId` |
| 当前用户 | 优先 `me` 语义（见该文档） |
| Admin | `/api/admin/...` |
| Auth | `/auth/*`、`/api/auth/*`、`/.well-known/*`（与 v1 资源树分开） |
| WebSocket | `/ws/chat` 等；流式 HTTP 如 `/api/v1/audio/transcriptions/stream` |

OpenAI 兼容相对路径保持生态习惯：`/chat/completions`、`/speech`、`/voices`。

### 服务端：路由 / 服务 / 操作

| 模式 | 含义 | 示例 |
|------|------|------|
| `createXxxRoutes` | 挂载路由树 | `createChatRoutes`、`createFluxRoutes` |
| `createAdminXxxRoutes` | Admin 子树 | `createAdminVoicePackRoutes` |
| `createXxxUiRoutes` | 服务端 HTML/UI 路由 | `createAuthUiRoutes` |
| `createXxxWsHandlers` | WS 处理器包 | `createChatWsHandlers` |
| `createXxxService` | 领域服务 | `createFluxService`、`createCharacterService` |
| `createXxxOperation` | 单笔操作编排 | `createCheckoutOperation`、`createSpeechCatalogOperation` |
| 领域动词函数 | 网关内操作（不一定 `create*Operation`） | `chatCompletions(deps)` |
| `*RoutesDeps` / `*OperationDeps` | 注入袋 | `V1RouteDeps`、`CheckoutOperationDeps` |

服务方法：`createChat` · `listChats` · `getChat` · `updateChat` · `deleteChat` · `addMember`（动词 + 资源；集合用复数）。

### 客户端：Hono RPC

```ts
// packages/stage-ui/src/composables/api.ts
export const client = hc<AppType>(SERVER_URL, { fetch: authedFetch })
export type StageApiClient = typeof client
```

| 项 | 约定 |
|----|------|
| 路径段 | 跟服务器：`client.api.v1.characters…` |
| HTTP 方法 | `$get` / `$post` / `$patch` / `$delete` |
| 动态段 | `':id'` 键 |

### 客户端：领域门面

业务代码优先走 service 门面，而不是到处散落 `$get`。

| 层 | 命名 | 示例 |
|----|------|------|
| Service 工厂 | `createXxxService` | `createCharactersService` |
| 远程读写 | `fetchRemote` / `fetchRemoteById` / `createRemote` / `updateRemote` / `removeRemote` | `CharactersService` |
| 其它动作 | 领域动词 + `Remote` | `likeRemote`、`bookmarkRemote` |
| 载荷类型 | `CreateXxxPayload` / `UpdateXxxPayload` | 与 Valibot schema 对齐 |

Store 内可再缩短为 `fetchList` / `create`，由 store 调 service。

### 客户端：其它 HTTP

| 名 | 角色 |
|----|------|
| `authedFetch` | 带 Bearer、401 刷新的 `fetch` |
| `fetchSession` / `listSessions` / `signOut` | Auth 会话（better-auth `authClient`） |
| `createCloudChatMapper` → `listChats` / `createChat` / `deleteChat` | 聊天云同步 HTTP |
| `ofetch` / 厂商 `createToken` | 第三方 token 等局部调用 |

### Eventa（桌宠 / 协议 IPC）

符号（TS 导出）：camelCase，动作可读。

| 习惯 | 示例 |
|------|------|
| 桌宠 Electron 多 `electron*` 前缀 | `electronPluginList`、`electronAuthStartLogin` |
| 亦有域前缀无 `electron` | `widgetsOpenWindow`、`gameletIframeRequest` |
| 事件（非 invoke） | `electronPluginToolsChanged` 等 + `defineEventa` |

字符串（运行时事件名）：分段 kebab，固定前缀族。

| 族 | 形态 | 示例 |
|----|------|------|
| Electron invoke | `eventa:invoke:electron:<domain>:<action>` | `eventa:invoke:electron:plugins:list` |
| Electron event | `eventa:event:electron:…` | `eventa:event:electron:plugins:tools:changed` |
| Gamelet 等 | `eventa:invoke:gamelet:…` | `eventa:invoke:gamelet:iframe:request` |
| plugin-sdk 协议 | `proj-airi:plugin-sdk:apis:…` | `…:apis:client:kits:list` |

配套常量常见 `*EventName`，再交给 `defineInvokeEventa`。新契约：符号与字符串同域、同动作；字符串用 `:` 分段、段内 kebab；不要自造第三套前缀。

### Plugin Kit API

| 名 | 含义 |
|----|------|
| `xxxKitApis` | 共享 Eventa invoke 契约表（`defineInvokeEventa` 映射） |
| `XxxKitService` | Host 侧真实副作用 |
| `xxxKit` | `defineKit` 定义（`id` / `version` / `createClient`） |
| 复数客户端 | `gamelets` = `ctx.kits.use(gameletKit)` 的返回 |
| `createXxxKit(…)` | 把 service / 远程客户端焊进 kit |

代码里还常见：`KitRef`、`KitClientRuntime`、`GameletKitClient`、`createHostGameletKit`、`createKits`；kit id 形如 `'kit.gamelet'`。

禁止对扩展暴露运输层专用名（如 `invokeGamelet`、`gameletRpc`）。本地 / 远程应对作者同一客户端形状。

### Redis key 与 HTTP 头

Redis（`apps/server/src/utils/redis-keys.ts`）：

- 运行时 key：`:` 分段，如 `user:{userId}:flux`、`lock:{domain}:…`、`config:{key}`
- TS helper：`*RedisKey`，如 `userFluxRedisKey`、`lockRedisKey`、`ttsPoolInflightRedisKey`
- 业务代码走 helper，禁止散落模板字符串

Header（代码里出现的）：

- 认证：`Authorization: Bearer …`（读取时常用小写 `authorization`）
- 产品分析：`x-posthog-distinct-id`、`x-posthog-session-id`
- 扩展静态资源路径前缀：`/_airi/extensions/...`

### 各面对照（起名时先选面）

| 你在写… | 跟这套名字 |
|---------|------------|
| 云端 URL | 复数资源 · `/api/v1` · 文档 route 节 |
| server 路由模块 | `create*Routes` + `*RoutesDeps` |
| server 领域逻辑 | `create*Service` + `list` / `get` / `create` / `update` / `delete` |
| stage-ui 调云端业务 | `create*Service` + `*Remote` / Payload |
| 直接 Hono client | `client.api.v1….$get` |
| 桌宠 main↔renderer | `electron*` + `eventa:invoke:electron:…` |
| 扩展 Kit | `*Kit` / `*KitApis` / `*KitService` / 复数客户端 |
| Redis | `*RedisKey` + `a:b:c` 分段 |

## Pinia 与模块级 id（TS 侧）

Store 实现在 `.ts`；不含 `.vue`。

| 项 | 习惯 |
|----|------|
| 导出 | 多 `useXxxStore`；settings 常见 `useSettingsXxx` |
| `defineStore` 第一参 id | kebab；嵌套用 `:`。例：`'chat-context'`、`'devtools:io-tracer'`、`'mods:api:context-bridge'` |
| 全局唯一 | 与其它包撞名时改 id（如 `background-entries`） |

## 常量与字符串资源

| 种类 | 命名 |
|------|------|
| 超时 / 默认上限 / 协议码 / 指标 | UPPER_SNAKE 常量，词间 `_`（允许偏长） |
| configKV 键 | UPPER_SNAKE 字符串，schema 单一真相 |
| Eventa 名 | 见上文 Eventa 节 |
| inject Symbol 描述 | 可含 `@proj-airi/…` |
| npm 包 | `@proj-airi/*`（import / `pnpm -F`） |

稳定常量、配置键、OTel / 网关指标名等用 `_` 分段是本仓常态，不必改成 camelCase。契约对象、Eventa 导出仍用 camelCase const，不要写成 `ELECTRON_PLUGIN_LIST`。

## 已知不一致（跟邻域，不发明第三套）

| 点 | 现状 |
|----|------|
| 文件大小写 | 默认 kebab；少数 camel / Pascal 例外 |
| Character 单复数 | server `createCharacterService`；client `createCharactersService` |
| 删除动词 | server `delete*`；client 门面常 `removeRemote` |
| Operation 工厂 | Stripe / speech-catalog 用 `create*Operation`；chat completions 用 `chatCompletions` |
| Eventa 符号前缀 | 多数 `electron*`，部分纯域前缀 |
| Eventa 字符串两族 | `eventa:invoke:…` 与 `proj-airi:plugin-sdk:…` |
| Kit | README 表（`*KitApis` 等）与部分内建 `defineKit` + `createHost*Kit` 并存；新 kit 按 README 表 |
| Composable 文件 | `use-*.ts` 与领域名文件混用 |

## 现状

- `.ts` 文件 / 目录：kebab-case 为主
- 符号：camelCase + UPPER_SNAKE 常量；`create*` / `define*` / `use*` 分工稳定
- 类型：Options / Config / Context / Deps / Payload / Client / Service；Input 与 Payload 双轨（server vs stage-ui）可辨
- API：HTTP 路径、server 工厂、client `*Remote`、Eventa、Kit、Redis helper 分面命名，无统一 `query` / `add` / `edit` 管理端表

## 边界

- **本篇管**：`.ts` 文件与目录名；TS 变量 / 函数 / 常量 / 类型；HTTP · RPC · Eventa · Kit · Redis helper 命名
- **本篇不管**：`.vue` 文件名与 SFC 组件名；Uno / CSS 类名；i18n key（见文案专题）；完整复抄 `AGENTS.md` 注释篇
- **与工作室文档库**：跨栈默认以 Obsidian `命名规范/`（核心 · 类型 · API）为主；本篇为 **AIRI 仓辅证**。冲突时（尤其文件名 kebab vs 工作室 camelCase）**仓内跟邻域 + 本篇**，不要把 kebab 写回文档库默认
- **云端路径 / Redis / 可观测字段**：以 `apps/server/docs/ai-context/` 对应篇为准；本页只收口 TS 侧怎么起名
