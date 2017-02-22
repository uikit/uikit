import { $, fastdom, getStyle, isVoidElement, promise } from '../util/index';

var storage = window.sessionStorage || {}, svgs = {}, parser = new DOMParser();

export default function (UIkit) {

    UIkit.component('svg', {

        attrs: true,

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

        init() {
            this.class += ' uk-svg';
        },

        connected() {

            if (this._rejecter) {
                this._rejecter();
            }

            if (isVoidElement(this.$el)) {
                this.$el.attr({hidden: true, id: null});
            }

            this.width = this.$props.width;
            this.height = this.$props.height;

            this.svg = promise((resolve, reject) => {

                this._resolver = resolve;
                this._rejecter = reject;

            }).then(doc => promise((resolve, reject) => fastdom.mutate(() => {

                var svg, el;

                if (!this.icon) {
                    el = doc.documentElement.cloneNode(true);
                } else {
                    svg = doc.getElementById(this.icon);

                    if (!svg) {

                        // fallback if SVG has no symbols
                        if (!doc.querySelector('symbol')) {
                            el = doc.documentElement.cloneNode(true);
                        }

                    } else {

                        var html = svg.outerHTML;

                        // IE workaround
                        if (!html) {
                            var div = document.createElement('div');
                            div.appendChild(svg.cloneNode(true));
                            html = div.innerHTML;
                        }

                        html = html
                            .replace(/<symbol/g, `<svg${!~html.indexOf('xmlns') ? ' xmlns="http://www.w3.org/2000/svg"' : ''}`)
                            .replace(/symbol>/g, 'svg>');

                        el = parser.parseFromString(html, 'image/svg+xml').documentElement;
                    }

                }

                if (!el) {
                    reject('SVG not found.');
                    return;
                }

                var dimensions = el.getAttribute('viewBox'); // jQuery workaround, el.attr('viewBox')

                if (dimensions) {
                    dimensions = dimensions.split(' ');
                    this.width = this.width || dimensions[2];
                    this.height = this.height || dimensions[3];
                }

                el = $(el);

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
                    el.insertAfter(this.$el);
                } else {
                    el.appendTo(this.$el);
                }

                resolve(el);

            }))).catch(() => {});

            if (!this._isReady) {
                this.$emitSync();
            }
        },

        disconnected() {

            this.isSet = false;

            if (isVoidElement(this.$el)) {
                this.$el.attr({hidden: null, id: this.id || null});
            }

            if (this.svg) {
                this.svg.then(svg => {
                    svg && svg.remove();
                });
                this.svg = null;
            }
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

                this._resolver(getSvg(this.src));
            },

            events: ['load']

        }

    });

    function getSrc(el) {

        var image = getBackgroundImage(el);

        if (!image) {

            el = el.clone().empty()
                .attr({'uk-no-boot': '', style: `${el.attr('style')};display:block !important;`})
                .appendTo(document.body);

            image = getBackgroundImage(el);

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

    function getSvg(src) {

        if (!svgs[src]) {
            svgs[src] = promise((resolve, reject) => {

                if (src.lastIndexOf('data:', 0) === 0) {
                    resolve(parse(decodeURIComponent(src.split(',')[1])));
                } else {

                    var key = `${UIkit.data}${UIkit.version}_${src}`;

                    if (storage[key]) {
                        resolve(parse(storage[key]));
                    } else {
                        $.ajax(src, {dataType: 'html'}).then(doc => {
                            storage[key] = doc;
                            resolve(parse(doc));
                        }, () => {
                            reject('SVG not found.');
                        });
                    }
                }

            });
        }

        return svgs[src];
    }

    function parse(doc) {
        return parser.parseFromString(doc, 'image/svg+xml');
    }

    // workaround for Safari's private browsing mode
    try {
        var key = `${UIkit.data}test`;
        storage[key] = 1;
        delete storage[key];
    } catch (e) {
        storage = {};
    }

}
