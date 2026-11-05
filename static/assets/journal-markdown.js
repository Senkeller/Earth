/* GitHub Markdown → 期刊语义适配器。

   职责：
   1. ```mermaid 代码块 → <div class="mermaid">，交给 Mermaid 渲染
   2. 「图 N 说明」「表 N 说明」粗体段落 → 语义化题注元素
   3. 未渲染的 [!NOTE] 引用 → markdown-alert 结构（兼容兜底）

   任何渲染失败都必须保留原始内容，绝不能让人看到空白。

   关于 Mermaid 的 HTML 形态（重要）：
   GitHub Markdown API 当前输出的是一个 enrichment 容器：
       <section class="js-render-needs-enrichment" data-type="mermaid">
         <div class="js-render-enrichment-target">
           <div class="render-plaintext-hidden">
             <pre lang="mermaid">源码</pre>
           </div>
         </div>
         <span class="js-render-enrichment-loader">转圈动画</span>
       </section>
   只替换内层 <pre> 会留下容器和永远不会消失的加载动画。
   因此这里把整个 section 换成 <div class="mermaid">，并清理 loader。
   同时兼容旧形态 pre[lang="mermaid"] / pre > code.language-mermaid。
*/
(function (window, document) {
  'use strict';

  var readyPromise = Promise.resolve();

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

  /* 找到包住 <pre> 的 GitHub enrichment 容器；旧形态返回 null。 */
  function mermaidContainer(pre) {
    var node = pre;
    while (node && node !== document) {
      if (node.tagName === 'SECTION') {
        if (node.getAttribute('data-type') === 'mermaid') return node;
        if (node.classList && (
          node.classList.contains('js-render-needs-enrichment') ||
          node.classList.contains('render-needs-enrichment')
        )) return node;
      }
      node = node.parentElement;
    }
    return null;
  }

  /* 去掉 GitHub 的加载动画，并让原始代码在降级时可见。 */
  function stripLoader(container) {
    if (!container || !container.querySelector) return;
    if (container.classList) container.classList.remove('render-plaintext-hidden');
    var loader = container.querySelector('.js-render-enrichment-loader');
    if (loader && loader.parentElement) loader.parentElement.removeChild(loader);
    /* GitHub 用这个类把原始 pre 隐藏起来；保留它会导致降级时看不到源码。 */
    Array.prototype.forEach.call(
      container.querySelectorAll('.render-plaintext-hidden'),
      function (el) { el.classList.remove('render-plaintext-hidden'); }
    );
    var target = container.querySelector('.js-render-enrichment-target');
    if (target) target.removeAttribute('aria-busy');
  }

  function adaptMermaid(root) {
    var pres = mermaidTargets(root);
    if (!pres.length) return Promise.resolve();

    /* Mermaid 库没加载：移除转圈动画、显示源码，绝不留下永久 spinner。 */
    if (!window.mermaid || typeof window.mermaid.run !== 'function') {
      pres.forEach(function (pre) {
        var container = mermaidContainer(pre);
        if (container) stripLoader(container);
        else stripLoader(pre.parentElement);
      });
      return Promise.resolve();
    }

    var jobs = [];

    pres.forEach(function (pre) {
      if (!pre.parentElement) return;

      /* 从 pre 取源码：优先内层 code，否则用 pre 自身文本 */
      var code = pre.querySelector('code');
      var source = (code ? code.textContent : pre.textContent) || '';
      if (!source.trim()) return;

      var container = mermaidContainer(pre);
      var host = container || pre;
      var parent = host.parentElement;
      if (!parent) return;

      /* 保留原节点副本（去掉 loader），渲染失败时回滚为可读源码。 */
      var original = host.cloneNode(true);
      stripLoader(original);

      var wrapper = document.createElement('div');
      wrapper.className = 'mermaid';
      /* textContent 会正确还原 HTML 实体（--&gt; → -->） */
      wrapper.textContent = source;

      parent.replaceChild(wrapper, host);

      var job;
      try {
        job = window.mermaid.run({ nodes: [wrapper] });
      } catch (error) {
        if (wrapper.parentElement) wrapper.parentElement.replaceChild(original, wrapper);
        return;
      }

      jobs.push(Promise.resolve(job).catch(function () {
        if (wrapper.parentElement) wrapper.parentElement.replaceChild(original, wrapper);
      }));
    });

    return Promise.all(jobs).then(function () { /* 全部完成或已降级 */ });
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
    var next = adaptMermaid(scope);
    /* 多次 init 时串联而非覆盖，避免第二次调用把仍在渲染的第一次“提前完成”。 */
    readyPromise = readyPromise.then(function () { return next; }, function () { return next; });
    return readyPromise;
  }

  window.JournalMarkdownAdapter = {
    init: init,
    /* 分页引擎等异步消费方可以等待 Mermaid 渲染完成，避免按旧高度切页。 */
    ready: function () { return readyPromise; }
  };
})(window, document);
