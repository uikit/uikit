import {
    $,
    addClass,
    apply,
    attr,
    css,
    each,
    hasAttr,
    hasClass,
    hyphenate,
    isRtl,
    isString,
    isTag,
    swap,
} from 'uikit-util';
import closeIcon from '../../images/components/close-icon.svg';
import closeLarge from '../../images/components/close-large.svg';
import dropParentIcon from '../../images/components/drop-parent-icon.svg';
import marker from '../../images/components/marker.svg';
import navParentIconLarge from '../../images/components/nav-parent-icon-large.svg';
import navParentIcon from '../../images/components/nav-parent-icon.svg';
import navbarParentIcon from '../../images/components/navbar-parent-icon.svg';
import navbarToggleIcon from '../../images/components/navbar-toggle-icon.svg';
import overlayIcon from '../../images/components/overlay-icon.svg';
import paginationNext from '../../images/components/pagination-next.svg';
import paginationPrevious from '../../images/components/pagination-previous.svg';
import searchIcon from '../../images/components/search-icon.svg';
import searchLarge from '../../images/components/search-large.svg';
import searchMedium from '../../images/components/search-medium.svg';
import slidenavNextLarge from '../../images/components/slidenav-next-large.svg';
import slidenavNext from '../../images/components/slidenav-next.svg';
import slidenavPreviousLarge from '../../images/components/slidenav-previous-large.svg';
import slidenavPrevious from '../../images/components/slidenav-previous.svg';
import spinner from '../../images/components/spinner.svg';
import totop from '../../images/components/totop.svg';
import I18n from '../mixin/i18n';
import Svg, { parseSVG } from '../mixin/svg';

const icons = {
    spinner,
    totop,
    marker,
    'close-icon': closeIcon,
    'close-large': closeLarge,
    'drop-parent-icon': dropParentIcon,
    'nav-parent-icon': navParentIcon,
    'nav-parent-icon-large': navParentIconLarge,
    'navbar-parent-icon': navbarParentIcon,
    'navbar-toggle-icon': navbarToggleIcon,
    'overlay-icon': overlayIcon,
    'pagination-next': paginationNext,
    'pagination-previous': paginationPrevious,
    'search-icon': searchIcon,
    'search-medium': searchMedium,
    'search-large': searchLarge,
    'search-toggle-icon': searchIcon,
    'slidenav-next': slidenavNext,
    'slidenav-next-large': slidenavNextLarge,
    'slidenav-previous': slidenavPrevious,
    'slidenav-previous-large': slidenavPreviousLarge,
};

const Icon = {
    install,

    mixins: [Svg],

    args: 'icon',

    props: { icon: String },

    isIcon: true,

    beforeConnect() {
        addClass(this.$el, 'uk-icon');
    },

    methods: {
        async getSvg() {
            const icon = getIcon(this.icon);

            if (!icon) {
                throw 'Icon not found.';
            }

            return icon;
        },
    },
};

export default Icon;

export const IconComponent = {
    args: false,

    extends: Icon,

    data: (vm) => ({
        icon: hyphenate(vm.constructor.options.name),
    }),

    beforeConnect() {
        addClass(this.$el, this.$options.id);
    },
};

export const NavParentIcon = {
    extends: IconComponent,

    beforeConnect() {
        const icon = this.$props.icon;
        this.icon = this.$el.closest('.uk-nav-primary') ? `${icon}-large` : icon;
    },
};

export const Search = {
    extends: IconComponent,

    mixins: [I18n],

    i18n: { toggle: 'Open Search', submit: 'Submit Search' },

    beforeConnect() {
        const isToggle =
            hasClass(this.$el, 'uk-search-toggle') || hasClass(this.$el, 'uk-navbar-toggle');
        this.icon = isToggle
            ? 'search-toggle-icon'
            : hasClass(this.$el, 'uk-search-icon') && this.$el.closest('.uk-search-large')
              ? 'search-large'
              : this.$el.closest('.uk-search-medium')
                ? 'search-medium'
                : this.$props.icon;

        if (hasAttr(this.$el, 'aria-label')) {
            return;
        }

        if (isToggle) {
            const label = this.t('toggle');
            attr(this.$el, 'aria-label', label);
        } else {
            const button = this.$el.closest('a,button');
            if (button) {
                const label = this.t('submit');
                attr(button, 'aria-label', label);
            }
        }
    },
};

export const Spinner = {
    extends: IconComponent,

    beforeConnect() {
        attr(this.$el, 'role', 'status');
    },

    methods: {
        async getSvg() {
            const icon = await Icon.methods.getSvg.call(this);

            if (this.ratio !== 1) {
                css($('circle', icon), 'strokeWidth', 1 / this.ratio);
            }

            return icon;
        },
    },
};

const ButtonComponent = {
    extends: IconComponent,

    mixins: [I18n],

    beforeConnect() {
        const button = this.$el.closest('a,button');

        attr(button, 'role', this.role !== null && isTag(button, 'a') ? 'button' : this.role);

        const label = this.t('label');
        if (label && !hasAttr(button, 'aria-label')) {
            attr(button, 'aria-label', label);
        }
    },
};

export const Slidenav = {
    extends: ButtonComponent,

    beforeConnect() {
        addClass(this.$el, 'uk-slidenav');
        const icon = this.$props.icon;
        this.icon = hasClass(this.$el, 'uk-slidenav-large') ? `${icon}-large` : icon;
    },
};

export const NavbarToggleIcon = {
    extends: ButtonComponent,
    i18n: { label: 'Open menu' },
};

export const Close = {
    extends: ButtonComponent,

    i18n: { label: 'Close' },

    beforeConnect() {
        this.icon = `close-${hasClass(this.$el, 'uk-close-large') ? 'large' : 'icon'}`;
    },
};

export const Marker = {
    extends: ButtonComponent,
    i18n: { label: 'Open' },
};

export const Totop = {
    extends: ButtonComponent,
    i18n: { label: 'Back to top' },
};

export const PaginationNext = {
    extends: ButtonComponent,
    i18n: { label: 'Next page' },
    data: { role: null },
};

export const PaginationPrevious = {
    extends: ButtonComponent,
    i18n: { label: 'Previous page' },
    data: { role: null },
};

const parsed = {};
function install(UIkit) {
    UIkit.icon.add = (name, svg) => {
        const added = isString(name) ? { [name]: svg } : name;
        each(added, (svg, name) => {
            icons[name] = svg;
            delete parsed[name];
        });

        if (UIkit._initialized) {
            apply(document.body, (el) =>
                each(UIkit.getComponents(el), (cmp) => {
                    cmp.$options.isIcon && cmp.icon in added && cmp.$reset();
                }),
            );
        }
    };
}

const aliases = { twitter: 'x' };

function getIcon(icon) {
    icon = aliases[icon] || icon;

    if (!icons[icon]) {
        return null;
    }

    if (!parsed[icon]) {
        parsed[icon] = parseSVG(icons[applyRtl(icon)] || icons[icon]);
    }

    return parsed[icon].cloneNode(true);
}

function applyRtl(icon) {
    return isRtl ? swap(swap(icon, 'left', 'right'), 'previous', 'next') : icon;
}
