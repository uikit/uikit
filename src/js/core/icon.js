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
import {$, addClass, apply, assign, css, hasClass, isRtl, noop, parents, Promise, swap} from 'uikit-util';

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

    extends: SVG,

    mixins: [Class],

    name: 'icon',

    args: 'icon',

    props: ['icon'],

    defaults: {exclude: ['id', 'style', 'class', 'src', 'icon', 'ratio']},

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

};

export default Icon;

export const IconComponent = {

    install(_, options, name) {
        options.defaults = {icon: name};
    },

    extends: Icon,

};

export const Slidenav = assign({

    init() {
        addClass(this.$el, 'uk-slidenav');

        if (hasClass(this.$el, 'uk-slidenav-large')) {
            this.icon += '-large';
        }
    }

}, IconComponent);

export const Search = assign({

    init() {
        if (hasClass(this.$el, 'uk-search-icon') && parents(this.$el, '.uk-search-large').length) {
            this.icon = 'search-large';
        } else if (parents(this.$el, '.uk-search-navbar').length) {
            this.icon = 'search-navbar';
        }
    }

}, IconComponent);

export const Close = assign({

    init() {
        this.icon = `close-${hasClass(this.$el, 'uk-close-large') ? 'large' : 'icon'}`;
    }

}, IconComponent);

export const Spinner = assign({

    connected() {
        this.svg.then(svg => this.ratio !== 1 && css($('circle', svg), 'stroke-width', 1 / this.ratio), noop);
    }

}, IconComponent);

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
