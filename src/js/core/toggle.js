import Media from '../mixin/media';
import Togglable from '../mixin/togglable';
import {attr, closest, hasClass, hasTouch, includes, isBoolean, isTouch, isVisible, matches, pointerEnter, pointerLeave, queryAll, trigger} from 'uikit-util';

export default {

    mixins: [Media, Togglable],

    args: 'target',

    props: {
        href: String,
        target: null,
        mode: 'list',
        queued: Boolean
    },

    data: {
        href: false,
        target: false,
        mode: 'click',
        queued: true
    },

    computed: {

        target: {

            get({href, target}, $el) {
                target = queryAll(target || href, $el);
                return target.length && target || [$el];
            },

            watch() {
                this.updateAria();
            },

            immediate: true

        }

    },

    events: [

        {

            name: `${pointerEnter} ${pointerLeave}`,

            filter() {
                return includes(this.mode, 'hover');
            },

            handler(e) {
                if (!isTouch(e)) {
                    this.toggle(`toggle${e.type === pointerEnter ? 'show' : 'hide'}`);
                }
            }

        },

        {

            name: 'click',

            filter() {
                return includes(this.mode, 'click') || hasTouch && includes(this.mode, 'hover');
            },

            handler(e) {

                let link;
                if (closest(e.target, 'a[href="#"], a[href=""]')
                    || (link = closest(e.target, 'a[href]')) && (
                        !isToggled(this.target, this.cls)
                        || link.hash && matches(this.target, link.hash)
                    )
                ) {
                    e.preventDefault();
                }

                this.toggle();
            }

        },

        {

            name: 'toggled',

            self: true,

            el() {
                return this.target;
            },

            handler(e, toggled) {
                this.updateAria(toggled);
            }
        }

    ],

    update: {

        read() {
            return includes(this.mode, 'media') && this.media
                ? {match: this.matchMedia}
                : false;
        },

        write({match}) {

            const toggled = this.isToggled(this.target);
            if (match ? !toggled : toggled) {
                this.toggle();
            }

        },

        events: ['resize']

    },

    methods: {

        toggle(type) {

            if (!trigger(this.target, type || 'toggle', [this])) {
                return;
            }

            if (!this.queued) {
                return this.toggleElement(this.target);
            }

            const leaving = this.target.filter(el => hasClass(el, this.clsLeave));

            if (leaving.length) {
                this.target.forEach(el => {
                    const isLeaving = includes(leaving, el);
                    this.toggleElement(el, isLeaving, isLeaving);
                });
                return;
            }

            const toggled = this.target.filter(this.isToggled);
            this.toggleElement(toggled, false).then(() =>
                this.toggleElement(this.target.filter(el =>
                    !includes(toggled, el)
                ), true)
            );

        },

        updateAria(toggled) {
            attr(this.$el, 'aria-expanded', isBoolean(toggled)
                ? toggled
                : isToggled(this.target, this.cls)
            );
        }

    }

};

// TODO improve isToggled handling
function isToggled(target, cls) {
    return cls
        ? hasClass(target, cls.split(' ')[0])
        : isVisible(target);
}
