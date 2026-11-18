# 语音交互

> **管什么**：Hearing（听入模式 · 唤醒 · 声纹）、Speech、VAD、音频包、云端流式转写
> **边界**：口型 morph 在舞台/算法口型文；文本 `ingest` 在角色对话域

## 从这里开始

→ [学习路径](./学习路径.md)

## 专题

| 文档 | 内容 |
|------|------|
| [学习路径](./学习路径.md) | Hearing 控制面 → 听链 → 说链 |
| [听力转写](./听力转写.md) | 输入模式 · `useVoiceStore` 主路径 · 唤醒/声纹 |
| [云端流式转写](./云端流式转写.md) | Official `/transcriptions/stream` |
| [语音合成](./语音合成.md) | TTS · Official vs Kokoro |
| [音频管线](./音频管线.md) | audio / pipelines-audio / workers |

## 数据流

```text
入: 麦 → Hearing 模式（always-on | PTT | wake-word）
       → Voice plugins（VAD / 唤醒 / 句末 / 改写 / 可选说话人）
       → STT → 草稿/inlay → ingest
出: LLM token hooks → SpeechPipeline → TTS provider → 播放 →（可选口型）
```
