import { addClass, css, Dimensions, height, inBrowser, isVisible, parent, width } from 'uikit-util';
import { resize } from '../api/observables';

const supportsAspectRatio = inBrowser && CSS.supports('aspect-ratio', 1);

export default {
    mixins: [
        supportsAspectRatio
            ? {
                  connected() {
                      css(this.$el, 'aspectRatio', `${this.width}/${this.height}`);
                  },
              }
            : {
                  observe: resize({
                      target: ({ $el }) => [$el, parent($el)],
                  }),

                  update: {
                      read() {
                          return isVisible(this.$el) && this.width && this.height
                              ? { width: width(parent(this.$el)), height: this.height }
                              : false;
                      },

                      write(dim) {
                          height(
                              this.$el,
                              Dimensions.contain(
                                  {
                                      height: this.height,
                                      width: this.width,
                                  },
                                  dim,
                              ).height,
                          );
                      },

                      events: ['resize'],
                  },
              },
    ],

    props: ['width', 'height'],

    connected() {
        addClass(this.$el, 'uk-responsive-width');
    },
};
