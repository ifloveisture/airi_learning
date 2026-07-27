# 运营Runbook

## 定位

把 **Discord Channel 桥**跑到「能收消息并进 Stage」的检查清单。不讲 Stage UI 设计。

## 前置

| 项 | 说明 |
|----|------|
| Channel Hub | 桌宠内嵌 **或** `pnpm dev:server`（`server-runtime`，默认 WS 端口以实际为准，常见文档写 6121） |
| Stage | `pnpm dev:web` 或桌宠，便于看模块/上下文是否进编排 |
| Bot | `services/discord-bot` 配好 token 与 Hub 地址 |

## 步骤

1. 起 Hub：确认进程监听 WS
2. 起 Discord bot：`pnpm -F @proj-airi/discord-bot start`（以 package scripts 为准）
3. 看 bot 日志：是否 `announce` / 握手成功
4. Stage 侧打开相关模块设置，确认事件能进（输入可见或 context-bridge 有反应）
5. 在 Discord 测试频道发消息 → 期望 Stage 侧有对应输入/回复链路

## 真源（排障时打开）

| 项 | 路径 |
|----|------|
| Bot | `services/discord-bot/` |
| 事件名 | `packages/plugin-protocol` / 同域《Channel事件速查》 |
| 竖切说明 | 同域《Discord竖切》 |

## 常见失败

| 现象 | 先查 |
|------|------|
| bot 连不上 | Hub URL/端口、防火墙、是否误连 `apps/server` |
| 握手成功无业务 | 事件名是否协议版本一致、Stage 模块是否启用 |
| 仅本地通 | 生产需稳定 Hub 进程与 env 密钥轮换 |

## 现状

可启用；生产守护（systemd/docker）由部署方自定，仓内不绑死。

## 边界

- **不是** Telegram/Satori 独立 Agent（那些自带 LLM loop）。
- **不是** 云端 `apps/server` 登录计费。
