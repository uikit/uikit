import {query} from 'uikit-util';

export default {

    props: {
        container: Boolean
    },

    data: {
        container: true
    },

    computed: {

        container({container}, $el) {
            return container === true && this.$container || container && query(container, $el);
        }

    }

};
