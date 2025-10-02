import eslintJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
    eslintJs.configs.recommended,
    eslintConfigPrettier,
    {
        ignores: ['*', '!src/', '!src/*', '!src/js', '!build/', 'build/*', '!build/*.js'],
    },
    {
        rules: {
            'no-empty': ['error', { allowEmptyCatch: true }],
        },
        languageOptions: {
            ecmaVersion: 'latest',
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
