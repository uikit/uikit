
String.prototype.ucfirst = function() {
    return this.length ? this.charAt(0).toUpperCase() + this.slice(1) : '';
}

function _get(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}


var storage = window.sessionStorage, key = '_uikit_style', keyinverse = '_uikit_inverse';

var styles  = {
    'core'  : '../css/uikit.core.css',
    'theme' : '../css/uikit.theme.css'
};

if (_get('style') && _get('style').match(/\.(json|css)$/)) {
    styles.custom = _get('style');
}

storage[key]        = storage[key] || 'core';
storage[keyinverse] = storage[keyinverse] || 'default';

// add UIkit core
document.writeln(`<link rel="stylesheet" href="${(styles[storage[key]] || '../css/uikit.theme.css')}">`);
document.writeln(`<script src="../vendor/jquery.js"></script>`);
document.writeln(`<script src="../js/uikit.js"></script>`);


// add  UIkit components

[
    'tooltip',
    'spinner'
].forEach(component => {
    document.writeln(`<link rel="stylesheet" href="../css/components/${storage[key]}/${component}.css">`);
});

document.addEventListener("DOMContentLoaded", () => {

    var $ = jQuery;

    var $container = $('<div class="uk-container"></div>').prependTo('body');
    var $tests     = $('<select class="uk-select"></select>').css('margin', '20px 20px 20px 0').prependTo($container);
    var $styles    = $('<select class="uk-select"></select>').css('margin', '20px').appendTo($container);
    var $inverse   = $('<select class="uk-select"></select>').css('margin', '20px').appendTo($container);

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
        'inverse',
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
        'sortable',
        'spinner',
        'sticky',
        'subnav',
        'switcher',
        'tab',
        'table',
        'text',
        'toggle',
        'tooltip',
        'totop',
        'transition',
        'utility',
        'visibility',
        'width'
    ].forEach(name => {

        $(`<option value="${name}.html">${name.split('-').map(name => {
            return name.charAt(0).toUpperCase() + name.slice(1);
        }).join(' ')}</option>`).appendTo($tests);
    });

    $tests.on('change', () => {
        if ($tests.val()) {
            var style = styles.custom ? `?style=${_get('style')}` : '';
            location.href = `../${document.querySelector('script[src*="test.js"]').getAttribute('src').replace('js/test.js', '')}tests/${$tests.val()}${style}`;
        }
    }).val(location.pathname.split('/').pop());

    // Styles
    // ------------------------------

    Object.keys(styles).forEach(style => {
        $styles.append(`<option value="${style}">${style.ucfirst()}</option>`);
    });

    $styles.on('change', () => {
        storage[key] = $styles.val();
        location.reload();
    }).val(storage[key]);

    // Variations
    // ------------------------------

    var variations = {
        'default' : 'Default',
        'light'   : 'Dark',
        'dark'    : 'Light'
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
