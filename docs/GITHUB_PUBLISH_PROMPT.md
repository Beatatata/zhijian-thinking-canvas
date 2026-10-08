# 给发布 agent 的提示词

复制下面整段。仓库名称默认 zhijian-thinking-canvas；若你想换名字，先替换该字段。本提示词授权建立公开代码仓库，但不授权发布任何个人工作台、备份或真实截图。

```text
请把「枝间 · Thinking Canvas」整理并发布为健全的 GitHub 开源仓库。
源目录：本项目的 app 源码目录（即本仓库根目录）。
仓库名称：zhijian-thinking-canvas
可见性：公开；使用我当前已登录的 GitHub 账号。如果存在多个可用账号／组织，先让我选择，不要推测目标。

先读 README.md、CONTRIBUTING.md、ATTRIBUTIONS.md、SECURITY.md、LICENSE、docs/DEVELOPMENT.md、docs/GITHUB_RELEASE.md 及适用的 AGENTS.md。
保留制作人 TATALAB（https://www.tatalab.ai/）、交互参考 Milanote（https://app.milanote.com/）、Tabler Icons（https://tabler.io/icons）、Tiptap（https://tiptap.dev/）的署名与链接。使用仓库现有 MIT LICENSE，版本保持 1.0.0 · 2026.10.7 日版本，不编造新版本历史。

在新的独立目录建立干净源码副本并初始化新 Git 历史，不改变原 app 目录的 Git 远程、原 Sites 发布绑定和浏览器数据。只复制经过检查的源码、锁文件、public、开发文档、测试和 GitHub 模板。排除 .git、.openai、.sites-runtime、.sites-checkout、node_modules、dist、.env、临时归档、个人完整备份、Obsidian 镜像目录和包含真实工作台的截图。检查 src/model.ts 中 seed 仅有教学示例；检查待提交文件与敏感信息，不输出令牌。不要从浏览器读取或导出我的个人工作台。

核对现有 .github/workflows/ci.yml（npm ci、npm test、npm run build），核实 GitHub Actions 的当前官方用法与所用 action 版本。若同名仓库已经存在，先查看其内容；不要覆盖、强推或删历史，不明确时询问我。
在干净目录运行安装、48 项现有测试和构建（实际数量以结果为准，不伪造验证）。失败先修复并报告，不绕过检查。确认外层正文只读且链接可跳转、专注编辑格式化工具、回收站单项永久删除与清除的确认页，以及 JSON 导入独立工作台的流程；不可逆删除只用内存测试数据库验证，不清除作者的真实数据。上传前再核对文件清单，确认没有原发布绑定和私人数据。

创建并推送公开代码仓库，设置清晰描述与相关 topics，启用仓库支持的私密漏洞报告（若有该选项），补齐 README 导航与贡献入口。将准确仓库 URL 更新到 README 及 src/HelpPanel.tsx 的 GitHub 入口，取消“待公开”禁用状态。推送更新并确认 GitHub 文件与 CI 结果。

本轮只发布代码，不改变原 Sites 站点权限或部署。如果具备 GitHub Pages 权限，可以在新仓库为静态演示配置手动触发部署 workflow，构建时使用正确 Vite base；只用教学示例，不迁移个人数据。实际启用或公开演示之前向我说明地址与访问范围并等待我确认。不要宣称仓库公开就自动有可用网页。

完成后给我：仓库 URL、许可证、提交摘要、测试／CI 结果、别人本地运行方法、是否有在线演示及其真实状态，以及原 Sites 页面 GitHub 入口如何更新。任何需要我登录、选择账号或设置权限的步骤明确说明。不要留下假链接，不创建我没有要求的商业服务或付费资源。
```
