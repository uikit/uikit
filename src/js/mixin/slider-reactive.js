export default {
    update: {
        write() {
            if (this.stack.length || this.dragging || this.parallax) {
                return;
            }

            const index = this.getValidIndex();

            if (!~this.prevIndex || this.index !== index) {
                this.show(index);
            } else {
                this._translate(1);
            }
        },

        events: ['resize'],
    },
};
