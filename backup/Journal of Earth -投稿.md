![JOE](https://github.com/user-attachments/assets/8e3980da-e615-4710-a4f3-7a5eea566394)

<!-- gmeek-meta
{
  "keywords": ["投稿指南", "写作规范", "Instructions"],
  "abstract": "《Journal of Earth》投稿指南：期刊简介与宗旨、投稿流程、稿件要求速查与最新写作模板规范，照此即可完成投稿。",
  "receivedDate": "2026-10-28"
}
-->

> 《Journal of Earth》是郑郑的个人娱乐刊物，于 2024 年创刊。本文是投稿的完整指南——从写作规范到发布流程，一页说清。

## 一、期刊简介

《Journal of Earth》是郑郑主办的个人刊物，于 2024 年创刊，收录作者在技术、学习与生活上的记录与思考。本刊坚持符合国家有关标准和法律法规，文章发表后进入 GitHub 数据库公开并在互联网上运行，作者著作权使用费为零。

> [!NOTE]
> 刊宗旨：**Viva la Vida！人总有一死，但灵魂会在 GitHub 中会万岁！**

## 二、投稿流程

### 1. 在线投稿

1. 打开投稿入口，点击右上角 **New issue**
2. **Issue 标题即文章标题**，请直接写清题目
3. 在正文中按本文第三、四部分的规范撰写文章
4. 发布 Issue，即完成投稿

[**投稿入口 →**](https://github.com/Senkeller/Earth/issues/new)

### 2. 查稿

投稿成功后，随时登录[本刊网站](https://senkeller.github.io/Earth/)查看稿件状态。

### 3. 著作权约定

凡本刊发表的文章将进入 GitHub 数据库公开并在互联网上运行，其作者著作权使用费为零。如作者不同意将文章投稿本期刊，请勿投稿。

## 三、稿件要求速查

本节为速查表；详细格式条款见[《投稿须知 Instructions for Authors》](https://senkeller.github.io/Earth/post/tou-gao-xu-zhi-%20Instructions%20for%20Authors.html)。

| 项目 | 要求 |
| --- | --- |
| 字数 | 2000～3000 字为宜 |
| 摘要 | 400～500 字，含目的、方法、结果、结论 |
| 关键词 | 2～3 个 |
| 书写顺序 | 题目 → 作者姓名与单位 → 关键词 → 正文 → 参考文献 |
| 正文层次 | 阿拉伯数字连续编号，如 1、2.1、3.1.2，左顶格 |
| 图表 | 三线表、表题在上、图题在下，内容自明 |
| 参考文献 | 按 GB/T 7714—2015 顺序编码，研究性 ≥15 篇、综述 ≥35 篇，需英文对照并注明 DOI |

## 四、写作模板

本刊采用 GitHub 风格写作：标题由 Issue 标题承担，正文用标准 Markdown 书写，**分页、页码、纸页样式全部由引擎负责**，作者无需手写任何 HTML 或分页标记。

### 1. 元信息块

在正文开头、题目之后，用 `gmeek-meta` 注释块填写摘要与关键词（可选字段：`receivedDate`、`fund`、`authorBio`、`correspondingAuthor`）：

```markdown
<!-- gmeek-meta
{
  "keywords": ["关键词一", "关键词二"],
  "abstract": "本文介绍……（可选，不写则自动取正文首段）"
}
-->
```

### 2. 正文层级

```text
## 一、章节标题
### 1. 小节标题
#### 1.1 更小的小节
```

### 3. 图表与流程图

图题、表题用粗体单独一行（表题在上、图题在下）；流程图用 Mermaid：

**表 1　参数说明**

| 参数 | 含义 |
| --- | --- |
| `a` | 输入 |

**图 1　整体流程**

```mermaid
flowchart LR
    A[输入] --> B[处理]
    B --> C[输出]
```

### 4. 醒目标注

> [!WARNING]
> 需要醒目提示时使用 GitHub Alert；普通引用用 `>`。

### 5. 完整模板

可直接复制[文章模板](https://github.com/Senkeller/Emeek/blob/main/docs/article-template.md)作为起点。

## 五、常用技巧

| 用途 | 说明 |
| --- | --- |
| [在线表格转换](https://tableconvert.com/zh-cn/excel-to-markdown) | Excel → Markdown 表格 |
| [图片格式](https://www.runoob.com/markdown/md-image.html) | Markdown 图片语法 |
| [表格格式](https://www.runoob.com/markdown/md-table.html) | Markdown 表格语法 |
| [其他技巧](https://www.runoob.com/markdown/md-advance.html) | 进阶语法 |

## 六、联系方式

- 在线投稿：https://github.com/Senkeller/Earth/issues
- E-mail：zzsenln@163.com