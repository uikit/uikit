export default function (UIkit) {

    const {removeClass} = UIkit.util;

    return {

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
