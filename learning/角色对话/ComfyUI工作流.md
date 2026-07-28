# ComfyUI 工作流

## 定位

Artistry 的**本地生图后端配方**：在本机（或可信局域网）ComfyUI 里连好的文生图流水线，导出 API JSON 后上传给 AIRI。不是聊天 LLM，也不是 Replicate 那种云端模型 ID。

[ComfyUI](https://github.com/comfyanonymous/ComfyUI) 是节点式画图软件。画布上「加载模型 → 写 prompt → 采样 → 存图」连成的可执行图即**工作流**。AIRI 不内置画图模型，而是把任务交给已启动的 ComfyUI，按已保存模板跑通出图。

| 说法 | 含义 |
|------|------|
| ComfyUI 里的图 | 节点 + 连线，决定模型与采样 |
| 导出的 API JSON | 扁平 `nodeId → { class_type, inputs, _meta }`，供程序调用（**不是**普通 UI 保存格式） |
| AIRI「工作流模板」 | 上述 JSON + 勾选的**可暴露字段**（允许覆盖的输入，如 prompt） |

角色卡选 ComfyUI 时，`model` 多为模板 `id`；`options` 常见 `{ "template": "<id>" }`。

## 真源

| 项 | 路径 |
|----|------|
| 模板类型 | `packages/stage-ui/src/stores/modules/artistry.ts` → `ComfyUIWorkflowTemplate` |
| 持久化 | `artistry-comfyui-server-url` · `artistry-comfyui-saved-workflows` · `artistry-comfyui-active-workflow` |
| 设置 UI | `packages/stage-pages/src/pages/settings/providers/artistry/comfyui.vue` |
| 产品手册 | `docs/content/zh-Hans/docs/manual/config/providers/artistry/comfyui.md` |

```ts
interface ComfyUIWorkflowTemplate {
  id: string
  name: string
  workflow: Record<string, any> // API JSON
  exposedFields: Record<string, string[]> // 节点标题 → 可覆盖字段名
}
```

## 跟读

1. 启动 ComfyUI（默认 `http://localhost:8188`；跨域按设置页加 `--enable-cors-header "*"`）
2. 在 ComfyUI 跑通文生图，导出 **API** 工作流 JSON
3. AIRI：设置 → 服务商 → 艺术 → ComfyUI → 填 URL → 测试连接 → 上传 JSON → 命名 → 勾选暴露字段 → 保存
4. 设置 → 艺术选 ComfyUI，或角色卡 Artistry Tab 选提供商 + 对应工作流
5. 主动出图需意识模型支持 Tool Calling；电影式自主走旁路，仍用同一 Comfy 后端

未上传模板时，角色卡生图页会提示先去提供商页上传。

## 现状

| 状态 | 说明 |
|------|------|
| 可启用 | 依赖本机/局域网 ComfyUI + 已保存的 API 工作流模板 |

## 边界

| 是 | 不是 |
|----|------|
| 本地 / 可信局域网生图后端 | 云端聊天模型（GPT / Claude 等） |
| 自备 checkpoint、节点、工作流 | AIRI 仓库自带的完整画图管线 |
| 需可执行 API JSON + 运行中的 ComfyUI | 只配聊天 Provider 就能出图 |

不要把 ComfyUI 端口暴露到不可信公网；不要导入来源不明的工作流 JSON。
