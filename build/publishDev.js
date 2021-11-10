import {inc} from 'semver';
import {resolve} from 'path';
import {args, getVersion, run} from './util.js';

// default exec options
const options = {cwd: resolve(`${__dirname}/..`), encoding: 'utf8'};
if (args.f || args.force || await isDevCommit()) {

    // increase version patch number
    const version = inc(await getVersion(), 'patch');

    // get current git hash
    const hash = (await run('git rev-parse --short HEAD', options)).trim();

    // set version of package.json
    await run(`npm version ${version}-dev.${hash} --git-tag-version false`, {...options, stdio: 'inherit'});

    // create dist files
    await run('yarn compile && yarn compile-rtl && yarn build-scss', {...options, stdio: 'inherit'});

    // publish to dev tag
    await run('npm publish --tag dev', options);

}

async function isDevCommit() {

    // check for changes to publish (%B: raw body (unwrapped subject and body)
    const message = await run('git log -1 --pretty=%B', options);

    const type = message.match(/^(revert: )?(feat|fix|polish|docs|style|refactor|perf|test|workflow|ci|chore|types)(\(.+\))?: .{1,50}/);

    return type && ['feat', 'fix', 'refactor', 'perf'].includes(type[2]);

}
