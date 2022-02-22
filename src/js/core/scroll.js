import { $, escape, scrollIntoView, trigger } from 'uikit-util';

export default {
    props: {
        offset: Number,
    },

    data: {
        offset: 0,
    },

    methods: {
        async scrollTo(el) {
            el = (el && $(el)) || document.body;

            if (trigger(this.$el, 'beforescroll', [this, el])) {
                await scrollIntoView(el, { offset: this.offset });
                trigger(this.$el, 'scrolled', [this, el]);
            }
        },
    },

    events: {
        click(e) {
            if (e.defaultPrevented) {
                return;
            }

            e.preventDefault();
            this.scrollTo(`#${escape(decodeURIComponent((this.$el.hash || '').substr(1)))}`);
        },
    },
};
