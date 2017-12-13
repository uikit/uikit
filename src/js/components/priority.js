import { $, $$, closest, hide, isInvisible, isVisible, show, width, setVisible } from '../util/index';
import { isVisible } from '../util/dom';

function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    UIkit.component('priority-nav', {
        props: {
            source: String,
            exclude: String,
            target: String,
            container: String,
            containerElements: String,
        },

        defaults: {
            source: null,
            exclude: null,
            target: null,
            container: null,
            containerElements: null,
            lastTarget: null,
        },

        connected() {
            const navBarContainer = closest(this.$el, '.uk-navbar-container');
            if (navBarContainer) {
                this.container = this.container || navBarContainer;
                this.containerElements = this.containerElements || '[class^=uk-navbar-left],[class^=uk-navbar-right],[class^=uk-navbar-center]';
                this.source = this.source || '[class^=uk-navbar-] .uk-navbar-nav';
            }
        },

        disconnected() {
            this.restoreOriginalPriobar;
        },

        computed: {

            excludedNodes() {
                if (this.exclude) {
                    var ignoreList = [];
                    this.priorityLists.forEach(list => {
                        ignoreList = ignoreList.concat($$(this.exclude, list));
                    });
                    return ignoreList;
                } else {
                    return [];
                }
            },

            moreNode() {
                return this.$el;
            },

            containerNode() {
                return this.container ? $(this.container) : this.moreNode.parentNode;
            },

            priorityLists() {
                return this.source ? $$(this.source) : [this.containerNode];
            },

            allElements() {
                var allElements = [];
                this.priorityLists.forEach(list => {
                    allElements = allElements.concat($$('> *', list));
                });
                return allElements.filter(el => el !== this.moreNode).map(el => ({el}));
            },

            //the node to place menu items into
            temporaryNodes() {

                const newTargetLists = this.target ? $$(this.target) : $$('ul', this.moreNode);

                this.lastTarget = newTargetLists.length ? newTargetLists : this.lastTarget;
                var allElements = [];
                this.lastTarget.forEach(list => {
                    allElements = allElements.concat($$('> *', list));
                });
                return allElements;
            },

            moreNodeWidth() {
                return this.moreNode.getBoundingClientRect().width;
            },

            availableWidth() {
                return width(this.containerNode);
            }

        },

        methods: {

            hiddenElements() {
                return this.allElements.filter(item => !isVisible(item.el));
            },

            currentElements() {
                const cur = this.allElements.filter(item => isVisible(item.el));
                return cur;
            },

            neededWidth() {
                const w = this.currentElements().reduce((width, el) => width + (el.width || (el.width = el.el.getBoundingClientRect().width)), 0);
                return w + (this.currentElements().length < this.allElements.length ? this.moreNodeWidth : 0);
            },

            showMore() {
                return this.currentElements().length < this.allElements.length;
            },

            overLaps() {
                const overlappingChildren = $$(this.containerElements, this.containerNode).map(el => ({el, bounds: el.getBoundingClientRect()})).sort((a, b) => a.bounds.left - b.bounds.left);
                var lastRight;
                const overlaps = item => {
                    const doesOverlap = lastRight && lastRight > item.bounds.left;
                    lastRight = item.bounds.right;
                    return doesOverlap;
                };
                return overlappingChildren.some(overlaps);

            },

            hasBreakingElement() {
                var prevElement = null;
                var elements = this.showMore() ? this.currentElements().concat([{el: this.moreNode}]) : this.currentElements();
                const breaks = elements.some((el, i) => {
                    var breaks;
                    el.top = el.el.offsetTop;
                    if (prevElement) {
                        prevElement.height = prevElement.el.offsetHeight;
                        breaks = el.top >= (prevElement.top + prevElement.height);

                    }
                    prevElement = el;
                    return breaks;
                });

                return breaks;
            },

            canBePrioritized(el) {
                return this.excludedNodes.indexOf(el) === -1;
            },

            shouldShrink() {
                return this.currentElements().length
                    && this.hiddenElements().length < this.temporaryNodes.length
                    && (this.neededWidth() > this.availableWidth || this.hasBreakingElement() || this.overLaps());
            },

            priorityEnabled() {
                return true;
            },

            restoreOriginalPriobar() {

                this.allElements.forEach(node => {
                    show(node.el);
                });

                hide(this.moreNode);

            },

            resetMeasurements() {
                this.currentElements().forEach(el => {
                    delete el.width;
                    delete el.top;
                    delete el.height;
                });
                delete this._moreNodeBounds;
            },

            getNextItemToRemove() {

                for (var i = 0 ; i < this.currentElements().length; i++) {
                    const index = this.currentElements().length - i - 1;
                    const overHangingChild = this.currentElements()[index];
                    if (this.canBePrioritized(overHangingChild.el)) {
                        return overHangingChild;
                    }
                }
            },

            resize() {

                debugger;
                this.restoreOriginalPriobar();
                this.resetMeasurements();
                
                while (this.shouldShrink()) {

                    show(this.moreNode);

                    const overHangingChild = this.getNextItemToRemove();
                    if (overHangingChild) {
                        hide(overHangingChild.el);
                    } else {
                        break;
                    }
                }

                this.temporaryNodes.concat().reverse().forEach((node, i) => {
                    setVisible(node, i < this.hiddenElements().length);
                });
            }

        },

        update: {

            write() {

                if (this.priorityEnabled()) {

                    delete this._computeds.availableWidth;
                    delete this._computeds.allElements;
                    delete this._computeds.availableWidth;
                    this.resize();

                } else {
                    this.restoreOriginalPriobar();
                }

            },
            events: ['load', 'resize']
        }
    });

}

export default plugin;
