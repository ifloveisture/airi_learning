# 发布与CI地图

## 定位

一张表回答「某个产品面发版/部署看哪个 workflow」。细节以 YAML 为准。

## 真源

目录：`.github/workflows/`

## 发布 / 部署表

| 面 | Workflow（文件名） | 说明 |
|----|-------------------|------|
| 桌宠 Electron | `release-tamagotchi.yml` | 桌面安装包；应用内另有 auto-updater 逻辑 |
| Pocket iOS | `release-pocket-ios.yml` | 移动（本学习体系不展开产品） |
| Pocket Android | `release-pocket-android.yml` | 同上 |
| Docker | `release-docker.yaml` | 容器镜像 |
| npm 类包 | `release-pkg.yaml` | 包发布 |
| VS Code 扩展 | `release-vsix.yaml` | `integrations/vscode` |
| Cloudflare Workers | `deploy-cloudflare-workers.yml` 等 | Workers / preview 系列 |
| 认证 UI | `deploy-cloudflare-auth-ui.yml` | `apps/ui-server-auth` → Pages |
| HF Spaces | `deploy-huggingface-spaces.yml` | 演示空间 |
| Crowdin | `crowdin-cron-sync.yml` | 译稿 PR |
| README URL | `update-post-release-readme-urls.yml` | 发版后改链接 |

## 跟读

1. 选定产品面 → 打开上表对应 YAML
2. 看 `on:` 触发（tag / workflow_dispatch / push）
3. 看 secrets 名称（勿提交密钥）
4. 桌宠再搜 renderer/main 里 `auto-updater` 相关服务

## 现状

多面已接线；Pocket 发布存在但产品文档在本体系刻意不深挖。

## 边界

- **本地 `pnpm build`**：开发构建，不等于 CI 发版。
- **Channel Hub `pnpm dev:server`**：本机模块通道，不是 `apps/server` 云端发版。
- **云端 API 生产部署**：看团队实际主机（如 Railway 等）与 server 文档，不全写在上述 YAML。
