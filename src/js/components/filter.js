import Animate from '../mixin/animate';
import { parseOptions } from '../api/options';
import {
    $,
    $$,
    append,
    attr,
    closest,
    css,
    data,
    each,
    fastdom,
    children as getChildren,
    hasClass,
    includes,
    isEmpty,
    isEqual,
    isTag,
    isUndefined,
    matches,
    toggleClass,
    trigger,
} from 'uikit-util';
import { keyMap } from '../util/keys';

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
        toggles({ attrItem }, $el) {
            return $$(`[${attrItem}],[data-${attrItem}]`, $el);
        },

        children({ target }, $el) {
            return $$(`${target} > *`, $el);
        },
    },

    watch: {
        toggles(toggles) {
            this.updateState();

            const actives = $$(this.selActive, this.$el);
            for (const toggle of toggles) {
                if (this.selActive !== false) {
                    toggleClass(toggle, this.cls, includes(actives, toggle));
                }
                const button = findButton(toggle);
                if (isTag(button, 'a')) {
                    attr(button, 'role', 'button');
                }
            }
        },

        children(list, prev) {
            if (prev) {
                this.updateState();
            }
        },
    },

    events: {
        name: 'click keydown',

        delegate() {
            return `[${this.attrItem}],[data-${this.attrItem}]`;
        },

        handler(e) {
            if (e.type === 'keydown' && e.keyCode !== keyMap.SPACE) {
                return;
            }

            if (closest(e.target, 'a,button')) {
                e.preventDefault();
                this.apply(e.current);
            }
        },
    },

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

        async setState(state, animate = true) {
            state = { filter: { '': '' }, sort: [], ...state };

            trigger(this.$el, 'beforeFilter', [this, state]);

            for (const toggle of this.toggles) {
                toggleClass(toggle, this.cls, matchFilter(toggle, this.attrItem, state));
            }

            await Promise.all(
                $$(this.target, this.$el).map((target) => {
                    const filterFn = () => {
                        applyState(state, target, getChildren(target));
                        this.$update(this.$el);
                    };
                    return animate ? this.animate(filterFn, target) : filterFn();
                })
            );

            trigger(this.$el, 'afterFilter', [this]);
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
    const { filter, group, sort, order = 'asc' } = getFilter(el, attr);

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

function findButton(el) {
    return $('a,button', el) || el;
}
