import $ from 'jquery';
import {isWithin, toJQuery} from '../util/index';

export default function (UIkit) {

    UIkit.component('offcanvas', {

        mixins: [UIkit.mixin.toggle],

        props: {
            mode: String
        },

        defaults: {
            clsSidebar: 'uk-offcanvas-sidebar',
            clsContent: 'uk-offcanvas-content',
            clsToggle: 'uk-offcanvas-toggle',
            cls: 'uk-offcanvas-animation',
            mode: 'overlay'
        },

        ready() {

            this.trigger = toJQuery(`.${this.clsToggle}`, this.$el);
            this.sidebar = toJQuery(`.${this.clsSidebar}`, this.$el);
            this.content = toJQuery(`.${this.clsContent}`, this.$el);

            if (!this.trigger || !this.sidebar || !this.content) {
                return;
            }

            this.$el.addClass(`uk-offcanvas-mode-${this.mode}`);

            if (this.mode === 'reveal') {
                this.sidebar.addClass(this.cls);
            }

            this.trigger.on('click', e => {
                e.stopPropagation();
                this.toggle()
            });

            $(document).on('click', ({target}) => {
                if (!isWithin(target, this.sidebar)) {
                    this.toggle(false);
                }
            });

        },

        methods: {

            toggle(show) {

                if (this.mode !== 'reveal') {
                    this.toggleState(this.sidebar, false, show);
                }

                if (this.mode === 'push' || this.mode === 'reveal') {
                    this.toggleState(this.content, false, show);
                }
            }

        }

    });

}
