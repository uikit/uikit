import Components from 'components';
import { Class } from '../mixin/index';
import { extend, isRtl, promise, swap } from '../util/index';

export default function (UIkit) {

    var icons = Components, parsed = {};

    UIkit.component('icon', UIkit.components.svg.extend({

        mixins: [Class],

        name: 'icon',

        args: 'icon',

        props: ['icon'],

        defaults: {exclude: ['id', 'style', 'class', 'src']},

        init() {
            this.$el.addClass('uk-icon');

            if (isRtl) {
                this.icon = swap(swap(this.icon, 'left', 'right'), 'previous', 'next');
            }
        },

        methods: {

            getSvg() {

                if (!icons[this.icon]) {
                    return promise.reject('Icon not found.');
                }

                if (!parsed[this.icon]) {
                    parsed[this.icon] = this.parse(icons[this.icon]);
                }

                return promise.resolve(parsed[this.icon]);
            }

        }

    }));

    [
        'navbar-toggle-icon',
        'overlay-icon',
        'pagination-previous',
        'pagination-next',
        'totop'
    ].forEach(name => registerComponent(name));

    [
        'slidenav-previous',
        'slidenav-next'
    ].forEach(name => registerComponent(name, {

        init() {
            this.$el.addClass('uk-slidenav');

            if (this.$el.parents(`.uk-${name}-large`).length) {
                this.icon = `${name}-large`;
            }
        }

    }));

    registerComponent('search-icon', {

        init() {
            if (this.$el.hasClass('uk-search-icon') && this.$el.parents('.uk-search-large').length) {
                this.icon = 'search-large';
            } else if (this.$el.parents('.uk-search-navbar')) {
                this.icon = 'search-navbar';
            }
        }

    });

    registerComponent('close', {

        init() {
            if (this.$el.hasClass('uk-close-large')) {
                this.icon = 'close-large';
            }
        }

    });

    registerComponent('spinner', {

        connected() {

            this.height = this.width = this.$el.width();

            this.svg.then(svg => {

                var circle = svg.find('circle'),
                    diameter = Math.floor(this.width / 2);

                svg[0].setAttribute('viewBox', `0 0 ${this.width} ${this.width}`);

                circle.attr({cx: diameter, cy: diameter, r: diameter - parseFloat(circle.css('stroke-width') || 0)});
            });
        }

    });

    UIkit.icon.add = added => {
        extend(icons, added)
    };

    function registerComponent(name, mixin) {

        UIkit.component(name, UIkit.components.icon.extend({

            name,

            mixins: mixin ? [mixin] : [],

            defaults: {
                icon: name
            },

            init() {

                if (this.$options.large && this.$el.parents(`uk-`).hasClass()) {

                } else if (this.$options.modifiers) {
                    this.$options.modifiers.forEach(modifier => {
                        if (this.$el.hasClass(modifier[0])) {
                            this.icon = modifier[1];
                        }
                    });
                }

            }

        }));
    }

}
