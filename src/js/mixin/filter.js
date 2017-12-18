import animator from './animator';

import { $, Animation, css, fastdom, toggleClass, toNodes, isVisible } from '../util/index';

export default {
    attrs: true,

    mixins: [animator],

    props: {
        filter: String,
        sort: String
    },

    defaults: {
        sort: null,
        filter: null
    },

    computed: {
        targetNode() {
            return this.$el;
        },
        children() {
            return toNodes(this.targetNode.children);//.concat([this.targetNode]);
        }
    },

    events: {
        filter(e) {
            if (e.detail !== this.filter) {
                this.filter = e.detail;
                this.animate(() => this.apply());

                // this.apply(true);
            }
        },

        sort(e) {
            if (e.detail !== this.sort) {
                this.sort = e.detail;
                this.animate(() => this.apply());
                // this.apply(true);
            }
        }
    },

    methods: {
        apply(animate) {
            var nodes = toNodes(this.targetNode.children);
            switch (this.sort) {
            case 'asc':
                nodes = nodes.sort((a, b) => a.textContent.localeCompare(b.textContent));
            break;
            case 'desc':
                nodes = nodes.sort((a, b) => -a.textContent.localeCompare(b.textContent));
            break;
            }

            var i = 0;
            nodes.forEach(el => {
                el.style.order = i++;
   
                const show = !this.filter || this.filter.split(',').map(el => el.trim()).some(filter => {
                    return filter && el.textContent.indexOf(filter) >= 0;
                });

                const visible = isVisible(el);
                if (animate) {
                    if (show !== visible) {
                        if (show) {
                            Animation.in(el, 'uk-animation-scale-up', this.duration);
                        } else {
                            Animation.out(el, 'uk-animation-scale-up', this.duration);
                        }
                    }
                } else {
                    // css(el, 'display', show ? '' : 'none');
                    toggleClass(el, 'uk-hidden', !show);
                }
            });

            console.log('filter');
        }
    },

};

