import {getCssVar, isString, toFloat} from 'uikit-util';

export default {

    props: {
        media: Boolean
    },

    data: {
        media: false
    },

    computed: {

        matchMedia() {
            const media = toMedia(this.media);
            return !media || window.matchMedia(media).matches;
        }

    }

};

function toMedia(value) {

    if (isString(value)) {
        if (value[0] === '@') {
            const name = `breakpoint-${value.substr(1)}`;
            value = toFloat(getCssVar(name));
        } else if (isNaN(value)) {
            return value;
        }
    }

    return value && !isNaN(value) ? `(min-width: ${value}px)` : false;
}
