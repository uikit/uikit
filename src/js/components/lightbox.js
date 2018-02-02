import LightboxPanel from './internal/lightbox-panel';

function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    UIkit.use(LightboxPanel);

    const {util} = UIkit;
    const {$$, assign, data, index} = util;
    const {options} = UIkit.components.lightboxPanel;

    UIkit.component('lightbox', {

        attrs: true,

        props: assign({toggle: String}, options.props),

        defaults: assign({toggle: 'a'}, Object.keys(options.props).reduce((defaults, key) => {
            defaults[key] = options.defaults[key];
            return defaults;
        }, {})),

        computed: {

            toggles({toggle}, $el) {
                return $$(toggle, $el);
            }

        },

        disconnected() {
            this._destroy();
        },

        events: [

            {

                name: 'click',

                delegate() {
                    return `${this.toggle}:not(.uk-disabled)`;
                },

                handler(e) {
                    e.preventDefault();
                    e.current.blur();
                    this.show(index(this.toggles, e.current));
                }

            }

        ],

        update(data) {

            if (this.panel && this.animation) {
                this.panel.$props.animation = this.animation;
                this.panel.$emit();
            }

            if (!this.panel || data.toggles && isEqualList(data.toggles, this.toggles)) {
                return;
            }

            data.toggles = this.toggles;
            this._destroy();
            this._init();

        },

        methods: {

            _init() {
                return this.panel = this.panel || UIkit.lightboxPanel(assign({}, this.$props, {
                    items: this.toggles.reduce((items, el) => {
                        items.push(['href', 'caption', 'type', 'poster', 'alt'].reduce((obj, attr) => {
                            obj[attr === 'href' ? 'source' : attr] = data(el, attr);
                            return obj;
                        }, {}));
                        return items;
                    }, [])
                }));
            },

            _destroy() {
                if (this.panel) {
                    this.panel.$destroy(true);
                    this.panel = null;
                }
            },

            show(index) {

                if (!this.panel) {
                    this._init();
                }

                return this.panel.show(index);

            },

            hide() {

                return this.panel && this.panel.hide();

            }

        }

    });

    function isEqualList(listA, listB) {
        return listA.length === listB.length
            && listA.every((el, i) => el !== listB[i]);
    }

}

if (!BUNDLED && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

export default plugin;
