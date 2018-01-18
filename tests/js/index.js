/* global UIkit */
var storage = window.sessionStorage,
    key = '_uikit_style',
    keyinverse = '_uikit_inverse',
    themes = {},
    docEl = document.documentElement;

// try to load themes.json
var request = new XMLHttpRequest();
request.open('GET', '../themes.json', false);
request.send(null);

if (request.status === 200) {
    themes = JSON.parse(request.responseText);
}

var styles = {
        core: {css: '../dist/css/uikit-core.css'},
        theme: {css: '../dist/css/uikit.css'}
    },
    component = location.pathname.split('/').pop().replace(/.html$/, '');

for (var theme in themes) {
    styles[theme] = themes[theme];
}

if (getParam('style') && getParam('style').match(/\.(json|css)$/)) {
    styles.custom = getParam('style');
}

storage[key] = storage[key] || 'core';
storage[keyinverse] = storage[keyinverse] || '';

var dir = storage._uikit_dir || 'ltr';

// set dir
docEl.setAttribute('dir', dir);

var style = styles[storage[key]] || styles.theme;

// add style
document.writeln(`<link rel="stylesheet" href="${dir !== 'rtl' ? style.css : style.css.replace('.css', '').concat('-rtl.css')}">`);

// add javascript
document.writeln('<script src="../dist/js/uikit.js"></script>');
document.writeln(`<script src="${style.icons ? style.icons : '../dist/js/uikit-icons.js'}"></script>`);

window.addEventListener('load', () => setTimeout(() => {

    var {addClass, append, css, on, prepend, removeClass, ucfirst} = UIkit.util;

    var $body = document.body;
    var $container = prepend($body, '<div class="uk-container"></div>');
    var $tests = css(append($container, '<select class="uk-select uk-form-width-small"></select>'), 'margin', '20px 20px 20px 0');
    var $styles = css(append($container, '<select class="uk-select uk-form-width-small"></select>'), 'margin', '20px');
    var $inverse = css(append($container, '<select class="uk-select uk-form-width-small"></select>'), 'margin', '20px');
    var $rtl = css(append($container, '<label></label>'), 'margin', '20px');

    // Tests
    // ------------------------------

    [
        'accordion',
        'alert',
        'align',
        'animation',
        'article',
        'background',
        'badge',
        'base',
        'breadcrumb',
        'button',
        'card',
        'close',
        'column',
        'comment',
        'container',
        'countdown',
        'cover',
        'description-list',
        'divider',
        'dotnav',
        'drop',
        'dropdown',
        'flex',
        'form',
        'grid',
        'grid-parallax',
        'heading',
        'height-expand',
        'height-viewport',
        'icon',
        'iconnav',
        'label',
        'lightbox',
        'link',
        'list',
        'margin',
        'marker',
        'modal',
        'nav',
        'navbar',
        'notification',
        'offcanvas',
        'overlay',
        'padding',
        'pagination',
        'parallax',
        'position',
        'placeholder',
        'progress',
        'scroll',
        'scrollspy',
        'search',
        'section',
        'slidenav',
        'slider',
        'slideshow',
        'sortable',
        'spinner',
        'sticky',
        'sticky-navbar',
        'subnav',
        'switcher',
        'tab',
        'table',
        'text',
        'thumbnav',
        'tile',
        'toggle',
        'tooltip',
        'totop',
        'transition',
        'utility',
        'upload',
        'visibility',
        'width'
    ].sort().forEach(name => append($tests, `<option value="${name}.html">${name.split('-').map(ucfirst).join(' ')}</option>`));

    on($tests, 'change', () => {
        if ($tests.value) {
            location.href = `${$tests.value}${styles.custom ? `?style=${getParam('style')}` : ''}`;
        }
    });

    $tests.value = component && `${component}.html`;

    prepend($tests, '<option value="index.html">Overview</option>');

    // Styles
    // ------------------------------

    Object.keys(styles).forEach(style => append($styles, `<option value="${style}">${ucfirst(style)}</option>`));

    on($styles, 'change', () => {
        storage[key] = $styles.value;
        location.reload();
    });
    $styles.value = storage[key];

    // Variations
    // ------------------------------

    var variations = {
        '': 'Default',
        'light': 'Dark',
        'dark': 'Light'
    };

    Object.keys(variations).forEach(name => append($inverse, `<option value="${name}">${variations[name]}</option>`));

    $inverse.value = storage[keyinverse];

    if ($inverse.value) {

        removeClass(document.querySelectorAll('*'), [
            'uk-navbar-container',
            'uk-card-default',
            'uk-card-muted',
            'uk-card-primary',
            'uk-card-secondary',
            'uk-tile-default',
            'uk-tile-muted',
            'uk-tile-primary',
            'uk-tile-secondary',
            'uk-section-default',
            'uk-section-muted',
            'uk-section-primary',
            'uk-section-secondary',
            'uk-overlay-default',
            'uk-overlay-primary'
        ]);

        css(docEl, 'background', $inverse.value === 'dark' ? '#fff' : '#222');
        addClass($body, `uk-${$inverse.value}`);

    }

    on($inverse, 'change', () => {
        storage[keyinverse] = $inverse.value;
        location.reload();
    });

    // RTL
    // ------------------------------

    append($rtl, '<input type="checkbox" class="uk-checkbox" />');
    append($rtl, '<span style="margin:5px;">RTL</span>');
    on($rtl, 'change', ({target}) => {
        storage._uikit_dir = target.checked ? 'rtl' : 'ltr';
        location.reload();
    });

    $rtl.firstElementChild.checked = dir === 'rtl';

    css(docEl, 'padding-top', '');
}, 100));

docEl.style.paddingTop = '80px';

function getParam(name) {
    var match = new RegExp(`[?&]${name}=([^&]*)`).exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
