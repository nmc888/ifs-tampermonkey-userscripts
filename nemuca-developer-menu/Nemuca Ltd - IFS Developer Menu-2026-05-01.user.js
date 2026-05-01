// ==UserScript==
// @name         Nemuca Ltd - IFS Developer Menu
// @namespace    http://nemuca.com
// @version      2026-05-01
// @description  Nemuca developer menu for IFS Cloud. Adds a quick access menu to clear caches and a return-to-top button on long-scroll pages.
// @author       Neil Carter (Nemuca Ltd)
// @match        https://*.ifs.cloud/*
// @icon         data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAQlBMVEVHcEzPDg7PDg7TDAzPDg7PDg7PDg7PDg7PDg7PDg7PDQ3PDg7PDg7PDQ3PDg7PDQ3PDg7PDg7PDg7PDg7PDg7PDg7kl/WXAAAAFXRSTlMA8EID+ZepWebSIjW/E4cLY1J5caKDX4LdAAAAxElEQVQ4y+1TyRaDIBAD2YalCKj//6u1w2IRvPfQ3CCZJMCDkAZmlpC836J9kQmY9Q74B1TLYCY0HBe4C70LU/roQeW3ybrBMcAt13yizZvzptC2+Zd5qsUWQpLVzpUUW/JdMAwDa2EuVlyLsrpasZhnAGsskPnuXMVVnptMdHkVCnvT08Kglqrbza0S5zwjEaVuuP62n/Dgfnib7KwNwQpcDYKcAZbstcz9+SohnwTiL/g5wf75jjATFMKqE3Hynx+JG96+xhv6LvXE5gAAAABJRU5ErkJggg==
// @grant        none

// ==/UserScript==

(() => {
    'use strict';

    const BTN_ID = 'nemuca-n-btn';
    const MENU_ID = 'nemuca-n-menu';
    const WRAP_ID = 'nemuca-n-item';
    const TOP_BTN_ID = 'nemuca-top-btn';
    const MDI_CSS = 'https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css';
    const LOGO = 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAQlBMVEVHcEzPDg7PDg7TDAzPDg7PDg7PDg7PDg7PDg7PDg7PDQ3PDg7PDg7PDQ3PDg7PDQ3PDg7PDg7PDg7PDg7PDg7PDg7kl/WXAAAAFXRSTlMA8EID+ZepWebSIjW/E4cLY1J5caKDX4LdAAAAxElEQVQ4y+1TyRaDIBAD2YalCKj//6u1w2IRvPfQ3CCZJMCDkAZmlpC836J9kQmY9Q74B1TLYCY0HBe4C70LU/roQeW3ybrBMcAt13yizZvzptC2+Zd5qsUWQpLVzpUUW/JdMAwDa2EuVlyLsrpasZhnAGsskPnuXMVVnptMdHkVCnvT08Kglqrbza0S5zwjEaVuuP62n/Dgfnib7KwNwQpcDYKcAZbstcz9+SohnwTiL/g5wf75jjATFMKqE3Hynx+JG96+xhv6LvXE5gAAAABJRU5ErkJggg==';

    //MDI icons from https://pictogrammers.com/library/mdi/
    //Use 'null' for separators in menu
    const LINKS = [
        ['OpenID Connect Discovery', '/.well-known/openid-configuration', 'mdi-identifier'],
        null,
        ['Clear Projection Cache', '/main/ifsapplications/projection/ClearCache?METHOD=CLEAR_PROJECTION_CACHE&VALUE=*', 'mdi-projector-screen'],
        ['Clear Client Cache', '/main/ifsapplications/web/server/clearmetadatacache?METHOD=CLEAR_CLIENT_LAYOUT_CACHE&VALUE=*', 'mdi-palette'],
        ['Clear Metadata Cache', '/main/ifsapplications/web/server/clearmetadatacache', 'mdi-cog-outline'],
        ['Clear Lobby Cache', '/main/ifsapplications/web/server/lobby/page/clear-cache', 'mdi-palette-advanced'],
        null,
        ['IFS Docs', 'https://docs.ifs.com/', 'mdi-book-open-variant'],
        ['IFS LEC', 'https://lifecycle.ifs.com/', 'mdi-crane'],
        null,
        ['nemuca.com', 'https://www.nemuca.com', 'mdi-web']
    ];

    const css = `
    :root {
      --nemuca-bg: var(--granite-color-background-variant, #fff);
      --nemuca-text: var(--granite-color-text, inherit);
      --nemuca-hover: var(--granite-color-signal-failure);
      --nemuca-separator: var(--granite-color-border-hard);
      --nemuca-shadow: 0 8px 20px rgba(0,0,0,.18);
      --nemuca-border: var(--granite-color-border-soft);
      --nemuca-top-bg: var(--granite-theme-button-background, var(--granite-color-background-variant, #fff));
    }

    #${MENU_ID} {
      position: fixed; z-index: 100000; min-width: 280px; margin: 0; padding: .2rem;
      list-style: none; background: var(--nemuca-bg); color: var(--nemuca-text);
      border: 1px solid var(--nemuca-border); border-radius: 8px; box-shadow: var(--nemuca-shadow);
    }
    #${MENU_ID} > li { list-style: none; }
    #${MENU_ID} [role="menuitem"] {
      display: flex; align-items: center; width: 100%; box-sizing: border-box;
      padding: .3rem; line-height: 1rem; color: inherit; text-decoration: none;
      white-space: nowrap; cursor: pointer; border: 0; background: transparent;
      font: inherit; font-size: small; gap: .65rem;
    }
    #${MENU_ID} [role="menuitem"]:hover,
    #${MENU_ID} [role="menuitem"]:focus { background: var(--nemuca-hover); outline: none; }
    #${MENU_ID} .mdi, #${TOP_BTN_ID} .mdi { flex: 0 0 auto; font-size: 18px; line-height: 1rem; opacity: .85; }
    #${MENU_ID} .label { flex: 1 1 auto; }
    #${MENU_ID} .separator { margin: .2rem 0; border-top: 1px solid var(--nemuca-separator); }

    #${TOP_BTN_ID} {
      position: fixed; right: 30px; bottom: 18px; z-index: 100001; display: none;
      align-items: center; justify-content: center; width: 44px; height: 44px;
      border: 0; border-radius: 999px; background: var(--nemuca-top-bg);
      color: var(--granite-color-text, #222); box-shadow: var(--nemuca-shadow);
      cursor: pointer; padding: 0;
    }
    #${TOP_BTN_ID}:hover,
    #${TOP_BTN_ID}:focus { background: var(--granite-color-signal-failure); outline: none; }
    #${TOP_BTN_ID} .mdi { color: inherit; opacity: 1; font-size: 18px; line-height: 1rem; }
    #${BTN_ID} img { display: block; margin: auto; pointer-events: none; }
  `;

    const addOnce = (id, tag, props = {}, parent = document.head) => {
        if (document.getElementById(id)) return null;
        const el = document.createElement(tag);
        el.id = id;
        Object.assign(el, props);
        parent.appendChild(el);
        return el;
    };

    const addStyles = () => addOnce('nemuca-style', 'style', { textContent: css });
    const addMdiStyles = () => addOnce('mdi-font-css', 'link', { rel: 'stylesheet', href: MDI_CSS });

    const closeMenu = () => {
        document.getElementById(MENU_ID)?.remove();
        document.getElementById(BTN_ID)?.setAttribute('aria-expanded', 'false');
    };

    const getStreamsLi = () => document.querySelector('button[aria-controls="fnd-streams-panel"]')?.closest('li.shell-header-icons');

    const makeButton = streamsLi => {
        const template = streamsLi?.querySelector('button');
        if (!template) return null;

        const btn = template.cloneNode(true);
        btn.id = BTN_ID;
        btn.removeAttribute('aria-controls');
        btn.setAttribute('aria-haspopup', 'true');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'Nemuca menu');
        btn.title = 'Nemuca menu';
        btn.querySelectorAll('granite-icon, img, svg, .notification-bubble, .notification-bubbles, .notification-bubble-container').forEach(n => n.remove());
        btn.textContent = '';

        const img = document.createElement('img');
        img.src = LOGO;
        img.alt = 'Nemuca';
        img.width = 20;
        img.height = 20;
        img.draggable = false;
        btn.appendChild(img);

        btn.addEventListener('click', e => {
            e.stopPropagation();
            document.getElementById(MENU_ID) ? closeMenu() : openMenu(btn);
        });

        return btn;
    };

    const makeItem = item => {
        const li = document.createElement('li');
        if (!item) {
            li.className = 'separator';
            li.setAttribute('role', 'separator');
            return li;
        }

        const [text, path, icon] = item;
        const a = document.createElement('a');
        a.className = 'granite-menu-item';
        a.setAttribute('granitemenuitem', '');
        a.setAttribute('role', 'menuitem');
        a.setAttribute('tabindex', '-1');
        a.href = new URL(path, location.origin).href;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        if (icon) {
            const i = document.createElement('span');
            i.className = `mdi ${icon}`;
            i.setAttribute('aria-hidden', 'true');
            a.appendChild(i);
        }
        const s = document.createElement('span');
        s.className = 'label';
        s.textContent = text;
        a.appendChild(s);
        a.addEventListener('click', closeMenu);
        li.appendChild(a);
        return li;
    };

    const makeMenu = () => {
        const menu = document.createElement('ul');
        menu.id = MENU_ID;
        menu.setAttribute('role', 'menu');
        menu.setAttribute('aria-labelledby', BTN_ID);
        LINKS.forEach(item => menu.appendChild(makeItem(item)));
        return menu;
    };

    const openMenu = btn => {
        closeMenu();
        const menu = makeMenu();
        document.body.appendChild(menu);
        const r = btn.getBoundingClientRect();
        menu.style.left = `${r.left}px`;
        menu.style.top = `${r.bottom + 4}px`;
        btn.setAttribute('aria-expanded', 'true');
    };

    const getScroller = () => {
        for (const sel of ['main', '.page', '.page-content', '.content', '.main-content', '.scroll-container', '.overflow-auto', '.overflow-y-auto', '[style*="overflow"]']) {
            for (const el of document.querySelectorAll(sel)) {
                const o = getComputedStyle(el).overflowY;
                if (/(auto|scroll|overlay)/.test(o) && el.scrollHeight > el.clientHeight + 20) return el;
            }
        }
        return window;
    };

    const metrics = () => {
        const s = getScroller();
        const top = s === window ? (scrollY || document.documentElement.scrollTop || 0) : s.scrollTop;
        const scrollable = s === window ? document.documentElement.scrollHeight > innerHeight + 20 : s.scrollHeight > s.clientHeight + 20;
        return { s, top, scrollable };
    };

    const updateTop = () => {
        const btn = document.getElementById(TOP_BTN_ID);
        if (btn) btn.style.display = metrics().scrollable && metrics().top > 200 ? 'flex' : 'none';
    };

    const makeTopButton = () => {
        const btn = document.createElement('button');
        btn.id = TOP_BTN_ID;
        btn.type = 'button';
        btn.title = 'Back to top';
        btn.setAttribute('aria-label', 'Scroll to top');

        const i = document.createElement('span');
        i.className = 'mdi mdi-arrow-up-bold';
        i.setAttribute('aria-hidden', 'true');
        btn.appendChild(i);

        btn.addEventListener('click', () => {
            const { s } = metrics();
            s === window ? scrollTo({ top: 0, behavior: 'smooth' }) : s.scrollTo({ top: 0, behavior: 'smooth' });
        });

        return btn;
    };

    const ensureTopButton = () => addOnce(TOP_BTN_ID, 'button', {}, document.body) || document.body.appendChild(makeTopButton());
    const addTopButtonIfMissing = () => {
        if (document.getElementById(TOP_BTN_ID)) return;
        document.body.appendChild(makeTopButton());
    };

    let currentScroller = null;
    const bindScroll = () => {
        const next = getScroller();
        if (next === currentScroller) return;

        if (currentScroller === window) window.removeEventListener('scroll', updateTop);
        else if (currentScroller) currentScroller.removeEventListener('scroll', updateTop);

        currentScroller = next;
        (currentScroller === window ? window : currentScroller).addEventListener('scroll', updateTop, { passive: true });
    };

    const watch = () => {
        new MutationObserver(() => {
            bindScroll();
            updateTop();
            insertButton();
        }).observe(document.body, { childList: true, subtree: true, attributes: true });

        new ResizeObserver(() => {
            bindScroll();
            updateTop();
        }).observe(document.body);

        new ResizeObserver(updateTop).observe(document.documentElement);
    };

    const insertButton = () => {
        if (document.getElementById(WRAP_ID)) return;
        const streamsLi = getStreamsLi();
        if (!streamsLi) return;
        const wrap = streamsLi.cloneNode(false);
        wrap.id = WRAP_ID;
        const btn = makeButton(streamsLi);
        if (!btn) return;
        wrap.appendChild(btn);
        streamsLi.insertAdjacentElement('afterend', wrap);
    };

    document.addEventListener('click', e => {
        if (!e.target.closest('#' + BTN_ID) && !e.target.closest('#' + MENU_ID)) closeMenu();
    });

    document.addEventListener('keydown', e => e.key === 'Escape' && closeMenu());
    window.addEventListener('resize', updateTop, { passive: true });

    const boot = () => {
        addStyles();
        addMdiStyles();
        addTopButtonIfMissing();
        bindScroll();
        watch();
        updateTop();
        insertButton();
    };

    document.readyState === 'complete'
        ? setTimeout(boot, 300)
    : window.addEventListener('load', () => setTimeout(boot, 300), { once: true });
})();