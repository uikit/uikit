import {
    attr,
    children,
    clamp,
    css,
    dimensions,
    includes,
    index,
    isInView,
    isVisible,
    offsetViewport,
    parent,
    position,
    resetProps,
    Transition,
    trigger,
} from 'uikit-util';
import { awaitFrame } from '../../util/await';

export default async function (action, target, duration) {
    await awaitFrame();

    let nodes = children(target);

    // Get current state
    const currentProps = nodes.map((el) => getProps(el, true));
    const targetProps = { ...css(target, ['height', 'padding']), display: 'block' };

    const transitionNodes = nodes.filter((node) => isInView(node));
    const targets = nodes.concat(target);

    // Cancel previous animations
    await Promise.all(targets.map(Transition.cancel));

    // Force transition to be canceled in Safari
    css(targets, 'transitionProperty', 'none');

    // Adding, sorting, removing nodes
    await action();

    // Find new nodes

    const newNodes = children(target).filter((el) => !includes(nodes, el));

    nodes = nodes.concat(newNodes);

    // Wait for update to propagate
    await Promise.resolve();

    // Reset the forced transition property
    css(targets, 'transitionProperty', '');

    // Get new state
    const targetStyle = attr(target, 'style');
    const targetPropsTo = css(target, ['height', 'padding']);
    const [propsTo, propsFrom] = getTransitionProps(target, nodes, currentProps);
    const attrsTo = nodes.map((el) => ({ style: attr(el, 'style') }));

    transitionNodes.push(...nodes.filter((node) => isInView(node)));

    // Reset to previous state
    nodes.forEach((el, i) => propsFrom[i] && css(el, propsFrom[i]));
    css(target, targetProps);

    // Trigger update in e.g. parallax component
    trigger(target, 'scroll');

    // Start transitions on next frame
    await awaitFrame();

    const transitions = nodes
        .map((el, i) => {
            if (parent(el) === target && transitionNodes.includes(el)) {
                return Transition.start(el, propsTo[i], duration, 'ease', !newNodes.includes(el));
            }
        })
        .concat(Transition.start(target, targetPropsTo, duration, 'ease', true));

    try {
        await Promise.all(transitions);
        nodes.forEach((el, i) => {
            attr(el, attrsTo[i]);
            if (parent(el) === target) {
                css(el, 'display', propsTo[i].opacity === 0 ? 'none' : '');
            }
        });
        attr(target, 'style', targetStyle);
    } catch {
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
            : false,
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

function getPositionWithMargin(el) {
    const { height, width } = dimensions(el);

    let { top, left } = position(el);

    const viewport = offsetViewport(el.ownerDocument);

    top = clamp(top, viewport.top - height - viewport.height, viewport.bottom + viewport.height);
    left = clamp(left, viewport.left - width - viewport.width, viewport.right + viewport.width);

    return {
        height,
        width,
        top,
        left,
        transform: '',
        ...css(el, ['marginTop', 'marginLeft']),
    };
}
