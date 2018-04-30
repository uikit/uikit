function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    const {addClass, css, scrolledOver, sortBy, toFloat} = UIkit.util;

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

                read({rows}) {
                    return {
                        columns: rows && rows[0] && rows[0].length || 0,
                        rows: rows && rows.map(elements => sortBy(elements, 'offsetLeft'))
                    };
                },

                write({columns}) {
                    css(this.$el, 'marginBottom', columns > 1
                        ? this.translate + toFloat(css(css(this.$el, 'marginBottom', ''), 'marginBottom'))
                        : '');
                },

                events: ['load', 'resize']
            },

            {

                read() {
                    return {scrolled: scrolledOver(this.$el) * this.translate};
                },

                write({rows, columns, scrolled}) {

                    if (!rows || columns === 1 || !scrolled) {
                        return this.reset();
                    }

                    rows.forEach(row =>
                        row.forEach((el, i) =>
                            css(el, 'transform', `translateY(${i % 2 ? scrolled : scrolled / 8}px)`)
                        )
                    );

                },

                events: ['scroll', 'load', 'resize']
            }
        ],

        methods: {

            reset() {
                css(this.$el.children, 'transform', '');
            }

        }

    }));

    UIkit.components.gridParallax.options.update.unshift({

        read() {
            this.reset();
        },

        events: ['load', 'resize']

    });

}

if (!BUNDLED && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

export default plugin;
