import { $ } from 'execa';
import semver from 'semver';
import { args, getVersion } from './util.js';

const $$ = $({ stdio: 'inherit' });

// default exec options
if (args.f || args.force || (await isDevCommit())) {
    // increase version patch number
    const version = semver.inc(await getVersion(), 'patch');

    // get current git hash
    const hash = (await $`git rev-parse --short HEAD`).stdout.trim();

    // set version of package.json
    await $$`pnpm version ${version}-dev.${hash} --no-git-tag-version`;

    // create dist files
    await $$`pnpm compile`;
    await $$`pnpm compile-rtl`;
    await $$`pnpm build-scss`;

    // publish to dev tag
    await $$`pnpm publish --tag dev --no-git-checks`;
}

async function isDevCommit() {
    // check for changes to publish (%B: raw body (unwrapped subject and body)
    const message = (await $`git log -1 --pretty=%B`).stdout.trim();

    // https://www.conventionalcommits.org/en/v1.0.0/
    return Boolean(message.match(/^(revert: )?(feat|fix|refactor|perf)(\(.+\))?: .{1,50}/));
}
