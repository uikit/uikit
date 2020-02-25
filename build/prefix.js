const fs = require('fs');
const glob = require('glob');
const util = require('./util');
const argv = require('minimist')(process.argv.slice(2));
const prompt = require('inquirer').createPromptModule();

argv._.forEach(arg => {
    const tokens = arg.split('=');
    argv[tokens[0]] = tokens[1] || true;
});

const allFiles = [];

if (argv.h || argv.help) {
    console.log(`
        usage:

        prefix.js [-p{refix}=your_great_new_prefix]

        example:

        prefix.js // will prompt for a prefix to replace the current one with
        prefix.js -p=xyz // will replace any existing prefix with xyz

    `);
} else {
    readAllFiles().then(startProcess);
}

function startProcess() {

    const currentPrefix = findExistingPrefix();
    getPrefix().then(prefix => replacePrefix(currentPrefix, prefix));

}

function findExistingPrefix() {

    // find existing prefix
    let currentPrefix;

    allFiles.filter(({file}) => ~file.indexOf('uikit.css')).some(({file, data}) => {

        const res = data.match(new RegExp(`(${util.validClassName.source})-grid`));
        currentPrefix = res && res[1];
        return currentPrefix;

    });
    return currentPrefix;

}

function getPrefix() {

    const prefixFromInput = argv.p || argv.prefix;
    if (!prefixFromInput) {
        return prompt({
            name: 'prefix',
            message: 'enter a prefix',
            validate: (val, res) => val.length && val.match(util.validClassName) ? !!(res.prefix = val) : 'invalid prefix'
        })
        .then(res => res.prefix);
    } else if (util.validClassName.test(prefixFromInput)) {
        return Promise.resolve(prefixFromInput);
    } else {
        throw 'illegal prefix: ' + prefixFromInput;
    }
}

function replacePrefix(from, to) {

    if (from === to) {
        console.log('already prefixed with: ' + from);
    } else {
        allFiles.forEach(({file, data, replace}) => {
            data = replace(data, from, to);
            fs.writeFileSync(file, data);
        });
    }
}

function readAllFiles(prefix) {

    const globs = [];

    globs.push(new Promise(res =>
        glob('dist/**/*.css', (err, files) => {
            const reads = [];
            files.forEach(file =>
                reads.push(util.read(file, data =>
                    allFiles.push({
                        file,
                        data,
                        replace: (data, needle, replace) => data.replace(new RegExp(`${needle}-` + /([a-z\d-]+)/.source, 'g'), `${replace}-$1`)
                    })
                ))
            );
            Promise.all(reads).then(res);
        }
        )
    ));

    globs.push(new Promise(res =>
        glob('dist/**/*.js', (err, files) => {
            const reads = [];
            files.forEach(file =>
                reads.push(util.read(file, data =>
                    allFiles.push({
                        file,
                        data,
                        replace: (data, needle, replace) => data.replace(new RegExp(`${needle}-`, 'g'), `${replace}-`).replace(new RegExp(`(${needle})?UIkit`, 'g'), `${replace === 'uk' ? '' : replace}UIkit`)
                    })
                ))
            );
            Promise.all(reads).then(res);
        }
        )
    ));

    return Promise.all(globs);
}
