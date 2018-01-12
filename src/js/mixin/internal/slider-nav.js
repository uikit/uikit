export default function (UIkit) {

    var {$, $$, data, html, index, toggleClass} = UIkit.util;

    return {

        defaults: {
            selNav: false
        },

        computed: {

            nav({selNav}, $el) {
                return $(selNav, $el);
            },

            navItemSelector({attrItem}) {
                return `[${attrItem}],[data-${attrItem}]`;
            },

            navItems(_, $el) {
                return $$(this.navItemSelector, $el);
            }

        },

        update: [

            {

                write() {

                    if (this.nav && this.length !== this.nav.children.length) {
                        html(this.nav, this.slides.map((_, i) => `<li ${this.attrItem}="${i}"><a href="#"></a></li>`).join(''));
                    }

                    toggleClass($$(this.navItemSelector, this.$el).concat(this.nav), 'uk-hidden', !this.maxIndex);

                },

                events: ['load', 'resize']

            }

        ],

        events: [

            {

                name: 'click',

                delegate() {
                    return this.navItemSelector;
                },

                handler(e) {
                    e.preventDefault();
                    e.current.blur();
                    this.show(data(e.current, this.attrItem));
                }

            },

            {

                name: 'itemshow',

                handler() {
                    var i = this.getValidIndex();
                    this.navItems.forEach(item => toggleClass(item, this.clsActive, index(item) === i));
                }

            }

        ]

    };

}
