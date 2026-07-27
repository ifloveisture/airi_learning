# 工程横切

> **管什么**：测试、质量门禁、DI/IPC 读码入口、i18n、发布/CI、错误处理约定
> **不管什么**：Histoire / Devtools / Vishot / solutions 写法 → 见同仓 `learning/工程工具/`（调试产品面）；业务功能本身不在本域

本域专题**各自可跟读闭环**，正文内用「边界」段说明邻近概念，不要求先读其它功能域。

## 从这里开始

→ [学习路径](./学习路径.md)

## 专题

| 文档 | 内容 |
|------|------|
| [学习路径](./学习路径.md) | 贡献最小闭环 |
| [测试与质量门禁](./测试与质量门禁.md) | Vitest · lint · typecheck |
| [Eventa与injeca](./Eventa与injeca.md) | 桌宠 DI / IPC 最短读码 |
| [文案与Crowdin](./文案与Crowdin.md) | `packages/i18n` · Crowdin |
| [发布与CI地图](./发布与CI地图.md) | workflows · 各面发布 |
| [错误处理约定](./错误处理约定.md) | `@moeru/std` · NOTICE 等 |

## 刻意不写（本域）

| 项 | 说明 |
|----|------|
| 移动端 Pocket 发布细节 | 仅在 CI 地图列 workflow 名；产品学习另议 |
| 完整 AGENTS 全文 | 以本域专题 + 根 `AGENTS.md` 为准，不复抄 |
