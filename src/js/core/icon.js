import {Class} from '../mixin/index';
import {$, addClass, css, each, hasClass, isRtl, noop, parents, Promise, swap} from '../util/index';
import closeIcon from '../../images/components/close-icon.svg';
import closeLarge from '../../images/components/close-large.svg';
import marker from '../../images/components/marker.svg';
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

    const parsed = {};
    const icons = {
        spinner,
        totop,
        marker,
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

        defaults: {exclude: ['id', 'style', 'class', 'src', 'icon']},

        init() {
            addClass(this.$el, 'uk-icon');

            if (isRtl) {
                this.icon = swap(swap(this.icon, 'left', 'right'), 'previous', 'next');
            }
        },

        methods: {

            getSvg() {

                const icon = getIcon(this.icon);

                if (!icon) {
                    return Promise.reject('Icon not found.');
                }

                return Promise.resolve(icon);
            }

        }

    }));

    [
        'marker',
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
            addClass(this.$el, 'uk-slidenav');

            if (hasClass(this.$el, 'uk-slidenav-large')) {
                this.icon += '-large';
            }
        }

    }));

    registerComponent('search-icon', {

        init() {
            if (hasClass(this.$el, 'uk-search-icon') && parents(this.$el, '.uk-search-large').length) {
                this.icon = 'search-large';
            } else if (parents(this.$el, '.uk-search-navbar').length) {
                this.icon = 'search-navbar';
            }
        }

    });

    registerComponent('close', {

        init() {
            this.icon = `close-${hasClass(this.$el, 'uk-close-large') ? 'large' : 'icon'}`;
        }

    });

    registerComponent('spinner', {

        connected() {
            this.svg.then(svg => this.ratio !== 1 && css($('circle', svg), 'stroke-width', 1 / this.ratio), noop);
        }

    });

    UIkit.icon.add = added => {
        Object.keys(added).forEach(name => {
            icons[name] = added[name];
            delete parsed[name];
        });

        if (UIkit._initialized) {
            each(UIkit.instances, component => {
                if (component.$options.name === 'icon') {
                    component.$reset();
                }
            });
        }
    };

    function registerComponent(name, mixin) {

        UIkit.component(name, UIkit.components.icon.extend({

            name,

            mixins: mixin ? [mixin] : [],

            defaults: {
                icon: name
            }

        }));
    }

    function getIcon(icon) {

        if (!icons[icon]) {
            return null;
        }

        if (!parsed[icon]) {
            parsed[icon] = $(icons[icon].trim());
        }

        return parsed[icon];
    }

}
