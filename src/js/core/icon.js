import SVG from './svg';
import Class from '../mixin/class';
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
import {$, addClass, apply, css, hasClass, hyphenate, isRtl, noop, parents, Promise, swap} from 'uikit-util';

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

const Icon = {

    install,

    attrs: ['icon', 'ratio'],

    mixins: [Class, SVG],

    name: 'icon',

    args: 'icon',

    props: ['icon'],

    data: {exclude: ['id', 'style', 'class', 'src', 'icon', 'ratio']},

    connected() {
        addClass(this.$el, 'uk-icon');
    },

    methods: {

        getSvg() {

            const icon = getIcon(applyRtl(this.icon));

            if (!icon) {
                return Promise.reject('Icon not found.');
            }

            return Promise.resolve(icon);
        }

    }

};

export default Icon;

export const IconComponent = {

    extends: Icon,

    data: vm => ({
        icon: hyphenate(vm.constructor.options.name)
    })

};

export const Slidenav = {

    extends: IconComponent,

    connected() {
        addClass(this.$el, 'uk-slidenav');
    },

    computed: {

        icon({icon}, $el) {
            return hasClass($el, 'uk-slidenav-large')
                ? `${icon}-large`
                : icon;
        }

    }

};

export const Search = {

    extends: IconComponent,

    computed: {

        icon({icon}, $el) {
            return hasClass($el, 'uk-search-icon') && parents($el, '.uk-search-large').length
                ? 'search-large'
                : parents($el, '.uk-search-navbar').length
                    ? 'search-navbar'
                    : icon;
        }

    }

};

export const Close = {

    extends: IconComponent,

    connected() {
        this.icon = `close-${hasClass(this.$el, 'uk-close-large') ? 'large' : 'icon'}`;
    }

};

export const Spinner = {

    extends: IconComponent,

    connected() {
        this.svg.then(svg => this.ratio !== 1 && css($('circle', svg), 'strokeWidth', 1 / this.ratio), noop);
    }

};

function install(UIkit) {
    UIkit.icon.add = added => {
        Object.keys(added).forEach(name => {
            icons[name] = added[name];
            delete parsed[name];
        });

        if (UIkit._initialized) {
            apply(document.body, el => {
                const icon = UIkit.getComponent(el, 'icon');
                if (icon) {
                    icon.$reset();
                }
            });
        }
    };
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

function applyRtl(icon) {
    return isRtl ? swap(swap(icon, 'left', 'right'), 'previous', 'next') : icon;
}
