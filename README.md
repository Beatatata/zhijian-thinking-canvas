# 枝间 · Thinking Canvas

[![Validate](https://github.com/Beatatata/zhijian-thinking-canvas/actions/workflows/ci.yml/badge.svg)](https://github.com/Beatatata/zhijian-thinking-canvas/actions/workflows/ci.yml)
![version](https://img.shields.io/badge/version-1.0.0-blue)
![license](https://img.shields.io/badge/license-MIT-green)

一个帮助你拆解问题、整理资料、理清关系并推进下一步的个人思考画布。内容保存在浏览器本地，不需要账户或后端数据库即可自行运行。

仓库：<https://github.com/Beatatata/zhijian-thinking-canvas>（MIT · 制作人 [TATALAB](https://www.tatalab.ai/)）。仓库只有应用源码，不含任何个人工作台数据。

## 能做什么

- 笔记：外层只显示格式化正文与可跳转链接，双击进入专注编辑修改正文。专注编辑支持标题、粗体、列表、引用、代码和 Markdown 粘贴，内容仍保存与导出为 Markdown。
- 清单：回车创建下一项，整行拖动排序，勾选完成。
- 链接与图片：收集参考资料，双击编辑封面、标题和说明。
- 进度：目标状态、完成比例、截止日期与下一步说明。
- 表格：直接编辑文本单元格，增删行列；Enter 到下一行，Shift+Enter 换行。第一版最多 8 列、100 行，不含公式与合并单元格。
- 画板与分栏：逐层拆解主题，拖入整理，长内容自动撑高。
- 连线：建立关系，编辑说明、曲线锚点与四档线宽。
- 导出与导入：离线思路文档、Markdown／CSV／图片包、完整 JSON 备份；在“导入备份”页签选择 JSON，恢复为独立工作台并保留当前内容。
- 回收站：恢复工作台、单项永久删除或清除回收站；永久操作需再次确认，不能撤销。

## 文件夹与 Obsidian

在导出面板点击问号查看完整教程。Markdown ZIP 解压后可直接放入 Obsidian 知识库；在支持 File System Access API 的桌面 Chrome / Edge 中，也可授权一个文件夹，持续保存当前工作台的 Markdown、附件、CSV、思路文档和完整备份。

这是单向镜像：页面打开且具有权限时，编辑后约 1.5 秒更新；关闭页面后不运行。生成目录使用工作台 ID，画板文件使用稳定 ID；外部文件修改会暂停同步，自己的笔记请放在生成目录外。移除内容留下旧文件，不自动清理磁盘。工作台删除进入本地回收站，建议先下载备份，恢复后重新连接同步目录。


## 本地运行

需要 Node.js 22.12 或更新的稳定版本与 npm。

```sh
git clone https://github.com/Beatatata/zhijian-thinking-canvas.git
cd zhijian-thinking-canvas
npm ci
npm run dev
```

浏览器打开终端显示的地址，默认 `http://127.0.0.1:5178`。1.0.0 首次进入默认打开可编辑教学示例；已有工作台保留在左上角的工作台列表，此后恢复你最后使用的工作台。左上角可新建空白工作台。

```sh
npm test
npm run build
npm run preview
```

`dist/` 为静态构建，可部署到支持静态站点的服务，不依赖当前发布平台。`npm start` 使用仓库内的简单静态服务器。`.openai/hosting.json` 仅用于原作者的 Sites 发布绑定，自行部署不需要它；不要复用其中的项目 ID 创建你的站点。

## 保存与迁移

数据和图片存于 IndexedDB。同一网站地址、浏览器配置与设备内可自动保存。更换设备、清除网站数据或切换到其他部署域名，不会自动迁移内容。请定期下载“完整工作台备份”，在目标地址恢复。导出思路文档和 Markdown 用于阅读，不包含可恢复的画布布局；完整备份包含整个工作台。

导出文件可能包含你的私密笔记与图片。发布 GitHub 仓库前，不要把个人备份、验收截图或真实项目数据加入源码。

## 项目结构

| 文件 | 职责 |
| --- | --- |
| `src/model.ts` | 数据结构、布局、复制、移动与备份校验 |
| `src/App.tsx` | 画布交互与工作台管理 |
| `src/InlineCard.tsx`、`src/PlanningCard.tsx` | 原位编辑与进度／表格卡片 |
| `src/FocusEditor.tsx` | 专注编辑 |
| `src/export.ts`、`src/thought-export.ts` | Markdown、CSV、阅读文档与备份 |
| `src/storage.ts` | IndexedDB 保存 |
| `src/snapping.ts`、`src/connections.ts` | 对齐与连线几何 |

技术栈：React、TypeScript、Vite、IndexedDB、Tabler Icons、react-markdown、JSZip。包版本以 `package-lock.json` 为准。

## 获取与部署

仓库：<https://github.com/Beatatata/zhijian-thinking-canvas>。公开仓库只包含应用源码；个人工作台、图片、回收站及文件夹授权保存在浏览器 IndexedDB，不在仓库中；源码内的 `seed()` 只有通用教学示例。向仓库提交内容时，不要加入验收截图、完整备份 JSON、导出 ZIP 或 Obsidian 镜像目录，也不要把 `.openai/` 发布绑定或 `.sites-runtime/` 一起提交。

其他人有两种使用方式：克隆或下载仓库后按本地运行说明执行 `npm ci`、`npm run dev`；或者打开单独部署的公开静态网站，无需安装。`npm run build` 生成 dist，可部署到任意静态托管服务。

GitHub Pages 的项目站点位于仓库子路径，部署时要设置 Vite 的 base，例如 `npm run build -- --base=/zhijian-thinking-canvas/`；无前端路由的当前实现也可以构建相对资源路径 `npm run build -- --base=./`。不要直接复用根路径构建。**本仓库当前未启用 Pages，也没有在线演示地址**；以后如启用，只使用通用教学数据。

仓库公开不会自动让原制作人的私有 Sites 地址公开。每个人都会获得教学示例与自己的本地数据，不会看到作者的个人工作台。跨域名、浏览器、设备迁移时，先下载完整备份，再到目标站点恢复；Markdown 不是布局恢复文件。

官方文档：[GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)。

## 开源与贡献

项目源码采用 [MIT](LICENSE)，Copyright © 2026 TATALAB。仓库已公开：<https://github.com/Beatatata/zhijian-thinking-canvas>。原制作人的私有 Sites 站点访问权限未改变，仓库公开不代表该站点公开。

参与方式见 [贡献说明](CONTRIBUTING.md)：问题反馈使用 [issue 模板](https://github.com/Beatatata/zhijian-thinking-canvas/issues/new/choose)，代码改动用 [PR 模板](https://github.com/Beatatata/zhijian-thinking-canvas/blob/main/.github/PULL_REQUEST_TEMPLATE.md)；安全问题按 [SECURITY.md](SECURITY.md) 报告，不要在公开 issue 附个人数据。

后续方向：表格粘贴与导入、目标和清单关联进度、导出阅读顺序与关系导航、无障碍键盘操作、移动端适配、大工作台性能。

图标来自 [Tabler Icons](https://tabler.io/icons)，使用 MIT 许可证；其他依赖许可证由各自包提供。产品交互参考 Milanote，未使用其专有素材或源码。

## 制作人与来源

制作人：[TATALAB](https://www.tatalab.ai/)。交互原型参考：[Milanote](https://app.milanote.com/)。图标：[Tabler Icons](https://tabler.io/icons)。版本：**1.0.0 · 2026.10.7 日版本**。本项目独立实现，与参考产品没有隶属关系；完整归属见 [ATTRIBUTIONS](ATTRIBUTIONS.md)。

## 文档导航

- 仓库：<https://github.com/Beatatata/zhijian-thinking-canvas>（[问题反馈](https://github.com/Beatatata/zhijian-thinking-canvas/issues/new/choose) · [贡献说明](CONTRIBUTING.md)）
- [开发指南](docs/DEVELOPMENT.md)与[贡献说明](CONTRIBUTING.md)
- [可复制开发提示词](docs/AGENT_PROMPTS.md)
- [GitHub 发布清单](docs/GITHUB_RELEASE.md)与[发布 agent 提示词](docs/GITHUB_PUBLISH_PROMPT.md)
- [安全与隐私](SECURITY.md)、[社区准则](CODE_OF_CONDUCT.md)、[更新记录](CHANGELOG.md)

截图与演示地址只在实际生成或验证后加入，不使用虚构的仓库与演示链接。上方版本与许可证徽章对应 `package.json` 的 `1.0.0` 与仓库内的 MIT `LICENSE`。

[`.github/workflows/ci.yml`](https://github.com/Beatatata/zhijian-thinking-canvas/blob/main/.github/workflows/ci.yml) 在推送与 PR 时运行 `npm ci`、`npm test`、`npm run build`；当前主版本为 `actions/checkout@v7` 与 `actions/setup-node@v7`，按 [checkout](https://github.com/actions/checkout) 与 [setup-node](https://github.com/actions/setup-node) 官方说明配置。首次运行（2026-10-08，`test-and-build`）已通过，见 [运行记录](https://github.com/Beatatata/zhijian-thinking-canvas/actions/runs/37731170592)。
