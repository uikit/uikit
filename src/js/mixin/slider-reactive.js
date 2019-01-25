import {removeClass} from 'uikit-util';

export default {

    update: {

        write() {

            if (this.stack.length || this.dragging) {
                return;
            }

            const index = this.getValidIndex();
            delete this.index;
            removeClass(this.slides, this.clsActive, this.clsActivated);
            this.show(index);

        },

        events: ['resize']

    }

};
