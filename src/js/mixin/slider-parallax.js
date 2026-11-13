import ScrollDriven from './scroll-driven';

export default {
    mixins: [ScrollDriven],

    props: {
        parallax: Boolean,
    },

    data: {
        parallax: false,
    },

    computed: {
        parallaxTargetFallback() {
            return this.list;
        },
    },

    update: {
        write({ percent }) {
            if (!this.parallax) {
                return;
            }

            const [prevIndex, slidePercent] = this.getIndexAt(percent);
            const nextIndex = this.getValidIndex(prevIndex + Math.ceil(slidePercent));

            this.dir = 1;
            this._seek(prevIndex, nextIndex);
            this._translate(prevIndex === nextIndex ? 1 : slidePercent);
        },

        events: ['scroll', 'resize'],
    },

    methods: {
        getIndexAt(percent) {
            const index = percent * (this.length - 1);
            return [Math.floor(index), index % 1];
        },
    },
};
