import {addClass, append, assign, children, css, fastdom, height, includes, index, isVisible, noop, offset, parent, position, Promise, removeClass, toWindow, Transition, trigger} from 'uikit-util';

const targetClass = 'uk-animation-target';

export default function (action, target, duration) {

    addStyle();

    let nodes = children(target);
    let propsFrom = nodes.map(el => getProps(el, true));

    const oldHeight = height(target);

    action();

    Transition.cancel(target);
    nodes.forEach(Transition.cancel);

    reset(target);

    trigger(toWindow(target), 'resize'); // IE11

    return Promise.resolve().then(() => {

        fastdom.flush();

        const newHeight = height(target);

        nodes = nodes.concat(children(target).filter(el => !includes(nodes, el)));

        const propsTo = nodes.map((el, i) =>
            parent(el) && i in propsFrom
                ? propsFrom[i]
                    ? isVisible(el)
                        ? getPositionWithMargin(el)
                        : {opacity: 0}
                    : {opacity: isVisible(el) ? 1 : 0}
                : false
        );

        propsFrom = propsTo.map((props, i) => {

            const from = parent(nodes[i]) === target && (propsFrom[i] || getProps(nodes[i]));

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

        addClass(target, targetClass);
        nodes.forEach((el, i) => propsFrom[i] && css(el, propsFrom[i]));
        css(target, {height: oldHeight, display: 'block'});

        const transitions = nodes.map((el, i) =>
            Transition.start(el, propsTo[i], duration, 'ease')
        );

        if (oldHeight !== newHeight) {
            transitions.push(Transition.start(target, {height: newHeight}, duration, 'ease'));
        }

        return Promise.all(transitions).then(() => {
            nodes.forEach((el, i) => css(el, {display: propsTo[i].opacity === 0 ? 'none' : '', zIndex: ''}));
            reset(target);
        }, noop);
    });
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
