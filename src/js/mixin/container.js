import {$} from 'uikit-util';

export default {

    props: {
        container: Boolean
    },

    defaults: {
        container: true
    },

    computed: {

        container({container}) {
            return container === true && this.$container || container && $(container);
        }

    }

};
