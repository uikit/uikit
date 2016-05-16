import $ from 'jquery';
module.exports = require('../../src/js/uikit.js');

requestAnimationFrame(function () {

    var $select = $('<select><option value="">- Select Test -</option></select>').css('margin', '20px 0');

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
        'flex',
        'form',
        'form-custom',
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
        'padding',
        'pagination',
        'position',
        'scroll',
        'scrollspy',
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
        'typography',
        'utility',
        'visibility',
        'width'
    ].forEach(function (name) {
        $('<option value="' + name + '.html">' + name.split('-').map(function (name) {
                return name.charAt(0).toUpperCase() + name.slice(1);
            }).join(' ') + '</option>').appendTo($select);
    });

    $select.on('change', function () {
        if ($select.val()) {
            location.href = '../' + document.querySelector('script[src*="test.js"]').getAttribute('src').replace('js/test.js', '') + 'tests/' + $select.val();
        }
    }).val(location.pathname.split('/').pop());

    $('body').prepend($('<div class="uk-form uk-container"></div>').prepend($select));

});
