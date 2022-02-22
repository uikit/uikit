import semver from 'semver';
import { args, getVersion, run } from './util.js';

const { inc } = semver;

// default exec options
if (args.f || args.force || (await isDevCommit())) {
    // increase version patch number
    const version = inc(await getVersion(), 'patch');

    // get current git hash
    const hash = (await run('git rev-parse --short HEAD')).trim();

    // set version of package.json
    await run(`npm version ${version}-dev.${hash} --git-tag-version false`);

    // create dist files
    await run('yarn compile && yarn compile-rtl && yarn build-scss');

    // publish to dev tag
    await run('npm publish --tag dev');
}

async function isDevCommit() {
    // check for changes to publish (%B: raw body (unwrapped subject and body)
    const message = await run('git log -1 --pretty=%B');

    // https://www.conventionalcommits.org/en/v1.0.0/
    const type = message.match(
        /^(revert: )?(feat|fix|polish|docs|style|refactor|perf|test|workflow|ci|chore|types|build)(\(.+\))?: .{1,50}/
    );

    return type && ['feat', 'fix', 'refactor', 'perf'].includes(type[2]);
}
