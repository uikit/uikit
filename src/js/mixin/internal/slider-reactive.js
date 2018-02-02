export default function (UIkit) {

    const {fastdom, removeClass} = UIkit.util;

    return {

        ready() {
            fastdom.write(() => this.show(this.getValidIndex()));
        },

        update: [

            {

                write() {

                    if (this.stack.length || this.dragging) {
                        return;
                    }

                    const index = this.getValidIndex();
                    delete this.index;
                    removeClass(this.slides, this.clsActive, this.clsActivated);
                    this.show(index);

                },

                events: ['load', 'resize']

            }

        ]

    };

}
