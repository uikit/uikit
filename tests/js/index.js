/* global TESTS */
import { $$, addClass, css, on, prepend, removeClass, ucfirst } from 'uikit-util';

const tests = TESTS;
const storage = window.sessionStorage;
const key = '_uikit_style';
const keyinverse = '_uikit_inverse';
const docEl = document.documentElement;

// try to load themes.json
const request = new XMLHttpRequest();
request.open('GET', '../themes.json', false);
request.send(null);

const themes = request.status === 200 ? JSON.parse(request.responseText) : {};
const styles = {
    core: { css: '../dist/css/uikit-core.css' },
    theme: { css: '../dist/css/uikit.css' },
    ...themes,
};
const component = location.pathname
    .split('/')
    .pop()
    .replace(/.html$/, '');

const variations = {
    '': 'Default',
    light: 'Dark',
    dark: 'Light',
};

if (getParam('style') && getParam('style').match(/\.(json|css)$/)) {
    styles.custom = getParam('style');
}

storage[key] = storage[key] || 'core';
storage[keyinverse] = storage[keyinverse] || '';

const dir = storage._uikit_dir || 'ltr';

// set dir
docEl.dir = dir;

const style = styles[storage[key]] || styles.theme;

// add style
document.writeln(
    `<link rel="stylesheet" href="${
        dir !== 'rtl' ? style.css : style.css.replace('.css', '-rtl.css')
    }">`
);

// add javascript
document.writeln('<script src="../dist/js/uikit.js"></script>');
document.writeln(
    `<script src="${style.icons ? style.icons : '../dist/js/uikit-icons.js'}"></script>`
);

on(window, 'load', () =>
    setTimeout(
        () =>
            requestAnimationFrame(() => {
                const $body = document.body;
                const $container = prepend(
                    $body,
                    `
        <div class="uk-container">
            <select class="uk-select uk-form-width-small" style="margin: 20px 20px 20px 0" aria-label="Component switcher">
                <option value="index.html">Overview</option>
                ${tests
                    .map(
                        (name) =>
                            `<option value="${name}.html">${name
                                .split('-')
                                .map(ucfirst)
                                .join(' ')}</option>`
                    )
                    .join('')}
            </select>
            <select class="uk-select uk-form-width-small" style="margin: 20px" aria-label="Theme switcher">
                ${Object.keys(styles)
                    .map((style) => `<option value="${style}">${ucfirst(style)}</option>`)
                    .join('')}
            </select>
            <select class="uk-select uk-form-width-small" style="margin: 20px" aria-label="Inverse switcher">
                ${Object.keys(variations)
                    .map((name) => `<option value="${name}">${variations[name]}</option>`)
                    .join('')}
            </select>
            <label style="margin: 20px">
                <input type="checkbox" class="uk-checkbox"/>
                <span style="margin: 5px">RTL</span>
            </label>
        </div>
    `
                );

                const [$tests, $styles, $inverse, $rtl] = $container.children;

                // Tests
                // ------------------------------

                on($tests, 'change', () => {
                    if ($tests.value) {
                        location.href = `${$tests.value}${
                            styles.custom ? `?style=${getParam('style')}` : ''
                        }`;
                    }
                });
                $tests.value = `${component || 'index'}.html`;

                // Styles
                // ------------------------------

                on($styles, 'change', () => {
                    storage[key] = $styles.value;
                    location.reload();
                });
                $styles.value = storage[key];

                // Variations
                // ------------------------------

                $inverse.value = storage[keyinverse];

                if ($inverse.value) {
                    removeClass(
                        $$('*'),
                        'uk-card-default',
                        'uk-card-muted',
                        'uk-card-primary',
                        'uk-card-secondary',
                        'uk-tile-default',
                        'uk-tile-muted',
                        'uk-tile-primary',
                        'uk-tile-secondary',
                        'uk-section-default',
                        'uk-section-muted',
                        'uk-section-primary',
                        'uk-section-secondary',
                        'uk-overlay-default',
                        'uk-overlay-primary'
                    );

                    addClass($$('.uk-navbar-container'), 'uk-navbar-transparent');

                    css(docEl, 'background', $inverse.value === 'dark' ? '#fff' : '#222');
                    addClass($body, `uk-${$inverse.value}`);
                }

                on($inverse, 'change', () => {
                    storage[keyinverse] = $inverse.value;
                    location.reload();
                });

                // RTL
                // ------------------------------

                on($rtl, 'change', ({ target }) => {
                    storage._uikit_dir = target.checked ? 'rtl' : 'ltr';
                    location.reload();
                });
                $rtl.firstElementChild.checked = dir === 'rtl';

                css(docEl, 'paddingTop', '');
            }),
        100
    )
);

css(docEl, 'paddingTop', '80px');

function getParam(name) {
    const match = new RegExp(`[?&]${name}=([^&]*)`).exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
