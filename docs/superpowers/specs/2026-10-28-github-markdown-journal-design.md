# GitHub Markdown 技术杂志型期刊排版设计

日期：2026-10-28
状态：设计已确认，待实现

## 目标

让 GitHub Issue 中的 Markdown 文章稳定转换为技术杂志型期刊页面：保留 Markdown 的语义表达，使用 CSS 呈现论文式视觉，并由分页引擎负责纸页结构。

目标页面不要求作者手写 HTML、CSS、分页标记或页码。作者只写 GitHub Flavored Markdown（GFM）和可选的单篇元信息。

## 兼容边界

Emeek 当前通过 GitHub Markdown API 使用 GFM：

```python
payload = {"text": mdstr, "mode": "gfm"}
```

实现时必须补充仓库上下文：

```python
payload = {
    "text": mdstr,
    "mode": "gfm",
    "context": options.repo_name,
}
```

`context` 使用 `owner/repository` 格式，用于 GitHub 风格的相对链接、Issue/PR 引用和仓库语义解析。若 API 请求失败，构建必须保留明确错误日志并终止当前文章生成，不能静默发布未渲染的 Markdown 原文。

正式支持的基础语法：

- `#` 到 `######` 标题
- 段落、粗体、斜体、删除线、行内代码
- 无序列表、有序列表、嵌套列表、任务列表
- 普通引用
- GFM 表格
- fenced code block 和语言标记
- 图片、链接、自动链接
- 水平线
- 脚注
- GitHub Alert（同时保留普通引用兜底）
- Mermaid fenced code（由前端适配器处理）

不作为核心规范：`:::warning`、WikiLinks、Obsidian Callout、自定义 Markdown 宏、PlantUML、自定义 `[[link]]`、依赖 HTML 注释渲染结果的元数据和大量内联 HTML 样式。

## 数据模型与优先级

### 全局配置

Earth `config.json` 提供博客级默认值：

```json
{
  "journalAuthor": "郑郑",
  "journalAffiliation": "个人博客 · 西安 710072",
  "journalKeywords": [],
  "journalFund": "",
  "journalAuthorBio": "",
  "journalCorrespondingAuthor": "",
  "journalDefaultAbstract": "",
  "journalReceivedDateMode": "issue-created",
  "journalIgnoredLabels": ["draft", "置顶", "singlePage"]
}
```

### 单篇元信息

文章原始 Markdown 可以在标题之后加入 `gmeek-meta` 注释块。Gmeek 必须在调用 GitHub Markdown API 前提取并移除该块，使它不参与正文渲染和分页：

```md
<!-- gmeek-meta
{
  "author": "郑郑",
  "affiliation": "个人博客 · 西安 710072",
  "keywords": ["设计体系", "Design Token", "组件库"],
  "abstract": "本文介绍如何从 Design Token 建立可维护的 UI 设计体系。",
  "receivedDate": "2026-10-28",
  "fund": "",
  "authorBio": "",
  "correspondingAuthor": ""
}
-->
```

元信息必须是严格 JSON：双引号属性名、双引号字符串、无尾随逗号、无 JavaScript 注释。格式错误时忽略该块并继续正常渲染正文，不能导致构建失败。

兼容旧文章时继续支持当前 Gmeek 的末尾配置格式：

```md
正文内容
##{"timestamp": 1720000000, "style": ""}
```

旧格式仍只读取现有构建字段（如 `timestamp`、`style`、`script`、`head`、`ogImage`），不把它误当作 `gmeek-meta`。当同一篇文章同时存在两种格式时，`gmeek-meta` 负责期刊元信息，旧末尾 JSON 负责构建控制字段；两者不得互相覆盖。

### 字段优先级

每个字段遵循：

```text
单篇 gmeek-meta
→ config.json 全局值
→ GitHub Issue / Gmeek 自动字段
→ 安全默认值
→ 空值则隐藏
```

字段规则：

- `author`：单篇作者 → 全局作者 → Issue 创建者显示名 → `config.title` → 隐藏
- `affiliation`：单篇单位 → 全局单位 → 隐藏
- `keywords`：单篇关键词 → 全局关键词 → 过滤后的 GitHub Labels → 隐藏
- `abstract`：单篇摘要 → 现有 Gmeek `description` → 正文首个普通段落 → 全局默认摘要 → 隐藏
- `receivedDate`：单篇日期 → Issue timestamp → Issue 创建日期 → 配置策略 → 隐藏
- `fund`、`authorBio`、`correspondingAuthor`：单篇值 → 全局值 → 整行隐藏

不显示“无”、不伪造当前日期、DOI、卷期、基金编号或出版身份信息。

关键词使用分号分隔的普通链接文本，不使用彩色药丸。GitHub Labels 作为最后兜底，并过滤 `journalIgnoredLabels`。

### 模板元信息接口

`Gmeek.py` 将合并后的字段放入单一 `journalMeta` 对象，并将它作为独立模板变量传给 `post.html`。模板不直接解析原始 Markdown 元数据，也不从通用 `blogBase` 字典猜测字段：

```python
journalMeta = {
    "author": str | None,
    "affiliation": str | None,
    "abstract": str | None,
    "keywords": list[str],
    "receivedDate": str | None,
    "fund": str | None,
    "authorBio": str | None,
    "correspondingAuthor": str | None,
}
```

`None`、空白字符串和空列表统一视为缺失。模板按字段逐项判断，缺失字段整块不渲染；关键词链接仍使用现有 `postLabels` 兼容变量，第一阶段可以由 `journalMeta.keywords` 生成并传入。

摘要提取顺序中，现有 `description` 是 Gmeek 从 Issue 正文生成的预览描述；它仍保持兼容，但不得覆盖显式 `gmeek-meta.abstract`。

## 标题规范

Issue title 是文章总标题，显示在 `journal-title`。正文不应重复写同一个 `#` 标题：

```text
Issue title: ③ UI 设计体系实战：从 Design Token 到组件库
```

已有文章若包含相同的正文首个 `h1`，前端分页引擎继续自动移除重复标题。

正文层级：

```md
## 一、问题背景
### 1. 现状分析
#### 1.1 颜色不一致
##### 特殊说明
```

- `##`：一级章节，黑体、跨双栏
- `###`：二级章节，黑体、跨双栏
- `####`：三级标题，紧凑黑体
- `#####`：小标题，正文级黑体

不建议跳级。

## Markdown 元素映射

### 段落

普通段落使用宋体、五号字、首行缩进、两端对齐。作者不通过空行、`<br>` 或 `&nbsp;` 调整分页。

### 列表

列表不使用首行缩进，保持正文字号和紧凑行距。列表项尽量避免跨页拆分。

### 引用与 Callout

普通引用：

```md
> 好的设计系统不是限制设计，而是让设计决策能够持续复用。
```

GitHub Alert：

```md
> [!NOTE]
> 这是背景信息。
```

```md
> [!WARNING]
> 这是风险提示。
```

Emeek 同时兼容 GitHub Alert 生成的 `.markdown-alert` 和普通引用兜底。两者都跨双栏、避免拆页。

不把 `:::warning` 作为正式规范。

### 代码块

必须标注语言：

````md
```typescript
const spacing = '16px';
```
````

代码块跨双栏、保留滚动、避免拆页。`language-mermaid` 交给 Mermaid 适配器处理；其它语言保持代码块并使用现有高亮能力。

### 表格

使用 GFM 表格：

```md
**表 1　设计令牌示例**

| 字段 | 含义 | 示例 |
| --- | --- | --- |
| `colorPrimary` | 主色 | `#D4A574` |
```

表格跨双栏，表头黑体，宽表格允许横向滚动，尽量避免跨页。

### Mermaid

使用标准 fenced code：

````md
```mermaid
flowchart LR
    A[设计令牌] --> B[基础组件]
    B --> C[业务组件]
```
````

前端识别 `code.language-mermaid`，转换为 Mermaid 容器。渲染失败时保留原始代码块，不得让整篇文章消失。

### 图片、水平线和脚注

图片使用标准 Markdown，保留 alt 文本，跨双栏、居中、限制最大宽度。水平线只用于主题分隔，不用于手动分页。脚注集中在文末，小字号显示。

## 页面结构

```text
刊头
├── 日期、刊名、期号
├── 文章标题
├── 作者、单位
├── 摘要
└── 关键词

分页正文
├── 独立纸页
├── 双栏 Markdown 内容
├── 续页页眉
└── 自动页码

文章页脚
├── 收稿日期（有值才显示）
├── 基金项目（有值才显示）
├── 作者简介（有值才显示）
└── 通信作者（有值才显示）
```

Markdown 元信息不进入正文分页。页码由 `journal-paginate.js` 生成。文章页脚由模板根据解析后的字段生成。

## 推荐文章模板

```md
<!-- gmeek-meta
{
  "abstract": "本文介绍如何从 Design Token 建立可维护的 UI 设计体系，并给出从设计令牌到组件库的工程实践。",
  "keywords": ["设计体系", "Design Token", "组件库"],
  "receivedDate": "2026-10-28",
  "fund": "",
  "authorBio": "",
  "correspondingAuthor": ""
}
-->

> 本文面向希望建立统一 UI 设计体系的前端开发者和产品设计师。

## 一、问题背景

说明问题是什么，以及为什么需要设计体系。

### 1. 现状分析

正文段落。

> [!NOTE]
> 设计系统的核心不是限制设计，而是让设计决策能够持续复用。

### 2. 核心问题

- 页面之间的颜色和间距不一致
- 组件缺少统一状态
- 修改设计需要重复调整多个页面

## 二、核心方法

### 1. 设计令牌

设计令牌用于描述颜色、字号、间距、圆角和阴影。

```typescript
const tokens = {
  colorPrimary: '#D4A574',
  colorText: '#2D2A26',
  spacingMd: '16px',
  radiusSm: '6px',
};
```

### 2. 组件体系

```mermaid
flowchart LR
    A[设计令牌] --> B[基础组件]
    B --> C[业务组件]
    C --> D[页面组合]
```

**图 1　设计令牌到页面组件的依赖关系**

### 3. 参数对比

**表 1　设计令牌示例**

| 参数 | 含义 | 示例 |
| --- | --- | --- |
| `colorPrimary` | 主色 | `#D4A574` |
| `spacingMd` | 中等间距 | `16px` |
| `radiusSm` | 小圆角 | `6px` |

## 三、工程实践

### 1. 正常流程

1. 整理设计令牌
2. 建立基础组件
3. 组合业务组件
4. 进行视觉回归测试

### 2. 异常情况

> [!WARNING]
> 不要在业务组件内部重新定义全局设计令牌。

```bash
npm run test
npm run build
```

## 四、结论

总结核心结论，并给出下一步建议。

---

## 参考资料

- [Design Tokens Community Group](https://www.designtokens.org/)
- [相关项目文档](https://example.com)
```

## 实现边界

### Gmeek.py

负责：

- 从原始 Issue Markdown 提取并移除 `gmeek-meta`
- 严格解析 JSON，格式错误时忽略并记录日志
- 合并单篇元信息、全局配置、Issue 自动字段
- 提取摘要和过滤关键词
- 把解析后的元信息传给模板

不负责：

- 解析最终 HTML 的视觉样式
- 分页
- Mermaid 绘图

### templates/post.html

负责：

- 刊头、作者、单位、摘要、关键词结构
- Markdown 正文容器
- 文章元信息页脚
- 空值字段的条件渲染

不负责：

- 直接解析 Markdown 语法
- 手动计算页码

### journal-style.css

负责：

- Markdown HTML 元素的论文化视觉
- 标题、段落、列表、引用、Callout、代码、表格、Mermaid、图片的布局
- 双栏、跨栏、纸页背景和视觉层次

### journal-paginate.js

负责：

- 对最终 HTML 做分页
- 保持代码块、Callout、表格、Mermaid、图片等块级元素不拆页
- 生成续页页眉和页码
- 移动端禁用固定分页

## 验收标准

1. GFM 基础语法仍能通过 GitHub Markdown API 正常渲染。
2. `gmeek-meta` 不会出现在正文中，也不会参与分页。
3. 元信息解析失败不会导致构建失败。
4. 文章标题只显示一次。
5. 作者、单位、摘要、关键词按优先级正确兜底。
6. 空的基金、作者简介、通信作者整行隐藏。
7. `##`、`###`、`####` 层级视觉稳定。
8. 代码块跨双栏，Mermaid 能转换；转换失败时保留代码。
9. Callout 和普通引用都能显示并保持跨栏。
10. 表格、图片、代码块和 Callout 不被分页引擎拆开。
11. 移动端恢复单栏自然滚动。
12. 现有文章不要求修改也能继续生成页面。
13. 新模板可以直接复制使用。
14. 相关测试、构建和线上文章验证全部通过。
