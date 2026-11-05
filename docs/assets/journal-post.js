/* Journal of Earth post enhancements */
(function () {
  'use strict';

  function enhanceCodeBlocks() {
    document.querySelectorAll('pre.notranslate').forEach(function (pre) {
      if (!pre.parentElement.classList.contains('snippet-clipboard-content')) {
        var wrapper = document.createElement('div');
        wrapper.className = 'snippet-clipboard-content';
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
      }
      pre.setAttribute('tabindex', '0');
      pre.setAttribute('role', 'region');
      pre.setAttribute('aria-label', '代码示例，可横向滚动');
    });
  }

  /* 纸页宽 920px，右侧目录宽 222px + 24px 间距。
     只有视口宽度 >= 1420px 时，两侧才放得下目录而不压住纸页；
     低于该值时目录改为文前静态块（由 GmeekTOC.js 的媒体查询兜底）。 */
  var TOC_FIXED_MIN_WIDTH = 1420;

  function updateTOC() {
    var toc = document.querySelector('.toc');
    if (!toc) return;
    if (window.innerWidth < TOC_FIXED_MIN_WIDTH) {
      toc.style.position = 'static';
      toc.style.left = 'auto';
      toc.style.right = 'auto';
      toc.style.transform = 'none';
    } else {
      toc.style.position = 'fixed';
      toc.style.left = 'auto';
      toc.style.right = '24px';
      toc.style.transform = 'none';
    }
  }

  function init() {
    enhanceCodeBlocks();
    updateTOC();
    window.addEventListener('resize', updateTOC, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
