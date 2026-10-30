/* GitHub Markdown → 期刊语义适配器。

   职责：
   1. ```mermaid 代码块 → <div class="mermaid">，交给 Mermaid 渲染
   2. 「图 N 说明」「表 N 说明」粗体段落 → 语义化题注元素
   3. 未渲染的 [!NOTE] 引用 → markdown-alert 结构（兼容兜底）

   任何渲染失败都必须保留原始内容，绝不能让人看到空白。

   关于 Mermaid 的 HTML 形态（重要）：
   GitHub Markdown API 实际输出的是
       <pre lang="mermaid" aria-label="Raw mermaid code" class="notranslate">
   内容直接在 pre 里，**没有内层 <code> 元素**。
   早期按 `pre > code.language-mermaid` 查找，该选择器永远匹配不到，
   导致站点上的 Mermaid 图一直显示成代码文本。此处同时兼容两种形态。
*/
(function (window, document) {
  'use strict';

  /* ------------------------------------------------------------------
     Mermaid
     ------------------------------------------------------------------ */

  /* 同时匹配两种历史与当前的 GitHub 输出形态：
       pre[lang="mermaid"]          （当前）
       pre > code.language-mermaid  （早期某些版本） */
  function mermaidTargets(root) {
    var out = [];
    Array.prototype.forEach.call(
      root.querySelectorAll('pre[lang="mermaid"], pre.lang-mermaid, pre > code.language-mermaid, pre > code.lang-mermaid'),
      function (el) {
        /* 命中内层 code 时，实际容器是它的父级 pre */
        var pre = el.tagName === 'CODE' ? el.parentElement : el;
        if (pre && pre.tagName === 'PRE' && out.indexOf(pre) === -1) out.push(pre);
      }
    );
    return out;
  }

  function adaptMermaid(root) {
    var pres = mermaidTargets(root);
    if (!pres.length) return;
    /* Mermaid 库没加载：保持原样，不要动 DOM */
    if (!window.mermaid || typeof window.mermaid.run !== 'function') return;

    pres.forEach(function (pre) {
      if (!pre.parentElement) return;
      /* 从 pre 取源码：优先内层 code，否则用 pre 自身文本 */
      var code = pre.querySelector('code');
      var source = (code ? code.textContent : pre.textContent) || '';

      var wrapper = document.createElement('div');
      wrapper.className = 'mermaid';
      wrapper.textContent = source;

      /* 保留原节点副本，渲染失败时回滚 */
      var original = pre.cloneNode(true);
      pre.parentElement.replaceChild(wrapper, pre);

      try {
        var result = window.mermaid.run({ nodes: [wrapper] });
        if (result && typeof result.catch === 'function') {
          result.catch(function () {
            if (wrapper.parentElement) wrapper.parentElement.replaceChild(original, wrapper);
          });
        }
      } catch (error) {
        if (wrapper.parentElement) wrapper.parentElement.replaceChild(original, wrapper);
      }
    });
  }

  /* ------------------------------------------------------------------
     图题 / 表题
     模板约定：`**图 1　说明**` 或 `**表 1　说明**`
     GitHub 渲染成 <p><strong>图 1 …</strong></p>。
     升级为 <figcaption class="fig-caption[-table]">，让论文样式生效。
     只处理「整段就是题注」的情形（段内没有其他文字），避免误伤正文。
     ------------------------------------------------------------------ */

  var FIG_RE = /^\s*图\s*\d+(?:[.\-－—]\d+)?[\s　:：.]/;
  var TAB_RE = /^\s*表\s*\d+(?:[.\-－—]\d+)?[\s　:：.]/;

  function adaptCaptions(root) {
    Array.prototype.forEach.call(root.querySelectorAll('p'), function (p) {
      /* 段落里只有一个 strong（或 em），且没有其他文本节点内容 */
      var strong = p.querySelector('strong') || p.querySelector('em');
      if (!strong) return;
      var rest = (p.textContent || '').replace(strong.textContent || '', '').trim();
      if (rest) return;

      var text = strong.textContent || '';
      var isFig = FIG_RE.test(text);
      var isTab = TAB_RE.test(text);
      if (!isFig && !isTab) return;

      var caption = document.createElement('figcaption');
      caption.className = isTab ? 'fig-caption fig-caption-table' : 'fig-caption';
      caption.textContent = text.trim();

      /* 图题在图下方：直接替换原段落。
         表题在表上方同理——位置由作者书写顺序决定，这里只换语义。 */
      if (p.parentElement) p.parentElement.replaceChild(caption, p);
    });
  }

  /* ------------------------------------------------------------------
     Legacy Alert（兜底）
     GitHub 现在会直接渲染 .markdown-alert；只有遗留形态才需要转换。
     ------------------------------------------------------------------ */

  function adaptLegacyAlert(blockquote) {
    /* 已经是标准 alert 结构就跳过，避免重复处理 */
    if (blockquote.classList.contains('markdown-alert')) return;
    var title = blockquote.querySelector('p:first-child');
    if (!title) return;
    var match = title.textContent.trim().toUpperCase().match(
      /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]$/
    );
    if (!match) return;
    var kind = match[1].toLowerCase();
    blockquote.classList.add('markdown-alert', 'markdown-alert-' + kind);
    title.classList.add('markdown-alert-title');
    title.textContent = match[1];
  }

  function init(root) {
    var scope = root || document;
    Array.prototype.forEach.call(scope.querySelectorAll('blockquote'), adaptLegacyAlert);
    adaptCaptions(scope);
    adaptMermaid(scope);
  }

  window.JournalMarkdownAdapter = { init: init };
})(window, document);
