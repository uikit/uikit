export default function (UIkit) {

    var {fastdom, removeClass} = UIkit.util;

    return {

        ready() {
            fastdom.write(() => this.show(this.getValidIndex()));
        },

        update: [

            {

                read() {
                    this._resetComputeds();
                },

                write() {

                    if (this.stack.length) {
                        return;
                    }

                    var index = this.getValidIndex();
                    delete this.index;
                    removeClass(this.slides, this.clsActive, this.clsActivated);
                    this.show(index);

                },

                events: ['load', 'resize']

            }

        ]

    };

}
