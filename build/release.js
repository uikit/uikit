/* eslint-env node */
const fs = require('fs');
const util = require('./util');
const archiver = require('archiver');
const inquirer = require('inquirer');
const pkg = require('../package.json');
const dateFormat = require('dateformat');
const {execSync} = require('child_process');
const args = require('minimist')(process.argv);
const versionRe = /(\d+\.\d+\.)(\d+)(?:-([a-z]+)\.(\d+))?/;

let version = args.v || args.version;

inquireVersion()
    .then(updateVersion)
    .then(compile)
    .then(createPackage);

async function inquireVersion() {

    if (version) {
        return Promise.resolve(version);
    }

    const prompt = inquirer.createPromptModule();

    return await prompt({
        name: 'version',
        message: 'Enter a version',
        default: () => pkg.version.replace(versionRe, (match, p1, p2, p3, p4) => p3 ? `${p1}${p2}-${p3}.${++p4}` : `${p1}${++p2}`),
        validate: val => !!val.length || 'Invalid version'
    }).then(res => res.version);

}

async function updateVersion(version) {

    return Promise.all([
        util.write('package.json', JSON.stringify(Object.assign({}, pkg, {version}), null, '  ') + '\n'),
        util.read('CHANGELOG.md').then(data => util.write('CHANGELOG.md', data.replace(/^##\s*WIP/m, `## ${version.replace(versionRe, (match, p1, p2, p3, p4) => p3 ? `${p1}${p2} ${p3} ${p4}` : `${p1}${p2}`)} (${dateFormat(Date.now(), 'mmmm d, yyyy')})`))),
        util.read('.github/ISSUE_TEMPLATE.md').then(data => util.write('.github/ISSUE_TEMPLATE.md', data.replace(versionRe, version))),
    ]).then(() => version);

}

function compile(version) {
    execSync('yarn compile', {stdio: [0, 1, 2]});
    execSync('yarn compile-rtl', {stdio: [0, 1, 2]});
    execSync('yarn build-scss', {stdio: [0, 1, 2]});
    return version
}

function createPackage(version) {
    const file = `dist/uikit-${version}.zip`;
    const output = fs.createWriteStream(file).on('close', () => util.logFile(file));

    const archive = archiver('zip');

    archive.pipe(output);
    archive.file('dist/js/uikit.js', {name: '/js/uikit.js'});
    archive.file('dist/js/uikit.min.js', {name: '/js/uikit.min.js'});
    archive.file('dist/js/uikit-icons.js', {name: '/js/uikit-icons.js'});
    archive.file('dist/js/uikit-icons.min.js', {name: '/js/uikit-icons.min.js'});
    archive.file('dist/css/uikit.css', {name: '/css/uikit.css'});
    archive.file('dist/css/uikit.min.css', {name: '/css/uikit.min.css'});
    archive.file('dist/css/uikit-rtl.css', {name: '/css/uikit-rtl.css'});
    archive.file('dist/css/uikit-rtl.min.css', {name: '/css/uikit-rtl.min.css'});
    archive.finalize();
}
