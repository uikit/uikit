
var storage = window.sessionStorage, key = '_uikit_style', keyinverse = '_uikit_inverse';

var styles = extend({
    core: {
        file: '../css/uikit.core.css',
        components: [
            '../css/components/core/notify.css',
            '../css/components/core/sortable.css',
            '../css/components/core/spinner.css',
            '../css/components/core/tooltip.css'
        ]
    },
    theme: {
        file: '../css/uikit.theme.css',
        components: [
            '../css/components/theme/notify.css',
            '../css/components/theme/sortable.css',
            '../css/components/theme/spinner.css',
            '../css/components/theme/tooltip.css'
        ]
    }
}, JSON.parse(_load('../themes.json') || '{}'));

if (_get('style') && _get('style').match(/\.(json|css)$/)) {
    styles.custom = _get('style');
}

storage[key] = storage[key] || 'core';
storage[keyinverse] = storage[keyinverse] || 'default';

var style = styles[storage[key]] || styles.theme;

// add UIkit core
document.writeln(`<link rel="stylesheet" href="${style.file}">`);

// add  UIkit components
(style.components || []).forEach(file => {
    document.writeln(`<link rel="stylesheet" href="${file}">`);
});

document.writeln(`<script src="../vendor/jquery.js"></script>`);
document.writeln(`<script src="../js/uikit.js"></script>`);

// add  UIkit components

var component = location.pathname.split('/').pop().replace(/.html$/, '');
var components = [
    'notify',
    'sortable',
    'spinner',
    'tooltip',
    'upload'
];

components.forEach(name => {
    document.writeln(`<script src="../js/components/${name}.js"></script>`);
});

document.addEventListener("DOMContentLoaded", () => {

    var $ = jQuery;

    var $container = $('<div class="uk-container"></div>').prependTo('body');
    var $tests = $('<select class="uk-select"></select>').css('margin', '20px 20px 20px 0').prependTo($container);
    var $styles = $('<select class="uk-select"></select>').css('margin', '20px').appendTo($container);
    var $inverse = $('<select class="uk-select"></select>').css('margin', '20px').appendTo($container);

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
        'cover',
        'description-list',
        'drop',
        'dropdown',
        'element',
        'flex',
        'form',
        'grid',
        'height-expand',
        'height-viewport',
        'icon',
        'label',
        'lightbox',
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
        'scroll',
        'scrollspy',
        'search',
        'section',
        'slidenav',
        'sticky',
        'subnav',
        'switcher',
        'tab',
        'table',
        'text',
        'toggle',
        'totop',
        'transition',
        'utility',
        'visibility',
        'width'
    ].concat(components).sort().forEach(name => {

        $(`<option value="${name}.html">${name.split('-').map(name => {
            return ucfirst(name);
        }).join(' ')}</option>`).appendTo($tests);
    });

    $tests.on('change', () => {
        if ($tests.val()) {
            var style = styles.custom ? `?style=${_get('style')}` : '';
            location.href = `../${document.querySelector('script[src*="test.js"]').getAttribute('src').replace('js/test.js', '')}tests/${$tests.val()}${style}`;
        }
    }).val(component && `${component}.html`);

    $tests.prepend(`<option value="index.html">Overview</option>`);

    // Styles
    // ------------------------------

    Object.keys(styles).forEach(style => {
        $styles.append(`<option value="${style}">${ucfirst(style)}</option>`);
    });

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

    Object.keys(variations).forEach(name => {
        $(`<option value="${name}">${variations[name]}</option>`).appendTo($inverse);
    });

    $inverse.on('change', () => {

        document.body.classList.remove('uk-dark');
        document.body.classList.remove('uk-light');

        switch ($inverse.val()) {
            case 'dark':
                document.documentElement.style.background = '#fff';
                document.body.classList.add('uk-dark');
                break;

            case 'light':
                document.documentElement.style.background = '#222';
                document.body.classList.add('uk-light');
                break;

            default:
                document.documentElement.style.background = '';
        }

        storage[keyinverse] = $inverse.val();

    }).val(storage[keyinverse]).trigger('change');


    $('html').css('padding-top', '');

});

document.querySelector('html').style.paddingTop = '80px';


function extend(target) {

    for (var index = 1, source; index < arguments.length; index++) {
        source = arguments[index];
        for (var key in source) {
            target[key] = source[key];
        }
    }

    return target;
}

function ucfirst(str) {
    return str.length ? str.charAt(0).toUpperCase() + str.slice(1) : '';
};

function _get(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function _load(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, false);  // `false` makes the request synchronous
    request.send(null);
    return request.status === 200 ? request.responseText : undefined;
}
