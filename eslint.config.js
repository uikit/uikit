const eslintJs = require('@eslint/js');
const eslintConfigPrettier = require('eslint-config-prettier');
const globals = require('globals');

module.exports = [
    eslintJs.configs.recommended,
    eslintConfigPrettier,
    {
        ignores: ['*', '!src/', '!src/*', '!src/js', '!build/', 'build/*', '!build/*.js'],
    },
    {
        rules: {
            'no-unused-vars': ['error', { caughtErrors: 'none' }],
        },
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                VERSION: true,
                LOG: true,
                ICONS: true,
                NAME: true,
            },
        },
    },
    {
        files: ['build/*.js', 'eslint.config.js'],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
];
