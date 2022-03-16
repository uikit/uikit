import {
    getCssVar,
    isString,
    on,
    trigger,
    toFloat,
    startsWith,
    isNumeric,
    createEvent,
} from 'uikit-util';

export default {
    props: {
        media: Boolean,
    },

    data: {
        media: false,
    },

    computed: {
        matchMedia() {
            return this.mediaObj?.matches;
        },
    },

    connected() {
        const media = toMedia(this.media);
        this.mediaObj = window.matchMedia(media);
        const handler = () =>
            trigger(this.$el, createEvent('mediachange', false, true, [this.mediaObj]));
        this.offMediaObj = on(this.mediaObj, 'change', () => {
            handler();
            this.$emit('resize');
        });
        handler();
    },

    disconnected() {
        this.offMediaObj?.();
    },
};

function toMedia(value) {
    if (isString(value)) {
        if (startsWith(value, '@')) {
            const name = `breakpoint-${value.substr(1)}`;
            value = toFloat(getCssVar(name));
        } else if (isNaN(value)) {
            return value;
        }
    }

    return value && isNumeric(value) ? `(min-width: ${value}px)` : '';
}
