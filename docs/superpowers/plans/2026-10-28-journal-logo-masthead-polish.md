# Journal Logo Masthead Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 Journal of Earth 的透明 logo、双语期号和续页刊头整合进文章页，同时保持论文式正文、元信息和页脚结构稳定。

**Architecture:** `templates/post.html` 负责语义结构与数据绑定，`static/assets/journal-style.css` 负责视觉呈现，`static/assets/journal-paginate.js` 负责续页刊头数据。logo 使用仓库内静态资源，不依赖 GitHub 临时附件；Emeek 是源仓库，Earth 同步相同模板资源供部署覆盖使用。

**Tech Stack:** Jinja2 templates, CSS, vanilla JavaScript, Python pytest contract tests, headless Chrome DOM verification.

## Global Constraints

- 保留现有 `journalMeta` 字段语义，不伪造卷期、DOI、中图分类号或文章编号。
- logo 使用透明 PNG，默认宽度不超过刊头纸张内容宽度，移动端必须缩小并保持比例。
- Emeek 与 Earth 的 `templates/post.html`、`static/assets/journal-style.css`、`static/assets/journal-paginate.js` 必须保持同步。
- 分页仍在 `window.innerWidth <= 720` 时关闭，移动端自然流动。
- 新增行为必须先有失败测试；完成前必须运行 pytest、静态同步检查和线上/本地 DOM 验证。
- 代码注释使用中文，生产文件保持现有 ASCII/UTF-8 风格。

---

### Task 1: Add failing contract tests for masthead semantics

**Files:**
- Modify: `tests/test_journal_layout_contract.py`
- Modify: `tests/test_journal_paginate.py`
- Read: `templates/post.html`, `static/assets/journal-paginate.js`

**Interfaces:**
- Consumes: current Jinja template and pagination source text.
- Produces: contract assertions for logo markup, bilingual issue row, and continuation issue text.

- [ ] **Step 1: Write the failing tests**

Add tests that assert:

```python
def test_post_template_contains_local_logo_and_bilingual_issue_row():
    source = Path("templates/post.html").read_text(encoding="utf-8")
    assert 'class="journal-logo"' in source
    assert 'journal-issue-prefix' in source
    assert "第{{ blogBase['createdDate'][5:7]|int }}期" in source


def test_paginator_continuation_header_contains_issue_number():
    source = Path("static/assets/journal-paginate.js").read_text(encoding="utf-8")
    assert "issueName" in source
    assert "No." in source
```

Use the existing test module style and `Path` import already used by the repository. Keep assertions structural rather than testing generated HTML through network fixtures.

- [ ] **Step 2: Run tests to verify the new tests fail**

Run:

```bash
cd /Users/jason/Documents/Blog/Emeek
python3 -m pytest tests/test_journal_layout_contract.py tests/test_journal_paginate.py -q
```

Expected: the existing tests may run, while the two new assertions fail because the template and paginator do not yet contain the new logo/issue contract. If collection fails because the repository's GitHub client dependency is unavailable, run the two files individually and record the collection error separately.

- [ ] **Step 3: Commit the red tests**

```bash
git add tests/test_journal_layout_contract.py tests/test_journal_paginate.py
git commit -m "test(journal): define logo masthead contract"
```

---

### Task 2: Implement logo and masthead structure

**Files:**
- Create: `static/assets/journal-logo.png` (the supplied transparent logo, cropped and resized to 800x191 or smaller)
- Modify: `templates/post.html:64-75`
- Modify: `static/assets/journal-paginate.js:139-155`
- Test: `tests/test_journal_layout_contract.py`, `tests/test_journal_paginate.py`

**Interfaces:**
- Consumes: `blogBase['homeUrl']`, `blogBase['title']`, `blogBase['createdDate']`, and the existing `.journal-masthead` structure.
- Produces: `.journal-logo-link > .journal-logo`, `.journal-issue-prefix`, and continuation headers showing `第X期` and `No.X`.

- [ ] **Step 1: Add semantic masthead markup**

In `templates/post.html`, make the masthead contain a centered logo link before the date rows:

```html
<a class="journal-logo-link" href="{{ blogBase['homeUrl'] }}" aria-label="{{ blogBase['title'] }}">
    <img class="journal-logo" src="{{ blogBase['homeUrl'] }}/assets/journal-logo.png" alt="{{ blogBase['title'] }}">
</a>
```

In the second `.mh-row journal-issue`, render the real month-derived issue number on both sides:

```html
<div class="mh-row journal-issue">
    <span class="mh-side journal-issue-prefix">{% if blogBase.get('createdDate','')!='' %}第{{ blogBase['createdDate'][5:7]|int }}期{% endif %}</span>
    <span class="mh-center"></span>
    <span class="mh-side">{% if blogBase.get('createdDate','')!='' %}No.{{ blogBase['createdDate'][5:7]|int }}{% endif %}</span>
</div>
```

Keep the text center empty so the logo owns the visual center and the row remains balanced.

- [ ] **Step 2: Add continuation header data**

Update `newPage()` in `journal-paginate.js` to read the masthead center text, derive the same issue number from `blogBase`-rendered markup, and emit escaped text nodes rather than interpolating unsanitized HTML. The continuation header must have this shape:

```html
<div class="cont-masthead">
  <span class="mh-side">— 2 —</span>
  <span class="mh-center">Journal of Earth</span>
  <span class="mh-side">第7期 / No.7</span>
</div>
```

Use DOM element creation and `textContent` for all three values. Add a `data-issue` attribute to `.journal-masthead` in the template so the paginator can consume the issue without parsing visible text.

- [ ] **Step 3: Run the focused tests to verify they pass**

Run:

```bash
cd /Users/jason/Documents/Blog/Emeek
python3 -m pytest tests/test_journal_layout_contract.py tests/test_journal_paginate.py -q
```

Expected: PASS for the new contract assertions and all existing focused tests.

- [ ] **Step 4: Commit the implementation**

```bash
git add templates/post.html static/assets/journal-paginate.js static/assets/journal-logo.png tests/test_journal_layout_contract.py tests/test_journal_paginate.py
git commit -m "feat(journal): add logo and bilingual masthead"
```

---

### Task 3: Polish the journal CSS

**Files:**
- Modify: `static/assets/journal-style.css:54-75, 380-388`
- Modify: `templates/post.html:36` only if the logo URL needs a CSS-safe fallback
- Test: `tests/test_journal_layout_contract.py`

**Interfaces:**
- Consumes: `.journal-logo-link`, `.journal-logo`, `.journal-issue-prefix`, existing paper variables.
- Produces: stable desktop and mobile logo sizing, balanced masthead spacing, visible keyboard focus, and no layout overflow.

- [ ] **Step 1: Add CSS contract assertions**

Add assertions for the selectors and responsive constraints:

```python
def test_journal_styles_define_logo_responsive_rules():
    source = Path("static/assets/journal-style.css").read_text(encoding="utf-8")
    assert ".journal-logo" in source
    assert "max-width: min(100%, 420px)" in source
    assert "object-fit: contain" in source
    assert ".journal-logo-link:focus-visible" in source
```

- [ ] **Step 2: Run the CSS contract test to verify it fails**

Run:

```bash
cd /Users/jason/Documents/Blog/Emeek
python3 -m pytest tests/test_journal_layout_contract.py -q
```

Expected: FAIL on the missing logo CSS selectors.

- [ ] **Step 3: Implement the CSS**

Add styles after the masthead base rule:

```css
.journal-logo-link {
  display: block;
  width: fit-content;
  max-width: 100%;
  margin: 0 auto 12px;
  line-height: 0;
}
.journal-logo {
  display: block;
  width: 420px;
  max-width: min(100%, 420px);
  height: auto;
  object-fit: contain;
}
.journal-logo-link:focus-visible {
  outline: 2px solid var(--journal-accent, #bc4c00);
  outline-offset: 4px;
}
.journal-issue { font-size: 11px; }
.journal-issue-prefix { letter-spacing: 0.08em; }
```

Update the mobile media query with `width: min(100%, 280px)` and `max-width: 100%` for `.journal-logo`.

- [ ] **Step 4: Run focused tests and inspect CSS**

Run:

```bash
cd /Users/jason/Documents/Blog/Emeek
python3 -m pytest tests/test_journal_layout_contract.py -q
```

Expected: PASS with no new failures.

- [ ] **Step 5: Commit the CSS**

```bash
git add static/assets/journal-style.css tests/test_journal_layout_contract.py
 git commit -m "style(journal): refine logo masthead spacing"
```

---

### Task 4: Synchronize Earth deployment assets and preview

**Files:**
- Create: `Earth/static/assets/journal-logo.png`
- Modify: `Earth/templates/post.html` only if the Earth checkout carries a tracked template override; otherwise verify no override is needed
- Modify: `design-post-result.html` to demonstrate logo and bilingual issue row
- Modify: `Earth/static/assets/journal-style.css` and `Earth/static/assets/journal-paginate.js` by exact copy from Emeek

**Interfaces:**
- Consumes: the committed Emeek template/assets and the existing Earth static override behavior.
- Produces: deployment-ready Earth assets whose checksums match Emeek assets.

- [ ] **Step 1: Copy source assets into Earth**

```bash
cp /Users/jason/Documents/Blog/Emeek/static/assets/journal-logo.png /Users/jason/Documents/Blog/Earth/static/assets/journal-logo.png
cp /Users/jason/Documents/Blog/Emeek/static/assets/journal-style.css /Users/jason/Documents/Blog/Earth/static/assets/journal-style.css
cp /Users/jason/Documents/Blog/Emeek/static/assets/journal-paginate.js /Users/jason/Documents/Blog/Earth/static/assets/journal-paginate.js
```

Copy `templates/post.html` into the Emeek source only; Earth receives generated HTML through the workflow and must not get an untracked template copy.

- [ ] **Step 2: Update the local result preview**

Add the logo link and `第10期` left issue text to `design-post-result.html`, and use the same local asset path `static/assets/journal-logo.png` relative to the Emeek root. Keep the preview self-contained and do not add explanatory UI to production templates.

- [ ] **Step 3: Verify source/deployment checksums**

Run:

```bash
cmp /Users/jason/Documents/Blog/Emeek/static/assets/journal-style.css /Users/jason/Documents/Blog/Earth/static/assets/journal-style.css
cmp /Users/jason/Documents/Blog/Emeek/static/assets/journal-paginate.js /Users/jason/Documents/Blog/Earth/static/assets/journal-paginate.js
cmp /Users/jason/Documents/Blog/Emeek/static/assets/journal-logo.png /Users/jason/Documents/Blog/Earth/static/assets/journal-logo.png
```

Expected: all commands exit 0 with no output.

- [ ] **Step 4: Commit Earth synchronization and preview**

```bash
cd /Users/jason/Documents/Blog/Earth
git add static/assets/journal-logo.png static/assets/journal-style.css static/assets/journal-paginate.js
git commit -m "feat(journal): sync logo masthead assets"
cd /Users/jason/Documents/Blog/Emeek
git add design-post-result.html
git commit -m "docs(journal): update logo masthead preview"
```

---

### Task 5: Verify build and browser-visible behavior

**Files:**
- Verify only: `templates/post.html`, `static/assets/journal-style.css`, `static/assets/journal-paginate.js`, `Earth/static/assets/*`

**Interfaces:**
- Consumes: committed source and synchronized deployment assets.
- Produces: test evidence for semantic markup, responsive CSS, and rendered DOM.

- [ ] **Step 1: Run focused and available full tests**

```bash
cd /Users/jason/Documents/Blog/Emeek
python3 -m pytest tests/test_journal_layout_contract.py tests/test_journal_paginate.py tests/test_markdown_adapter_contract.py -q
```

Expected: all selected tests pass. Run the full suite separately and report any pre-existing collection failure from the GitHub dependency rather than masking it.

- [ ] **Step 2: Validate local preview in headless Chrome**

Serve the Emeek directory with the existing preview mechanism or open the static `design-post-result.html`, then verify:

```javascript
({
  logo: document.querySelector('.journal-logo')?.getAttribute('src'),
  issuePrefix: document.querySelector('.journal-issue-prefix')?.textContent.trim(),
  issueNumber: document.querySelector('.journal-masthead')?.dataset.issue,
  overflow: document.querySelector('.journal-logo')?.getBoundingClientRect().right > document.querySelector('#journalPaper')?.getBoundingClientRect().right
})
```

Expected: local logo path is present, issue prefix is `第10期`, issue data is present, and `overflow` is `false`.

- [ ] **Step 3: Validate online generated DOM after deployment**

Use the existing headless Chrome command against the live article URL after the Earth workflow rebuilds. Confirm the rendered DOM contains exactly one `.journal-logo`, a non-empty `.journal-issue-prefix`, and the expected `.jpages` structure. Also check a mobile viewport where `.jpages` is absent and the article body remains naturally flowing.

- [ ] **Step 4: Report verification truthfully**

Report the exact focused test result, any full-suite pre-existing error, source/deployment checksum result, and whether online verification was run before the workflow completed.
