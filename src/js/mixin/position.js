import { flipPosition, getCssVar, includes, isRtl, positionAt, toPx } from 'uikit-util';

export default {
    props: {
        pos: String,
        offset: null,
        flip: Boolean,
    },

    data: {
        pos: `bottom-${isRtl ? 'right' : 'left'}`,
        flip: true,
        offset: false,
    },

    connected() {
        this.pos = this.$props.pos.split('-').concat('center').slice(0, 2);
        this.axis = includes(['top', 'bottom'], this.pos[0]) ? 'y' : 'x';
    },

    methods: {
        positionAt(element, target, boundary) {
            const [dir, align] = this.pos;

            const mainAxisOffset =
                toPx(
                    this.offset === false ? getCssVar('position-offset', element) : this.offset,
                    this.axis === 'x' ? 'width' : 'height',
                    element
                ) * (includes(['left', 'top'], dir) ? -1 : 1);

            const crossAxisOffset = includes(['center', 'justify'], align)
                ? 0
                : toPx(
                      getCssVar('position-shift-offset', element),
                      this.axis === 'y' ? 'width' : 'height',
                      element
                  ) * (includes(['left', 'top'], align) ? 1 : -1);

            let offset = [mainAxisOffset, crossAxisOffset];

            const attach = {
                element: [flipPosition(dir), align],
                target: [dir, align],
            };

            if (this.axis === 'y') {
                for (const prop in attach) {
                    attach[prop] = attach[prop].reverse();
                }
                offset = offset.reverse();
            }

            positionAt(element, target, {
                attach,
                offset,
                boundary,
                flip: this.flip,
                viewportOffset: toPx(getCssVar('position-viewport-offset', element)),
            });
        },
    },
};
