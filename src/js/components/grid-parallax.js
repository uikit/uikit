function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    var {$$, addClass, css, scrolledOver, toFloat, toNodes} = UIkit.util;

    UIkit.component('grid-parallax', UIkit.components.grid.extend({

        props: {
            target: String,
            translate: Number
        },

        defaults: {
            target: false,
            translate: 150
        },

        computed: {

            translate({translate}) {
                return Math.abs(translate);
            },

            items({target}, $el) {
                return target ? $$(target, $el) : toNodes($el.children);
            }

        },

        init() {
            addClass(this.$el, 'uk-grid');
        },

        disconnected() {
            this.reset();
            css(this.$el, 'marginBottom', '');
        },

        update: [

            {

                read() {
                    this.columns = this.rows && this.rows[0] && this.rows[0].length || 0;
                    this.rows = this.rows && this.rows.map(elements => sortBy(elements, 'offsetLeft'));
                },

                write() {
                    css(this.$el, 'marginBottom', this.columns > 1
                        ? this.translate + toFloat(css(css(this.$el, 'marginBottom', ''), 'marginBottom'))
                        : '');
                },

                events: ['load', 'resize']
            },

            {

                read() {

                    this.scrolled = scrolledOver(this.$el) * this.translate;

                },

                write() {

                    if (!this.rows || this.columns === 1 || !this.scrolled) {
                        return this.reset();
                    }

                    this.rows.forEach(row =>
                        row.forEach((el, i) =>
                            css(el, 'transform', `translateY(${i % 2 ? this.scrolled : this.scrolled / 8}px)`)
                        )
                    );

                },

                events: ['scroll', 'load', 'resize']
            }
        ],

        methods: {

            reset() {
                css(this.items, 'transform', '');
            }

        }

    }));

    UIkit.component('grid-parallax').options.update.unshift({

        read() {
            this.reset();
        },

        events: ['load', 'resize']

    });

    function sortBy(collection, prop) {
        return collection.sort((a, b) =>
            a[prop] > b[prop]
                ? 1
                : b[prop] > a[prop]
                    ? -1
                    : 0
        )
    }

}

if (!BUNDLED && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

export default plugin;
