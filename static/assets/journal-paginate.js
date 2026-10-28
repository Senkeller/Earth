/* =========================================================
   Journal of Earth · 文章分页引擎
   ---------------------------------------------------------
   职责：把 #postBody 的顶级内容块按固定页高切分到多页纸页，
   让长文呈现论文式分页（设计稿 design-post-preview.html 形态）。

   算法：测量 → 分配 → 渲染
   - 测量：把每块 clone 到隐藏测量容器，读真实 offsetHeight
   - 分配：buildPages 纯函数贪心分页（块不可跨页拆分）
   - 渲染：按分配结果把块装进固定页高的双栏纸页

   可测接口：
   - buildPages(heights, usableHeight)：给定每块高度，纯函数贪心分页，
     供单元测试验证分配逻辑的正确性
   ========================================================= */

(function () {
  'use strict';

  var PAGE = {
    height: 780,        /* 页高 px（与 CSS .jpages .jpage 一致） */
    headerHeight: 32,   /* 续页页眉（页码|刊名|期）占位 */
    paddingBottom: 34   /* 页脚页码留白 */
  };

  function getUsableHeight() {
    /* 页高减去页眉与页脚页码占位，双栏容器里可容纳内容的实际高度 */
    return PAGE.height - PAGE.headerHeight - PAGE.paddingBottom;
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

  function isPageSafe(node) {
    if (!node || node.nodeType !== 1) return false;
    return /^(PRE|TABLE|FIGURE)$/.test(node.tagName) ||
      node.matches('.markdown-alert, .mermaid');
  }

  function collectBlocks(nodes) {
    return nodes.map(function (node) {
      if (isPageSafe(node)) {
        node.style.breakInside = 'avoid';
      }
      return node;
    });
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

    /* 1.5 剔除正文开头的冗余标题：文章标题已由刊头 .journal-title 呈现，
          markdown 正文里的首个 h1 是同一标题的重复，分页前移除。 */
    while (postBody.firstChild && postBody.firstChild.tagName === 'H1') {
      postBody.removeChild(postBody.firstChild);
    }

    /* 1. 提取顶级块（保留节点引用，从容器移出） */
    var blocks = [];
    while (postBody.firstChild) {
      blocks.push(postBody.firstChild);
      postBody.removeChild(postBody.firstChild);
    }
    blocks = collectBlocks(blocks);

    /* 2. 测量每块高度：clone 进隐藏测量容器（单栏自然流，读 offsetHeight）。
          测量容器宽度与正文容器一致，字体/行高从 .jpage 继承。 */
    var measure = document.createElement('div');
    measure.style.cssText =
      'position:absolute;visibility:hidden;left:-9999px;top:0;z-index:-1;' +
      'width:' + postBody.clientWidth + 'px;';
    var jpageRef = document.querySelector('.jpage.markdown-body');
    if (jpageRef) {
      var cs = window.getComputedStyle(jpageRef);
      measure.style.fontFamily = cs.fontFamily;
      measure.style.fontSize = cs.fontSize;
      measure.style.lineHeight = cs.lineHeight;
    }
    document.body.appendChild(measure);

    var heights = [];
    for (var i = 0; i < blocks.length; i++) {
      var clone = blocks[i].cloneNode(true);
      measure.appendChild(clone);
      heights.push(clone.offsetHeight || 20);
      measure.removeChild(clone);
    }
    document.body.removeChild(measure);

    /* 3. 分配页（纯函数，块不可拆分） */
    var pageAssign = buildPages(heights, getUsableHeight());

    /* 4. 渲染：按分配把块装进固定页高的纸页 */
    var jpages = document.createElement('div');
    jpages.className = 'jpages';

    for (var p = 0; p < pageAssign.length; p++) {
      var page = newPage(jpages, p);
      var assign = pageAssign[p].blocks;
      for (var b = 0; b < assign.length; b++) {
        page.appendChild(blocks[assign[b]]);
      }
    }

    /* 5. 替换正文容器 */
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
      /* 期号从模板刊头的 data-issue 读取（第X期 / No.X），与首页刊头保持一致；
         刊名取主刊头中栏文本。全部用 textContent 写入，避免拼 HTML 造成注入。 */
      var mastheadEl = document.querySelector('.journal-masthead');
      var issueName = mastheadEl ? mastheadEl.getAttribute('data-issue') : '';
      var nameEl = document.querySelector('.journal-masthead .mh-center');
      var name = nameEl ? nameEl.textContent : '';

      var pageSpan = document.createElement('span');
      pageSpan.className = 'mh-side';
      pageSpan.textContent = '— ' + (index + 1) + ' —';
      var centerSpan = document.createElement('span');
      centerSpan.className = 'mh-center';
      centerSpan.textContent = name;
      var issueSpan = document.createElement('span');
      issueSpan.className = 'mh-side';
      issueSpan.textContent = issueName;

      cont.appendChild(pageSpan);
      cont.appendChild(centerSpan);
      cont.appendChild(issueSpan);
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