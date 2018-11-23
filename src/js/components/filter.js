import Animate from '../mixin/animate';
import {$$, $, append, assign, css, data, each, hasClass, includes, isUndefined, matches, parseOptions, toggleClass, toNodes, trigger} from 'uikit-util';

export default {

    mixins: [Animate],

    args: 'target',

    props: {
        target: Boolean,
        selActive: Boolean
    },

    data: {
        target: null,
        selActive: false,
        attrItem: 'uk-filter-control',
        cls: 'uk-active',
        animation: 250
    },

    computed: {

        toggles({attrItem}, $el) {
            return $$(`[${this.attrItem}],[data-${this.attrItem}]`, $el);
        },

        target({target}, $el) {
            return $(target, $el);
        }

    },

    events: [

        {

            name: 'click',

            delegate() {
                return `[${this.attrItem}],[data-${this.attrItem}]`;
            },

            handler(e) {

                e.preventDefault();
                this.apply(e.current);

            }

        }

    ],

    connected() {

        if (this.selActive === false) {
            return;
        }

        const actives = $$(this.selActive, this.$el);
        this.toggles.forEach(el => toggleClass(el, this.cls, includes(actives, el)));
    },

    update(data) {

        const {toggles, children} = data;
        if (isEqualList(toggles, this.toggles, false) && isEqualList(children, this.target.children, false)) {
            return;
        }

        data.toggles = this.toggles;
        data.children = this.target.children;

        this.setState(this.getState(), false);

    },

    methods: {

        apply(el) {
            this.setState(mergeState(el, this.attrItem, this.getState()));
        },

        getState() {
            return this.toggles
                .filter(item => hasClass(item, this.cls))
                .reduce((state, el) => mergeState(el, this.attrItem, state), {filter: {'': ''}, sort: []});
        },

        setState(state, animate = true) {

            state = assign({filter: {'': ''}, sort: []}, state);

            trigger(this.$el, 'beforeFilter', [this, state]);

            const children = toNodes(this.target.children);

            this.toggles.forEach(el => toggleClass(el, this.cls, matchFilter(el, this.attrItem, state)));

            const apply = () => {

                const selector = getSelector(state);

                children.forEach(el => css(el, 'display', selector && !matches(el, selector) ? 'none' : ''));

                const [sort, order] = state.sort;

                if (sort) {
                    const sorted = sortItems(children, sort, order);
                    if (!isEqualList(sorted, children)) {
                        sorted.forEach(el => append(this.target, el));
                    }
                }

            };

            if (animate) {
                this.animate(apply).then(() => trigger(this.$el, 'afterFilter', [this]));
            } else {
                apply();
                trigger(this.$el, 'afterFilter', [this]);
            }

        }

    }

};

function getFilter(el, attr) {
    return parseOptions(data(el, attr), ['filter']);
}

function mergeState(el, attr, state) {

    toNodes(el).forEach(el => {
        const filterBy = getFilter(el, attr);
        const {filter, group, sort, order = 'asc'} = filterBy;

        if (filter || isUndefined(sort)) {

            if (group) {
                delete state.filter[''];
                state.filter[group] = filter;
            } else {
                state.filter = {'': filter || ''};
            }

        }

        if (!isUndefined(sort)) {
            state.sort = [sort, order];
        }
    });

    return state;
}

function matchFilter(el, attr, {filter: stateFilter = {'': ''}, sort: [stateSort, stateOrder]}) {

    let {filter, group = '', sort, order = 'asc'} = getFilter(el, attr);

    filter = isUndefined(sort) ? filter || '' : filter;
    sort = isUndefined(filter) ? sort || '' : sort;

    return (isUndefined(filter) || group in stateFilter && filter === stateFilter[group])
        && (isUndefined(sort) || stateSort === sort && stateOrder === order);
}

function isEqualList(listA, listB, strict = true) {

    listA = toNodes(listA);
    listB = toNodes(listB);

    return listA.length === listB.length
        && listA.every((el, i) => strict ? el === listB[i] : ~listB.indexOf(el));
}

function getSelector({filter}) {
    let selector = '';
    each(filter, value => selector += value || '');
    return selector;
}

function sortItems(nodes, sort, order) {
    return toNodes(nodes).sort((a, b) => data(a, sort).localeCompare(data(b, sort), undefined, {numeric: true}) * (order === 'asc' || -1));
}
