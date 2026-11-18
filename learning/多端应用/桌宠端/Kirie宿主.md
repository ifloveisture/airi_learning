# Kirie 宿主（旁路）

> Godot + Kirie WebView 跑 Stage 渲染器的**旁路桌面宿主**。
> Electron `stage-tamagotchi` 仍是行为参考与主学习线。learning **不**写完整产品专章。

## 定位

| 项 | 事实 |
|----|------|
| 路径 | `apps/stage-tamagotchi-kirie` |
| 角色 | Kirie 供 WebView / IPC；AIRI 仍管应用服务与窗口语义 |
| 架构文 | 包内 `README.md` · `docs/host-architecture.md` |
| Skill | `.agents/skills/stage-tamagotchi-godot-csharp` |
| 与 Electron Godot sidecar | **不同线**：sidecar 见 [Godot旁路](../../舞台呈现/Godot旁路.md)；Kirie 是整应用宿主替换 |

## 读码前印象

```text
mise + Godot Mono + pnpm kirie doctor/plugin
  → dotnet build
  → pnpm kirie dev
  → WebView 加载 Stage renderer
  → IPC / 宿主能力按 host-architecture（非 Electron Eventa 逐条复用）
```

Widget calling 等实验在 Kirie 侧；**勿**与 Electron `#/widgets` 当成同一启动链。

## 跟读

1. `apps/stage-tamagotchi-kirie/README.md`（Setup · doctor · `kirie dev`）
2. `docs/host-architecture.md`（所有权与生命周期）
3. 需要 C# / Godot 约定时开 skill，不在 learning 复写
4. 对照 Electron：[桌宠学习路径](./学习路径.md) · [桌宠壳能力](./桌宠壳能力.md)

## 现状

| 项 | 状态 |
|----|------|
| 可本地开 Kirie 宿主研究 | **可启用**（工具链重） |
| learning 产品级竖切 | **故意薄写**（本页 + 包内文档） |

## 边界

- 聊天编排 / Voice / 计费仍在共享 Stage 核；本页只谈**宿主替换**。
- Glass / 全屏 Workspace / MCP HTTP 以 Electron 桌宠文为准，不假设 Kirie 已一一对齐。
