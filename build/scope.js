/* eslint-env node */
const glob = require('glob');
const util = require('./util');
const argv = require('minimist')(process.argv.slice(2));

argv._.forEach(arg => {
    const tokens = arg.split('=');
    argv[tokens[0]] = tokens[1] || true;
});

const currentScopeRegex = /\/\* scoped: ([^*]*) \*\//;
const currentScopeLegacyRegex = new RegExp('\\.(uk-scope)');

const allFiles = [];

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
    readAllFiles().then(startProcess);
}

function startProcess() {

    const currentScope = getCurrentScope();

    if (argv.cleanup && currentScope) {
        cleanUp(currentScope).then(store).catch(console.log);
    } else if (currentScope) {
        getNewScope().then(newScope => {
            if (currentScope !== newScope) {
                cleanUp(currentScope).then(() => doScope(newScope)).then(store).catch(console.log);
            } else {
                console.log('already scoped with:' + currentScope);
            }
        });
    } else {
        getNewScope().then(doScope).then(store).catch(console.log);
    }
}

function getNewScope() {

    const scopeFromInput = argv.scope || argv.s || 'uk-scope';

    if (util.validClassName.test(scopeFromInput)) {
        return Promise.resolve(scopeFromInput);
    } else {
        throw 'illegal scope-name: ' + scopeFromInput;
    }
}

function isScoped(data) {
    let varName = data.match(currentScopeRegex);
    if (varName) {
        return varName[1];
    } else {
        varName = data.match(currentScopeLegacyRegex);
    }
    return varName && varName[1];
}

function doScope(scopeFromInput) {

    const scopes = [];
    allFiles.forEach(store => {

        scopes.push(util.renderLess(`.${scopeFromInput} {\n${store.data}\n}`)
                        .then(output =>
                            store.data = `/* scoped: ${scopeFromInput} */` +
                                    output.replace(new RegExp(`.${scopeFromInput} ${/{(.|[\r\n])*?}/.source}`), '')
                                          .replace(new RegExp(`.${scopeFromInput} ${/\s((\.(uk-(drag|modal-page|offcanvas-page|offcanvas-flip)))|html)/.source}`, 'g'), '$1')
                        )
        );
    });

    return Promise.all(scopes);

}

function store() {
    const writes = [];
    allFiles.forEach(({file, data}) => writes.push(util.write(file, data).then(util.minify)));
    return Promise.all(writes);
}

function cleanUp(currentScope) {
    allFiles.forEach((store) => {
        const string = currentScope.split(' ').map(scope => `.${scope}`).join(' ');
        store.data = store.data.replace(new RegExp(/ */.source + string + / ({[\s\S]*?})?/.source, 'g'), '') // replace classes
                   .replace(new RegExp(currentScopeRegex.source, 'g'), ''); // remove scope comment
    });

    return Promise.resolve();
}

function getCurrentScope() {

    let currentScope;
    allFiles.forEach(({data}) => {
        const scope = isScoped(data);
        if (currentScope && scope !== currentScope) {
            throw 'scopes used on current css differ from file to file.';
        }
        currentScope = scope;
    });

    return currentScope;
}

function readAllFiles() {
    return new Promise(res => {
        glob('dist/**/!(*.min).css', (err, files) => {
            //read files, check scopes
            const reads = [];
            files.forEach(file => {
                const promise = util.read(file, data => {
                    allFiles.push({file, data});
                });
                reads.push(promise);
            });
            Promise.all(reads).then(res);
        });

    });
}
