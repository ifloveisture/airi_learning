# VS Code 集成

> IDE 把编辑上下文推给 AIRI Channel，不是云端 `apps/server`。
> 总索引：[游戏与操控](./游戏与操控.md)；Channel 协议：[模块通道](../插件扩展/模块通道.md)。

## 两个包（别混）

| 包 | 路径 | 状态 | 角色 |
|----|------|------|------|
| `vscode-airi` | `integrations/vscode/vscode-airi` | **已实现**（preview） | VS Code 扩展：sdk 连 Hub，推 `context:update` |
| `airi-plugin-vscode` | `integrations/vscode/airi-plugin-vscode` | **WIP stub** | 宿主侧 Host 插件位；`activate()` 仍 TODO |

学习主路径只跟 **`vscode-airi`**。

## 连接方式

```text
VS Code 扩展 (vscode-airi)
  → @proj-airi/server-sdk Client
  → ws://localhost:6121/ws   # 默认；桌宠 Channel Hub 或 pnpm dev:server
  → 客户端名例：proj-airi:plugin-vscode
  → context:update（ReplaceSelf）
  → Stage context-bridge → 可进聊天编排
```

Hub：桌宠 `main/services/airi/channel-server`（端口 `SERVER_CHANNEL_PORT` 或 **6121**），或根脚本 `pnpm dev:server`。
**不是** `pnpm -F @proj-airi/server dev` 那条云端 API。

## 推什么

| 项 | 事实 |
|----|------|
| 触发 | 存盘、切编辑器、周期轮询（`sendInterval`，默认约 3000ms） |
| 内容 | 可读文本：路径 / 文件名 / 光标行 / 前后文（`ContextCollector`） |
| 策略 | `ContextUpdateStrategy.ReplaceSelf` |
| 配置 | `airi-vscode.enabled` · `contextLines` · `sendInterval` |

源码入口：`integrations/vscode/vscode-airi/src/airi.ts` · `context-collector.ts`。

## 本地怎么跑

```bash
pnpm -F vscode-airi build    # 或 dev = tsdown --watch
# VS Code：从扩展输出目录 Load Unpacked
# 同时起 Channel Hub：桌宠 或 pnpm dev:server
```

验收：改文件 / 切焦点后，Stage 侧能收到上下文更新（devtools / bridge 日志视环境而定）。

## 阅读顺序

1. 本页分清两包
2. `vscode-airi/src/airi.ts`
3. [模块通道](../插件扩展/模块通道.md) 的 `context:update`
4. （可选）对照 Discord 桥：同是 Channel Client，载荷不同 → [Discord竖切](../通道机器人/Discord竖切.md)
