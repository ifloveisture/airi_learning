# 移动端

> 只写 **`apps/stage-pocket`**（Capacitor）。当前发布面 **WIP**。

## 现状

- 与 Web 同属 Vue + Vite 舞台壳，复用 `stage-ui` / `stage-layouts`
- 路由合并 `stage-pages` 时会 exclude 部分页（如 connection）
- **尚未**写成与网页端同级的深挖专章；需要时再按「一端一文」补启动链 / 原生桥接

## 命令

```bash
pnpm -F @proj-airi/stage-pocket run dev:ios
pnpm -F @proj-airi/stage-pocket run dev:android
```

网页主路径请先读 [网页端](../网页端/)。
