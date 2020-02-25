import {$$, boxModelAdjust, css, isIE, toFloat} from 'uikit-util';

// IE 11 fix (min-height on a flex container won't apply to its flex items)
export default isIE ? {

    props: {
        selMinHeight: String
    },

    data: {
        selMinHeight: false,
        forceHeight: false
    },

    computed: {

        elements({selMinHeight}, $el) {
            return selMinHeight ? $$(selMinHeight, $el) : [$el];
        }

    },

    update: [

        {

            read() {
                css(this.elements, 'height', '');
            },

            order: -5,

            events: ['resize']

        },

        {

            write() {
                this.elements.forEach(el => {
                    const height = toFloat(css(el, 'minHeight'));
                    if (height && (this.forceHeight || Math.round(height + boxModelAdjust(el, 'height', 'content-box')) >= el.offsetHeight)) {
                        css(el, 'height', height);
                    }
                });
            },

            order: 5,

            events: ['resize']

        }

    ]

} : {};
