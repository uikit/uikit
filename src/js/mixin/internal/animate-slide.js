import {
    children,
    css,
    fastdom,
    includes,
    index,
    isVisible,
    noop,
    offset,
    parent,
    position,
    Transition,
} from 'uikit-util';

export default function (action, target, duration) {
    return new Promise((resolve) =>
        requestAnimationFrame(() => {
            let nodes = children(target);

            // Get current state
            const currentProps = nodes.map((el) => getProps(el, true));
            const targetProps = css(target, ['height', 'padding']);

            // Cancel previous animations
            Transition.cancel(target);
            nodes.forEach(Transition.cancel);
            reset(target);

            // Adding, sorting, removing nodes
            action();

            // Find new nodes
            nodes = nodes.concat(children(target).filter((el) => !includes(nodes, el)));

            // Wait for update to propagate
            Promise.resolve().then(() => {
                // Force update
                fastdom.flush();

                // Get new state
                const targetPropsTo = css(target, ['height', 'padding']);
                const [propsTo, propsFrom] = getTransitionProps(target, nodes, currentProps);

                // Reset to previous state
                nodes.forEach((el, i) => propsFrom[i] && css(el, propsFrom[i]));
                css(target, { display: 'block', ...targetProps });

                // Start transitions on next frame
                requestAnimationFrame(() => {
                    const transitions = nodes
                        .map(
                            (el, i) =>
                                parent(el) === target &&
                                Transition.start(el, propsTo[i], duration, 'ease')
                        )
                        .concat(Transition.start(target, targetPropsTo, duration, 'ease'));

                    Promise.all(transitions)
                        .then(() => {
                            nodes.forEach(
                                (el, i) =>
                                    parent(el) === target &&
                                    css(el, 'display', propsTo[i].opacity === 0 ? 'none' : '')
                            );
                            reset(target);
                        }, noop)
                        .then(resolve);
                });
            });
        })
    );
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

function reset(el) {
    css(el.children, {
        height: '',
        left: '',
        opacity: '',
        pointerEvents: '',
        position: '',
        top: '',
        marginTop: '',
        marginLeft: '',
        transform: '',
        width: '',
        zIndex: '',
    });
    css(el, { height: '', display: '', padding: '' });
}

function getPositionWithMargin(el) {
    const { height, width } = offset(el);
    const { top, left } = position(el);
    const { marginLeft, marginTop } = css(el, ['marginTop', 'marginLeft']);

    return { top, left, height, width, marginLeft, marginTop, transform: '' };
}
