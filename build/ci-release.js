import { ZipArchive } from 'archiver';
import { $ } from 'execa';
import { createWriteStream } from 'node:fs';
import fs from 'node:fs/promises';
import semver from 'semver';
import { args, getVersion, logFile, read, replaceInFile } from './util.js';

const $$ = $({ stdio: 'inherit' });

if ([args.prepare, args.build, args.resolve].filter(Boolean).length !== 1) {
    throw new Error(
        'Use --resolve --bump <type> --preid <identifier>, --prepare --version <version>, or --build.',
    );
}

const prevVersion = await getVersion();
if (args.resolve) {
    console.log(validateVersion(semver.inc(prevVersion, args.bump, args.preid), prevVersion));
    process.exit(0);
}

const version = args.prepare ? validateVersion(args.version, prevVersion) : prevVersion;
const tag = `v${version}`;

if (args.prepare) {
    await raiseVersion(version, prevVersion);
} else {
    const previous = JSON.parse(
        (await $`git show ${`${process.env.RELEASE_BASE_SHA}:package.json`}`).stdout,
    ).version;
    validateVersion(version, previous);
    if (process.env.RELEASE_BRANCH !== `release/${tag}`) {
        throw new Error('Release branch does not match package.json version.');
    }
}

await $$`pnpm compile`;
await $$`pnpm compile-rtl`;
await $$`pnpm build-scss`;

if (args.build) {
    const notes = releaseNotes(await read('CHANGELOG.md'), version);
    const asset = await createPackage(version);
    const notesFile = `${process.env.RUNNER_TEMP}/uikit-${version}-notes.md`;
    await fs.writeFile(notesFile, notes);
    await fs.appendFile(
        process.env.GITHUB_OUTPUT,
        `tag=${tag}\nasset=${asset}\nnotes-file=${notesFile}\nprerelease=${Boolean(semver.prerelease(version))}\n`,
    );
}

function validateVersion(version, previous) {
    if (
        typeof version !== 'string' ||
        semver.valid(version) !== version ||
        !semver.gt(version, previous)
    ) {
        throw new Error(`Version must be a valid version greater than ${previous}.`);
    }
    return version;
}

function versionFormat(version) {
    return [semver.coerce(version).version].concat(semver.prerelease(version) || []).join(' ');
}

function releaseChangelog(changelog, version, date) {
    if (!/^## WIP\s*$/m.test(changelog)) {
        throw new Error('CHANGELOG.md must contain a WIP section before preparing a release.');
    }
    const result = changelog.replace(
        /^## WIP[^\S\n]*$/m,
        `## WIP\n\n## ${versionFormat(version)} (${date})`,
    );
    releaseNotes(result, version);
    return result;
}

function releaseNotes(changelog, version) {
    const sections = changelog.split(/^## /m);
    const section = sections.find((section) => section.startsWith(`${versionFormat(version)} (`));
    const notes = section?.slice(section.indexOf('\n') + 1).trim();
    if (!notes) {
        throw new Error(`No changelog notes found for ${version}.`);
    }
    return notes;
}

async function raiseVersion(version, prevVersion) {
    const changelog = releaseChangelog(await read('CHANGELOG.md'), version, dateFormat());
    return Promise.all([
        $$`npm version ${version} --git-tag-version false`,
        replaceInFile('CHANGELOG.md', () => changelog),
        replaceInFile('.github/ISSUE_TEMPLATE/bug-report.md', (data) =>
            data.replace(prevVersion, version),
        ),
    ]);
}

async function createPackage(version) {
    const dest = `dist/uikit-${version}.zip`;
    const archive = new ZipArchive({ zlib: { level: 9 } });

    const output = createWriteStream(dest);
    const closed = new Promise((resolve, reject) => {
        output.on('close', resolve);
        output.on('error', reject);
    });

    archive.pipe(output);

    for await (const file of fs.glob('dist/{js,css}/uikit?(-icons|-rtl)?(.min).{js,css}')) {
        archive.file(file, { name: file.slice(5) });
    }

    await archive.finalize();
    await closed;
    await logFile(dest);
    return dest;
}

function dateFormat() {
    return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date());
}
