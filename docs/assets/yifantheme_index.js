const style = document.createElement("style");
style.innerHTML = `
:root {
    --primary-color: #2563eb;
    --primary-hover: #1d4ed8;
    --secondary-color: #64748b;
    --accent-color: #06b6d4;
    --bg-gradient-start: #f8fafc;
    --bg-gradient-end: #e2e8f0;
    --card-bg: rgba(255, 255, 255, 0.95);
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    --radius-sm: 0.375rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    --radius-xl: 1rem;
    --radius-full: 9999px;
    --transition-fast: 150ms ease-in-out;
    --transition-normal: 300ms ease-in-out;
    --transition-slow: 500ms ease-in-out;
}

html[data-color-mode="dark"] {
    --primary-color: #3b82f6;
    --primary-hover: #60a5fa;
    --secondary-color: #94a3b8;
    --accent-color: #22d3ee;
    --bg-gradient-start: #0f172a;
    --bg-gradient-end: #1e293b;
    --card-bg: rgba(30, 41, 59, 0.95);
}

html {
    background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
    min-height: 100vh;
}

body {
    margin: 2rem auto;
    padding: 1.5rem;
    font-size: 16px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
    line-height: 1.6;
    background: var(--card-bg);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xl);
    max-width: 900px;
    min-height: calc(100vh - 4rem);
    backdrop-filter: blur(10px);
}

#header {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    margin-bottom: 2rem;
    position: relative;
}

#header h1 {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    margin: 0;
}

.avatar {
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: var(--radius-full);
    border: 4px solid var(--primary-color);
    box-shadow: var(--shadow-lg);
    transition: transform var(--transition-normal), box-shadow var(--transition-normal);
}

.avatar:hover {
    transform: scale(1.05);
    box-shadow: var(--shadow-xl);
}

#header h1 a {
    color: inherit;
    text-decoration: none;
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
}

.title-right {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
}

.title-right .btn {
    padding: 0.5rem 1rem;
    border-radius: var(--radius-full);
    background: rgba(0, 0, 0, 0.05);
    border: none;
    cursor: pointer;
    transition: all var(--transition-fast);
    color: var(--secondary-color);
}

.title-right .btn:hover {
    background: var(--primary-color);
    color: white;
    transform: translateY(-2px);
}

#content > div:first-of-type {
    text-align: center;
    color: var(--secondary-color);
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: rgba(37, 99, 235, 0.05);
    border-radius: var(--radius-lg);
}

.SideNav {
    background: rgba(0, 0, 0, 0.02);
    border-radius: var(--radius-xl);
    border: 1px solid rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

.SideNav-item {
    padding: 0.875rem 1rem;
    transition: all var(--transition-fast);
    border-bottom: 1px solid rgba(0, 0, 0, 0.03);
}

.SideNav-item:last-child {
    border-bottom: none;
}

.SideNav-item:hover {
    background: linear-gradient(90deg, rgba(37, 99, 235, 0.1) 0%, transparent 100%);
    transform: translateX(4px);
    border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
}

.SideNav-item a {
    color: inherit;
    text-decoration: none;
}

.SideNav-icon {
    margin-right: 0.75rem;
    color: var(--primary-color);
    flex-shrink: 0;
}

.listTitle {
    font-weight: 500;
    color: inherit;
}

.listLabels {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.Label {
    padding: 0.25rem 0.625rem;
    border-radius: var(--radius-full);
    font-size: 0.75rem;
    font-weight: 500;
}

.LabelName {
    background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
    color: white !important;
}

.LabelName a {
    color: white !important;
}

.LabelTime {
    background: rgba(0, 0, 0, 0.08);
    color: var(--secondary-color);
}

.paginate-container {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
}

.pagination {
    display: flex;
    gap: 0.5rem;
}

.pagination a,
.pagination span {
    padding: 0.5rem 1rem;
    border-radius: var(--radius-md);
    text-decoration: none;
    transition: all var(--transition-fast);
}

.pagination a {
    background: rgba(37, 99, 235, 0.1);
    color: var(--primary-color);
}

.pagination a:hover {
    background: var(--primary-color);
    color: white;
    transform: translateY(-2px);
}

.pagination span {
    background: rgba(0, 0, 0, 0.05);
    color: var(--secondary-color);
    cursor: not-allowed;
}

#footer {
    margin-top: 3rem;
    text-align: center;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
}

#footer1 {
    font-size: 0.875rem;
    color: var(--secondary-color);
    margin-bottom: 0.5rem;
}

#footer2 {
    font-size: 0.75rem;
    color: var(--secondary-color);
    opacity: 0.7;
}

#footer a {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 500;
}

#footer a:hover {
    text-decoration: underline;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.SideNav-item {
    animation: fadeIn 0.5s ease-out forwards;
    opacity: 0;
}

.SideNav-item:nth-child(1) { animation-delay: 0.05s; }
.SideNav-item:nth-child(2) { animation-delay: 0.1s; }
.SideNav-item:nth-child(3) { animation-delay: 0.15s; }
.SideNav-item:nth-child(4) { animation-delay: 0.2s; }
.SideNav-item:nth-child(5) { animation-delay: 0.25s; }
.SideNav-item:nth-child(6) { animation-delay: 0.3s; }
.SideNav-item:nth-child(7) { animation-delay: 0.35s; }
.SideNav-item:nth-child(8) { animation-delay: 0.4s; }
.SideNav-item:nth-child(9) { animation-delay: 0.45s; }
.SideNav-item:nth-child(10) { animation-delay: 0.5s; }

@media (max-width: 640px) {
    body {
        margin: 0.5rem;
        padding: 1rem;
        border-radius: var(--radius-lg);
    }

    #header {
        padding: 1.5rem 0;
    }

    .avatar {
        width: 80px;
        height: 80px;
        border-width: 3px;
    }

    #header h1 a {
        font-size: 1.5rem;
    }

    .SideNav-item {
        padding: 0.75rem;
    }

    .LabelTime {
        display: none;
    }

    .title-right .btn {
        padding: 0.4rem 0.8rem;
    }
}

@media (max-width: 480px) {
    #header h1 a {
        font-size: 1.25rem;
    }

    .SideNav-icon {
        display: none;
    }

    .listTitle {
        font-size: 0.875rem;
    }
}
`;
document.head.appendChild(style);