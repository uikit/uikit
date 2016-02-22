import $ from 'jquery';

require('../vendor/holder.js');
require('../src/js/uikit.js');

var base = '../' + document.querySelector('script[src*="test.js"]').getAttribute('src').replace('test.js', ''),

    tests = {

        Base: ['base'],
        Elements: ['typography', 'list', 'description-list', 'table', 'form', 'button'],
        Common: ['alert', 'badge', 'close', 'icon'],
        Navigation: ['nav', 'navbar', 'subnav', 'breadcrumb', 'pagination'],
        Layout: ['section', 'container', 'grid', 'card'],
        JavaScript: ['drop', 'dropdown', 'toggle', 'scrollspy', 'smooth-scroll'],
        Utilities: ['align', 'column', 'cover', 'flex', 'inverse', 'margin', 'padding', 'sticky', 'text', 'utility', 'visibility', 'width'],
        Components: ['form-advanced']

    };

document.addEventListener('DOMContentLoaded', function () {

    var $select = $('<select><option value="">- Select Test -</option></select>').css('margin', '0 5px'), $optgroup;

    $.each(tests, function (group, tests) {

        $optgroup = $('<optgroup label="' + group + '"></optgroup>').appendTo($select);

        tests.forEach(function (name) {
            $optgroup.append('<option value="' + name + '.html">' + name.charAt(0).toUpperCase() + name.slice(1) + '</option>');
        });

    });

    $select.on('change', function () {
        if ($select.val()) {
            location.href = base + 'tests/' + $select.val();
        }
    }).val(location.pathname.split('/').pop());

    $('body').prepend($('<div class="uk-form uk-margin-top uk-margin-bottom uk-container uk-container-center"></div>').prepend($select));

});
