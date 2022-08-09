export default {
    update: {
        write() {
            if (this.stack.length || this.dragging) {
                return;
            }

            const index = this.getValidIndex(this.index);

            if (!~this.prevIndex || this.index !== index) {
                this.show(index);
            } else {
                this._translate(1, this.prevIndex, this.index);
            }
        },

        events: ['resize'],
    },
};
