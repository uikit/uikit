import { $, getStyle, fastdom, isVoidElement, toJQuery } from '../util/index';

var storage = window.sessionStorage || {}, svgs = {};

export default function (UIkit) {

    UIkit.component('svg', {

        props: {
            id: String,
            icon: String,
            src: String,
            class: String,
            style: String,
            width: Number,
            height: Number,
            ratio: Number
        },

        defaults: {
            ratio: 1,
            id: false,
            class: '',
            exclude: ['src']
        },

        connected() {
            this.svg = $.Deferred();
        },

        update: {

            read() {

                if (!this.src) {
                    this.src = getSrc(this.$el);
                }

                if (!this.src || this.isSet) {
                    return;
                }

                this.isSet = true;

                if (!this.icon && ~this.src.indexOf('#')) {

                    var parts = this.src.split('#');

                    if (parts.length > 1) {
                        this.src = parts[0];
                        this.icon = parts[1];
                    }
                }

                this.get(this.src).then(svg =>
                    fastdom.mutate(() => {

                        var el;

                        el = !this.icon
                            ? svg.clone()
                            : (el = toJQuery(`#${this.icon}`, svg))
                                && toJQuery((el[0].outerHTML || $('<div>').append(el.clone()).html()).replace(/symbol/g, 'svg')) // IE workaround, el[0].outerHTML
                                || !toJQuery('symbol', svg) && svg.clone(); // fallback if SVG has no symbols

                        if (!el || !el.length) {
                            return $.Deferred().reject('SVG not found.');
                        }

                        var dimensions = el[0].getAttribute('viewBox'); // jQuery workaround, el.attr('viewBox')

                        if (dimensions) {
                            dimensions = dimensions.split(' ');
                            this.width = this.width || dimensions[2];
                            this.height = this.height || dimensions[3];
                        }

                        this.width *= this.ratio;
                        this.height *= this.ratio;

                        for (var prop in this.$options.props) {
                            if (this[prop] && !~this.exclude.indexOf(prop)) {
                                el.attr(prop, this[prop]);
                            }
                        }

                        if (!this.id) {
                            el.removeAttr('id');
                        }

                        if (this.width && !this.height) {
                            el.removeAttr('height');
                        }

                        if (this.height && !this.width) {
                            el.removeAttr('width');
                        }

                        if (isVoidElement(this.$el) || this.$el[0].tagName === 'CANVAS') {
                            this.$el.attr({hidden: true, id: null});
                            el.insertAfter(this.$el);
                        } else {
                            el.appendTo(this.$el);
                        }

                        this.svg.resolve(el);

                    })
                );
            },

            events: ['load']

        },

        methods: {

            get(src) {

                if (svgs[src]) {
                    return svgs[src];
                }

                svgs[src] = $.Deferred();

                if (src.lastIndexOf('data:', 0) === 0) {
                    svgs[src].resolve(getSvg(decodeURIComponent(src.split(',')[1])));
                } else {

                    var key = `uikit_${UIkit.version}_${src}`;

                    if (storage[key]) {
                        svgs[src].resolve(getSvg(storage[key]));
                    } else {
                        $.get(src).then((doc, status, res) => {
                            storage[key] = res.responseText;
                            svgs[src].resolve(getSvg(storage[key]));
                        });
                    }
                }

                return svgs[src];

                function getSvg (doc) {
                    return $(doc).filter('svg');
                }
            }

        },

        destroy() {

            if (isVoidElement(this.$el)) {
                this.$el.attr({hidden: null, id: this.id || null});
            }

            if (this.svg) {
                this.svg.then(svg => svg.remove());
            }
        }

    });

    function getSrc(el) {

        var image = getBackgroundImage(el);

        if (!image) {

            el = el.clone().empty().attr('uk-no-boot', '').appendTo(document.body).show();

            if (!el.is(':visible')) {
                image = getBackgroundImage(el);
            }

            // safari workaround
            if (!image && el[0].tagName === 'CANVAS') {
                var span = $(el[0].outerHTML.replace(/canvas/g, 'span')).insertAfter(el);
                image = getBackgroundImage(span);
                span.remove();
            }

            el.remove();

        }

        return image && image.slice(4, -1).replace(/"/g, '');
    }

    function getBackgroundImage(el) {
        var image = getStyle(el[0], 'backgroundImage', '::before');
        return image !== 'none' && image;
    }

}
