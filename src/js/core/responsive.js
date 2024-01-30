import { addClass, css } from 'uikit-util';

export default {
    props: ['width', 'height'],

    connected() {
        addClass(this.$el, 'uk-responsive-width');
        css(this.$el, 'aspectRatio', `${this.width}/${this.height}`);
    },
};
