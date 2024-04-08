import eslintJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
    eslintJs.configs.recommended,
    eslintConfigPrettier,
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
];
