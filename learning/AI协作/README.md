# AI 协作

> **管什么**：给编码 Agent（Cursor / Claude Code / Codex / Copilot 等）看的仓库约定——根指南、包级 handoff、Skills、Cursor 命令、AI 上下文文档、GitHub agentic workflow
> **不管什么**：产品里的「角色对话 / core-agent / 通道 Bot」→ 各功能域；贡献闭环（测试/lint/CI）→ [工程横切](../工程横切/)；Histoire / solutions 写法细节 → [工程工具](../工程工具/)

本域回答：**Agent 进仓后读哪一层、何时加载 Skill、高风险包有什么额外协作策略。**
事实以源码与仓内原文为准；learning **不复抄** `AGENTS.md` 全文。

## 从这里开始

→ [学习路径](./学习路径.md)

## 专题

| 文档 | 内容 |
|------|------|
| [学习路径](./学习路径.md) | 最短跟读顺序 |
| [配置分层](./配置分层.md) | 各配置文件落点与优先级感 |
| [根指南](./根指南.md) | `AGENTS.md` · `CLAUDE.md` |
| [Skills与命令](./Skills与命令.md) | `.agents/skills` · `.cursor/commands` |
| [上下文文档](./上下文文档.md) | `docs/ai/context` · server `ai-context` · solutions |
| [包级策略](./包级策略.md) | 包/服务内 `AGENTS.md` · 多 Agent 分工 |

## 刻意不写（本域）

| 项 | 说明 |
|----|------|
| 根 `AGENTS.md` 全文复写 | 只抽结构与「何时打开」；正文以仓库文件为准 |
| server `docs/ai-context/` 全文 | 本域给地图；云端细读见 [云端服务/ai-context导读](../云端服务/ai-context导读.md) |
| Cursor User Rules / 本机 Obsidian 规范 | 属本机工作流，不是本仓上游约定 |
