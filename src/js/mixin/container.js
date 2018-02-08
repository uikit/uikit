import UIkit from '../api/index';
import {$} from '../util/index';

export default {

    props: {
        container: Boolean
    },

    defaults: {
        container: true
    },

    computed: {

        container({container}) {
            return container === true && UIkit.container || container && $(container);
        }

    }

};
