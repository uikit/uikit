import Media from '../mixin/media';
import Togglable from '../mixin/togglable';
import {closest, hasTouch, includes, isTouch, isVisible, matches, pointerEnter, pointerLeave, queryAll, trigger} from 'uikit-util';

export default {

    mixins: [Media, Togglable],

    args: 'target',

    props: {
        href: String,
        target: null,
        mode: 'list',
    },

    data: {
        href: false,
        target: false,
        mode: 'click',
        queued: true,
    },

    computed: {

        target({href, target}, $el) {
            target = queryAll(target || href, $el);
            return target.length && target || [$el];
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

                if (!isTouch(e) && !includes(this.mode, 'click')) {
                    return;
                }

                // TODO better isToggled handling
                let link;
                if (closest(e.target, 'a[href="#"], a[href=""], button')
                    || (link = closest(e.target, 'a[href]')) && (
                        this.cls
                        || !isVisible(this.target)
                        || link.hash && matches(this.target, link.hash)
                    )
                ) {
                    e.preventDefault();
                }

                this.toggle();
            }

        }
    ],

    update: {

        write() {

            if (!includes(this.mode, 'media') || !this.media) {
                return;
            }

            const toggled = this.isToggled(this.target);
            if (this.matchMedia ? !toggled : toggled) {
                this.toggle();
            }

        },

        events: ['load', 'resize']

    },

    methods: {

        toggle(type) {
            if (trigger(this.target, type || 'toggle', [this])) {
                this.toggleElement(this.target);
            }
        }

    }

};
