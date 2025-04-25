import { emptyDir } from 'fs-extra';
import { glob } from 'glob';
import NP from 'number-precision';
import path from 'path';
import { read, write } from './util.js';

NP.enableBoundaryChecking(false);

const coreMixins = {};
const themeMixins = {};
const coreVariables = {};
const themeVariables = {};
const inverseComponentMixins = [];

/* First Step: Delete previously generated files */
const scssDir = 'src/scss/';
await emptyDir(scssDir);

/* Second Step: Go through all files */
for (const file of (await glob('src/less/**/*.less'))
    .sort()
    .sort((a, b) => a.endsWith('/inverse.less') - b.endsWith('/inverse.less'))) {
    let source = await read(file);

    /* replace all Less stuff with SCSS */
    source = (await read(file))
        .replace(/\/less\//g, '/scss/') // change less/ dir to scss/ on imports
        .replace(/\.less/g, '.scss') // change .less extensions to .scss on imports
        .replace(/@/g, '$') // convert variables
        .replace(
            /(:[^'"]*?\([^'"]+?)\s*\/\s*([0-9.-]+)\)/g,
            (exp, m1, m2) => `${m1} * ${NP.round(1 / parseFloat(m2), 5)})`,
        )
        .replace(/--uk-\S+: (\$\S+);/g, (exp, name) => exp.replace(name, `#{${name}}`))
        .replace(/\\\$/g, '\\@') // revert classes using the @ symbol
        .replace(/ e\(/g, ' unquote(') // convert escape function
        .replace(/\.([\w-]*)\s*\((.*)\)\s*{/g, '@mixin $1($2){') // hook -> mixins
        .replace(/(\$[\w-]*)\s*:(.*);/g, '$1: $2 !default;') // make variables optional
        .replace(/@mixin ([\w-]*)\s*\((.*)\)\s*{\s*}/g, '// @mixin $1($2){}') // comment empty mixins
        .replace(/\.(hook[a-zA-Z\-\d]+)(\(\))?;/g, '@if(mixin-exists($1)) {@include $1();}') // hook calls surrounded by a mixin-exists
        .replace(/\$(import|supports|media|font-face|page|keyframes|-moz-document)/g, '@$1') // replace valid '@' statements
        .replace(/tint\((\$[\w-]+),\s([^)]*)\)/g, 'mix(white, $1, $2)') // replace Less function tint with mix
        .replace(/fade\((\$[\w-]*), ([0-9]+)%\)/g, (match, p1, p2) => {
            return `rgba(${p1}, ${p2 / 100})`;
        }) // replace Less function fade with rgba
        .replace(/spin\((\$[\w-]*), ([0-9]+)\)/g, (match, p1, p2) => {
            return `adjust-hue(${p1}, ${p2})`;
        }) // replace Less function spin with adjust-hue
        .replace(/fade(in|out)\((\$[\w-]*), ([0-9]+)%\)/g, (match, p1, p2, p3) => {
            return `fade-${p1}(${p2}, ${p3 / 100})`;
        }) // replace Less function fadeout with fade-out
        .replace(/\.svg-fill/g, '@include svg-fill') // include svg-fill mixin
        .replace(
            /(.*):extend\((\.[\w\\@-]*) all\) when \((\$[\w-]*) = (\w+)\) {}/g,
            '@if ( $3 == $4 ) { $1 { @extend $2 !optional;} }',
        ) // update conditional extend and add !optional to ignore warnings
        .replace(
            /(\.[\w\\@-]+)\s*when\s*\((\$[\w-]*)\s*=\s*(\w+)\)\s*{\s*@if\(mixin-exists\(([\w-]*)\)\) {@include\s([\w-]*)\(\);\s*}\s*}/g,
            '@if ($2 == $3) { $1 { @if (mixin-exists($4)) {@include $4();}}}',
        ) // update conditional hook
        .replace(
            /([.:][\w\\@-]+(?: ?[.:][\w\\@-]+)*)\s*when\s*\(([$@][\w-]*)\s*=\s*([$@]?[\w-]+)\)\s*({\s*.*?\s*})/gms,
            '@if ($2 == $3) {\n$1 $4\n}',
        )
        .replace(
            /([.:][\w\\@-]+(?: ?[.:][\w\\@-]+)*)\s*when\s+not\s*\(([$@][\w-]*)\s*=\s*([$@]?[\w-]+)\)\s*({\s*.*?\s*})/gs,
            '@if ($2 != $3) {\n$1 $4\n}',
        ) // replace conditionals
        .replace(/\${/g, '#{$') // string literals: from: /~"(.*)"/g, to: '#{"$1"}'
        .replace(/[^(](-\$[\w-]*)/g, ' ($1)') // surround negative variables with brackets
        .replace(/(--[\w-]+:\s*)~'([^']+)'/g, '$1$2') // string literals in custom properties
        .replace(/~('[^']+')/g, 'unquote($1)'); // string literals: for real

    /* File name of the current file */
    const filename = path.basename(file, '.less');

    if (filename === 'inverse') {
        source = source.replace(
            /\*\//,
            `*/\n@mixin hook-inverse() {\n${inverseComponentMixins
                .map((mixin) => `    @include ${mixin}();\n`)
                .join('')}}`,
        );
    } else if (source.match(/hook-inverse(?!-)/)) {
        source = source.replace(/hook-inverse(?!-)/, `hook-inverse-component-${filename}`);
        if (!inverseComponentMixins.includes(`hook-inverse-component-${filename}`)) {
            inverseComponentMixins.push(`hook-inverse-component-${filename}`);
        }
    }

    /* get all the mixins and remove them from the file */
    source = getMixinsFromFile(file, source);

    /* get all Variables and remove them */
    source = await getVariablesFromFile(file, source);

    source = useModules(source);

    if (filename === 'uikit.theme') {
        /* remove the theme import first place */
        source = source.replace(/\/\/\n\/\/ Theme\n\/\/\n\n@import "theme\/_import.scss";/, '');
        source = source.replace(/\/\/ Core\n\/\//g, '// Theme\n//\n');
    }

    /* mixin.less needs to be fully replaced by the new mixin file*/
    if (filename === 'mixin') {
        source = await read('build/scss/mixin.scss');
        source = useModules(source).replace(/(\s+\$[\w-]*)\s*:(.*)!default;/g, '$1: $2;');
    }

    if (!file.includes('theme/')) {
        await write(file.replace(/less/g, 'scss').replace('.theme.', '-theme.'), source);
    }
}

/* Third Step: write all new needed files for Sass */

/* write mixins files */
for (const [vars, file] of [
    [coreMixins, 'mixins'],
    [themeMixins, 'mixins-theme'],
]) {
    delete vars['svg-fill'];

    await write(`src/scss/${file}.scss`, useModules(Array.from(Object.values(vars)).join('\n')));
}

/* write variables files */
for (const [vars, file] of [
    [coreVariables, 'variables'],
    [themeVariables, 'variables-theme'],
]) {
    const variables = Object.keys(vars).reduce(
        (dependencies, key) => resolveDependencies(vars, key, dependencies),
        new Set(),
    );
    await write(`src/scss/${file}.scss`, useModules(Array.from(variables).join('\n')));
}

/*
 * add prefix of origin to methods
 */
function useModules(source) {
    for (const [module, [methods, replacement]] of Object.entries({
        meta: [[/(mixin-exists)(?=\()/g], 'meta.$1'],
        string: [
            [/(?=\W)(unquote|index|slice|quote)(?=\()/g, /str-(index|slice|length)(?=\()/g],
            'string.$1',
        ],
        math: [[/(?=\W)(floor|round)(?=\()/g], 'math.$1'],
        color: [
            [[/(?=\W)lighten\((.*),(.*)\)/g], 'color.adjust( $1, $lightness: $2)'],
            [[/(?=\W)darken\((.*),(.*)\)/g], 'color.adjust( $1, $lightness: -$2)'],
            [[/(?=\W)(mix)(?=\()/g], 'color.$1'],
            [
                [/(?=\W)(fade-in\(|fade-out\(|adjust-hue\()([^,]*),(.*)\)/g],
                'color.adjust( $2, $alpha: $3)',
            ],
        ],
    })) {
        /* add origin of method as prefix */
        const prev = source;
        for (const method of methods) {
            source = source.replace(method, replacement);
        }

        /* add module */
        if (source !== prev) {
            source = `@use "sass:${module}";\n${source}`;
        }
    }

    return source;
}

/*
 * recursive function to get a dependencies Set which is ordered so that no dependencies exist to a later on entry
 * @return Set with all the dependencies.
 */
function resolveDependencies(allVariables, currentKey, dependencies = new Set()) {
    for (const dependency of allVariables[currentKey].dependencies) {
        for (const newDependency of resolveDependencies(allVariables, dependency, dependencies)) {
            dependencies.add(newDependency);
        }
    }

    dependencies.add(`${currentKey}: ${allVariables[currentKey].value}`);
    return dependencies;
}

/*
 * Extract all the mixins from a given file with its data.
 * @return an updated data where the mixins have been removed.
 */
function getMixinsFromFile(file, source) {
    /* Step 1: get all includes and insert them, so that at least empty mixins exist. */
    for (const [, include] of source.matchAll(/@include ([a-z0-9-]+)/g)) {
        if (!(include in themeMixins)) {
            themeMixins[include] = `@mixin ${include}(){}`;
        }
        if (!(include in coreMixins)) {
            coreMixins[include] = `@mixin ${include}(){}`;
        }
    }

    /* Step 2: get all mixins */
    for (const [match, mixin] of source.matchAll(
        /@mixin ([\w-]*)\s*\(.*\)\s*{(\n\s+[\w\W]+?(?=\n})\n| [^\n]+)}/g,
    )) {
        themeMixins[mixin] = match;
        if (!file.includes('theme/')) {
            coreMixins[mixin] = match;
        }
    }

    /* Step 3: remove the mixins from the file, so that users can overwrite them in their custom code. */
    return source.replace(/@mixin ([\w-]*)\s*\((.*)\)\s*{(\n(\s+[\w\W]+?)(?=\n})\n| [^\n]+)}/g, '');
}

/*
 * Extract all variables from a given file with its data.
 * @return an updated data where the icons have been replaced by the actual SVG data.
 */
async function getVariablesFromFile(file, source) {
    for (let [, name, value] of source.matchAll(/(\$[\w-]*)\s*:\s*(.*);/g)) {
        let dependencies = [];

        /* check if variable is a background icon, if so replace it directly by the SVG */
        if (value.includes('../../images/backgrounds')) {
            const svg = (await read(`src/${value.match(/images\/backgrounds\/[\w./-]+/)}`))
                .replace(/\r?\n|\r/g, '%0A')
                .replace(/"/g, "'")
                .replace(/\s/g, '%20')
                .replace(/</g, '%3C')
                .replace(/=/g, '%3D')
                .replace(/'/g, '%22')
                .replace(/:/g, '%3A')
                .replace(/\//g, '%2F')
                .replace(/>/g, '%3E')
                .replace(/%3Csvg/, 'data:image/svg+xml;charset=UTF-8,%3Csvg');

            value = `"${svg}" !default`;

            /* if it's not an SVG add the variable and search for its dependencies */
        } else {
            dependencies = Array.from(value.matchAll(/\$[\w-]+/g)).map(([value]) => value);
        }

        themeVariables[name] = { value: `${value};`, dependencies };

        /* add variables only to the core Variables if it is not a theme file */
        if (!file.includes('theme/')) {
            coreVariables[name] = themeVariables[name];
        }
    }

    // Remove variables from source
    return source.replace(/(\$[\w-]*)\s*:(.*);\r?\n/g, '');
}
