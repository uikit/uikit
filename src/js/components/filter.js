import Animate from '../mixin/animate';
import {$$, $, append, assign, css, data, each, fastdom, hasClass, includes, isEmpty, isEqual, isUndefined, matches, parseOptions, toggleClass, toNodes, trigger} from 'uikit-util';

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

        toggles: {

            get({attrItem}, $el) {
                return $$(`[${this.attrItem}],[data-${this.attrItem}]`, $el);
            },

            watch() {
                this.updateState();
            }

        },

        target({target}, $el) {
            return $(target, $el);
        },

        children: {

            get() {
                return toNodes(this.target.children);
            },

            watch(list, old) {
                if (!isEqualList(list, old)) {
                    this.updateState();
                }
            }
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

        this.updateState();

        if (this.selActive !== false) {
            const actives = $$(this.selActive, this.$el);
            this.toggles.forEach(el => toggleClass(el, this.cls, includes(actives, el)));
        }

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

            const {children} = this;

            this.toggles.forEach(el => toggleClass(el, this.cls, !!matchFilter(el, this.attrItem, state)));

            const apply = () => {

                const selector = getSelector(state);

                children.forEach(el => css(el, 'display', selector && !matches(el, selector) ? 'none' : ''));

                const [sort, order] = state.sort;

                if (sort) {
                    const sorted = sortItems(children, sort, order);
                    if (!isEqual(sorted, children)) {
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

        },

        updateState() {
            fastdom.write(() => this.setState(this.getState(), false));
        }

    }

};

function getFilter(el, attr) {
    return parseOptions(data(el, attr), ['filter']);
}

function mergeState(el, attr, state) {

    const filterBy = getFilter(el, attr);
    const {filter, group, sort, order = 'asc'} = filterBy;

    if (filter || isUndefined(sort)) {

        if (group) {

            if (filter) {
                delete state.filter[''];
                state.filter[group] = filter;
            } else {
                delete state.filter[group];

                if (isEmpty(state.filter) || '' in state.filter) {
                    state.filter = {'': filter || ''};
                }

            }

        } else {
            state.filter = {'': filter || ''};
        }

    }

    if (!isUndefined(sort)) {
        state.sort = [sort, order];
    }

    return state;
}

function matchFilter(el, attr, {filter: stateFilter = {'': ''}, sort: [stateSort, stateOrder]}) {

    const {filter = '', group = '', sort, order = 'asc'} = getFilter(el, attr);

    if (isUndefined(sort)) {
        return group in stateFilter && filter === stateFilter[group]
            || !filter && group && !(group in stateFilter) && !stateFilter[''];
    } else {
        return stateSort === sort && stateOrder === order;
    }
    // filter = isUndefined(sort) ? filter || '' : filter;
    // sort = isUndefined(filter) ? sort || '' : sort;
    //
    // return (isUndefined(filter) || group in stateFilter && filter === stateFilter[group])
    //     && (isUndefined(sort) || stateSort === sort && stateOrder === order);
}

function isEqualList(listA, listB) {
    return listA.length === listB.length
        && listA.every(el => ~listB.indexOf(el));
}

function getSelector({filter}) {
    let selector = '';
    each(filter, value => selector += value || '');
    return selector;
}

function sortItems(nodes, sort, order) {
    return assign([], nodes).sort((a, b) => data(a, sort).localeCompare(data(b, sort), undefined, {numeric: true}) * (order === 'asc' || -1));
}
