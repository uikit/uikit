var $ = jQuery, storage = window.sessionStorage, key = '_uikit_style';

if (!storage[key]) {
    storage[key] = '../css/uikit.css';
}

document.writeln(`<link rel="stylesheet" href="${storage[key]}">`);
document.writeln(`<script src="../js/uikit.js"></script>`);

requestAnimationFrame(function () {

    var $container = $('<div class="uk-container"></div>').prependTo('body');
    var $tests = $('<select class="uk-select"><option value="">- Select Test -</option></select>').css('margin', '20px 20px 20px 0').prependTo($container);

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
            location.href = `../${document.querySelector('script[src*="test.js"]').getAttribute('src').replace('js/test.js', '')}tests/${$tests.val()}`;
        }
    }).val(location.pathname.split('/').pop());

    var $styles = $(`
        <select class="uk-select">
            <option value="../css/uikit.css">Theme</option>
            <option value="css/uikit.core.css">Core</option>
        </select>
    `).insertAfter($tests);

    $styles.css('margin', '20px 0').on('change', () => {
        storage[key] = $styles.val();
        location.reload();
    }).val(storage[key]);

    $('html').css('padding-top', '');

});

$('html').css('padding-top', '80px');
