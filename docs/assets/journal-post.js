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

  function updateTOC() {
    var toc = document.querySelector('.toc');
    if (!toc) return;
    if (window.innerWidth < 1250) {
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
