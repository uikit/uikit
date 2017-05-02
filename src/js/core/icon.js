import { Class } from '../mixin/index';
import { $, extend, isRtl, promise, swap } from '../util/index';
import closeIcon from '../../images/components/close-icon.svg';
import closeLarge from '../../images/components/close-large.svg';
import navbarToggleIcon from '../../images/components/navbar-toggle-icon.svg';
import overlayIcon from '../../images/components/overlay-icon.svg';
import paginationNext from '../../images/components/pagination-next.svg';
import paginationPrevious from '../../images/components/pagination-previous.svg';
import searchIcon from '../../images/components/search-icon.svg';
import searchLarge from '../../images/components/search-large.svg';
import searchNavbar from '../../images/components/search-navbar.svg';
import slidenavNext from '../../images/components/slidenav-next.svg';
import slidenavNextLarge from '../../images/components/slidenav-next-large.svg';
import slidenavPrevious from '../../images/components/slidenav-previous.svg';
import slidenavPreviousLarge from '../../images/components/slidenav-previous-large.svg';
import spinner from '../../images/components/spinner.svg';
import totop from '../../images/components/totop.svg';

export default function (UIkit) {

    var parsed = {},
        icons = {
            spinner,
            totop,
            'close-icon': closeIcon,
            'close-large': closeLarge,
            'navbar-toggle-icon': navbarToggleIcon,
            'overlay-icon': overlayIcon,
            'pagination-next': paginationNext,
            'pagination-previous': paginationPrevious,
            'search-icon': searchIcon,
            'search-large': searchLarge,
            'search-navbar': searchNavbar,
            'slidenav-next': slidenavNext,
            'slidenav-next-large': slidenavNextLarge,
            'slidenav-previous': slidenavPrevious,
            'slidenav-previous-large': slidenavPreviousLarge
        };

    UIkit.component('icon', UIkit.components.svg.extend({

        attrs: ['icon', 'ratio'],

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

        update: {

            read() {

                if (this.delay) {
                    var icon = this.getIcon();

                    if (icon) {
                        this.delay(icon);
                    }
                }
            },

            events: ['load']

        },

        methods: {

            getSvg() {

                var icon = this.getIcon();

                if (!icon) {

                    if (document.readyState !== 'complete') {
                        return promise(resolve => {
                            this.delay = resolve;
                        });
                    }

                    return promise.reject('Icon not found.');

                }

                return promise.resolve(icon);
            },

            getIcon() {

                if (!icons[this.icon]) {
                    return null;
                }

                if (!parsed[this.icon]) {
                    parsed[this.icon] = this.parse(icons[this.icon]);
                }

                return parsed[this.icon];
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

            if (this.$el.hasClass('uk-slidenav-large')) {
                this.icon += '-large';
            }
        }

    }));

    registerComponent('search-icon', {

        init() {
            if (this.$el.hasClass('uk-search-icon') && this.$el.parents('.uk-search-large').length) {
                this.icon = 'search-large';
            } else if (this.$el.parents('.uk-search-navbar').length) {
                this.icon = 'search-navbar';
            }
        }

    });

    registerComponent('close', {

        init() {
            this.icon = `close-${this.$el.hasClass('uk-close-large') ? 'large' : 'icon'}`;
        }

    });

    registerComponent('spinner', {

        connected() {

            this.height = this.width = this.$el.width();

            this.svg.then(svg => {

                var circle = $(svg).find('circle'),
                    diameter = Math.floor(this.width / 2);

                svg.setAttribute('viewBox', `0 0 ${this.width} ${this.width}`);

                circle.attr({cx: diameter, cy: diameter, r: diameter - parseFloat(circle.css('stroke-width') || 0)});
            });
        }

    });

    UIkit.icon.add = added => extend(icons, added);

    function registerComponent(name, mixin) {

        UIkit.component(name, UIkit.components.icon.extend({

            name,

            mixins: mixin ? [mixin] : [],

            defaults: {
                icon: name
            }

        }));
    }

}
