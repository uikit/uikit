const fs = require('fs');
const {promisify} = require('util');
const archiver = require('archiver');
const inquirer = require('inquirer');
const pkg = require('../package.json');
const dateFormat = require('dateformat');
const args = require('minimist')(process.argv);
const {glob, logFile, read, write} = require('./util');
const {coerce, inc, prerelease, valid} = require('semver');
const exec = promisify(require('child_process').exec);

inquireVersion(args.v || args.version)
    .then(updateVersion)
    .then(compile)
    .then(createPackage)
    .catch(({message}) => {
        console.error(message);
        process.exitCode = 1;
    });

async function inquireVersion(v) {

    if (valid(v)) {
        return v;
    }

    const prompt = inquirer.createPromptModule();

    const {version} = await prompt({
        name: 'version',
        message: 'Enter a version',
        default: () => inc(pkg.version, prerelease(pkg.version) ? 'prerelease' : 'patch'),
        validate: val => !!val.length || 'Invalid version'
    });

    return version;

}

async function updateVersion(version) {
    await Promise.all([
        run(`npm version ${version} --git-tag-version false`),
        replaceInFile('CHANGELOG.md', data => data.replace(/^##\s*WIP/m, `## ${versionFormat(version)} (${dateFormat(Date.now(), 'mmmm d, yyyy')})`)),
        replaceInFile('.github/ISSUE_TEMPLATE/bug-report.md', data => data.replace(pkg.version, version))
    ]);

    return version;
}

async function compile(version) {
    await sequential([
        () => run('yarn compile'),
        () => run('yarn compile-rtl'),
        () => run('yarn build-scss')
    ]);

    return version;
}

async function createPackage(version) {
    const file = `dist/uikit-${version}.zip`;
    const archive = archiver('zip');

    archive.pipe(fs.createWriteStream(file));

    (await glob('dist/{js,css}/uikit?(-icons|-rtl)?(.min).{js,css}')).forEach(file =>
        archive.file(file, {name: file.substring(5)})
    );

    await archive.finalize();
    await logFile(file);
}

function versionFormat(version) {
    return [coerce(version).version].concat(prerelease(version) || []).join(' ');
}

async function replaceInFile(file, fn) {
    await write(file, fn(await read(file)));
}

async function sequential(tasks) {
    await tasks.reduce((promise, task) => promise.then(task), Promise.resolve());
}

async function run(cmd) {
    const {stdout, stderr} = await exec(cmd);

    stdout && console.log(stdout.trim());
    stderr && console.log(stderr.trim());
}
