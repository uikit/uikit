export default {
    props: {
        i18n: Object,
    },

    data: {
        i18n: null,
    },

    methods: {
        t(key, ...params) {
            let i = 0;
            return (
                (this.i18n?.[key] || this.$options.i18n?.[key])?.replace(
                    /%s/g,
                    () => params[i++] || ''
                ) || ''
            );
        },
    },
};
