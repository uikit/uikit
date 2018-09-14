import {$$, css, isIE, toFloat} from 'uikit-util';

// IE 11 fix (min-height on a flex container won't apply to its flex items)
export default isIE ? {

    data: {
        selMinHeight: false,
        forceHeight: false
    },

    update() {

        const targets = this.selMinHeight ? $$(this.selMinHeight, this.$el) : [this.$el];

        css(targets, 'height', '');

        targets.forEach(el => {
            const height = Math.round(toFloat(css(el, 'minHeight')));
            if (this.forceHeight || height >= el.offsetHeight) {
                css(el, 'height', height);
            }
        });

    }

} : {};
