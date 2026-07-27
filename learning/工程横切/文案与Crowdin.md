# 文案与Crowdin

## 定位

产品文案集中在 `packages/i18n` 的 YAML；Crowdin 以 **en 为源语言** 同步译稿并开 PR。

## 真源

| 项 | 路径 |
|----|------|
| 文案 | `packages/i18n/src/locales/{en,zh-Hans,…}/**/*.yaml` |
| 语言装配 | 同目录下各语种 `index.ts`（`import … from './settings.yaml'` 再 `export default`） |
| Crowdin | 根 `crowdin.yml`（project_id `816610`） |
| CI | `.github/workflows/crowdin-cron-sync.yml` · `crowdin-manual-upload.yml` |
| 构建加载 | `unplugin-yaml`（Vite / 包 build）；运行时仍是 vue-i18n 吃嵌套对象 |

## 文件格式策略（YAML，不是 JS 语言包）

本仓刻意用 **YAML 存词条 + 薄 `index.ts` 拼装**，而不是 `export default { … }` 的巨型 JS/TS 对象。

| | YAML（本仓） | JS / TS 对象 |
|--|--|--|
| 内容 | 纯数据 | 可写表达式、函数、动态拼接 |
| 协作 | 翻译/非开发友好；多行、注释、缩进嵌套 | 开发改代码顺手，外部翻译工具支持弱 |
| 风险 | 词条里不能写逻辑 | 易掺业务逻辑或副作用 |
| 工具链 | 需 `unplugin-yaml` 等 loader | 直接 import |
| 类型 | 默认弱；要另做 schema/生成 | TS 可直接约束 |

**选型理由（对本仓）：**

1. 词条量大（如 `settings.yaml` 上千行），YAML 比巨型 JS 对象更好维护。
2. 文案与代码分离：译员只动 YAML；`crowdin.yml` 也基本 ignore `*.ts`。
3. 仍用 TS 做目录拼装 / 按端分包（`tamagotchi/`、`docs/` 等）。

给 vue-i18n 的最终形态都是嵌套对象；YAML vs JS 是**源文件形态**选择。适合「大词典、多人翻译、少逻辑」。若词条要按环境计算或重度依赖 TS 类型，再考虑 JS/TS 词条。

## 跟读

1. 在 `locales/en/` 找到对应功能 YAML
2. 改英文源（或确认 key 命名）
3. 看同语种 `index.ts` 如何把 YAML 装进 `default` 导出
4. 看 `crowdin.yml` 的 `files` 映射与 ignore（`*.ts` 一般不进）
5. 等 cron PR 或有 token 时跑 manual upload

## 贡献要点

- **只把用户可见字符串放进 i18n**，避免 apps 内硬编码多语言。
- 源语言：**en**。
- 新键先落 `en`，其它语种可暂留英文占位，等 Crowdin 或人工补译（勿只在某一语种私自加键）。
- CI 需要 `CROWDIN_PERSONAL_TOKEN`。
- `ui-server-auth` 等独立 SPA 也依赖 `@proj-airi/i18n`，同一翻译源。

## 命令

```bash
# 本地一般改 YAML 即可；上传依赖 Crowdin token 与 workflow
pnpm -F @proj-airi/i18n build   # 若包有 build
```

## 现状

已实现；cron 拉译。部分语种 / 新功能键可能仍是英文占位（与 en 同源拷贝），属译稿缺口而非格式问题。

## 边界

- **设计文案语气**：产品气质在界面设计笔记；本页只管工程落点与格式策略。
- **服务端错误码文案**：部分在 server，不全部走 Crowdin 前端包。
- **包索引视角**：共享包图《工程场景与i18n》写怎么用包；格式为何选 YAML 以本页为准。
