import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const source = await readFile(new URL('../src/js/core/overflow-fade.js', import.meta.url), 'utf8');
function loadComponent(direction) {
    return vm.runInNewContext(
        source.replace(/^import[\s\S]*?from '[^']+';\s*/gm, '').replace('export default', 'component ='),
        {
            clamp: (value) => Math.min(1, Math.max(0, value)),
            isRtl: direction === 'rtl',
            css: (el, value) => (typeof value === 'string' ? el[value] : Object.assign(el.style, value)),
            mutation: () => ({}),
            resize: () => ({}),
            toggleClass: () => {},
            pointerDown: 'pointerdown',
        },
    );
}

function getOpacities(direction, scrollLeft, scrollTop = 0, horizontal = 200, vertical = 0) {
    const component = loadComponent(direction);
    const context = {
        $el: {
            direction,
            scrollLeft,
            scrollTop,
            scrollWidth: 100 + horizontal,
            clientWidth: 100,
            scrollHeight: 100 + vertical,
            clientHeight: 100,
            style: {},
        },
        $options: { id: 'uk-overflow-fade' },
        ...component.data,
    };
    component.update.write.call(context, component.update.read.call(context));
    return [
        context.$el.style['--uk-overflow-fade-start-opacity'],
        context.$el.style['--uk-overflow-fade-end-opacity'],
    ];
}

test('RTL horizontal fades follow physical left and right edges', () => {
    assert.deepEqual(getOpacities('rtl', 0), [0, 1]);
    assert.deepEqual(getOpacities('rtl', -100), [0, 0]);
    assert.deepEqual(getOpacities('rtl', -200), [1, 0]);
});

test('LTR horizontal fades are unchanged', () => {
    assert.deepEqual(getOpacities('ltr', 0), [1, 0]);
    assert.deepEqual(getOpacities('ltr', 100), [0, 0]);
    assert.deepEqual(getOpacities('ltr', 200), [0, 1]);
});

test('vertical fades are independent of direction', () => {
    for (const direction of ['ltr', 'rtl']) {
        assert.deepEqual(getOpacities(direction, 0, 0, 0, 200), [1, 0]);
        assert.deepEqual(getOpacities(direction, 0, 100, 0, 200), [0, 0]);
        assert.deepEqual(getOpacities(direction, 0, 200, 0, 200), [0, 1]);
    }
});

test('elements without overflow remain opaque', () => {
    for (const direction of ['ltr', 'rtl']) {
        assert.deepEqual(getOpacities(direction, 0, 0, 0), [1, 1]);
    }
});
