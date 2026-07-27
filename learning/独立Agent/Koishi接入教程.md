# Koishi 接入教程

> 面向 AIRI `services/satori-bot`：把 Koishi 配成可用的 **Satori 服务端**，再（可选）接 QQ。
> 边界速查：[Koishi桥接坑点](./Koishi桥接坑点.md) · bot 内核：[Satori专章](./Satori专章.md)

本教程按**里程碑**推进。前半不依赖 QQ；QQ 单独一章，协议实现会变，只讲稳定模式与验收，不绑定某一款已死客户端。

## 你要搭成什么样

```text
[可选] QQ 协议实现 ──OneBot──► Koishi（adapter-onebot）
                                    │
                                    ├─ 控制台 / 沙盒（先验收收发）
                                    │
                                    └─ server-satori ──Satori──► satori-bot
                                         :5140 + /satori/...
```

| 里程碑 | 验收标准 | 还没通时别碰 |
|--------|----------|--------------|
| M1 Koishi 能开 | 控制台网页打开 | QQ、satori-bot |
| M2 server-satori | 本机可连 `…/satori/v1` | QQ、LLM loop |
| M3 沙盒收发 | 沙盒发消息 Koishi 有日志 | QQ |
| M4（可选）QQ | 群/私聊进 Koishi | satori-bot 排障 |
| M5 satori-bot | IDENTIFY→READY→入队→回复 | 改 planner「碰运气」 |

---

## M1：安装并启动 Koishi

AIRI 仓**不附带** Koishi。用官方安装器即可。

| 平台 | 官方入口 |
|------|----------|
| Windows | [为 Windows 安装](https://koishi.chat/zh-CN/manual/starter/windows.html)（推荐 `.msi`） |
| 其它 | [选择安装方式](https://koishi.chat/zh-CN/manual/starter/) |

步骤概要：

1. 安装并启动 Koishi（开始菜单图标）。
2. 等待控制台在浏览器打开。
3. 默认 HTTP 端口叙事为 **5140**（若你改过端口，后面所有 URL 一起改）。

社区与排错入口：[Koishi 社区](https://koishi.chat/zh-CN/about/contact.html)。

**验收：** 控制台能进「插件配置」页面。

---

## M2：启用 `server-satori`（对 AIRI 最关键）

插件包名：`@koishijs/plugin-server-satori`（市场里常显示为 **server-satori**）。

官方说明：[server-satori](https://koishi.chat/zh-CN/plugins/develop/server-satori.html) —— 把当前实例里的机器人以 **Satori 协议**用 HTTP/WebSocket 暴露出去。

### 操作

1. 控制台 → **插件配置** / 插件市场。
2. 安装并**启用** `server-satori`。
3. 看插件配置里的 **`path`（监听路径）**。

### 路径必须与 AIRI 对齐（高频坑）

AIRI 默认（`services/satori-bot/.env`）：

```env
SATORI_WS_URL=ws://localhost:5140/satori/v1/events
SATORI_API_BASE_URL=http://localhost:5140/satori/v1
```

| 来源 | `path` 习惯 | 完整 URL 形态 |
|------|-------------|---------------|
| AIRI / 多数对接文（如 AstrBot） | `/satori` | `http://localhost:5140/satori/v1` |
| Koishi 官方文档默认值 | `''`（空） | 可能是 `http://localhost:5140/v1`（无 `/satori` 前缀） |

**二选一对齐，不要混用：**

- **推荐（少改 AIRI）：** 在 `server-satori` 把 `path` 设为 `/satori`，与 AIRI 默认一致。
- **或：** 保持 Koishi 空 path，改 `.env.local` 去掉 `/satori`（WS/HTTP 两处一起改）。

Token：

- Koishi **未**配鉴权 → `SATORI_TOKEN` **留空**（不要留 `.env` 里的 `your_satori_token_here` 占位字符串）。
- Koishi **配了** token → 两边填同一个。

### 本机烟测（不启 satori-bot 也能做）

浏览器或 curl 试 HTTP 根是否通（具体探测路径随 Satori 版本略有差异，以能连上为准）：

```text
http://localhost:5140/satori/v1
```

若改过端口/path，按实际替换。连不上时：插件是否启用、path、防火墙、Koishi 是否真在 5140。

**验收：** 你已明确写下「最终 WS URL 与 API Base」，且与即将写入的 `SATORI_*` 一致。

---

## M3：用沙盒确认「Koishi 会说话」

在接 QQ / AIRI 之前，先用控制台**沙盒**发一条消息：

- 能看到会话 / 日志 → 实例与插件栈基本健康。
- 沙盒都不动 → 先修 Koishi，不要装 QQ。

（对接其它 Satori 客户端的教程里也常用沙盒测 `/help` 一类指令；AIRI 侧对应的是后面 M5 的 LLM 回复。）

**验收：** 沙盒有进出记录。

---

## M4（可选）：接 QQ —— OneBot 模式

`satori-bot` **不**实现 QQ。常见拼法：

```text
QQ 协议实现（对外提供 OneBot）
  ↔ Koishi adapter-onebot
  → 同一 Koishi 实例上的 server-satori
  → satori-bot
```

### 4.1 装适配器

市场安装 **adapter-onebot**（`@koishijs/plugin-adapter-onebot`）。
配置说明：[适配器 OneBot](https://koishi.chat/zh-CN/plugins/adapter/onebot.html) · [GitHub](https://github.com/koishijs/koishi-plugin-adapter-onebot)。

关键项（名称以控制台为准）：

| 项 | 含义 |
|----|------|
| `selfId` | 机器人 QQ 号（字符串） |
| `protocol` | `http` / `ws` / `ws-reverse` 等 |
| `endpoint` / `path` | 与协议实现的地址、路径一致 |
| `token` / `secret` | 与协议实现一致（可空则两边都空） |

### 4.2 选通信方向（别配反）

| 模式 | 谁当服务端 | 典型用法 |
|------|------------|----------|
| 正向 WS / HTTP | **协议实现** 开端口，Koishi 去连 | `endpoint` 填实现方地址 |
| 反向 WS | **Koishi** 听路径（默认常 `/onebot`），实现方连过来 | 实现方填 `ws://127.0.0.1:5140/onebot` 一类 |

注意：`5140` 上可能同时有 **server（控制台）**、**onebot 路径**、**satori 路径**——path 不要撞车，也不要和 `/satori` 搞混。

### 4.3 协议实现怎么选

仓内 EVENT 样例出现过 **onebot** 与 **NTQQ / Lagrange** 原始字段（`services/satori-bot/docs/EVENT.md`），说明历史上有人这么接过。
具体用哪款实现、如何过登录与风控：

- **以该实现当前文档为准**（生态变化快；勿死抱已停更的旧客户端当唯一解）。
- AIRI learning **不**提供「某 QQ 框架一步装机」——那是外仓责任。

### 4.4 QQ 群专项检查

| 检查 | 说明 |
|------|------|
| 账号在线 | 适配器 / 协议端都显示在线 |
| 群消息进 Koishi | 控制台能看到该群发言（与 AIRI 无关） |
| 群权限 | 被禁言、未加群、未开群消息权限等都会导致「私聊通群不通」 |
| 过滤插件 | 其它 Koishi 插件是否吞掉消息 |

**验收：** 不启 `satori-bot` 时，群消息已稳定出现在 Koishi。

---

## M5：接上 `@proj-airi/satori-bot`

前置：M2 已绿；若要用 QQ，M4 已绿。另需 OpenAI 兼容 LLM。

```bash
# 仓库根
pnpm i
cp services/satori-bot/.env services/satori-bot/.env.local
```

编辑 `.env.local`（示例对齐默认 path=`/satori`）：

```env
SATORI_WS_URL=ws://localhost:5140/satori/v1/events
SATORI_API_BASE_URL=http://localhost:5140/satori/v1
SATORI_TOKEN=

LLM_API_KEY=...
LLM_API_BASE_URL=https://api.openai.com/v1
LLM_MODEL=...
```

```bash
pnpm -F @proj-airi/satori-bot dev
```

### 期望日志 / 行为

| 阶段 | 期望 |
|------|------|
| 连接 | 连上 WS，发送 IDENTIFY |
| READY | 收到 logins；据此建 HTTP API 客户端 |
| 群/沙盒消息 | `message-created` 入队（见 `docs/HANDLER.md`） |
| 决策 | `read_unread_messages` → `send_message`（可能 INTERRUPT） |

**不需要** `pnpm dev:server`（6121 Channel Hub）或 Stage。

细节：[Satori专章](./Satori专章.md) · [Agent调度](../算法主线/Agent调度.md)。

---

## 端到端检查清单

复制自检：

- [ ] Koishi 控制台可开（M1）
- [ ] `server-satori` 已启用
- [ ] `path` 与 `SATORI_WS_URL` / `SATORI_API_BASE_URL` **一致**
- [ ] Token 两边同为空或同为同一字符串（无占位垃圾值）
- [ ] 沙盒有消息记录（M3）
- [ ] （QQ）协议端在线 + 群消息进 Koishi（M4）
- [ ] `satori-bot` READY
- [ ] LLM 变量真实可用
- [ ] 群内或沙盒出现 bot 回复

---

## 故障对照表

| 现象 | 先查 |
|------|------|
| 控制台都打不开 | Koishi 安装/启动（M1） |
| satori-bot 连不上 / 立刻断 | 5140、path 是否少了或多重了 `/satori`、Token |
| READY 了但无事件 | 平台适配未上线；或只有沙盒通、QQ 未通 |
| Koishi 有群消息，bot 无入队 | WS 是否连的是**同一**实例；事件类型是否非 `message-created` |
| 入队了不回复 | `LLM_*`；loop 硬顶；看 HANDLER 是否卡在 read/send |
| 私聊通群不通 | QQ 群权限 / 适配器过滤（仍在 M4） |
| 改完 path 仍 404 | 清错旧 URL；确认改的是 `.env.local` 且已重启 bot |

分层排障顺序仍以 [Koishi桥接坑点](./Koishi桥接坑点.md) 六步表为准。

---

## 官方与仓内链接

| 资源 | 用途 |
|------|------|
| [Koishi 安装](https://koishi.chat/zh-CN/manual/starter/) | M1 |
| [server-satori](https://koishi.chat/zh-CN/plugins/develop/server-satori.html) | M2 |
| [adapter-onebot](https://koishi.chat/zh-CN/plugins/adapter/onebot.html) | M4 |
| [Satori 协议](https://satori.chat/) | 协议语义 |
| `services/satori-bot/README.md` | AIRI 前置声明 |
| `services/satori-bot/docs/HANDLER.md` | 事件→Action |
| `services/satori-bot/docs/EVENT.md` | 字段；onebot / Lagrange 痕迹 |
| `docs/content/zh-Hans/docs/integrations/satori.md` | 官方短文 |

同构对接参考（非 AIRI，但 URL 习惯一致）：[AstrBot ↔ server-satori](https://docs.astrbot.app/platform/satori/server-satori.html)。

---

## 阅读顺序（学完桥再深挖 bot）

1. 本教程跟到 M2（+ 可选 M4）
2. [Koishi桥接坑点](./Koishi桥接坑点.md) 巩固边界
3. [Satori专章](./Satori专章.md) + `docs/HANDLER.md`
4. [独立Agent/学习路径](./学习路径.md) Phase 2
