# CanvasChat

> 🎯 **白嫖大模型利器** - 在 Gemini Canvas 预览界面中免费大量使用 Gemini 3 Flash 模型

一个基于 Gemini 模型的精美聊天界面，专为 **Canvas 预览模式** 设计，让你可以**免费、大量**使用 Gemini 3 Flash 模型进行对话。

## 🚀 立即使用

👉 [**点击进入 Canvas 免费使用**](https://gemini.google.com/share/923e94e16c54)

无需配置，无需 API Key，打开即可免费使用 Gemini 3 Flash 模型！

> ⚠️ **重要提示**：Canvas 预览模式的使用额度**完全独立于** Gemini 普通聊天（Chat 界面）的额度！
> 
> 这意味着：**即使你的 Gemini Chat 额度用完了，仍然可以通过 Canvas 继续使用大模型！**

## 💡 项目初衷

Google Gemini 的 Canvas 预览功能提供了免费使用大模型的机会。本项目专为 Canvas 预览界面优化设计，让你可以：

- ✅ **免费使用** - 利用 Gemini 免费额度，大量调用 Gemini 3 Flash 模型
- ✅ **高效对话** - 专为 Canvas 环境优化的聊天界面
- ✅ **多模态交互** - 支持图片、视频、音频、PDF 等多种输入
- ✅ **生产级体验** - 完整的功能支持，不输付费版本

## ✨ 特性

### 🎯 多模态输入
- **图片上传** - 支持所有常见图片格式，可粘贴或拖拽
- **视频分析** - 支持 MP4、WebM 等格式（最大 20MB）
- **音频处理** - 支持 MP3、WAV 等格式（最大 20MB）
- **PDF 阅读** - 支持 PDF 文档上传和解析（最大 50MB）
- **文本文件** - 支持 TXT、MD、JSON、CSV、代码文件等（最大 10MB）

### 🤔 思考过程控制
- **可配置思考深度** - 4 个级别：minimal / low / medium / high
- **思考过程可视化** - 可折叠查看 AI 的推理过程
- **智能适配** - 自动适配 Gemini 2.5 / 3.x 不同 API

### 🎨 内容渲染
- **Markdown 完整支持** - 标题、列表、引用、加粗、斜体、链接
- **LaTeX 数学公式** - 支持行内公式 `$...$` 和块级公式 `$$...$$`
- **代码高亮** - 语法高亮 + 一键复制
- **智能排版** - 自动优化显示格式

### 🔊 TTS 语音合成
- **10 种音色** - 柔和女声、活泼男声、低沉男声等多种选择
- **语音风格控制** - 可自定义语音风格和情感
- **浮动面板** - 可拖拽、最小化的 TTS 控制面板

### 💬 对话管理
- **流式响应** - 实时显示 AI 回复，无需等待
- **系统提示词** - 可自定义角色设定和行为指令
- **多模型切换** - 支持切换不同 Gemini 模型版本
- **中断生成** - 随时停止 AI 回复

### 📱 用户体验
- **响应式设计** - 基于 TailwindCSS 的现代化 UI
- **全局粘贴** - 任意位置粘贴文件，自动识别类型
- **文件预览** - 图片、视频即时预览
- **智能滚动** - 新消息自动滚动到底部

## 🚀 快速开始

### 前置要求

- Node.js 18+
- React 项目环境（需要 React 18+）
- TailwindCSS 已配置
- Google Gemini API 访问权限（免费额度即可）

### 安装步骤

#### 1. 复制组件文件

```bash
# 将 App.jsx 复制到你的项目 src 目录
cp App.jsx src/components/
```

#### 2. 安装必要依赖

```bash
# 确保项目已安装 React
npm install react react-dom

# 如果项目未配置 TailwindCSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### 3. 引入并使用组件

```jsx
import App from './components/App';

function Root() {
  return <App />;
}

export default Root;
```

#### 4. 在 Canvas 中使用

1. 打开 Google Gemini（gemini.google.com）
2. 进入 Canvas 预览模式
3. 将代码粘贴到 Canvas 中
4. 即可免费使用完整功能

## 🛠️ 技术栈

| 技术 | 用途 | 版本 |
|------|------|------|
| **React** | UI 框架 | 18+ |
| **TailwindCSS** | 样式系统 | 3+ |
| **KaTeX** | LaTeX 数学公式渲染 | 0.16+ |
| **Google Gemini API** | AI 模型支持 | 2.5 / 3.x |
| **TTS API** | 文本转语音 | - |

## 📝 详细使用说明

### 思考深度级别配置

| 级别 | 响应速度 | 思考质量 | 适用场景 |
|------|---------|---------|----------|
| `minimal` | ⚡ 最快 | 基础 | 日常聊天、快速问答 |
| `low` | 🚀 快 | 良好 | 简单问题、信息查询 |
| `medium` | ⏱️ 中等 | 优秀 | 复杂问题、代码生成 |
| `high` | 🐢 较慢 | 最佳 | 数学证明、深度分析 |

### TTS 音色列表

| 音色 ID | 名称 | 特点 |
|---------|------|------|
| Kore | 柔和女声 | 温柔亲切 |
| Puck | 活泼男声 | 轻松活泼 |
| Fenrir | 低沉男声 | 沉稳有力 |
| Aoede | 知性女声 | 专业知性 |
| Charon | 浑厚男声 | 低沉浑厚 |
| Zephyr | 中性声音 | 中性温和 |
| Leda | 成熟女声 | 成熟稳重 |
| Orus | 洪亮男声 | 响亮清晰 |
| Callirrhoe | 清脆女声 | 清脆明亮 |
| Umbriel | 沉稳男声 | 沉稳内敛 |

### 文件上传支持

| 类型 | 格式 | 大小限制 | 说明 |
|------|------|----------|------|
| 🖼️ 图片 | JPG, PNG, GIF, WebP, SVG 等 | 无限制 | 支持拖拽和粘贴 |
| 🎥 视频 | MP4, WebM, MOV 等 | 20MB | 自动识别格式 |
| 🎵 音频 | MP3, WAV, OGG 等 | 20MB | 支持语音识别 |
| 📄 PDF | PDF 文档 | 50MB | 自动解析内容 |
| 📝 文本 | TXT, MD, JSON, CSV, JS, TS, PY, JAVA, C/C++, CSS 等 | 10MB | 语法自动识别 |

### 系统提示词使用

通过设置系统提示词，可以：

- 🎭 **角色扮演** - 设定 AI 的身份和性格
- 📚 **专业领域** - 限定专业范围和回答风格
- 🔧 **行为约束** - 定义回答格式和禁忌事项
- 💡 **任务定义** - 明确特定任务的要求

示例：
```
你是一个专业的数学教师，擅长用通俗易懂的方式解释数学概念。
回答时应包含：
1. 概念定义
2. 直观例子
3. 应用场景
```

## 🤔 常见问题

### Q: 真的可以免费使用吗？

A: 是的！Gemini 提供了一定的免费额度，本项目就是为充分利用这个免费额度而设计的。

### Q: 有没有使用次数限制？

A: Gemini 的免费额度有一定限制，但对于日常使用来说已经足够。本项目通过优化请求方式，最大化利用免费资源。

### Q: 需要 API Key 吗？

A: 在 Canvas 预览模式下，不需要单独配置 API Key。直接使用即可。

### Q: 支持哪些模型？

A: 主要支持 Gemini 2.5 和 3.x 系列模型，包括 Flash、Pro 等版本。

### Q: 如何最大化利用免费额度？

A: 
- 使用 `minimal` 或 `low` 思考级别可更快响应
- 合理控制消息长度，避免过长请求
- 多使用多模态功能，提高交互效率

## 🛣️ 开发计划

- [ ] 对话历史保存和导入
- [ ] 多语言界面切换
- [ ] 自定义主题和暗色模式
- [ ] 批量文件处理
- [ ] 对话导出功能
- [ ] 更多模型支持

## 🤝 贡献指南

欢迎为项目贡献代码、提交 Issue 或提出建议！

### 贡献步骤

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'feat: add some amazing feature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

### 代码规范

- 使用清晰的变量和函数命名
- 保持代码注释完整
- 遵循 React 最佳实践

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

你可以自由地：
- ✅ 商业使用
- ✅ 修改代码
- ✅ 分发副本
- ✅ 私人使用

## 📮 联系方式

- **项目地址**: https://github.com/yeahhe365/CanvasChat
- **问题反馈**: [提交 Issue](https://github.com/yeahhe365/CanvasChat/issues)
- **功能建议**: [提交 Feature Request](https://github.com/yeahhe365/CanvasChat/issues)

## ⭐ 支持项目

如果觉得这个项目有用，请给个 Star！

[![Star History Chart](https://api.star-history.com/svg?repos=yeahhe365/CanvasChat&type=Date)](https://star-history.com/#yeahhe365/CanvasChat&Date)

---

**💡 提示**: 本项目完全开源，欢迎 Fork、修改、优化，让更多人能够免费使用强大的 AI 对话功能！
