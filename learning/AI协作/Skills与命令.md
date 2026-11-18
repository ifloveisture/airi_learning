# Skills 与命令

## 定位

`.agents/skills` 是**按任务触发**的能力说明书（Agent Skills 格式：YAML frontmatter + `SKILL.md`）。
`.cursor/commands` 是 Cursor 里人工调用的斜杠命令文案。

根 `AGENTS.md` 的 [Task Routing](../../AGENTS.md) 表也会指向若干 skill；**以目录实况为准**，数量会变。

## 真源

| 项 | 路径 |
|----|------|
| Skills 根 | `.agents/skills/<name>/SKILL.md` |
| Cursor 命令 | `.cursor/commands/deslop.md`（当前仅见这一条） |

## 跟读

1. `ls .agents/skills`（或资源管理器）确认目录数与名称
2. 打开与任务匹配的 `SKILL.md` 顶部 `description`（触发条件写在这里）
3. 需要细节时再进同目录 `references/`（若有）
4. 对照根 `AGENTS.md` Task Routing，避免只记本页摘要

## 仓内 Skills 一览（32）

对照日期以你拉取后的目录为准；下表按用途分组。**已不存在**的旧名（如 `server-gateway-refactor`）勿再加载。

### AIRI 产品 / 仓规（优先记住）

| Skill | 何时用 |
|-------|--------|
| `eventa` | `@moeru/eventa`、跨进程 RPC / 流式事件 |
| `xsai` | `xsai` / `@xsai/*`、OpenAI 兼容小工作流 |
| `simple-english` | 文档、注释、PR/issue 英文（STE 式短句） |
| `create-pr` | 准备 / 开 AIRI PR（证据、架构、视觉要求） |
| `release-note-writer` | changelog / commit → 英文用户向 release notes |
| `upload-github-attachment` | 本地图/文件上传到 GitHub user-attachments |
| `analyze-io-traces` | 用 Tamagotchi 落盘的 IO trace 分析慢/失败回合 |
| `stage-tamagotchi-godot-csharp` | **仅** Godot/C# 引擎相关目录内工作 |
| `enforce-rules-for-typescript` | 写/改/审 TypeScript、Vue 源码约定 |
| `enforce-rules-for-unocss` | UnoCSS、样式、动画、图标、色模式 |
| `enforce-rules-for-vitest` | 测、复现 bug、mock、测试 import 边界 |
| `enforce-rules-for-pinia-synced` | 给 Pinia 加/改 `synced` |
| `enforce-rules-for-i18n` | Crowdin 待审翻译批量同步进仓 |

### 浏览器 / Electron / 截图自动化

| Skill | 何时用 |
|-------|--------|
| `agent-browser` | CLI 自动化网页（CDP） |
| `agent-browser-electron` | 多窗口 Electron（桌宠）选 CDP target |
| `use-agent-browser-with-input-file` | 文件选择器 / input file 上传流程 |
| `use-agent-browser-for-airi` | Live2D/VRM/MMD 导入在 web/桌宠/pocket 验 |
| `use-vishot` | 确定性截图 + manifest |
| `use-vishot-for-airi` | AIRI 场景（跳过 onboarding、导入模型等） |
| `use-vishot-with-web` | 本地 Web 路由 / 视口截图 |
| `use-vishot-with-electron` | Electron 窗截图 |
| `use-vishot-with-capacitor` | Capacitor WebView 截图 |
| `use-vishot-with-input-file` | Vishot 场景里驱动文件选择再截 |

### 生态 / 通用前端与工具链

| Skill | 何时用 |
|-------|--------|
| `vue` | Vue 3 Composition API、宏、内置组件 |
| `vue-best-practices` | **Vue 任务应加载**；工作流式最佳实践 |
| `vue-testing-best-practices` | Vue 组件测、VTU、E2E 习惯 |
| `vueuse-functions` | 优先用 VueUse 而不是手写同类逻辑 |
| `pinia` | 官方 Pinia 用法（store / getter / action） |
| `unocss` | 规则 / shortcuts / preset；先看根 `uno.config.ts` |
| `pnpm` | workspace、catalog、filter、store |
| `tsdown` | 库打包 / d.ts（Rolldown 系） |
| `web-design-guidelines` | 审 UI：a11y、焦点、表单、动效等 |

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
| 数量 | **32** 个 skill 目录（本页撰写时计数；以目录为准） |
| 同步 | 通用 skill（vue / pnpm / unocss 等）可能来自外部生成；仓规向以 `enforce-rules-*`、`eventa`、`create-pr`、`use-vishot*` 等为准 |
| 已删旧名 | `server-gateway-refactor` 等不再出现；云端改走 `server/AGENTS.md` + ADR |
| `.codex/` | 本仓根目录当前**没有** `.codex` 配置树 |

## 边界

| 是 | 不是 |
|----|------|
| 按任务打开的操作手册 | 替代根 `AGENTS.md` 的全局规章 |
| `agent-browser*` / `use-vishot*` | 替代 Vitest / 手工验收的唯一证明 |
| `deslop` | lint 替代品；风格问题仍以 ESLint + 文件上下文为准 |
| 本页分组表 | 永久冻结清单；增删 skill 后先 `ls` 再改本页 |
