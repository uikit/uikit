import { glob } from 'glob';
import { args, minify, read, renderLess, replaceInFile, validClassName } from './util.js';

if (args.h || args.help) {
    console.log(`
        usage:

        scope.js [-s{cope}=your_great_new_scope_name][cleanup]

        example:

        scope.js // will scope with uk-scope
        scope.js -s "my-scope" // will replace any existing scope with my-scope
        scope.js cleanup // will remove current scope

    `);
    process.exit(0);
}
const currentScopeRe = /\/\* scoped: ([^*]*) \*\/\n/;
const currentScopeLegacyRe = /\.(uk-scope)/;

const files = await glob('dist/**/!(*.min).css');
const prevScope = await getScope(files);

if (args.cleanup && prevScope) {
    await cleanup(files, prevScope);
} else if (prevScope) {
    const newScope = getNewScope();

    if (prevScope === newScope) {
        console.warn(`Already scoped with: ${prevScope}`);
        process.exit(0);
    }

    await cleanup(files, prevScope);
    await scope(files, newScope);
} else {
    await scope(files, getNewScope());
}

async function getScope(files) {
    for (const file of files) {
        const data = await read(file);
        const [, scope] = data.match(currentScopeRe) || data.match(currentScopeLegacyRe) || [];
        if (scope) {
            return scope;
        }
    }
    return '';
}

function getNewScope() {
    const scopeFromInput = args.scope || args.s || 'uk-scope';

    if (validClassName.test(scopeFromInput)) {
        return scopeFromInput;
    } else {
        throw `Illegal scope-name: ${scopeFromInput}`;
    }
}

async function scope(files, scope) {
    for (const file of files) {
        await replaceInFile(file, async (data) => {
            const output = await renderLess(`.${scope} {\n${stripComments(data)}\n}`);
            return `/* scoped: ${scope} */\n${
                output.replace(
                    new RegExp(
                        `.${scope}\\s((\\.(uk-(drag|modal-page|offcanvas-page|offcanvas-flip)))|html|:root)`,
                        'g'
                    ),
                    '$1'
                ) // unescape
            }`;
        });
        await minify(file);
    }
}

async function cleanup(files, scope) {
    const string = scope
        .split(' ')
        .map((scope) => `.${scope}`)
        .join(' ');
    for (const file of files) {
        await replaceInFile(
            file,
            (data) =>
                data
                    .replace(currentScopeRe, '') // remove scope comment
                    .replace(new RegExp(` *${string} ({[\\s\\S]*?})?`, 'g'), '') // replace classes
        );
    }
}

function stripComments(input) {
    return input
        .replace(/\/\*(.|\n)*?\*\//gm, '')
        .split('\n')
        .filter((line) => line.trim().substr(0, 2) !== '//')
        .join('\n');
}
