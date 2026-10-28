/* GitHub Markdown → 期刊语义适配器。
   只改写 Mermaid 和 Alert 的 HTML 形态；任何渲染失败都保留原始内容。 */
(function (window, document) {
  'use strict';

  function mermaidBlocks(root) {
    return Array.prototype.slice.call(
      root.querySelectorAll('pre > code.language-mermaid, pre > code.lang-mermaid')
    );
  }

  function adaptMermaid(root) {
    if (!window.mermaid) return;
    mermaidBlocks(root).forEach(function (code) {
      var pre = code.parentElement;
      if (!pre || !pre.parentElement) return;
      var wrapper = document.createElement('div');
      wrapper.className = 'mermaid';
      wrapper.textContent = code.textContent;
      var original = pre.cloneNode(true);
      pre.parentElement.replaceChild(wrapper, pre);
      if (typeof window.mermaid.run !== 'function') {
        wrapper.parentElement.replaceChild(original, wrapper);
        return;
      }
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

  function adaptLegacyAlert(blockquote) {
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
    var quotes = scope.querySelectorAll('blockquote');
    Array.prototype.forEach.call(quotes, adaptLegacyAlert);
    adaptMermaid(scope);
  }

  window.JournalMarkdownAdapter = { init: init };
})(window, document);
