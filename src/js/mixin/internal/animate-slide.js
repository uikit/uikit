import {
    attr,
    children,
    css,
    fastdom,
    includes,
    index,
    isVisible,
    offset,
    parent,
    position,
    Transition,
    trigger,
} from 'uikit-util';

export default async function (action, target, duration) {
    await awaitFrame();

    let nodes = children(target);

    // Get current state
    const currentProps = nodes.map((el) => getProps(el, true));
    const targetProps = { ...css(target, ['height', 'padding']), display: 'block' };

    // Cancel previous animations
    await Promise.all(nodes.concat(target).map(Transition.cancel));

    // Adding, sorting, removing nodes
    action();

    // Find new nodes
    nodes = nodes.concat(children(target).filter((el) => !includes(nodes, el)));

    // Wait for update to propagate
    await Promise.resolve();

    // Force update
    fastdom.flush();

    // Get new state
    const targetStyle = attr(target, 'style');
    const targetPropsTo = css(target, ['height', 'padding']);
    const [propsTo, propsFrom] = getTransitionProps(target, nodes, currentProps);
    const attrsTo = nodes.map((el) => ({ style: attr(el, 'style') }));

    // Reset to previous state
    nodes.forEach((el, i) => propsFrom[i] && css(el, propsFrom[i]));
    css(target, targetProps);

    // Trigger update in e.g. parallax component
    trigger(target, 'scroll');
    fastdom.flush();

    // Start transitions on next frame
    await awaitFrame();

    const transitions = nodes
        .map((el, i) => parent(el) === target && Transition.start(el, propsTo[i], duration, 'ease'))
        .concat(Transition.start(target, targetPropsTo, duration, 'ease'));

    try {
        await Promise.all(transitions);
        nodes.forEach((el, i) => {
            attr(el, attrsTo[i]);
            if (parent(el) === target) {
                css(el, 'display', propsTo[i].opacity === 0 ? 'none' : '');
            }
        });
        attr(target, 'style', targetStyle);
    } catch (e) {
        attr(nodes, 'style', '');
        resetProps(target, targetProps);
    }
}

function getProps(el, opacity) {
    const zIndex = css(el, 'zIndex');

    return isVisible(el)
        ? {
              display: '',
              opacity: opacity ? css(el, 'opacity') : '0',
              pointerEvents: 'none',
              position: 'absolute',
              zIndex: zIndex === 'auto' ? index(el) : zIndex,
              ...getPositionWithMargin(el),
          }
        : false;
}

function getTransitionProps(target, nodes, currentProps) {
    const propsTo = nodes.map((el, i) =>
        parent(el) && i in currentProps
            ? currentProps[i]
                ? isVisible(el)
                    ? getPositionWithMargin(el)
                    : { opacity: 0 }
                : { opacity: isVisible(el) ? 1 : 0 }
            : false
    );

    const propsFrom = propsTo.map((props, i) => {
        const from = parent(nodes[i]) === target && (currentProps[i] || getProps(nodes[i]));

        if (!from) {
            return false;
        }

        if (!props) {
            delete from.opacity;
        } else if (!('opacity' in props)) {
            const { opacity } = from;

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

function resetProps(el, props) {
    for (const prop in props) {
        css(el, prop, '');
    }
}

function getPositionWithMargin(el) {
    const { height, width } = offset(el);

    return {
        height,
        width,
        transform: '',
        ...position(el),
        ...css(el, ['marginTop', 'marginLeft']),
    };
}

function awaitFrame() {
    return new Promise((resolve) => requestAnimationFrame(resolve));
}
