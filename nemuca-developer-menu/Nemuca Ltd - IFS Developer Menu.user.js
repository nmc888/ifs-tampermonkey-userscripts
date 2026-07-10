// ==UserScript==
// @name         Nemuca Ltd - IFS Developer Menu
// @namespace    http://nemuca.com
// @version      2026-07-10
// @description  Nemuca developer menu for IFS Cloud. Adds a quick access menu to clear caches, an environment badge, a breadcrumb copy button, and a return-to-top button. Aligned label colours with Buddy banner defaults.
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
const ENV_BADGE_ID = 'nemuca-env-badge';
const LOGO = 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAQlBMVEVHcEzPDg7PDg7TDAzPDg7PDg7PDg7PDg7PDg7PDg7PDQ3PDg7PDg7PDQ3PDg7PDQ3PDg7PDg7PDg7PDg7PDg7PDg7kl/WXAAAAFXRSTlMA8EID+ZepWebSIjW/E4cLY1J5caKDX4LdAAAAxElEQVQ4y+1TyRaDIBAD2YalCKj//6u1w2IRvPfQ3CCZJMCDkAZmlpC836J9kQmY9Q74B1TLYCY0HBe4C70LU/roQeW3ybrBMcAt13yizZvzptC2+Zd5qsUWQpLVzpUUW/JdMAwDa2EuVlyLsrpasZhnAGsskPnuXMVVnptMdHkVCnvT08Kglqrbza0S5zwjEaVuuP62n/Dgfnib7KwNwQpcDYKcAZbstcz9+SohnwTiL/g5wf75jjATFMKqE3Hynx+JG96+xhv6LvXE5gAAAABJRU5ErkJggg==';

    //Find Granite icon library at <server>/main/ifsapplications/web/iconlibrary
const LINKS = [
  ['OpenID Connect Discovery', '/.well-known/openid-configuration', 'identification'],
  null,
  ['Clear Projection Cache', '/main/ifsapplications/projection/ClearCache?METHOD=CLEAR_PROJECTION_CACHE&VALUE=*', 'movie-alt'],
  ['Clear Client Cache', '/main/ifsapplications/web/server/clearmetadatacache?METHOD=CLEAR_CLIENT_LAYOUT_CACHE&VALUE=*', 'palette'],
  ['Clear Metadata Cache', '/main/ifsapplications/web/server/clearmetadatacache', 'refresh'],
  ['Clear Lobby Cache', '/main/ifsapplications/web/server/lobby/page/clear-cache', 'lobby-analog-gauge'],
  ['Refresh Server Cache', '/main/ifsapplications/web/page/RefreshServerCache/Form', 'gears'],
    null,
  ['Projection: __PROJECTION__', null, null],
  ['Projection Summary', "/main/ifsapplications/web/page/PermissionSetHandling/ProjectionSummary;$filter=ProjectionName%20eq%20'__PROJECTION__'", 'unlocked'],
  ['Page Configurations', "/main/ifsapplications/web/page/ConfigurationHandling/PageConfigurations;$filter=ProjectionName%20eq%20'__PROJECTION__'", 'page-settings'],
  ['API Explorer', "/main/ifsapplications/web/page/ProjectionExplorer/ProjExplorerPage;$filter=ProjectionName%20eq%20'__PROJECTION__'", 'channels'],
    null,
  ['IFS Docs', 'https://docs.ifs.com/', 'documents'],
  ['IFS Tech Docs', '__TECHDOC__', 'document-gear'],
  ['IFS LEC', 'https://lifecycle.ifs.com/', 'boxes'],
  ['IFS Community', 'https://community.ifs.com/', 'people'],
  ['IFS Service Center', 'https://support.ifs.com/csm', 'callcenter'],
  ['Azure DevOps', 'https://dev.azure.com/', 'branch'],
  null,
  ['nemuca.com', 'https://www.nemuca.com', 'lobby-web-1']
];

const ENVIRONMENTS = [
  ['prod', 'PROD', 'var(--granite-color-signal-failure, #ef4444)'],
  ['cfg', 'CFG', 'var(--granite-color-info, #3b82f6)'],
  ['uat', 'UAT', 'var(--granite-color-warning, #f97316)'],
  ['trn', 'TRN', 'var(--granite-color-ifs-purple, #a855f7)'],
  ['stg', 'STG', 'var(--granite-color-state-closed, #1e1e1e)'],
  ['cst', 'CUST', 'var(--granite-color-ifs-purple, #a855f7)'],
];

const css = `
:root {
  --nemuca-bg: var(--granite-color-background-variant, #fff);
  --nemuca-text: var(--granite-color-text, inherit);
  --nemuca-hover: var(--granite-color-signal-failure, #c62828);
  --nemuca-separator: var(--granite-color-border-hard);
  --nemuca-shadow: 0 8px 20px rgba(0,0,0,.18);
  --nemuca-border: var(--granite-color-border-soft);
  --nemuca-top-bg: var(--granite-theme-button-background, var(--granite-color-background-variant, #fff));
}

#${WRAP_ID} {
  display: inline-flex;
  align-items: center;
  margin-left: .75rem;
  flex: 0 0 auto;
}

#${BTN_ID} {
  width: 2.875rem;
  height: 2.875rem;
  min-width: 2.875rem;
  padding: 0;
  margin: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border: none;
  background-color: var(--fnd-branding-w-100-color, var(--granite-color-background));
  color: var(--fnd-branding-w-110-color, var(--granite-color-text));
  outline: none;
  cursor: pointer;
}

@media (hover: hover) and (pointer: fine) {
  #${BTN_ID}:hover:not(.granite-button-disabled) {
    background-color: var(--granite-color-background-selected);
    color: var(--granite-color-text-on-active, #fff);
    outline: none;
  }
}

#${BTN_ID}:active:not(.granite-button-disabled),
#${BTN_ID}[aria-expanded="true"] {
  background-color:  var(--granite-color-background-selected);
  color: var(--granite-color-text-on-active, var(--granite-color-focus));
  outline: none;
}

#${BTN_ID} img {
  display: block;
  margin: auto;
  pointer-events: none;
}

#${ENV_BADGE_ID} {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 1.5rem;
  padding: 0 var(--granite-spacing-8, .5rem);
  margin: 0;
  border-radius: var(--granite-radius-l, .5rem);
  line-height: 1.5rem;
  font-size: var(--granite-font-size-body-small, .875rem);
  font-weight: var(--granite-font-weight-bold, 600);
  white-space: nowrap;
  box-sizing: border-box;
}

#${MENU_ID} {
  position: fixed;
  z-index: 100000;
  min-width: 280px;
  margin: 0;
  padding: .2rem;
  list-style: none;
  background: var(--nemuca-bg);
  color: var(--nemuca-text);
  border: 1px solid var(--nemuca-border);
  border-radius: 8px;
  box-shadow: var(--nemuca-shadow);
}

#${MENU_ID} > li {
  list-style: none;
}

#${MENU_ID} [role="menuitem"] {
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  padding: .1rem;
  line-height: 1rem;
  color: inherit;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  border: 0;
  background: transparent;
  font: inherit;
  font-size: small;
  gap: .65rem;
}

#${MENU_ID} [role="menuitem"]:hover,
#${MENU_ID} [role="menuitem"]:focus {
  background: var(--nemuca-hover);
  outline: none;
}

#${MENU_ID} granite-icon,
#${TOP_BTN_ID} granite-icon {
  flex: 0 0 auto;
  font-size: 18px;
  line-height: 1rem;
  opacity: .85;
}

#${MENU_ID} .label {
  flex: 1 1 auto;
}

#${MENU_ID} .separator {
  margin: .2rem 0;
  border-top: 1px solid var(--nemuca-separator);
}

#${MENU_ID} .menu-static {
  padding: .2rem;
  font-size: small;
  color: var(--nemuca-text);
  opacity: .75;
  white-space: nowrap;
  cursor: default;
}

#${TOP_BTN_ID} {
  position: fixed;
  right: 30px;
  bottom: 18px;
  z-index: 100001;
  display: none;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 999px;
  background: var(--nemuca-top-bg);
  color: var(--granite-color-text, #222);
  box-shadow: var(--nemuca-shadow);
  cursor: pointer;
  padding: 0;
}

#${TOP_BTN_ID}:hover,
#${TOP_BTN_ID}:focus {
  background: var(--granite-color-signal-failure, #c62828);
  outline: none;
}

#${TOP_BTN_ID} granite-icon {
  color: inherit;
  opacity: 1;
  font-size: 18px;
  line-height: 1rem;
}

.nemuca-breadcrumb-copy {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--fnd-branding-w-410-color, var(--granite-color-text-weak));
  cursor: pointer;
  vertical-align: middle;
  padding: 0;
}

.nemuca-breadcrumb-copy:hover {
  color: var(--granite-color-signal-failure);
}

.nemuca-breadcrumb-copy:active {
  color: var(--granite-color-signal-ok);
}

.nemuca-breadcrumb-copy granite-icon {
  outline: none;
  line-height: 1;
  opacity: 1;
}
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

const closeMenu = () => {
  document.getElementById(MENU_ID)?.remove();
  document.getElementById(BTN_ID)?.setAttribute('aria-expanded', 'false');
};

const LANDING_PAGE_URL = new URL('/landing-page', window.location.origin).href;

const techDocState = {
  href: null,
  version: null
};

async function loadTechDocInfo() {
  try {
    const res = await fetch(LANDING_PAGE_URL, { credentials: 'include' });
    const html = await res.text();

    const doc = new DOMParser().parseFromString(html, 'text/html');
    const link = doc.getElementById('techdoclink');
    if (!link?.href) return;

    const href = link.href;
    const url = new URL(href);
    const parts = url.pathname.split('/').filter(Boolean);
    const version = parts[parts.length - 1] || null;

    techDocState.href = href;
    techDocState.version = version;
  } catch (err) {
    console.warn('Nemuca: unable to load tech doc info', err);
  }
}

const projectionState = {
  name: null
};

const getProjectionFromUrl = (href = window.location.href) => {
  try {
    const url = new URL(href);
    const parts = url.pathname.split('/').filter(Boolean);
    const pageIndex = parts.indexOf('page');
    if (pageIndex === -1) return null;

    const projection = parts[pageIndex + 1] || null;
    if (!projection) return null;

    return /Handling$/i.test(projection) ? projection : projection;
  } catch {
    return null;
  }
};

const refreshProjectionState = () => {
  projectionState.name = getProjectionFromUrl();
  return projectionState.name;
};

const getStreamsLi = () => document.querySelector('button[aria-controls="fnd-streams-panel"]')?.closest('li.shell-header-icons');

const getTopBarCenter = () => document.querySelector('.shell-top-bar-center');

const getHeaderInjectionHost = () => {
  const center = getTopBarCenter();
  if (!center) return null;
  return center.parentElement || center.closest('header');
};

const ensureWrap = () => {
  let wrap = document.getElementById(WRAP_ID);
  if (wrap) return wrap;

  const center = getTopBarCenter();
  const host = getHeaderInjectionHost();
  if (!center || !host) return null;

  wrap = document.createElement('div');
  wrap.id = WRAP_ID;
  center.insertAdjacentElement('afterend', wrap);
  return wrap;
};

const makeGraniteIcon = iconName => {
  const icon = document.createElement('granite-icon');
  icon.className = 'granite-icon';
  icon.setAttribute('role', 'img');
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = iconName;
  return icon;
};

const applyToolbarButtonClasses = btn => {
  btn.className = 'granite-button-base button granite-toolbar-button';
  btn.setAttribute('granitetoolbarbutton', '');
  return btn;
};

const makeFallbackButton = () => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.id = BTN_ID;
  btn.setAttribute('aria-haspopup', 'true');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-label', 'Nemuca menu');
  btn.title = 'Nemuca menu';

  applyToolbarButtonClasses(btn);

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

const makeButton = streamsLi => {
  const template = streamsLi?.querySelector('button');
  if (!template) return makeFallbackButton();

  const btn = template.cloneNode(true);
  btn.id = BTN_ID;
  btn.removeAttribute('aria-controls');
  btn.setAttribute('aria-haspopup', 'true');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-label', 'Nemuca menu');
  btn.title = 'Nemuca menu';

  applyToolbarButtonClasses(btn);

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

  let [text, path, icon] = item;
  const projection = projectionState.name || refreshProjectionState();

  if (path === '__TECHDOC__') {
    if (!techDocState.href) return null;
    path = techDocState.href;
  }

  const textNeedsProjection = typeof text === 'string' && text.includes('__PROJECTION__');
  const pathNeedsProjection = typeof path === 'string' && path.includes('__PROJECTION__');

  if ((textNeedsProjection || pathNeedsProjection) && !projection) {
    return null;
  }

  if (textNeedsProjection) {
    text = text.replaceAll('__PROJECTION__', projection);
  }

  if (pathNeedsProjection) {
    path = path.replaceAll('__PROJECTION__', projection);
  }

  const isStaticProjectionHeading = !path && text;

  if (isStaticProjectionHeading) {
    li.className = 'menu-static';
    li.textContent = text;
    return li;
  }

  const a = document.createElement('a');
  a.className = 'granite-menu-item';
  a.setAttribute('granitemenuitem', '');
  a.setAttribute('role', 'menuitem');
  a.setAttribute('tabindex', '-1');
  a.href = new URL(path, location.origin).href;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';

  if (icon) a.appendChild(makeGraniteIcon(icon));

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

  LINKS.forEach(item => {
    const el = makeItem(item);
    if (el) menu.appendChild(el);
  });

  if (techDocState.version) {
    const li = document.createElement('li');
    li.className = 'menu-static';
    li.textContent = `IFS Cloud Version: ${techDocState.version}`;
    menu.appendChild(li);
  }

  const ngVersion = document.querySelector('[ng-version]')?.getAttribute('ng-version');
  if (ngVersion) {
    const li = document.createElement('li');
    li.className = 'menu-static';
    li.textContent = `Angular Version: ${ngVersion}`;
    menu.appendChild(li);
  }

  return menu;
};

const openMenu = btn => {
  closeMenu();
  const menu = makeMenu();
  document.body.appendChild(menu);

  const r = btn.getBoundingClientRect();
  const pad = 16;

  menu.style.left = `${Math.min(r.left, window.innerWidth - menu.offsetWidth - pad)}px`;
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
  btn.appendChild(makeGraniteIcon('arrow-up'));

  btn.addEventListener('click', () => {
    const { s } = metrics();
    s === window ? scrollTo({ top: 0, behavior: 'smooth' }) : s.scrollTo({ top: 0, behavior: 'smooth' });
  });

  return btn;
};

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

const getEnvironmentInfo = () => {
  const host = window.location.hostname.toLowerCase();
  //defaults for any *.build.ifs.cloud environments
  const buildMatch = host.match(/-([a-z0-9]+)\.build\.ifs\.cloud$/i);
  if (buildMatch) {
    const envName = buildMatch[1].toUpperCase();
    return {
      keyword: buildMatch[1].toLowerCase(),
      label: envName,
      bg: 'var(--granite-color-state-confirmed, #22c55e)'
    };
  }

  const exactMatch = host.match(/(^|[-.])(prod|cfg|uat|trn)([-.]|$)/i);
  if (exactMatch) {
    const keyword = exactMatch[2].toLowerCase();
    const match = ENVIRONMENTS.find(([k]) => k === keyword);
    if (match) {
      const [, label, bg] = match;
      return { keyword, label, bg };
    }
  }

  for (const [keyword, label, bg] of ENVIRONMENTS) {
    if (host.includes(keyword)) {
      return { keyword, label, bg };
    }
  }

  return null;
};

const makeEnvironmentBadge = () => {
  const env = getEnvironmentInfo();
  if (!env) return null;

  const badge = document.createElement('granite-badge');
  badge.id = ENV_BADGE_ID;
  badge.className = 'granite-badge badge k-badge k-badge-md k-badge-solid k-badge-rounded';
  badge.textContent = env.label;
  badge.style.backgroundColor = env.bg;
  badge.style.color = 'var(--granite-color-text-on-active, #fff)';

  return badge;
};

const insertEnvironmentBadge = () => {
  const wrap = ensureWrap();
  if (!wrap) return;

  if (document.getElementById(ENV_BADGE_ID)) return;

  const badge = makeEnvironmentBadge();
  if (!badge) return;

  wrap.appendChild(badge);
};

const insertButton = () => {
  const wrap = ensureWrap();
  if (!wrap) return;

  if (document.getElementById(BTN_ID)) return;

  const btn = makeButton(getStreamsLi());
  if (!btn) return;

  wrap.appendChild(btn);
};

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    ta.style.pointerEvents = 'none';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}

function getBreadcrumbText() {
  const breadcrumb = document.querySelector('.breadcrumb');
  if (!breadcrumb) return '';

  return [...breadcrumb.querySelectorAll('li')]
    .map(li => li.textContent.trim())
    .filter(Boolean)
    .join(' > ');
}

function insertBreadcrumbCopyButton() {
  const breadcrumb = document.querySelector('.breadcrumb');
  if (!breadcrumb || breadcrumb.querySelector('.nemuca-breadcrumb-copy')) return;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'nemuca-breadcrumb-copy';
  btn.title = 'Copy breadcrumb';
  btn.setAttribute('aria-label', 'Copy breadcrumb');
  btn.appendChild(makeGraniteIcon('document-copy'));

  btn.addEventListener('click', async e => {
    e.stopPropagation();
    const text = getBreadcrumbText();
    if (!text) return;

    const ok = await copyText(text);
    btn.title = ok ? 'Copied' : 'Copy failed';
    setTimeout(() => { btn.title = 'Copy breadcrumb'; }, 1200);
  });

  breadcrumb.appendChild(btn);
}

const watch = () => {
  new MutationObserver(() => {
    refreshProjectionState();
    bindScroll();
    updateTop();
    insertButton();
    insertEnvironmentBadge();
    insertBreadcrumbCopyButton();
  }).observe(document.body, { childList: true, subtree: true, attributes: true });

  new ResizeObserver(() => {
    bindScroll();
    updateTop();
  }).observe(document.body);

  new ResizeObserver(updateTop).observe(document.documentElement);
};

document.addEventListener('click', e => {
  if (!e.target.closest('#' + BTN_ID) && !e.target.closest('#' + MENU_ID)) closeMenu();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

window.addEventListener('resize', updateTop, { passive: true });

const boot = async () => {
  refreshProjectionState();
  addStyles();
  addTopButtonIfMissing();
  await loadTechDocInfo();
  bindScroll();
  watch();
  updateTop();
  insertButton();
  insertEnvironmentBadge();
  insertBreadcrumbCopyButton();
};

document.readyState === 'complete'
  ? setTimeout(boot, 300)
  : window.addEventListener('load', () => setTimeout(boot, 300), { once: true });
})();