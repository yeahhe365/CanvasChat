# CanvasChat

> 🎯 **白嫖大模型利器** - 在 Gemini Canvas 预览界面中免费大量使用 Gemini 3 Flash 模型

一个基于 Gemini 模型的精美聊天界面，专为 **Canvas 预览模式** 设计，让你可以**免费、大量**使用 Gemini 3 Flash 模型进行对话。

## 💡 项目初衷

Google Gemini 的 Canvas 预览功能提供了免费使用大模型的机会。本项目专为 Canvas 预览界面优化设计，让你可以：

- ✅ **免费使用** - 利用 Gemini 免费额度，大量调用 Gemini 3 Flash 模型
- ✅ **高效对话** - 专为 Canvas 环境优化的聊天界面
- ✅ **多模态交互** - 支持图片、视频、音频、PDF 等多种输入
- ✅ **生产级体验** - 完整的功能支持，不输付费版本

## ✨ 特性

- 🎯 **多模态支持**: 支持图片、视频、音频、PDF 和文本文件上传
- 🤔 **思考过程可视化**: 可配置 Gemini 模型的思考深度级别
- 🎨 **Markdown & LaTeX 渲染**: 完整支持代码高亮、数学公式渲染
- 🔊 **TTS 语音合成**: 内置多种音色，支持文本转语音
- 📋 **代码一键复制**: 代码块支持一键复制功能
- 💬 **流式响应**: 实时显示 AI 回复内容
- 🎛️ **系统提示词**: 可自定义系统提示词
- 📱 **响应式设计**: 基于 TailwindCSS 的现代化 UI

## 🚀 快速开始

### 前置要求

- Node.js 18+ 
- React 项目环境
- Google Gemini API Key

### 安装

1. 在你的 React 项目中复制 `App.jsx` 文件：

```bash
cp App.jsx src/
```

2. 确保项目已安装以下依赖：

```bash
npm install react
```

3. 在项目中引入组件：

```jsx
import App from './App';

function Root() {
  return <App />;
}
```

## 🛠️ 技术栈

- **React** - UI 框架
- **TailwindCSS** - 样式系统
- **KaTeX** - LaTeX 数学公式渲染
- **Google Gemini API** - AI 模型支持
- **TTS API** - 文本转语音

## 📝 使用说明

### 思考深度级别

支持以下思考级别：
- `minimal` - 最小化延迟（适合快速对话）
- `low` - 低思考深度
- `medium` - 中等思考深度
- `high` - 高思考深度（适合复杂问题）

### TTS 音色选择

提供 10 种不同风格的音色：
- Kore (柔和女声)
- Puck (活泼男声)
- Fenrir (低沉男声)
- Aoede (知性女声)
- 等等...

### 文件上传支持

| 类型 | 格式 | 大小限制 |
|------|------|----------|
| 图片 | 所有常见图片格式 | 无限制 |
| 视频 | MP4, WebM 等 | 20MB |
| 音频 | MP3, WAV 等 | 20MB |
| PDF | PDF 文档 | 50MB |
| 文本 | TXT, MD, JSON, CSV, 代码文件等 | 10MB |

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📮 联系方式

- 项目地址: https://github.com/yeahhe365/CanvasChat
- 问题反馈: 提交 GitHub Issue

## ⭐ 支持项目

如果你觉得这个项目有用，请给个 Star！
