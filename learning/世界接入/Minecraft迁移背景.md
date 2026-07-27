# Minecraft 迁移背景

> 回答：**为什么**要从 Mineflayer 迁到 Fabric（/ NeoForge）模组运行时。
> 不是迁 git 仓库。现状与跟读入口见 [游戏与操控](./游戏与操控.md)。

## 官方结论（仓内已写死）

| 来源 | 说了什么 |
|------|----------|
| `services/minecraft/README.md` Deprecation Notice | Mineflayer bot 在弃用路径上；**Fabric mod runtime** 将成为以后的主集成面；勿在旧运行时上堆长期新功能（除非也算迁移计划一部分） |
| 官方集成文 `docs/content/zh-Hans/docs/integrations/minecraft.md` | 面向本地开发与维护；正计划迁到 Fabric；不建议围绕旧实现开长期功能 |
| PR [#1371](https://github.com/moeru-ai/airi/pull/1371)（作者） | *「This will probably be the last pr for the Mineflayer bot.」*；同期强化 `isolated-vm`、偏安全默认 |
| PR [#1213](https://github.com/moeru-ai/airi/pull/1213) 评论（维护者） | *「planning to deprecate … migrate to **fabric/neoforge** soon」* |
| 修复类提交说明（如 #1375 一带） | Mineflayer 即将弃用；修旧路径是为实验版还能用，并给**后续原生 Mod**当参考 |

**学习含义**：认知栈（perception → reflex → conscious → action）与 Channel 回 Stage 仍可当样本读；**执行底座（Mineflayer）不要当长期投入点**。

## 两种运行时差在哪

```text
现在（Mineflayer）
  Node 进程 → 第三方协议客户端连 MC 服
  → 技能 / JS planner（isolated-vm）驱动动作
  → server-sdk Channel ↔ Stage

目标（Fabric / NeoForge mod）
  官方客户端或模组加载的游戏进程内
  → 模组钩子碰游戏逻辑（「原生 Mod」）
  → 再与 AIRI 对接（具体协议本仓尚未落地成可跟读主路径）
```

| | Mineflayer（现） | Fabric / NeoForge（目标） |
|--|------------------|---------------------------|
| 进程位置 | 游戏外独立 bot | 游戏 / 模组进程内 |
| 控角色方式 | 再实现一套协议 + bot API | 模组 API / 事件，贴官方运行时 |
| 版本跟进 | 依赖 Prismarine 等生态跟协议 | 跟 Loader + 游戏版本走模组工具链 |
| 仓内代码 | `services/minecraft` **有** | **规划中**；learning 无 Fabric 竖切可跟 |

README 主文写 Fabric；维护者评论同时提到 **NeoForge**——选型以后续落地为准，learning 记作「原生模组运行时（Fabric / NeoForge）」。

## 为什么要迁（动机分层）

仓内**没有**单独的「迁移设计说明书」长文；动机需分开写：**明示决策** vs **现架构暴露的压力**（后者用源码/安全声明支撑，不当成已发表的唯一官方理由清单）。

### 1. 产品决策：换主集成面（明示）

- 维护者明确 deprecate Mineflayer、改走 fabric/neoforge。
- PR 1371 自我定性为 Mineflayer 线「大概最后一波」大改：把 AIRI Channel 接上、沙箱加固，然后把前进交给原生 Mod。

### 2. 安全模型：外挂 bot + LLM 生成代码（明示于 Safety Notice）

README Safety Notice：

- LLM 会产出 **JavaScript action plans** 驱动 bot；
- 虽在隔离环境跑（现用 `isolated-vm`，见 `js-planner*`），仍驱动**真实本地进程**（会话、网络等）；
- **禁止**连不信任的公共服；定位 = 本地 / 受信任服工具。

PR 1371 目标里也出现「unsafe code execution」相关取舍与 `isolated-vm`。
迁到**原生 Mod**，是把「控角色」从「外部 JS bot 执行面」挪到游戏模组侧——与「别在 Mineflayer 上长期加码」同一方向；细节以落地后的 mod 安全模型为准。

### 3. 架构形态：外挂协议客户端的天花板（由现状推断，供理解）

现路径本质是 **游戏外再实现一个客户端**：

- 感知绑在 Mineflayer 事件上（`cognitive/perception`）；
- 动作绑在 mineflayer skills / plugins；
- 协议与版本跟进、反作弊 / 正版会话、与「真人客户端同进程」的能力，都和外挂 bot 模型绑死。

原生 Mod 的目标形态是：**跟官方运行时同进程**，用模组生态跟版本，而不是无限加厚 Node 侧协议仿真。
（具体痛点列表仓内未逐条枚举；上表是读现架构后的理解框架。）

### 4. 迁移期怎么用旧代码（明示）

- 仍可 `pnpm -F @proj-airi/minecraft-bot dev` 做本地开发与维护。
- 修崩溃、稳实验版 = 过渡期合理；提交说明也写明可当后续 Mod 的参考。
- **不要**默认新功能只堆在 Mineflayer skills 上且无迁移计划。

## 和「迁仓库」无关

| 说法 | 对不对 |
|------|--------|
| 把 `services/minecraft` 拆到另一个 git 仓 | **否** |
| 换 Minecraft 侧执行底座（外挂 bot → 原生 mod） | **是** |
| 认知 / Channel 思路整包作废 | **否**——可参考；绑死 Mineflayer 的技能层会换 |

## 阅读顺序

1. 本页（背景）
2. [游戏与操控](./游戏与操控.md)（现包怎么接 AIRI）
3. `services/minecraft/README.md` Deprecation + Safety
4. （可选）PR [#1371](https://github.com/moeru-ai/airi/pull/1371)、[#1213](https://github.com/moeru-ai/airi/pull/1213) 评论
5. 官方用户文：`docs/content/zh-Hans/docs/integrations/minecraft.md`
