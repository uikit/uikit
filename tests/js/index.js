var storage = window.sessionStorage,
    key = '_uikit_style',
    keyinverse = '_uikit_inverse',
    themes = {},
    docEl = document.documentElement;

var {addClass, assign, attr, append, css, on, prepend, ready, removeClass, trigger, ucfirst} = UIkit.util;

// try to load themes.json
var request = new XMLHttpRequest();
request.open('GET', '../themes.json', false);
request.send(null);

if (request.status === 200) {
    themes = JSON.parse(request.responseText);
}

var styles = assign({
        core: {css: '../dist/css/uikit-core.css'},
        theme: {css: '../dist/css/uikit.css'}
    }, themes),
    component = location.pathname.split('/').pop().replace(/.html$/, '');

if (getParam('style') && getParam('style').match(/\.(json|css)$/)) {
    styles.custom = getParam('style');
}

storage[key] = storage[key] || 'core';
storage[keyinverse] = storage[keyinverse] || 'default';

var dir = storage._uikit_dir || 'ltr';

// set dir
attr(docEl, 'dir', dir);

var style = styles[storage[key]] || styles.theme;

// add style
document.writeln(`<link rel="stylesheet" href="${dir !== 'rtl' ? style.css : style.css.replace('.css', '').concat('-rtl.css')}">`);

// add javascript
document.writeln(`<script src="${style.icons ? style.icons : '../dist/js/uikit-icons.js'}"></script>`);

ready(() => {

    var $body = document.body;
    var $container = prepend($body, '<div class="uk-container"></div>');
    var $tests = css(append($container, '<select class="uk-select uk-form-width-small"></select>'), 'margin', '20px 20px 20px 0');
    var $styles = css(append($container, '<select class="uk-select uk-form-width-small"></select>'), 'margin', '20px');
    var $inverse = css(append($container, '<select class="uk-select uk-form-width-small"></select>'), 'margin', '20px');
    var $label = css(append($container, '<label></label>'), 'margin', '20px');

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
        'sortable',
        'spinner',
        'sticky',
        'sticky-navbar',
        'subnav',
        'switcher',
        'tab',
        'table',
        'text',
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

    prepend($tests, `<option value="index.html">Overview</option>`);

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
        'default': 'Default',
        'light': 'Dark',
        'dark': 'Light'
    };

    Object.keys(variations).forEach(name => append($inverse, `<option value="${name}">${variations[name]}</option>`));

    on($inverse, 'change', () => {

        removeClass($body, 'uk-dark uk-light');

        switch ($inverse.value) {
            case 'dark':
                css(docEl, 'background', '#fff');
                addClass($body, 'uk-dark');
                break;

            case 'light':
                css(docEl, 'background', '#222');
                addClass($body, 'uk-light');
                break;

            default:
                css(docEl, 'background', '');
        }

        storage[keyinverse] = $inverse.value;

    });
    $inverse.value = storage[keyinverse];
    trigger($inverse, 'change');

    // RTL
    // ------------------------------

    var $rtl = append($label, '<input type="checkbox" class="uk-checkbox" />');
    append($label, '<span style="margin:5px;">RTL</span>');
    on($rtl, 'change', () => {
        storage._uikit_dir = $rtl.checked ? 'rtl' : 'ltr';
        location.reload();
    });

    $rtl.checked = dir === 'rtl';

    css(docEl, 'padding-top', '');
});

css(docEl, 'padding-top', '80px');

function getParam(name) {
    var match = new RegExp(`[?&]${name}=([^&]*)`).exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
