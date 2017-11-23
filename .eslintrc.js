module.exports = {
    "root":true,
    "env": {
        "es6": true,
        "browser": true,
        "commonjs": true,
    },
    "extends": [
        "eslint:recommended",
    ],
    "parserOptions": {
        "sourceType": "module"
    },
    "globals": {
        "BUNDLED": true,
        "VERSION": true
    },
    "rules": {
        "no-cond-assign": 0,
        "indent-legacy": 0,
        "indent": [2, 4, {"SwitchCase": 1}],
        "linebreak-style": [2, "unix"],
        "space-infix-ops": 2,
        "comma-style": 2,
        "comma-spacing": 2,
        "key-spacing": 2,
        "keyword-spacing": 2,
        "no-multi-spaces": 2,
        "no-trailing-spaces": 2,
        "space-unary-ops": 2,
        "space-in-parens": 2,
        "space-before-blocks": 2,
        "template-curly-spacing": 2,
        "quotes": [2, "single", {"avoidEscape": true}],
        "eqeqeq": [0, "smart"],
        "semi": [2, "always"],
        "brace-style": [2, "1tbs", {"allowSingleLine": true}],
        "no-lone-blocks": 2,
        "no-extend-native": 2,
        "no-unused-vars": [2, {"vars": "local", "args": "none"}],
        "no-empty": [0, {"allowEmptyCatch": true}],
        "no-duplicate-imports": 2,
        "no-array-constructor": 2,
        "no-multiple-empty-lines": [2, {"max": 1}],
        "no-template-curly-in-string": 2,
        "no-useless-escape": 0
    }

};

/*
    implicit:

    "rules": {

        "no-undef": 2,
        "strict": 0,
        "new-cap": 0,
        "camelcase": 0,
        "no-underscore-dangle": 0,
        "no-new": 0,
        "no-alert": 0,
        "no-use-before-define": 0,
        "consistent-return": 0,
        "no-shadow": 0,

    }

*/