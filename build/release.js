import { glob } from 'glob';
import archiver from 'archiver';
import inquirer from 'inquirer';
import { createWriteStream } from 'fs';
import dateFormat from 'dateformat/lib/dateformat.js';
import { coerce, gt, inc, prerelease, valid } from 'semver';
import { args, getVersion, logFile, read, replaceInFile, run } from './util.js';

const prompt = inquirer.createPromptModule();

if (await run('git status --porcelain')) {
    throw 'Repository contains uncommitted changes.';
}

const prevVersion = await getVersion();
const version = await inquireVersion(args.v || args.version);

await raiseVersion(version);

await run('pnpm compile');
await run('pnpm compile-rtl');
await run('pnpm build-scss');

await createPackage(version);

if (args.d || args.deploy || (await inquireDeploy())) {
    await deploy(version);
}

function isValidVersion(version) {
    return valid(version) && gt(version, prevVersion);
}

async function inquireVersion(version) {
    if (isValidVersion(version)) {
        return version;
    }

    return (
        await prompt({
            name: 'version',
            message: 'Enter a version',
            default: () => inc(prevVersion, prerelease(prevVersion) ? 'prerelease' : 'patch'),
            validate: (val) => isValidVersion(val) || 'Invalid version',
        })
    ).version;
}

function raiseVersion(version) {
    return Promise.all([
        run(`npm version ${version} --git-tag-version false`),
        replaceInFile('CHANGELOG.md', (data) =>
            data.replace(
                /^##\s*WIP/m,
                `## ${versionFormat(version)} (${dateFormat(Date.now(), 'mmmm d, yyyy')})`
            )
        ),
        replaceInFile('.github/ISSUE_TEMPLATE/bug-report.md', (data) =>
            data.replace(prevVersion, version)
        ),
    ]);
}

async function createPackage(version) {
    const file = `dist/uikit-${version}.zip`;
    const archive = archiver('zip');

    archive.pipe(createWriteStream(file));

    (await glob('dist/{js,css}/uikit?(-icons|-rtl)?(.min).{js,css}')).forEach((file) =>
        archive.file(file, { name: file.substring(5) })
    );

    await archive.finalize();
    await logFile(file);
}

function versionFormat(version) {
    return [coerce(version).version].concat(prerelease(version) || []).join(' ');
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
    await run(`git checkout -b release/v${version}`);
    await run('git stage --all');
    await run(`git commit -am "v${version}"`);
    await run('git checkout main');
    await run(
        `git merge release/v${version} --commit --no-ff -m "Merge branch 'release/v${version}'"`
    );

    await run(`git tag v${version}`);
    await run('git checkout develop');
    await run(`git merge v${version} --commit --no-ff -m "Merge tag 'v${version}' into develop"`);
    await run(`git branch --delete release/v${version}`);

    await run('git push origin develop');
    await run('git push origin main --tags');

    await run('pnpm publish --no-git-checks');

    const notes = (await read('./Changelog.md'))
        .match(/## \d.*?$\s*(.*?)\s*(?=## \d)/ms)[1]
        .replace(/(["`])/g, '\\$1');
    await run(`gh release create v${version} --notes "${notes}" ./dist/uikit-${version}.zip`);
}
