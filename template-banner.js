(function () {
  'use strict';

  if (sessionStorage.getItem('fcsd-banner-dismissed')) return;

  var REPO = 'https://github.com/vpwebdev/freecssdesigns-templates';

  // Derive template name from URL
  var seg = window.location.pathname.split('/');
  var idx = seg.indexOf('templates');
  var slug = idx !== -1 && seg[idx + 1] ? seg[idx + 1] : '';
  var name = slug.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });

  // Resolve path back to root index
  var inSubpage = seg.indexOf('pages') !== -1;
  var allTemplatesHref = (inSubpage ? '../../../' : '../../') + 'index.html#templates';

  // --- Inject scoped styles ---
  var css = document.createElement('style');
  css.textContent = [
    '#fcsd-tpl-banner{',
    '  --_bg:rgba(13,13,15,.82);',
    '  --_border:rgba(255,255,255,.08);',
    '  --_text:rgba(255,255,255,.88);',
    '  --_muted:rgba(255,255,255,.5);',
    '  --_accent:#6e56cf;',
    '  --_accent-hover:#7c67d6;',
    '  --_radius:14px;',
    '  position:fixed;bottom:0;left:0;right:0;z-index:2147483647;',
    '  display:flex;align-items:center;justify-content:center;',
    '  padding:0 16px 16px;',
    '  pointer-events:none;',
    '  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;',
    '  transform:translateY(110%);',
    '  transition:transform .45s cubic-bezier(.22,1,.36,1);',
    '}',
    '#fcsd-tpl-banner.is-visible{transform:translateY(0);}',
    '',
    '#fcsd-tpl-banner .fcsd-inner{',
    '  pointer-events:auto;',
    '  display:flex;align-items:center;gap:12px;',
    '  max-width:720px;width:100%;',
    '  padding:10px 12px 10px 16px;',
    '  background:var(--_bg);',
    '  backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);',
    '  border:1px solid var(--_border);',
    '  border-radius:var(--_radius);',
    '  box-shadow:0 8px 32px rgba(0,0,0,.35),0 0 0 1px rgba(0,0,0,.15);',
    '  color:var(--_text);font-size:13px;line-height:1.4;',
    '}',
    '',
    '#fcsd-tpl-banner .fcsd-dot{',
    '  width:7px;height:7px;border-radius:50%;',
    '  background:var(--_accent);flex-shrink:0;',
    '  box-shadow:0 0 6px var(--_accent);',
    '  animation:fcsd-pulse 2.4s ease-in-out infinite;',
    '}',
    '@keyframes fcsd-pulse{0%,100%{opacity:1}50%{opacity:.45}}',
    '',
    '#fcsd-tpl-banner .fcsd-label{',
    '  flex:1 1 auto;min-width:0;',
    '  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;',
    '}',
    '#fcsd-tpl-banner .fcsd-label strong{font-weight:600;color:#fff;}',
    '',
    '#fcsd-tpl-banner .fcsd-actions{',
    '  display:flex;align-items:center;gap:6px;flex-shrink:0;',
    '}',
    '',
    '#fcsd-tpl-banner .fcsd-btn{',
    '  display:inline-flex;align-items:center;gap:5px;',
    '  padding:6px 12px;border-radius:8px;',
    '  font-size:12px;font-weight:500;line-height:1;',
    '  white-space:nowrap;text-decoration:none;',
    '  border:none;cursor:pointer;',
    '  transition:background .2s,color .2s;',
    '}',
    '#fcsd-tpl-banner .fcsd-btn svg{width:13px;height:13px;flex-shrink:0;}',
    '',
    '#fcsd-tpl-banner .fcsd-btn--browse{',
    '  background:rgba(255,255,255,.08);color:var(--_text);',
    '}',
    '#fcsd-tpl-banner .fcsd-btn--browse:hover{background:rgba(255,255,255,.15);}',
    '',
    '#fcsd-tpl-banner .fcsd-btn--gh{',
    '  background:var(--_accent);color:#fff;',
    '}',
    '#fcsd-tpl-banner .fcsd-btn--gh:hover{background:var(--_accent-hover);}',
    '',
    '#fcsd-tpl-banner .fcsd-close{',
    '  display:flex;align-items:center;justify-content:center;',
    '  width:28px;height:28px;border-radius:8px;flex-shrink:0;',
    '  background:transparent;border:none;cursor:pointer;',
    '  color:var(--_muted);transition:background .2s,color .2s;',
    '}',
    '#fcsd-tpl-banner .fcsd-close:hover{background:rgba(255,255,255,.1);color:#fff;}',
    '#fcsd-tpl-banner .fcsd-close svg{width:14px;height:14px;}',
    '',
    '@media(max-width:560px){',
    '  #fcsd-tpl-banner .fcsd-inner{',
    '    flex-wrap:wrap;gap:8px;padding:12px;',
    '  }',
    '  #fcsd-tpl-banner .fcsd-label{',
    '    flex-basis:calc(100% - 48px);font-size:12px;',
    '  }',
    '  #fcsd-tpl-banner .fcsd-actions{',
    '    flex-basis:100%;',
    '  }',
    '  #fcsd-tpl-banner .fcsd-btn{flex:1;justify-content:center;}',
    '  #fcsd-tpl-banner .fcsd-close{position:absolute;top:8px;right:8px;}',
    '  #fcsd-tpl-banner .fcsd-inner{position:relative;}',
    '}'
  ].join('\n');
  document.head.appendChild(css);

  // --- Build banner markup ---
  var el = document.createElement('div');
  el.id = 'fcsd-tpl-banner';
  el.setAttribute('role', 'status');
  el.innerHTML = [
    '<div class="fcsd-inner">',
    '  <span class="fcsd-dot" aria-hidden="true"></span>',
    '  <span class="fcsd-label">Template preview' + (name ? ': <strong>' + name + '</strong>' : '') + '</span>',
    '  <span class="fcsd-actions">',
    '    <a class="fcsd-btn fcsd-btn--browse" href="' + allTemplatesHref + '">',
    '      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
    '      All Templates',
    '    </a>',
    '    <a class="fcsd-btn fcsd-btn--gh" href="' + REPO + '" target="_blank" rel="noopener">',
    '      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
    '      GitHub',
    '    </a>',
    '  </span>',
    '  <button class="fcsd-close" aria-label="Dismiss banner">',
    '    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    '  </button>',
    '</div>'
  ].join('\n');

  document.body.appendChild(el);

  // Animate in after paint
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      el.classList.add('is-visible');
    });
  });

  // Dismiss
  el.querySelector('.fcsd-close').addEventListener('click', function () {
    el.classList.remove('is-visible');
    el.addEventListener('transitionend', function () { el.remove(); });
    sessionStorage.setItem('fcsd-banner-dismissed', '1');
  });
})();
