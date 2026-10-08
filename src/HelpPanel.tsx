import {Icon} from './icons';

export default function HelpPanel(){
 return <div className="help-content"><span className="eyebrow">枝间 · 使用与关于</span><h2>给想法一点空间</h2><div className="help-grid">
 <b>自由摆放</b><p>从左侧拖入卡片，或点击工具后在画布放置。图片可上传、拖入或粘贴。</p>
 <b>直接编辑</b><p>标题、清单与表格可直接操作；正文只在双击进入的专注编辑里修改。正文支持格式化与 Markdown，阅读时点击链接跳转。</p>
 <b>连接想法</b><p>从卡片右侧圆点拖出连线；点击线条调整粗细、箭头与说明，拖动锚点调整曲线。</p>
 <b>逐层整理</b><p>点击画板图标进入主题；拖入分栏自动排列。多选内容后可拆成子画板。</p>
 <b>移动视野</b><p>滚轮平移，空格 + 拖动平移；⌘ / Ctrl + 滚轮缩放，按 0 查看全部内容。</p>
 <b>数据归你</b><p>内容保存在本浏览器，无云同步。定期导出完整备份；思路文档和 Markdown 适合回顾与继续写作。</p>
 </div><section className="about-project" aria-label="项目信息"><div className="about-heading"><h3>关于枝间</h3><span>1.0.0 · 2026.10.7 日版本</span></div><div className="project-credits">
 <a href="https://www.tatalab.ai/" target="_blank" rel="noopener noreferrer"><span><small>制作人</small><strong>TATALAB</strong></span><Icon name="external" size={16}/></a>
 <a href="https://app.milanote.com/" target="_blank" rel="noopener noreferrer"><span><small>交互原型参考</small><strong>Milanote</strong></span><Icon name="external" size={16}/></a>
 <a href="https://tabler.io/icons" target="_blank" rel="noopener noreferrer"><span><small>图标库 · MIT</small><strong>Tabler Icons</strong></span><Icon name="external" size={16}/></a>
 </div></section><footer className="help-footer"><span>一个帮助你拆解问题、理清思路的本地工具。</span><a className="soft-button" href="https://github.com/Beatatata/zhijian-thinking-canvas" target="_blank" rel="noopener noreferrer" title="在 GitHub 查看源码、反馈问题或参与贡献"><Icon name="github" size={17}/>GitHub 仓库</a></footer></div>;
}
