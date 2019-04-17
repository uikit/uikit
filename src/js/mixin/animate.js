import {addClass, append, assign, css, fastdom, height, includes, index, isVisible, noop, position, Promise, removeClass, scrollTop, toFloat, toNodes, Transition} from 'uikit-util';

const targetClass = 'uk-animation-target';

export default {

    props: {
        animation: Number
    },

    data: {
        animation: 150
    },

    computed: {

        target() {
            return this.$el;
        }

    },

    methods: {

        animate(action) {

            addStyle();

            let children = toNodes(this.target.children);
            let propsFrom = children.map(el => getProps(el, true));

            const oldHeight = height(this.target);
            const oldScrollY = window.pageYOffset;

            action();

            Transition.cancel(this.target);
            children.forEach(Transition.cancel);

            reset(this.target);
            this.$update(this.target);
            fastdom.flush();

            const newHeight = height(this.target);

            children = children.concat(toNodes(this.target.children).filter(el => !includes(children, el)));

            const propsTo = children.map((el, i) =>
                el.parentNode && i in propsFrom
                    ? propsFrom[i]
                    ? isVisible(el)
                        ? getPositionWithMargin(el)
                        : {opacity: 0}
                    : {opacity: isVisible(el) ? 1 : 0}
                    : false
            );

            propsFrom = propsTo.map((props, i) => {
                const from = children[i].parentNode === this.target
                    ? propsFrom[i] || getProps(children[i])
                    : false;

                if (from) {
                    if (!props) {
                        delete from.opacity;
                    } else if (!('opacity' in props)) {
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

            addClass(this.target, targetClass);
            children.forEach((el, i) => propsFrom[i] && css(el, propsFrom[i]));
            css(this.target, 'height', oldHeight);
            scrollTop(window, oldScrollY);

            return Promise.all(children.map((el, i) =>
                propsFrom[i] && propsTo[i]
                    ? Transition.start(el, propsTo[i], this.animation, 'ease')
                    : Promise.resolve()
            ).concat(Transition.start(this.target, {height: newHeight}, this.animation, 'ease'))).then(() => {
                children.forEach((el, i) => css(el, {display: propsTo[i].opacity === 0 ? 'none' : '', zIndex: ''}));
                reset(this.target);
                this.$update(this.target);
                fastdom.flush(); // needed for IE11
            }, noop);

        }
    }
};

function getProps(el, opacity) {

    const zIndex = css(el, 'zIndex');

    return isVisible(el)
        ? assign({
            display: '',
            opacity: opacity ? css(el, 'opacity') : '0',
            pointerEvents: 'none',
            position: 'absolute',
            zIndex: zIndex === 'auto' ? index(el) : zIndex
        }, getPositionWithMargin(el))
        : false;
}

function reset(el) {
    css(el.children, {
        height: '',
        left: '',
        opacity: '',
        pointerEvents: '',
        position: '',
        top: '',
        width: ''
    });
    removeClass(el, targetClass);
    css(el, 'height', '');
}

function getPositionWithMargin(el) {
    const {height, width} = el.getBoundingClientRect();
    let {top, left} = position(el);
    top += toFloat(css(el, 'marginTop'));

    return {top, left, height, width};
}

let style;

function addStyle() {
    if (style) {
        return;
    }
    style = append(document.head, '<style>').sheet;
    style.insertRule(
        `.${targetClass} > * {
            margin-top: 0 !important;
            transform: none !important;
        }`, 0
    );
}
