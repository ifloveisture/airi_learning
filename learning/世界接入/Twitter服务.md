# Twitter服务

## 定位

`services/twitter-services`：Playwright 驱动 Twitter/X 浏览器自动化；可选 AIRI Channel adapter 或 MCP adapter。独立进程，非 monorepo Stage 主路径。

## 真源

| 项 | 路径 |
|----|------|
| 入口 | `services/twitter-services/src/main.ts` |
| Adapter | `adapters/airi-adapter.ts` · `adapters/mcp-adapter.ts` |
| 配置 | `.env.example` / `.env.local` |
| 设计笔记 | `services/twitter-services/docs/architecture-20250304.md`（若在） |

## 跟读

1. `main.ts` bootstrap
2. config 与 feature flag（`ENABLE_AIRI` / `ENABLE_MCP`）
3. 选定 adapter 读事件如何进出
4. auth/登录相关 core（浏览器会话）

## 命令 / env

```bash
pnpm -F @proj-airi/twitter-services dev
# 需 .env.local；首次 playwright install chromium
```

概念变量：`AIRI_URL` · `MCP_PORT` · `ENABLE_AIRI` · `ENABLE_MCP`

## 现状

可启用（独立 service）。

## 边界

- 控的是 **浏览器自动化**，不是 Twitter 官方 API SDK 主路径。
- 与 **浏览器扩展插件**：扩展抓页面上下文推 Channel；本服务专攻 Twitter 操作。
- 与 Discord Channel bot：协议都可能进 Hub，但本服务实现栈是 Playwright。
