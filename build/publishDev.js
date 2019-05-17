const {inc} = require('semver');
const {resolve} = require('path');
const {execSync} = require('child_process');
const argv = require('minimist')(process.argv.slice(2));

argv._.forEach(arg => {
    const tokens = arg.split('=');
    argv[tokens[0]] = tokens[1] || true;
});

// default exec options
const options = {cwd: resolve(`${__dirname}/..`), encoding: 'utf8'};

if (isDevCommit() || argv.f || argv.force) {

    // increase version patch number
    const version = inc(require('../package.json').version, 'patch');

    // get current git hash
    const hash = execSync('git rev-parse --short HEAD', options).trim();

    // set version of package.json
    execSync(`npm version ${version}-dev.${hash} --git-tag-version false`, {...options, stdio: 'inherit'});

    // create dist files
    execSync('yarn compile && yarn compile-rtl && yarn build-scss', {...options, stdio: 'inherit'});

    // publish to dev tag
    execSync('npm publish --tag dev', options);

}

function isDevCommit() {

    // check for changes to publish (%B: raw body (unwrapped subject and body)
    const message = execSync('git log -1 --pretty=%B', options);

    const type = message.match(/^(revert: )?(feat|fix|polish|docs|style|refactor|perf|test|workflow|ci|chore|types)(\(.+\))?: .{1,50}/);

    return type && ['feat', 'fix', 'refactor', 'perf'].includes(type[2]);

}
