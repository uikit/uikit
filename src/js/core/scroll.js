import {$, escape, scrollIntoView, trigger} from 'uikit-util';

export default {

    props: {
        duration: Number,
        offset: Number
    },

    data: {
        duration: 1000,
        offset: 0
    },

    methods: {

        scrollTo(el) {

            el = el && $(el) || document.body;

            if (trigger(this.$el, 'beforescroll', [this, el])) {
                scrollIntoView(el, this.$props).then(() =>
                    trigger(this.$el, 'scrolled', [this, el])
                );
            }

        }

    },

    events: {

        click(e) {

            if (e.defaultPrevented) {
                return;
            }

            e.preventDefault();
            this.scrollTo(escape(decodeURIComponent(this.$el.hash)).substr(1));
        }

    }

};
