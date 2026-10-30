/* =========================================================
   Journal of Earth · 期刊分页引擎（PDF 式多页）
   ---------------------------------------------------------
   职责：把 #postBody 的顶层内容块切成固定页高的纸页，
   让长文呈现 PDF 那样的翻页阅读体验。

   算法：DOM 顺序分页（边排边测）
   - 把块逐个 append 进当前页
   - 每次 append 后检查是否有块的底边超过页面内容底边
   - 溢出就把这一块整个挪到下一页开头
   - 单块超过一整页时强制保留，绝不丢内容

   与旧引擎（已删除）的本质区别：
   旧引擎预先测量所有块高、贪心分配到页，测量误差会累积，
   且以「块不可跨页」为前提导致页脚必然留白、反复调参。
   本引擎不预计算页数，浏览器负责断行，JS 只回答「这块放得下吗」。
   ========================================================= */

(function () {
  'use strict';

  /* 页面几何：与 CSS .jpages .jpage 保持一致 */
  var GEOMETRY = {
    height: 1300,      /* 页高 px（A4 比例：920 宽 × 1300 高 ≈ 1:1.414） */
    paddingBottom: 40, /* 页脚页码留白，内容不得侵入 */
    paddingSide: 28    /* 左右内边距（CSS: padding: 20px 28px 40px） */
  };

  /* 窄屏不分页：小屏上固定页高会造成频繁翻页，体验反而更差 */
  var MIN_WIDTH = 720;

  /* ------------------------------------------------------------------
     溢出检测
     返回第一个溢出页面可视区的元素；无溢出返回 null。

     关键：多栏容器（column-count: 2）装不下内容时，浏览器不是向下溢出，
     而是向右继续开新的「虚拟栏」。此时 scrollHeight 恒等于页高，
     只有 scrollWidth 会变大。因此必须优先检测横向溢出，
     否则引擎会误判「一页就装完了」，把大部分内容留在被
     overflow:hidden 裁掉的虚拟栏里——读者只能看到第一栏。

     实测：一篇 9339 字符的文章曾因此只生成 1 页，
     该页 scrollWidth=3272px、clientWidth=830px，横向溢出 2442px。
     ------------------------------------------------------------------ */
  function findOverflow(page) {
    var rect = page.getBoundingClientRect();
    var limit = rect.top + (GEOMETRY.height - GEOMETRY.paddingBottom);
    var kids = page.children;

    /* 横向溢出：内容被挤到页面右边界之外的虚拟栏 */
    if (page.scrollWidth > page.clientWidth + 2) {
      /* 页面右边界 = 内容区右边界（扣除 padding） */
      var contentRight = rect.right - GEOMETRY.paddingSide;
      for (var i = 0; i < kids.length; i++) {
        var el = kids[i];
        if (el.classList.contains('journal-pgno')) continue;
        /* 起点落在内容右边界之外的块，就是被挤进虚拟栏的第一块 */
        if (el.getBoundingClientRect().left >= contentRight - 2) return el;
      }
      /* 兜底：找任何右边越界的块 */
      for (var j = kids.length - 1; j >= 0; j--) {
        var e = kids[j];
        if (e.classList.contains('journal-pgno')) continue;
        if (e.getBoundingClientRect().right > contentRight + 2) return e;
      }
    }

    /* 纵向溢出：底边超过页面内容底边 */
    for (var k = kids.length - 1; k >= 0; k--) {
      var node = kids[k];
      /* 页码是绝对定位的装饰元素，不参与溢出判断 */
      if (node.classList.contains('journal-pgno')) continue;
      if (node.getBoundingClientRect().bottom > limit + 1) return node;
    }
    return null;
  }

  /* 页内真实内容块（排除页码装饰） */
  function contentChildren(page) {
    return Array.prototype.filter.call(page.children, function (el) {
      return !el.classList.contains('journal-pgno');
    });
  }

  function makePageNumber(n) {
    var div = document.createElement('div');
    div.className = 'journal-pgno';
    div.textContent = String(n);
    return div;
  }

  function createPage(container) {
    var page = document.createElement('div');
    /* 必须同时带 markdown-body 类：正文元素的排版规则全部挂在
       .jpage.markdown-body 选择器下（标题、段落、代码、表格等 46 条规则）。
       只写 jpage 会让分页后所有正文样式失效。 */
    page.className = 'jpage markdown-body';
    container.appendChild(page);
    return page;
  }

  /* ------------------------------------------------------------------
     主分页流程
     ------------------------------------------------------------------ */
  function paginate() {
    var postBody = document.getElementById('postBody');
    if (!postBody || postBody.getAttribute('data-paginated')) return;
    if (window.innerWidth <= MIN_WIDTH) return;

    var paper = postBody.parentElement;

    /* 0. 移除正文开头的冗余标题。
       文章标题已由刊头 .journal-title 呈现；模板允许作者在正文首行再写一次
       「# 文章标题」（便于在编辑器里阅读），这里是同一标题的重复。
       只移除开头连续的 h1（以及与刊头标题文本完全相同的首个 h1），
       正文中间的 h1 一律保留——那通常是作者刻意使用的章节分隔。 */
    var titleEl = document.querySelector('.journal-title');
    var mastheadTitle = titleEl ? (titleEl.textContent || '').trim() : '';
    while (postBody.firstElementChild && postBody.firstElementChild.tagName === 'H1') {
      var h1Text = (postBody.firstElementChild.textContent || '').trim();
      /* 若刊头标题存在且与正文首个 h1 不同，说明作者用了别的标题，保留之 */
      if (mastheadTitle && h1Text && h1Text !== mastheadTitle) break;
      postBody.removeChild(postBody.firstElementChild);
    }

    /* 1. 取出所有顶层块，保留节点引用（之后直接搬运，不 clone，避免状态丢失） */
    var blocks = [];
    while (postBody.firstChild) {
      blocks.push(postBody.firstChild);
      postBody.removeChild(postBody.firstChild);
    }
    if (!blocks.length) return;

    /* 2. 逐块装箱 */
    var jpages = document.createElement('div');
    jpages.className = 'jpages';
    paper.insertBefore(jpages, postBody);

    var current = createPage(jpages);
    for (var i = 0; i < blocks.length; i++) {
      var node = blocks[i];
      current.appendChild(node);

      if (findOverflow(current)) {
        current.removeChild(node);

        if (contentChildren(current).length === 0) {
          /* 这一块本身比一整页还高（超长代码块等）：
             放回去并给它独立一页，宁可溢出也不能丢内容 */
          current.appendChild(node);
          current.appendChild(makePageNumber(jpages.children.length));
          current = createPage(jpages);
        } else {
          /* 正常情况：当前页收尾，开新页放这一块 */
          current.appendChild(makePageNumber(jpages.children.length));
          current = createPage(jpages);
          current.appendChild(node);
        }
      }
    }

    /* 3. 末页收尾：加页码；若末页为空则移除 */
    if (contentChildren(current).length === 0) {
      if (jpages.children.length > 1) jpages.removeChild(current);
    } else {
      current.appendChild(makePageNumber(jpages.children.length));
    }

    paper.removeChild(postBody);
    postBody.setAttribute('data-paginated', '1');
  }

  /* ------------------------------------------------------------------
     启动时机
     必须等 window load：图片与 Mermaid 渲染完成会改变块高，
     提前分页会按错误的高度切分，导致内容错位。
     ------------------------------------------------------------------ */
  function start() {
    var done = false;
    function run() {
      if (done) return;
      done = true;
      paginate();
    }

    if (document.readyState === 'complete') {
      run();
    } else {
      window.addEventListener('load', run);
      /* 兜底：DOM 就绪后 3s 强制分页，避免个别慢资源永久阻塞 */
      document.addEventListener('DOMContentLoaded', function () {
        setTimeout(run, 3000);
      });
    }
  }

  /* 暴露测试接口 */
  window.JournalPaginator = {
    paginate: paginate,
    GEOMETRY: GEOMETRY,
    MIN_WIDTH: MIN_WIDTH
  };

  start();
})();
