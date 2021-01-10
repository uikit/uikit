import {addClass, append, assign, children, css, fastdom, height, includes, index, isVisible, noop, offset, parent, position, Promise, removeClass, Transition} from 'uikit-util';

const targetClass = 'uk-animation-target';

export default function (action, target, duration) {

    return new Promise(resolve =>
        requestAnimationFrame(() => {
            addStyle();

            let nodes = children(target);

            // Get current state
            const currentProps = nodes.map(el => getProps(el, true));
            const oldHeight = height(target);

            // Cancel previous animations
            Transition.cancel(target);
            nodes.forEach(Transition.cancel);
            removeClass(target, targetClass);
            reset(target);

            // Adding, sorting, removing nodes
            action();

            // Find new nodes
            nodes = nodes.concat(children(target).filter(el => !includes(nodes, el)));

            // Wait for update to propagate
            Promise.resolve().then(() => {

                // Force update
                fastdom.flush();

                // Get new state
                const newHeight = height(target);
                const [propsTo, propsFrom] = getTransitionProps(target, nodes, currentProps);

                // Reset to previous state
                addClass(target, targetClass);
                nodes.forEach((el, i) => propsFrom[i] && css(el, propsFrom[i]));
                css(target, {height: oldHeight, display: 'block'});

                // Start transitions on next frame
                requestAnimationFrame(() => {

                    const transitions = nodes.map((el, i) =>
                            parent(el) === target && Transition.start(el, propsTo[i], duration, 'ease')
                        ).concat(Transition.start(target, {height: newHeight}, duration, 'ease'));

                    Promise.all(transitions).then(() => {
                        nodes.forEach((el, i) => parent(el) === target && css(el, 'display', propsTo[i].opacity === 0 ? 'none' : ''));
                        reset(target);
                    }, noop).then(resolve);

                });
            });
        }));
}

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

function getTransitionProps(target, nodes, currentProps) {

    const propsTo = nodes.map((el, i) =>
        parent(el) && i in currentProps
            ? currentProps[i]
            ? isVisible(el)
                ? getPositionWithMargin(el)
                : {opacity: 0}
            : {opacity: isVisible(el) ? 1 : 0}
            : false);

    const propsFrom = propsTo.map((props, i) => {

        const from = parent(nodes[i]) === target && (currentProps[i] || getProps(nodes[i]));

        if (!from) {
            return false;
        }

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

        return from;
    });

    return [propsTo, propsFrom];
}

function reset(el) {
    css(el.children, {
        height: '',
        left: '',
        opacity: '',
        pointerEvents: '',
        position: '',
        top: '',
        width: '',
        zIndex: ''
    });
    removeClass(el, targetClass);
    css(el, {height: '', display: ''});
}

function getPositionWithMargin(el) {
    const {height, width} = offset(el);
    const {top, left} = position(el);

    return {top, left, height, width};
}

let style;

function addStyle() {
    if (style) {
        return;
    }
    style = !!append(document.head, `<style>
        .${targetClass} > * {
            margin-top: 0 !important;
            transform: none !important;
        }
    </style>`);
}
