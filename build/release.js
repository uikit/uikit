import archiver from 'archiver';
import dateFormat from 'dateformat/lib/dateformat.js';
import { $ } from 'execa';
import fs from 'fs';
import { glob } from 'glob';
import inquirer from 'inquirer';
import semver from 'semver';
import { args, getVersion, logFile, read, replaceInFile } from './util.js';

const $$ = $({ stdio: 'inherit' });
const prompt = inquirer.createPromptModule();

if ((await $`git status --porcelain`).stdout.trim()) {
    throw 'Repository contains uncommitted changes.';
}

const prevVersion = await getVersion();
const version = await inquireVersion(args.v || args.version);

await raiseVersion(version);

await $$`pnpm compile`;
await $$`pnpm compile-rtl`;
await $$`pnpm build-scss`;

await createPackage(version);

if (args.d || args.deploy || (await inquireDeploy())) {
    await deploy(version);
}

function isValidVersion(version) {
    return semver.valid(version) && semver.gt(version, prevVersion);
}

async function inquireVersion(version) {
    if (isValidVersion(version)) {
        return version;
    }

    return (
        await prompt({
            name: 'version',
            message: 'Enter a version',
            default: () =>
                semver.inc(prevVersion, semver.prerelease(prevVersion) ? 'prerelease' : 'patch'),
            validate: (val) => isValidVersion(val) || 'Invalid version',
        })
    ).version;
}

function raiseVersion(version) {
    return Promise.all([
        $$`npm version ${version} --git-tag-version false`,
        replaceInFile('CHANGELOG.md', (data) =>
            data.replace(
                /^##\s*WIP/m,
                `## ${versionFormat(version)} (${dateFormat(Date.now(), 'mmmm d, yyyy')})`,
            ),
        ),
        replaceInFile('.github/ISSUE_TEMPLATE/bug-report.md', (data) =>
            data.replace(prevVersion, version),
        ),
    ]);
}

async function createPackage(version) {
    const dest = `dist/uikit-${version}.zip`;
    const archive = archiver('zip');

    archive.pipe(fs.createWriteStream(dest));

    for (const file of await glob('dist/{js,css}/uikit?(-icons|-rtl)?(.min).{js,css}')) {
        archive.file(file, { name: file.slice(5) });
    }

    await archive.finalize();
    await logFile(dest);
}

function versionFormat(version) {
    return [semver.coerce(version).version].concat(semver.prerelease(version) || []).join(' ');
}

async function inquireDeploy() {
    return (
        await prompt({
            name: 'deploy',
            type: 'confirm',
            message: 'Do you want to deploy the release?',
            default: true,
        })
    ).deploy;
}

async function deploy(version) {
    const tag = `v${version}`;
    const branch = `release/v${version}`;

    await $$`git checkout -b ${branch}`;
    await $$`git stage --all`;
    await $$`git commit -am v${version}`;

    await $$`git checkout main`;
    await $$`git merge ${branch} --commit --no-ff -m ${`Merge branch '${branch}'`}`;
    await $$`git tag ${tag}`;

    await $$`git push origin main --tags`;

    await $$`pnpm publish --no-git-checks`;

    const notes = (await read('./Changelog.md'))
        .match(/## \d.*?$\s*(.*?)\s*(?=## \d)/ms)[1]
        .replace(/(["`])/g, '\\$1');
    await $$`gh release create v${version} --repo uikit/uikit --notes ${notes} ./dist/uikit-${version}.zip`;

    await $$`git checkout develop`;
    await $$`git merge ${tag} --commit --no-ff -m ${`Merge tag '${tag}' into develop`}`;

    await $$`git branch --delete ${branch}`;

    await $$`git push origin develop`;
}
