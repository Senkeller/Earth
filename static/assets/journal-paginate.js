/* =========================================================
   Journal of Earth · 文章分页引擎
   ---------------------------------------------------------
   职责：把 #postBody 的顶级内容块试排进固定页高的多页纸页，
   让长文呈现论文式分页（设计稿 design-post-preview.html 形态）。

   算法：「试排-回溯」
   - 逐页循环：把块依序 append 进当前页容器
   - 每加一块后测量当前页 scrollHeight 是否超过页高
   - 若超出，块属于下一页（回退，开新页继续）
   - 用真实渲染测量，多栏/跨栏/代码块高度都由浏览器精确给出

   可测接口：
   - buildPages(heights, usableHeight)：给定每块高度，纯函数贪心分页，
     供单元测试验证分配逻辑的正确性
   ========================================================= */

(function () {
  'use strict';

  var PAGE = {
    height: 780,        /* 页高 px（与 CSS .jpages .jpage 一致） */
    paddingTop: 0,      /* 页内顶部（续页页眉占位在块内实现） */
    paddingBottom: 34   /* 页脚页码留白 */
  };

  function getUsableHeight() {
    /* 页高减去上下 padding，双栏容器里可容纳内容的实际高度 */
    return PAGE.height - PAGE.paddingTop - PAGE.paddingBottom;
  }

  /* ------------------------------------------------------------------
     buildPages(heights, usableHeight)
     贪心把块装进页：顺序累加高度，超过页高则翻新页。
     返回：[{blocks:[i...], height}]，块不可跨页拆分。
     这是纯逻辑部分，供单元测试使用。
     ------------------------------------------------------------------ */
  function buildPages(heights, usableHeight) {
    var pages = [];
    var current = null;
    for (var i = 0; i < heights.length; i++) {
      var h = heights[i] || 0;
      if (current && current.height + h <= usableHeight) {
        current.blocks.push(i);
        current.height += h;
      } else {
        current = { blocks: [i], height: h };
        pages.push(current);
      }
    }
    return pages;
  }

  /* ==================================================================
     主流程
     ================================================================== */
  function paginate() {
    var postBody = document.getElementById('postBody');
    if (!postBody || postBody.getAttribute('data-paginated')) return;
    /* 窄屏（移动端）不分页：单栏自然滚动，避免固定页高造成小屏阅读灾难 */
    if (window.innerWidth <= 720) return;

    var paper = postBody.parentElement;
    var body = document.body;

    /* 1. 提取顶级块（保留节点引用） */
    var blocks = [];
    while (postBody.firstChild) {
      blocks.push(postBody.firstChild);
    }

    /* 2. 准备分页容器 */
    var jpages = document.createElement('div');
    jpages.className = 'jpages';

    /* 3. 逐页试排：真实渲染测量，回退溢出块 */
    var usable = getUsableHeight();
    var pageIndex = 0;
    var page = newPage(jpages, pageIndex);

    for (var i = 0; i < blocks.length; i++) {
      page.appendChild(blocks[i]);
      var over = page.scrollHeight > getUsableHeight();
      if (over) {
        /* 弹出这块（回到原 blocks 顺序由拼接保证），开新页 */
        var popped = page.removeChild(blocks[i]);
        pageIndex++;
        page = newPage(jpages, pageIndex);
        page.appendChild(popped);
      }
    }

    /* 4. 替换正文容器 */
    paper.insertBefore(jpages, postBody);
    paper.removeChild(postBody);
    postBody.setAttribute('data-paginated', '1');
  }

  function newPage(container, index) {
    var page = document.createElement('div');
    page.className = 'jpage markdown-body';
    page.style.height = PAGE.height + 'px';

    /* 首页（第0页）沿用主刊头外，续页显示续页页眉 */
    if (index > 0) {
      var cont = document.createElement('div');
      cont.className = 'cont-masthead';
      var nameEl = document.querySelector('.journal-masthead .mh-center');
      var name = nameEl ? nameEl.textContent : '';
      cont.innerHTML =
        '<span class="mh-side">— ' + (index + 1) + ' —</span>' +
        '<span class="mh-center">' + name + '</span>' +
        '<span class="mh-side"></span>';
      page.appendChild(cont);
    }
    container.appendChild(page);
    return page;
  }

  /* 暴露测试接口 */
  window.JournalPaginator = {
    buildPages: buildPages,
    getUsableHeight: getUsableHeight,
    PAGE: PAGE,
    paginate: paginate
  };

  function start() {
    /* 等图片等资源全部加载完再分页，保证高度测量准确；
       若 load 未触发（例如图片挂了），DOMContentLoaded 后兜底。 */
    var already = false;
    function run() {
      if (already) return;
      already = true;
      paginate();
    }
    if (document.readyState === 'complete') {
      run();
    } else {
      window.addEventListener('load', run);
      /* 兜底：DOM 就绪后 2.5s 强制分页，避免个别慢资源阻塞 */
      document.addEventListener('DOMContentLoaded', function () {
        setTimeout(run, 2500);
      });
    }
  }
  start();
})();