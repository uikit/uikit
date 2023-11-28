import {
    $$,
    css,
    filter,
    data as getData,
    once,
    removeClass,
    removeClasses,
    toggleClass,
    trigger,
} from 'uikit-util';
import { intersection } from '../api/observables';

export default {
    args: 'cls',

    props: {
        cls: String,
        target: String,
        hidden: Boolean,
        margin: String,
        repeat: Boolean,
        delay: Number,
    },

    data: () => ({
        cls: '',
        target: false,
        hidden: true,
        margin: '-1px',
        repeat: false,
        delay: 0,
        inViewClass: 'uk-scrollspy-inview',
    }),

    computed: {
        elements: ({ target }, $el) => (target ? $$(target, $el) : [$el]),
    },

    watch: {
        elements(elements) {
            if (this.hidden) {
                // use `opacity:0` instead of `visibility:hidden` to make content focusable with keyboard
                css(filter(elements, `:not(.${this.inViewClass})`), 'opacity', 0);
            }
        },
    },

    connected() {
        this.elementData = new Map();
    },

    disconnected() {
        for (const [el, state] of this.elementData.entries()) {
            removeClass(el, this.inViewClass, state?.cls || '');
        }
        delete this.elementData;
    },

    observe: intersection({
        target: ({ elements }) => elements,
        handler(records) {
            const elements = this.elementData;
            for (const { target: el, isIntersecting } of records) {
                if (!elements.has(el)) {
                    elements.set(el, {
                        cls: getData(el, 'uk-scrollspy-class') || this.cls,
                    });
                }

                const state = elements.get(el);
                if (!this.repeat && state.show) {
                    continue;
                }

                state.show = isIntersecting;
            }

            this.$emit();
        },
        options: ({ margin }) => ({ rootMargin: margin }),
        args: { intersecting: false },
    }),

    update: [
        {
            write(data) {
                for (const [el, state] of this.elementData.entries()) {
                    if (state.show && !state.inview && !state.queued) {
                        state.queued = true;

                        data.promise = (data.promise || Promise.resolve())
                            .then(() => new Promise((resolve) => console.log('this.delay:', this.delay) || setTimeout(resolve, this.delay)))
                            .then(() => {
                                this.toggle(el, true);
                                setTimeout(() => {
                                    state.queued = false;
                                    this.$emit();
                                }, 300);
                            });
                    } else if (!state.show && state.inview && !state.queued && this.repeat) {
                        this.toggle(el, false);
                    }
                }
            },
        },
    ],

    methods: {
        toggle(el, inview) {
            const state = this.elementData.get(el);
            // debugger;
            console.log('State: ', state, this.elementData, el);

            if (!state) {
                return;
            }

            state.off?.();

            css(el, 'opacity', !inview && this.hidden ? 0 : '');

            toggleClass(el, this.inViewClass, inview);
            toggleClass(el, state.cls);

            // let ORIGINAL_DISPLAY = window.getComputedStyle(el, 'display')
            // so, let's do a display none (el.style('display', 'none');
            // then do all the steps below (together, NOT one-by-one)
            // then again a display: ORIGINAL (el.style('display', ORIGINAL);

            // #1
            //window.getComputedStyle(el, 'top');

            // #2
            //console.log(el, el.clientHeight);

            // #3
            //console.log(el, el.offsetHeight);

            // #4
            /*
            const t = el.ownerDocument.createTextNode(' ') ;
            el.appendChild(t) ;
            setTimeout(() => { el.removeChild(t) }, 0) ;
            */

            // #5
            //el.appendChild(el.childNodes[el.childNodes.length - 1]);

            // #6
            // Maybe using window.requestAnimationFrame(() => { ... })


            /*
            * @TODO:
            *   - 1.) test if only calling window.getComputedStyle(el, 'top'); will resolve the issue
            *   - 2.) 1 + also console.log clientHeight & offsetHeight
            *   - 3.) test other CSS properties: height -> adding 0.1px to it
            *   - 4.) restrict code by filtering to svg extensions only
            * */

            const triggerRepaint = () => {
                Array.prototype
                    .slice
                    .call(el
                        .querySelectorAll('img')
                    )
                    .filter(el => {
                        return console.log(el) || 1;
                    })
                    .forEach(img => {
                        console.log('window.getComputedStyle(el, "top"): ', window.getComputedStyle(el, 'top'));
                        return;

                        const display = img.style.display;
                        if (display === 'none') {
                            return;
                        }
                        img.style.display = 'none';
                        const h = img.offsetHeight;
                        img.style.display = display;
                        return h;
                    });
            }

            if (/\buk-animation-/.test(state.cls)) {
                const removeAnimationClasses = () => {
                    removeClasses(el, 'uk-animation-[\\w-]+');
                    triggerRepaint();
                };
                if (inview) {
                    state.off = once(el, 'animationcancel animationend', removeAnimationClasses);
                } else {
                    removeAnimationClasses();
                }
            }

            trigger(el, inview ? 'inview' : 'outview');

            state.inview = inview;

            // change to `visibility: hidden` does not trigger observers
            this.$update(el);
        },
    },
};
