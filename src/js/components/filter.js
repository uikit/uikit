import Animate from '../mixin/animate';
import {
    $$,
    append,
    css,
    data,
    each,
    fastdom,
    children as getChildren,
    hasClass,
    includes,
    isEmpty,
    isEqual,
    isUndefined,
    matches,
    parseOptions,
    toggleClass,
    trigger,
} from 'uikit-util';

export default {
    mixins: [Animate],

    args: 'target',

    props: {
        target: Boolean,
        selActive: Boolean,
    },

    data: {
        target: null,
        selActive: false,
        attrItem: 'uk-filter-control',
        cls: 'uk-active',
        duration: 250,
    },

    computed: {
        toggles: {
            get({ attrItem }, $el) {
                return $$(`[${attrItem}],[data-${attrItem}]`, $el);
            },

            watch() {
                this.updateState();

                if (this.selActive !== false) {
                    const actives = $$(this.selActive, this.$el);
                    this.toggles.forEach((el) => toggleClass(el, this.cls, includes(actives, el)));
                }
            },

            immediate: true,
        },

        children: {
            get({ target }, $el) {
                return $$(`${target} > *`, $el);
            },

            watch(list, old) {
                if (old && !isEqualList(list, old)) {
                    this.updateState();
                }
            },

            immediate: true,
        },
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
            },
        },
    ],

    methods: {
        apply(el) {
            const prevState = this.getState();
            const newState = mergeState(el, this.attrItem, this.getState());

            if (!isEqualState(prevState, newState)) {
                this.setState(newState);
            }
        },

        getState() {
            return this.toggles
                .filter((item) => hasClass(item, this.cls))
                .reduce((state, el) => mergeState(el, this.attrItem, state), {
                    filter: { '': '' },
                    sort: [],
                });
        },

        setState(state, animate = true) {
            state = { filter: { '': '' }, sort: [], ...state };

            trigger(this.$el, 'beforeFilter', [this, state]);

            this.toggles.forEach((el) =>
                toggleClass(el, this.cls, !!matchFilter(el, this.attrItem, state))
            );

            Promise.all(
                $$(this.target, this.$el).map((target) => {
                    const filterFn = () => {
                        applyState(state, target, getChildren(target));
                        this.$update(this.$el);
                    };
                    return animate ? this.animate(filterFn, target) : filterFn();
                })
            ).then(() => trigger(this.$el, 'afterFilter', [this]));
        },

        updateState() {
            fastdom.write(() => this.setState(this.getState(), false));
        },
    },
};

function getFilter(el, attr) {
    return parseOptions(data(el, attr), ['filter']);
}

function isEqualState(stateA, stateB) {
    return ['filter', 'sort'].every((prop) => isEqual(stateA[prop], stateB[prop]));
}

function applyState(state, target, children) {
    const selector = getSelector(state);

    children.forEach((el) => css(el, 'display', selector && !matches(el, selector) ? 'none' : ''));

    const [sort, order] = state.sort;

    if (sort) {
        const sorted = sortItems(children, sort, order);
        if (!isEqual(sorted, children)) {
            append(target, sorted);
        }
    }
}

function mergeState(el, attr, state) {
    const filterBy = getFilter(el, attr);
    const { filter, group, sort, order = 'asc' } = filterBy;

    if (filter || isUndefined(sort)) {
        if (group) {
            if (filter) {
                delete state.filter[''];
                state.filter[group] = filter;
            } else {
                delete state.filter[group];

                if (isEmpty(state.filter) || '' in state.filter) {
                    state.filter = { '': filter || '' };
                }
            }
        } else {
            state.filter = { '': filter || '' };
        }
    }

    if (!isUndefined(sort)) {
        state.sort = [sort, order];
    }

    return state;
}

function matchFilter(
    el,
    attr,
    { filter: stateFilter = { '': '' }, sort: [stateSort, stateOrder] }
) {
    const { filter = '', group = '', sort, order = 'asc' } = getFilter(el, attr);

    return isUndefined(sort)
        ? (group in stateFilter && filter === stateFilter[group]) ||
              (!filter && group && !(group in stateFilter) && !stateFilter[''])
        : stateSort === sort && stateOrder === order;
}

function isEqualList(listA, listB) {
    return listA.length === listB.length && listA.every((el) => listB.includes(el));
}

function getSelector({ filter }) {
    let selector = '';
    each(filter, (value) => (selector += value || ''));
    return selector;
}

function sortItems(nodes, sort, order) {
    return [...nodes].sort(
        (a, b) =>
            data(a, sort).localeCompare(data(b, sort), undefined, { numeric: true }) *
            (order === 'asc' || -1)
    );
}
