function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    const {assign, css, fastdom, height, includes, isVisible, noop, position, Promise, toFloat, toNodes, Transition} = UIkit.util;

    const reset = {
        height: '',
        left: '',
        marginTop: '',
        pointerEvents: '',
        position: '',
        top: '',
        width: ''
    };

    UIkit.mixin.animate = {

        props: {
            animation: Number
        },

        defaults: {
            animation: 150
        },

        computed: {

            container() {
                return this.$el;
            }

        },

        methods: {

            animate(action) {

                let children = toNodes(this.container.children);
                let propsFrom = children.map(el => getProps(el, true));

                const oldHeight = height(this.container);

                css(this.container, 'minHeight', '');

                action();

                children.forEach(Transition.cancel);
                css(this.container.children, reset);
                updateImmediate(this.container);
                const newHeight = height(this.container);

                children = children.concat(toNodes(this.container.children).filter(el => !includes(children, el)));

                const propsTo = children.map((el, i) =>
                    el.parentNode && i in propsFrom
                        ? propsFrom[i]
                            ? isVisible(el)
                                ? assign({
                                    width: el.offsetWidth,
                                    height: el.offsetHeight,
                                }, getPositionWithMargin(el))
                                : {opacity: 0}
                            : {opacity: isVisible(el) ? 1 : 0}
                        : false
                );

                propsFrom = propsTo.map((props, i) => {
                    const from = children[i].parentNode === this.container
                        ? propsFrom[i] || getProps(children[i])
                        : false;

                    if (from) {
                        if (!props) {
                            delete from.opacity;
                            return;
                        }

                        if (!('opacity' in props)) {
                            const {opacity} = from;

                            if (opacity % 1) {
                                props.opacity = 1;
                            } else {
                                delete from.opacity;
                            }
                        }
                    }

                    return from;
                });

                children.forEach((el, i) => propsFrom[i] && css(el, propsFrom[i]));

                css(this.container, 'minHeight', Math.max(oldHeight, newHeight));

                return Promise.all(children.map((el, i) =>
                    propsFrom[i] && propsTo[i]
                        ? Transition.start(el, propsTo[i], this.animation, 'ease')
                        : Promise.resolve()
                )).then(() => {
                    css(this.container, 'minHeight', '');
                    css(children, reset);
                    children.forEach((el, i) => css(el, {
                        opacity: '',
                        display: propsTo[i].opacity === 0 ? 'none' : ''
                    }));
                    updateImmediate(this.container);
                }, noop);

            }
        }
    };

    function getProps(el, opacity) {
        return isVisible(el)
            ? assign({
                display: '',
                height: el.offsetHeight,
                marginTop: '0 !important',
                opacity: opacity ? css(el, 'opacity') : '0',
                pointerEvents: 'none',
                position: 'absolute',
                width: el.offsetWidth
            }, getPositionWithMargin(el))
            : false;
    }

    function updateImmediate(el) {
        UIkit.update('update', el, true);
        fastdom.flush();
    }

    function getPositionWithMargin(el) {
        let {top, left} = position(el);
        top += toFloat(css(el, 'marginTop'));
        return {top, left};
    }

}

export default plugin;
