const {glob, minify, read, renderLess, write, validClassName} = require('./util');
const argv = require('minimist')(process.argv.slice(2));

argv._.forEach(arg => {
    const tokens = arg.split('=');
    argv[tokens[0]] = tokens[1] || true;
});

if (argv.h || argv.help) {
    console.log(`
        usage:

        scope.js [-s{cope}=your_great_new_scope_name][cleanup]

        example:

        scope.js // will scope with uk-scope
        scope.js -s "my-scope" // will replace any existing scope with my-scope
        scope.js cleanup // will remove current scope

    `);
} else {
    run();
}

async function run() {

    const files = await readFiles();
    const oldScope = getScope(files);

    try {

        if (argv.cleanup && oldScope) {
            cleanup(files, oldScope);
        } else if (oldScope) {
            const newScope = getNewScope();

            if (oldScope === newScope) {
                throw new Error(`Already scoped with: ${oldScope}`);
            }

            cleanup(files, oldScope);
            await scope(files, newScope);

        } else {
            await scope(files, getNewScope());
        }

        await store(files);

    } catch (e) {
        console.error(e);
    }

}

async function readFiles() {

    const files = await glob('dist/**/!(*.min).css');
    return Promise.all(files.map(async file => {

        const data = await read(file);
        return {file, data};

    }));

}

function getScope(files) {
    return files.reduce((scope, {data}) => scope || isScoped(data), '');
}

function getNewScope() {

    const scopeFromInput = argv.scope || argv.s || 'uk-scope';

    if (validClassName.test(scopeFromInput)) {
        return scopeFromInput;
    } else {
        throw `Illegal scope-name: ${scopeFromInput}`;
    }
}

async function scope(files, scope) {
    await Promise.all(
        files.map(async store => {
            try {

                const output = await renderLess(`.${scope} {\n${stripComments(store.data)}\n}`);
                store.data = `/* scoped: ${scope} */\n${
                    output
                        .replace(new RegExp(`.${scope} ${/{(.|[\r\n])*?}/.source}`), '')
                        .replace(new RegExp(`.${scope}${/\s((\.(uk-(drag|modal-page|offcanvas-page|offcanvas-flip)))|html)/.source}`, 'g'), '$1')
                }`;

            } catch (e) {
                console.error(store.file, e);
            }
        })
    );
}

async function store(files) {
    return Promise.all(
        files.map(async ({file, data}) => {
            await write(file, data);
            await minify(file);
        })
    );
}

const currentScopeRe = /\/\* scoped: ([^*]*) \*\//;
const currentScopeLegacyRe = /\.(uk-scope)/;

function cleanup(files, scope) {
    const string = scope.split(' ').map(scope => `.${scope}`).join(' ');
    files.forEach(store => {
        store.data = store.data
            .replace(new RegExp(/ */.source + string + / ({[\s\S]*?})?/.source, 'g'), '') // replace classes
            .replace(new RegExp(currentScopeRe.source, 'g'), ''); // remove scope comment
    });
}

function isScoped(data) {
    return (data.match(currentScopeRe) || data.match(currentScopeLegacyRe) || [])[1];
}

function stripComments(input) {
    return input.replace(/\/\*(.|\n)*?\*\//gm, '').split('\n').filter(line => line.trim().substr(0, 2) !== '//').join('\n');
}
