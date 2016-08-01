import $ from '../../vendor/jquery';

var storage = window.sessionStorage, key = '_uikit_style', keyinverse = '_uikit_inverse', themes = {}, $html = $('html');

$.ajax({url: '../themes.json', async: false, dataType: 'json'}).then(res => themes = res);

var styles = $.extend({
    core: { file: '../css/uikit.all.css' },
    theme: { file: '../css/uikit.theme.all.css' }
}, themes);

var components = [
    'lightbox',
    'notification',
    'sortable',
    'spinner',
    'tooltip',
    'upload'
];

var component = location.pathname.split('/').pop().replace(/.html$/, '');

if (getParam('style') && getParam('style').match(/\.(json|css)$/)) {
    styles.custom = getParam('style');
}

storage[key] = storage[key] || 'core';
storage[keyinverse] = storage[keyinverse] || 'default';

var style = styles[storage[key]] || styles.theme;

// add style
document.writeln(`<link rel="stylesheet" href="${style.file}">`);

// add javascripts
['../vendor/jquery.js', '../js/uikit.js']
    .concat(components.map(name => `../js/components/${name}.js`))
    .forEach(file => document.writeln(`<script src="${file}"></script>`));

$(() => {


    var $body = $('body');
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
        'dotnav',
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
        'placeholder',
        'progress',
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
