# GitHub 发布清单

## 代码公开与网站公开是两件事

公开仓库让别人阅读、下载和修改源码。在线使用还要部署静态网站；原制作人的 Sites 地址仍遵循其原有访问限制。每位访问者的工作台保存于自己的浏览器；源码里的教学示例由每次首次运行生成。

## 干净发布

1. 从 app 目录准备独立副本，建立全新的 Git 历史，避免带入原发布绑定或历史中曾出现的数据。
2. 包含 README、LICENSE、ATTRIBUTIONS、CHANGELOG、贡献与安全文档、docs、src、public、package.json、package-lock.json、配置与必要测试。
3. 排除 .git、.openai、.sites-runtime、node_modules、dist、.env 和临时文件；不要复制上级目录里的验收截图。当前 .gitignore 不能替你判断所有私人文件，也无法删除已经追踪的敏感历史。
4. 核对实际文件内容；只使用教学示例作为演示。私人数据在 IndexedDB 与用户选择的磁盘目录，不应读取或加入仓库。
5. 安装、测试、构建，添加 CI；实际验证失败不能写“已通过”。
6. 发布准确仓库 URL 后更新应用 HelpPanel GitHub 入口与 README，不使用占位链接冒充真实仓库。

## 使用与部署

贡献者：克隆仓库，`npm ci`、`npm run dev`；`npm test`、`npm run build` 验证。
普通用户：访问单独发布的演示网页，无需安装。备份迁移：原地址下载完整 JSON，在新地址导入恢复。

GitHub Pages、其他静态托管或自己的服务器均可承载 dist。GitHub 项目站点通常有仓库子路径，需要核对 Vite base；无前端路由的当前实现也可构建相对资源路径 `npm run build -- --base=./`。Pages workflow 的权限、环境和 action 版本以当时官方文档为准，本仓库暂未配置或启用该服务。

## 发布后

检查首页加载、图标与样式、教学示例、标题与清单操作、正文阅读链接、专注编辑、分栏拖动、回收站确认取消、完整备份导入导出。检查第三方许可。release 1.0.0 的日期与版本保持真实；发布当天如不同，区分产品版本日期与 GitHub release 发布时间。不要承诺双向同步或后台同步。

仓库未实际创建前，问题与安全报告入口不可写成已开放的链接。制作人官网与参考来源见 ATTRIBUTIONS.md。
