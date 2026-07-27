# Solutions 用法

> 把 `docs/solutions/` 当成**排障索引**，不是第二套功能说明书。
> 截图 / Histoire 见 [场景截图](./场景截图.md) · [Histoire与Devtools](./Histoire与Devtools.md)。

## 何时打开

| 场景 | 动作 |
|------|------|
| 实现 / 调试 / 验收某模块前 | 先搜是否已有同类坑 |
| 修完非显然 bug | 考虑补一篇（给后人） |
| 查 UI 组件 API | 去 `docs/ai/context/ui-components.md`，不是 solutions |
| 查云端计费架构 | 去 `apps/server/docs/ai-context/`，不是 solutions |

`AGENTS.md`：Documented solutions 按类别组织，带 YAML frontmatter；在已有记录的区域实现或排障时优先查阅。

## 目录与命名

```text
docs/solutions/<category>/<kebab-topic>.md
```

现存例：`docs/solutions/developer-experience/agent-browser-mock-api-verification.md`
（仓内可能仍很少；**有一篇就按 frontmatter 搜，不要假设已覆盖全仓。**）

## Frontmatter 约定

`AGENTS.md` 强调字段：`module` · `tags` · `problem_type`。

现存样例实际还常见：

| 字段 | 用途 |
|------|------|
| `title` / `date` | 标题与时间 |
| `category` | 常与目录名一致（如 `developer-experience`） |
| `problem_type` | 问题类型 |
| `component` / `severity` | 组件与严重度 |
| `applies_when` | 适用前提 |
| `tags` | 检索标签 |

写新篇时：至少填齐 **problem_type + tags + category（或 module）**，并在正文写清「何时适用 / 不适用范围」（样例文即如此：mock API 验收，**不**当计费/集成证明）。

## 怎么搜

1. 按目录 category 浏览
2. 全文或 frontmatter 搜 `tags` / `problem_type` / 组件名
3. 命中后核对 `applies_when`，避免误套

## 和 learning 的分工

| | `learning/` | `docs/solutions/` |
|--|-------------|-------------------|
| 目的 | 学结构与主路径 | 记坑与修复 |
| 读者 | 跟研究线的人 | 正在修同类问题的人 |
| 更新 | 域结构变化时 | 每修一个非显然问题可追加 |

## 阅读顺序

1. 本页
2. 打开现有一篇 solutions 看 frontmatter 形状
3. 回 [学习路径](./学习路径.md)
