# 语音交互

> **管什么**：Hearing、Speech、VAD、音频包、云端流式转写
> **边界**：口型 morph 在舞台/算法口型文；文本 `ingest` 在角色对话域

## 从这里开始

→ [学习路径](./学习路径.md)

## 专题

| 文档 | 内容 |
|------|------|
| [学习路径](./学习路径.md) | 入出两条链 |
| [听力转写](./听力转写.md) | VAD → STT → 进聊天 |
| [云端流式转写](./云端流式转写.md) | Official `/transcriptions/stream` |
| [语音合成](./语音合成.md) | TTS · Official vs Kokoro |
| [音频管线](./音频管线.md) | audio / pipelines-audio / workers |

## 数据流

```text
入: 麦 → (VAD | 流式) → STT → 输入框或 TranscriptBuffer → ingest
出: LLM token hooks → SpeechPipeline → TTS provider → 播放 →（可选口型）
```
