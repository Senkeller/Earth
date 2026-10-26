/* Theme helpers used by post pages */
(function () {
  'use strict';
  window.modeSwitch = window.modeSwitch || function () {
    var current = document.documentElement.getAttribute('data-color-mode') || 'light';
    var next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-color-mode', next);
    try { localStorage.setItem('meek_theme', next); } catch (_) {}
  };
})();
