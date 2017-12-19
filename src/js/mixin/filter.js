import animator from './animator';

import { $$, attr, toggleClass, toNodes, hasAttr } from '../util/index';

export default {
    attrs: true,

    mixins: [animator],

    props: {
        filter: String,
        sort: String,
        attrSort: String,
        attrFilter: String
    },

    defaults: {
        sort: null,
        filter: null,
        attrSort: 'data-uk-sort',
        attrFilter: 'data-uk-filter'
    },

    computed: {
        targetNode() {
            return this.$el;
        },

        children() {
            return toNodes(this.targetNode.children);
        },

        useFilterAttribute() {
            return $$(this.filterAttribs.map(attr => `[${attr}]`).join(','), this.$el).length > 0;
        },

        useSortAttribute() {
            return $$(this.sortAttribs.map(attr => `[${attr}]`).join(','), this.$el).length > 0;
        },

        filterAttribs() {
            return this.attrFilter.split(',');
        },

        sortAttribs() {
            return this.attrSort.split(',');
        }
    },

    events: {
        filter(e) {
            if (e.detail !== this.filter) {
                this.filter = e.detail;
                this.animate(() => this.apply(), this.aninamtion, true);
            }
        },

        sort(e) {
            if (e.detail !== this.sort || e.detail === 'rnd') {
                this.sort = e.detail;
                this.animate(() => this.apply(), this.aninamtion, true);
            }
        }
    },

    methods: {

        getSortData(el) {
            if (this.useSortAttribute) {
                var data;
                this.sortAttribs.some(attrib => {
                    data = attr(el, attrib);
                    return data;
                });
                return data ? data : null;

            } else {
                return el.textContent;
            }
        },

        matches(el, term) {
            if (this.useFilterAttribute) {
                const val = attr(el, this.filterAttr);
                return val && val.split(',').map(d => d.trim()).indexOf(term) >= 0;
            } else {
                return el.textContent.indexOf(term) >= 0;
            }
        },

        sorting(a, b) {

            if (this.sort === 'rnd') {

                return Math.round(Math.random() * 2) - 1;

            } else if (this.sort) {

                a = this.getSortData(a);
                b = this.getSortData(b);

                if (!a) {
                    return 1;
                } else if (!b) {
                    return -1;
                }

                if (this.sort === 'asc') {
                    return a.localeCompare(b);
                } else if (this.sort === 'desc') {
                    return -a.localeCompare(b);
                }
            }
        },

        apply(animate) {

            const nodes = this.sort ? this.children.concat().sort(this.sorting) : this.children;

            nodes.forEach((el, i) => {
                el.style.order = i++;
                const show = !this.filter || this.filter.split(',').map(term => term.trim()).some(term => {
                    return term && this.matches(el, term);
                });

                toggleClass(el, 'uk-hidden', !show);

            });

        }

    },
};

