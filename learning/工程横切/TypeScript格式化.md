# TypeScript格式化

## 定位

本仓 **TypeScript（及同管线的 JS/Vue/JSON/YAML 等）单文件 / 全仓格式化** 怎么做：不用 Prettier，用 **ESLint 风格规则 + `moeru-lint --fix`**。保存时靠 IDE 的 ESLint Fix；提交时靠钩子再修一遍。

**格式模板**（引号 / 分号 / 缩进等观感）见下文「格式模板」；本页上半是**怎么跑**，下半是**长成什么样**。

## 真源

| 项 | 路径 |
|----|------|
| 根脚本 | `package.json`：`lint` / `lint:fix` → `moeru-lint` |
| ESLint 配置 | `eslint.config.ts`（`@moeru/eslint-config`，基于 antfu 系） |
| 编辑器 | `.vscode/settings.json`（关 Prettier；Save 时 ESLint fix） |
| 缩进底线 | `.editorconfig`（`*.{js,ts,vue,…}`：2 空格、LF、UTF-8） |
| 提交钩子 | `nano-staged`：`"*": "moeru-lint --fix"` → 见 [提交与钩子](./提交与钩子.md) |
| 约定一句话 | 根 `AGENTS.md`：*Formatting is handled via ESLint; `pnpm lint:fix` applies formatting.* |
| CI | `.github/workflows/ci.yml` 跑 `pnpm run lint`；`autofix.yaml` 跑 `pnpm run lint:fix` |

## 跟读

1. 打开 `.vscode/settings.json`：确认 `prettier.enable: false`、`source.fixAll.eslint`
2. 打开 `eslint.config.ts`：看 `defineConfig` 与仓内 overrides（如 server 禁 `vi.mock` 相对路径）
3. 对单个 `.ts` 跑下面「单文件」命令，看 diff
4. （可选）对照 [提交与钩子](./提交与钩子.md)：暂存后 pre-commit 仍会再 `--fix`

## 结论（怎么处理单文件）

| 场景 | 做法 |
|------|------|
| 只格式 / 自动修一个文件 | `pnpm exec moeru-lint --fix -- path/to/file.ts` |
| 只检查不改 | `pnpm exec moeru-lint -- path/to/file.ts` |
| 全仓检查 | `pnpm lint`（=`moeru-lint .`） |
| 全仓自动修 | `pnpm lint:fix`（=`moeru-lint --fix .`） |
| 编辑器里 | 保存触发 `source.fixAll.eslint`（**不是** Format Document / Prettier） |
| 提交时 | 暂存文件一律进 `moeru-lint --fix`（含中文路径时先 UTF-8，见提交与钩子） |

```bash
# 单文件（推荐日常）
pnpm exec moeru-lint --fix -- packages/stage-ui/src/libs/auth.ts

# 多文件
pnpm exec moeru-lint --fix -- path/a.ts path/b.ts
```

CLI 形态：`moeru-lint [--fix] [--flag <flag>]`（来自 `@moeru/eslint-config` 工具链；根脚本直接调它）。

`moeru-lint` 实际顺序：**先 `oxlint`，再 `eslint`**（带 cache）；`--fix` 两边都会带上。

## 格式模板（写出来长什么样）

本仓**没有**独立的 Prettier / `.prettierrc` 模板文件。观感由 **`@antfu/eslint-config` 风格规则 + 仓内 `eslint.config.ts`** 决定；对任意 `.ts` 跑 `moeru-lint --fix` 即对齐该模板。

### 手写对照样例

```ts
import type { TokenResponse } from './auth-oidc'

import { createAuthClient } from 'better-auth/vue'

import { useAuthStore } from '../stores/auth'
import { SERVER_URL } from './server'

export type OAuthProvider = 'google' | 'github'

export function getAuthToken(): string | null {
  return localStorage.getItem('auth/v1/token')
}

export const authClient = createAuthClient({
  baseURL: SERVER_URL,
  fetchOptions: {
    credentials: 'omit',
    auth: {
      type: 'Bearer',
      token: () => getAuthToken() ?? '',
    },
  },
})

export async function initializeAuth() {
  if (initialized)
    return

  initialized = true
  const authStore = useAuthStore()
  await authStore.restoreRefreshSchedule()
}
```

对照要点：

| 项 | 本仓模板 |
|----|----------|
| 缩进 | **2 空格**（非 Tab） |
| 引号 | **单引号**；需转义时可保留；JSX 属性偏双引号 |
| 分号 | **无分号** |
| 尾逗号 | **多行 always**（`always-multiline`） |
| 对象花括号 | `{ a: 1 }` 内侧有空格 |
| 数组方括号 | `[1, 2]` 内侧无空格 |
| `interface` / type 成员 | 多行**无** `;` / `,` 分隔（`member-delimiter-style: none`） |
| 大括号风格 | **stroustrup**（`} else {` 换行）；允许单行 |
| 箭头函数括号 | 能省则省；**块体**时要括号（`requireForBlockBody`） |
| 单行 `if` | 条件与语句**换行**（`antfu/if-newline`），见上例 `if (initialized)` / `return` |
| 顶层函数 | 偏好 `function foo()`（`antfu/top-level-function`），非顶层箭头随意 |
| 空行 | 最多连续 1 行空行；文件首尾不堆空行；文件末 **LF 换行** |
| `quote-props` | `consistent-as-needed` |
| import / 编码顺序 | **强制**；`import type` 在上；组间空一行；builtin → external → internal → parent/sibling；非 md 启用 `perfectionist/sort-imports`（`moeru-lint --fix` / ESLint fix 可改序）。跨栈正文 → 文档库 `前端工程化/代码格式/格式模板` |

### 规则真源（可 `eslint --print-config` 复核）

对 `*.ts` 生效的主要 style（节选）：

| 规则 | 值 |
|------|-----|
| `style/indent` | `2` |
| `style/quotes` | `'single'` |
| `style/semi` | `'never'` |
| `style/comma-dangle` | `'always-multiline'` |
| `style/member-delimiter-style` | multiline `delimiter: 'none'` |
| `style/arrow-parens` | `'as-needed'` + `requireForBlockBody: true` |
| `style/brace-style` | `'stroustrup'` |
| `style/object-curly-spacing` | `'always'` |
| `style/array-bracket-spacing` | `'never'` |
| `style/eol-last` | `'always'` |
| `style/no-multiple-empty-lines` | `max: 1` |
| `style/padding-line-between-statements` | 开启（仓内显式 `error`） |
| `antfu/if-newline` | 开启 |
| `antfu/top-level-function` | 开启 |

复核命令：

```bash
pnpm exec eslint --print-config path/to/file.ts
```

改模板 = 改 `@moeru/eslint-config` / `@antfu/eslint-config` 默认，或在根 `eslint.config.ts` 覆盖；**不要**另起 Prettier 模板文件。

## 架构（为何不是 Prettier）

```text
.editorconfig          → 缩进 / 换行 / charset 底线
        ↓
eslint.config.ts       → @moeru/eslint-config（typescript + vue + unocss…）
        ↓
moeru-lint [--fix]    → 检查 + 可自动修复（含 style/* 等格式类规则）
        ↓
IDE Save / nano-staged / CI autofix
```

| 决策 | 本仓做法 |
|------|----------|
| Prettier | **禁用**（`.vscode/settings.json`：`prettier.enable: false`） |
| `editor.formatOnSave` | **false**（避免与 ESLint fix 双通道打架） |
| 保存时修复 | `editor.codeActionsOnSave` → `source.fixAll.eslint: "explicit"` |
| 组织 import | `source.organizeImports: "never"`（import 排序交给 ESLint / perfectionist 配置） |
| IDE 噪音 | `style/*`、`format/*`、缩进/引号等规则在 UI 里 severity off，但仍会 **autofix** |

风格类规则仍由 ESLint 执行；只是编辑器里不把黄线刷满，修复靠 Save / CLI / 钩子。

## 与缩进相关的底线（EditorConfig）

`.editorconfig` 对 `*.{js,ts,vue,tsx,jsx,html,css,json,yaml,yml}`：

- `indent_size = 2`、`indent_style = space`
- `charset = utf-8`、`end_of_line = lf`、`insert_final_newline = true`
- `trim_trailing_whitespace = true`（`*.md` 例外，保留两空格换行）

这是编辑器 / 部分工具的底线；**细格式（引号、分号、padding-line 等）以 ESLint 为准**。

## ESLint 配置要点（读码用）

- 入口：`eslint.config.ts` → `defineConfig` from `@moeru/eslint-config`
- 开启：`typescript`、`vue`、`unocss`；关闭若干套件（`masknet`、`preferArrow`、`sonarjs` 等）
- 仓规示例：`style/padding-line-between-statements`；禁手写 `error instanceof Error ? error.message`；server 测禁乱 `vi.mock` 内部模块
- 非 md 文件启用 `perfectionist/sort-imports`（分组 + `newlinesBetween: 1`）
- ignores：bindings/out、drizzle、`.agents`、部分 pocket 原生目录等（见配置）

改格式策略时改 `eslint.config.ts` / `@moeru/eslint-config`，**不要**再引入根级 Prettier 配置抢通道。

## 现状

- 格式化单一通道：**ESLint + moeru-lint**，已落地。
- 单文件、暂存文件、全仓、CI autofix 都走同一套 `--fix`。
- Windows 上对含中文路径的文件跑 fix 时，与钩子相同，需 UTF-8 终端。

## 边界

- **跨栈观感 + 编码顺序（文档库为主）**：Obsidian `前端工程化/代码格式/格式模板`（观感：业务仓 Prettier 向；**import / `.ts` 顶层块顺序强制**，须能 autofix）。**本篇单引号与 ESLint-only 是 AIRI 仓面**；**顺序强制两边相同**。新建业务仓对齐文档库观感，不要默认照搬本篇关 Prettier。
- **通道选型参考**：文档库 `前端工程化/代码格式/工具通道参考`（Prettier 管观感 + ESLint `perfectionist` 改顺序；本仓 ESLint 兼做二者）。
- **钩子为何慢 / 中文路径失败**：见 [提交与钩子](./提交与钩子.md)，本页不重复。
- **typecheck / Vitest**：质量门禁另一条线，见 [测试与质量门禁](./测试与质量门禁.md)；格式化绿 ≠ 类型绿。
- **C# / Swift / Godot**：另有 EditorConfig 段或 SwiftLint；不在本页 TS 通道内。
- **在本仓改 TS**：继续走 `moeru-lint --fix`，**不要**对本仓单个 `.ts` 开 Prettier / `formatOnSave` 默认 formatter，以免与 ESLint 往返冲突。
