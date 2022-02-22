import archiver from 'archiver';
import inquirer from 'inquirer';
import dateFormat from 'dateformat/lib/dateformat.js';
import { createWriteStream } from 'fs';
import semver from 'semver';
import { args, getVersion, glob, logFile, replaceInFile, run } from './util.js';

const { coerce, inc, prerelease, valid } = semver;

const prevVersion = await getVersion();
const version = await inquireVersion(args.v || args.version);

await Promise.all([
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

await run('yarn compile');
await run('yarn compile-rtl');
await run('yarn build-scss');

await createPackage(version);

async function inquireVersion(v) {
    if (valid(v)) {
        return v;
    }

    const prompt = inquirer.createPromptModule();

    return (
        await prompt({
            name: 'version',
            message: 'Enter a version',
            default: () => inc(prevVersion, prerelease(prevVersion) ? 'prerelease' : 'patch'),
            validate: (val) => !!val.length || 'Invalid version',
        })
    ).version;
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
