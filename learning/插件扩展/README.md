# 插件扩展

> **管什么**：Channel 协议与 SDK、ExtensionHost、kits / gamelet、跟做
> **边界**：具体 Discord 业务竖切在通道机器人域；云端 HTTP 在云端服务域；MCP 在本机操控域

根脚本 `pnpm dev:server` = **Channel Hub（server-runtime）**，不是 `apps/server`。

## 从这里开始

→ [学习路径](./学习路径.md)

## 专题

| 文档 | 内容 |
|------|------|
| [学习路径](./学习路径.md) | 协议链跟读 |
| [模块通道](./模块通道.md) | protocol → runtime ↔ sdk |
| [宿主扩展](./宿主扩展.md) | ExtensionHost · kits · gamelet |
| [Host扩展跟做](./Host扩展跟做.md) | manifest → mount 实操 |
| [扩展作者入门](./扩展作者入门.md) | Channel vs Host 选型 |
