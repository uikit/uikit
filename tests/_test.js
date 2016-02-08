(function (d) {

    var base = '../' + document.querySelector('script[src*="_test.js"]').attributes.src.value.replace('_test.js', '');

    // include needed scripts
    [
        // vendor
        '../vendor/jquery.js',
        '../vendor/holder.js',
        '../vendor/less.js',

        // uikit
        '../js/uikit.js'

    ].forEach(function (script) {
        d.writeln('<script src="' + script + '"></script>');
    });

    var tests = {

        Base: ['base'],
        Elements: ['typography', 'list', 'description-list', 'table', 'form', 'button'],
        Common: ['alert', 'badge', 'icon'],
        Navigation: ['subnav'],
        Layout: ['section', 'container', 'grid', 'card'],
        JavaScript: ['toggle'],
        Utilities: ['align', 'column', 'cover', 'drop', 'dropdown', 'flex', 'inverse', 'margin', 'padding', 'scrollspy', 'smooth-scroll', 'text', 'utility', 'visibility', 'width'],
        Components: ['form-advanced']

    };

    document.addEventListener('DOMContentLoaded', function () {

        var $ = jQuery.noConflict(), $select = $('<select><option value="">- Select Test -</option></select>').css('margin', '0 5px'), $optgroup;

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

        var body = $('body').attr('visibility', 'hidden');
        requestAnimationFrame(function () {
            body.prepend($('<div class="uk-form uk-margin-top uk-margin-bottom uk-container uk-container-center"></div>').prepend($select)).css('visibility', '');
        });
    });

})(document);
