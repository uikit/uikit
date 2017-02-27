import { $, fastdom, isVoidElement, promise } from '../util/index';

var svgs = {}, parser = new DOMParser();

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

            if (!this.icon && this.src && ~this.src.indexOf('#')) {

                var parts = this.src.split('#');

                if (parts.length > 1) {
                    this.src = parts[0];
                    this.icon = parts[1];
                }
            }

            this.width = this.$props.width;
            this.height = this.$props.height;

            this.svg = this.getSvg().then(doc => promise((resolve, reject) => fastdom.mutate(() => {

                var svg, el;

                if (!doc) {
                    reject('SVG not found.');
                    return;
                }

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
                    this.$el.attr({hidden: true, id: null});
                    el.insertAfter(this.$el);
                } else {
                    el.appendTo(this.$el);
                }

                resolve(el);

            }))).then(null, () => this.$destroy());

            if (!this._isReady) {
                this.$emitSync();
            }
        },

        disconnected() {

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

        methods: {

            getSvg() {

                if (!this.src) {
                    return promise.reject();
                }

                if (svgs[this.src]) {
                    return svgs[this.src];
                }

                svgs[this.src] = promise((resolve, reject) => {

                    if (this.src.lastIndexOf('data:', 0) === 0) {
                        resolve(this.parse(decodeURIComponent(this.src.split(',')[1])));
                    } else {

                        $.ajax(this.src, {dataType: 'html'}).then(doc => {
                            resolve(this.parse(doc));
                        }, () => {
                            reject('SVG not found.');
                        });

                    }

                });

                return svgs[this.src];

            },

            parse(doc) {
                var parsed = parser.parseFromString(doc, 'image/svg+xml');
                return parsed.documentElement && parsed.documentElement.nodeName === 'svg' ? parsed : null;
            }

        }

    });

}
