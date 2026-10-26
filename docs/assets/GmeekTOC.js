function createTOC() {
    var tocElement = document.createElement('div');
    tocElement.className = 'toc';
    var contentContainer = document.getElementById('content');
    
    const headings = contentContainer.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    if (headings.length === 0) {
        return;  // 如果没有标题元素，则不创建TOC
    }
    
    tocElement.insertAdjacentHTML('afterbegin', '<div class="toc-title">文章目录</div>');
    
    headings.forEach(heading => {
        if (!heading.id) {
            const baseId = heading.textContent.trim().replace(/\s+/g, '-').toLowerCase() || 'section';
            let id = baseId;
            let suffix = 1;
            while (document.getElementById(id)) {
                id = `${baseId}-${suffix++}`;
            }
            heading.id = id;
        }
        const link = document.createElement('a');
        link.href = '#' + heading.id;
        link.textContent = heading.textContent;
        link.className = 'toc-link';
        link.style.paddingLeft = `${(parseInt(heading.tagName.charAt(1)) - 1) * 10}px`;
        tocElement.appendChild(link);
    });
    
    tocElement.insertAdjacentHTML('beforeend', '<a class="toc-end" onclick="window.scrollTo({top:0,behavior: \'smooth\'});">Top</a>');
    contentContainer.prepend(tocElement);
}

document.addEventListener("DOMContentLoaded", function() {
    createTOC();
    var css = `
    .toc {
        position: fixed;
        z-index: 20;
        top: 130px;
        right: 24px;
        left: auto;
        transform: none;
        box-sizing: border-box;
        width: 222px;
        max-width: calc(100vw - 48px);
        border: 1px solid #e1e4e8;
        border-radius: 6px;
        padding: 10px;
        overflow-y: auto;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        max-height: 70vh;
        background: var(--bgColor-default, #fff);
    }
    .toc-title{
        font-weight: bold;
        text-align: center;
        border-bottom: 1px solid #ddd;
        padding-bottom: 8px;
    }
    .toc-end{
        font-weight: bold;
        text-align: center;
        cursor: pointer;
        visibility: hidden;
    }
    .toc a {
        display: block;
        color: var(--fgColor-accent, var(--color-accent-fg, #0969da));
        text-decoration: none;
        padding: 5px 0;
        font-size: 14px;
        line-height: 1.5;
        border-bottom: 1px solid #e1e4e8;
    }
    .toc a:last-child { border-bottom: none; }
    .toc a:hover { background-color: var(--bgColor-accent-muted, #ddf4ff); }

    @media (max-width: 1249px) {
        .toc {
            position: static !important;
            top: auto !important;
            right: auto !important;
            left: auto !important;
            transform: none !important;
            width: auto;
            max-width: none;
            padding: 10px;
            margin: 16px 0 20px;
        }
    }`;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    window.onscroll = function() {
        const backToTopButton = document.querySelector('.toc-end');
        if (backToTopButton && (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20)) {
            backToTopButton.style="visibility: visible;"
        } else if (backToTopButton) {
            backToTopButton.style="visibility: hidden;"
        }
    };

    console.log("\n %c GmeekTOC Plugins https://github.com/Meekdai/Gmeek \n","padding:5px 0;background:#C333D0;color:#fff");
});
