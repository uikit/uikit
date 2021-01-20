import {$, escape, scrollIntoView, trigger} from 'uikit-util';

export default {

    props: {
        offset: Number
    },

    data: {
        offset: 0
    },

    methods: {

        scrollTo(el) {

            el = el && $(el) || document.body;

            if (trigger(this.$el, 'beforescroll', [this, el])) {
                scrollIntoView(el, {offset: this.offset}).then(() =>
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
            this.scrollTo(`#${escape(decodeURIComponent((this.$el.hash || '').substr(1)))}`);
        }

    }

};
