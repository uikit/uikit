var storage = window.sessionStorage, key = '_uikit_style', keyinverse = '_uikit_inverse', themes = {}, $html = $('html');

// try to load themes.json
var request = new XMLHttpRequest();
request.open('GET', '../themes.json', false);
request.send(null);

if (request.status === 200) {
    themes = JSON.parse(request.responseText);
}

var styles = $.extend({
        core: {css: '../dist/css/uikit-core.css'},
        theme: {css: '../dist/css/uikit.css'}
    }, themes),
    component = location.pathname.split('/').pop().replace(/.html$/, ''),
    components = [
        'lightbox',
        'notification',
        'sortable',
        'tooltip',
        'upload'
    ];

if (getParam('style') && getParam('style').match(/\.(json|css)$/)) {
    styles.custom = getParam('style');
}

storage[key] = storage[key] || 'core';
storage[keyinverse] = storage[keyinverse] || 'default';

var dir = storage._uikit_dir || 'ltr';

// set dir
$html.attr('dir', dir);

var style = styles[storage[key]] || styles.theme;

// add style
document.writeln(`<link rel="stylesheet" href="${dir !== 'rtl' ? style.css : style.css.replace('.css', '').concat('-rtl.css')}">`);

// add javascript
document.writeln(`<script src="../dist/js/uikit.js"></script>`);
document.writeln(`<script src="${style.icons ? style.icons : '../dist/js/uikit-icons.js'}"></script>`);

$(() => {

    var $body = $('body');
    var $container = $('<div class="uk-container"></div>').prependTo('body');
    var $tests = $('<select class="uk-select uk-form-width-small"></select>').css('margin', '20px 20px 20px 0').prependTo($container);
    var $styles = $('<select class="uk-select uk-form-width-small"></select>').css('margin', '20px').appendTo($container);
    var $inverse = $('<select class="uk-select uk-form-width-small"></select>').css('margin', '20px').appendTo($container);
    var $label = $('<label></label>').css('margin', '20px').appendTo($container);

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
        'heading',
        'height-expand',
        'height-viewport',
        'icon',
        'iconnav',
        'label',
        'link',
        'list',
        'margin',
        'modal',
        'nav',
        'navbar',
        'offcanvas',
        'overlay',
        'padding',
        'pagination',
        'position',
        'placeholder',
        'progress',
        'scroll',
        'scrollspy',
        'search',
        'section',
        'slidenav',
        'spinner',
        'sticky',
        'subnav',
        'switcher',
        'tab',
        'table',
        'text',
        'tile',
        'toggle',
        'totop',
        'transition',
        'utility',
        'visibility',
        'width'
    ].concat(components).sort().forEach(name => $(`<option value="${name}.html">${name.split('-').map(ucfirst).join(' ')}</option>`).appendTo($tests));

    $tests.on('change', () => {
        if ($tests.val()) {
            var style = styles.custom ? `?style=${getParam('style')}` : '';
            location.href = `../${$html.find('script[src*="test.js"]').attr('src').replace('js/test.js', '')}tests/${$tests.val()}${style}`;
        }
    }).val(component && `${component}.html`);

    $tests.prepend(`<option value="index.html">Overview</option>`);

    // Styles
    // ------------------------------

    Object.keys(styles).forEach(style => $styles.append(`<option value="${style}">${ucfirst(style)}</option>`));

    $styles.on('change', () => {
        storage[key] = $styles.val();
        location.reload();
    }).val(storage[key]);

    // Variations
    // ------------------------------

    var variations = {
        'default': 'Default',
        'light': 'Dark',
        'dark': 'Light'
    };

    Object.keys(variations).forEach(name => $(`<option value="${name}">${variations[name]}</option>`).appendTo($inverse));

    $inverse.on('change', () => {

        $body.removeClass('uk-dark uk-light');

        switch ($inverse.val()) {
            case 'dark':
                $html.css('background', '#fff');
                $body.addClass('uk-dark');
                break;

            case 'light':
                $html.css('background', '#222');
                $body.addClass('uk-light');
                break;

            default:
                $html.css('background', '');
        }

        storage[keyinverse] = $inverse.val();

    }).val(storage[keyinverse]).trigger('change');

    // RTL
    // ------------------------------

    var $rtl = $('<input type="checkbox" class="uk-checkbox uk-form-width-small" />').on('change', () => {
        storage._uikit_dir = $rtl.prop('checked') ? 'rtl' : 'ltr';
        location.reload();
    }).appendTo($label).after('<span style="margin:5px;">RTL</span>');

    if (dir == 'rtl') {
        $rtl.prop('checked', true);
    }

    $html.css('padding-top', '');
});

$html.css('padding-top', '80px');

function ucfirst(str) {
    return str.length ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

function getParam(name) {
    var match = RegExp(`[?&]${name}=([^&]*)`).exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
