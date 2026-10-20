# Skills 与命令

## 定位

`.agents/skills` 是**按任务触发**的能力说明书（Agent Skills 格式：YAML frontmatter + `SKILL.md`）。
`.cursor/commands` 是 Cursor 里人工调用的斜杠命令文案。

## 真源

| 项 | 路径 |
|----|------|
| Skills 根 | `.agents/skills/<name>/SKILL.md` |
| Cursor 命令 | `.cursor/commands/deslop.md` |

## 跟读

1. 列目录确认有哪些 skill
2. 打开与任务匹配的 `SKILL.md` 顶部 `description`（触发条件写在这里）
3. 需要细节时再进同目录 `references/`（若有）

## 仓内 Skills 一览（12）

按来源粗分：

### 仓内 / 产品相关（优先记住）

| Skill | 何时用 |
|-------|--------|
| `eventa` | `@moeru/eventa`、跨进程 RPC / 流式事件 |
| `xsai` | `xsai` / `@xsai/*`、OpenAI 兼容小工作流选型 |
| `server-gateway-refactor` | 拆/重构 `apps/server` 里混了路由·计费·网关·WS 的胖路由 |
| `agent-browser` | 用 CLI 自动化浏览器 / 部分桌面应用（CDP） |
| `agent-browser-electron` | 多窗口 Electron（桌宠）选对 CDP target |
| `stage-tamagotchi-godot-csharp` | **仅** `engines/stage-tamagotchi-godot` 内 C# |
| `release-note-writer` | 把 changelog / commit 写成英文用户向 release notes |

### 生态生成 / 通用前端（任务命中再加载）

| Skill | 何时用 |
|-------|--------|
| `vue` | Vue 3 Composition API、宏、内置组件 |
| `vue-best-practices` | **Vue 任务应加载**；工作流式最佳实践 |
| `vueuse-functions` | 优先用 VueUse 而不是手写同类逻辑 |
| `unocss` | 规则 / shortcuts / preset；先看根 `uno.config.ts` |
| `pnpm` | workspace、catalog、filter、store 等 pnpm 专有问题 |

## Skill 文件长什么样

典型 frontmatter：

```yaml
---
name: eventa
description: >-
  Guide for using @moeru/eventa ... Use this skill whenever ...
metadata:
  author: moeru-ai
  version: '1.0.0'
---
```

- `description`：给 Agent 做**自动匹配**的触发文案（越具体越好）
- 正文：约定、API 速查、references 链接
- 部分 skill 带 `allowed-tools`（如 `agent-browser` 限制 Bash 前缀）

## Cursor 命令：`deslop`

路径：`.cursor/commands/deslop.md`

作用：对照 main 看本分支 diff，清掉典型「AI 浆糊」——多余注释、异常防御、无意义的 `any` 强转、与文件风格不一致的写法；最后只汇报 1–3 句摘要。

适合：准备开 PR 前人工跑一次，而不是日常编码的默认加载项。

## 现状

| 项 | 说明 |
|----|------|
| 数量 | 12 个 skill 目录 |
| 同步 | 通用 skill（vue/pnpm/unocss）可能来自外部生成脚本；仓内自研以 `eventa`、`server-gateway-refactor` 等为准 |
| `.codex/` | 本仓根目录当前**没有** `.codex` 配置树 |

## 边界

| 是 | 不是 |
|----|------|
| 按任务打开的操作手册 | 替代根 `AGENTS.md` 的全局规章 |
| `agent-browser*` | 替代 Vitest / 手工验收的唯一证明 |
| `deslop` | lint 替代品；风格问题仍以 ESLint + 文件上下文为准 |
