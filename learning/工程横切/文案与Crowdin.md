# 文案与Crowdin

## 定位

产品文案集中在 `packages/i18n` 的 YAML；Crowdin 以 **en 为源语言** 同步译稿并开 PR。

## 真源

| 项 | 路径 |
|----|------|
| 文案 | `packages/i18n/src/locales/{en,zh-Hans,…}/**/*.yaml` |
| Crowdin | 根 `crowdin.yml`（project_id `816610`） |
| CI | `.github/workflows/crowdin-cron-sync.yml` · `crowdin-manual-upload.yml` |

## 跟读

1. 在 `locales/en/` 找到对应功能 YAML
2. 改英文源（或确认 key 命名）
3. 看 `crowdin.yml` 的 `files` 映射与 ignore（`*.ts` 一般不进）
4. 等 cron PR 或有 token 时跑 manual upload

## 贡献要点

- **只把用户可见字符串放进 i18n**，避免 apps 内硬编码多语言。
- 源语言：**en**。
- CI 需要 `CROWDIN_PERSONAL_TOKEN`。
- `ui-server-auth` 等独立 SPA 也依赖 `@proj-airi/i18n`，同一翻译源。

## 命令

```bash
# 本地一般改 YAML 即可；上传依赖 Crowdin token 与 workflow
pnpm -F @proj-airi/i18n build   # 若包有 build
```

## 现状

已实现；cron 拉译。

## 边界

- **设计文案语气**：产品气质在界面设计笔记；本页只管工程落点。
- **服务端错误码文案**：部分在 server，不全部走 Crowdin 前端包。
