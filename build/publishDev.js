/* eslint-env node */
const path = require('path');
const {execSync} = require('child_process');
const jsonData = require('../package.json');

// default exec options
const execOpts = {cwd: path.resolve(__dirname + '/..'), encoding: 'utf8'};

// get clean version string
let [, version] = /(\d+\.\d+\.\d+)/.exec(jsonData.version);

// if this is a regular version, e.g. no 'beta', 'alpha' or 'rc', do increment the version by 1
if (!['-alpha', '-beta', '-rc'].some(qualifier => jsonData.version.includes(qualifier))) {
    const versionSplit = version.split('.');
    const patch = parseInt(versionSplit.pop());
    version = [...versionSplit, patch + 1].join('.');
}

// get current git hash
const hash = execSync('git rev-parse --short HEAD', execOpts).trim();

// check for changes to publish
const changes = execSync('git log -1 --pretty=%B', execOpts);

const autoPublish = ['feat', 'fix', 'refactor', 'perf'];

let publish = false;

const commitRegex = /^(revert: )?(feat|fix|polish|docs|style|refactor|perf|test|workflow|ci|chore|types)(\(.+\))?: .{1,50}/g;
let change = commitRegex.exec(changes);
if (change) {

    // find specific changes to publish
    while (change) {
        if (autoPublish.includes(change[2])) {
            publish = true;
            break;
        }
        change = commitRegex.exec(changes);
    }

}

if (publish) {

    // set version of package.json
    execSync(`npm version ${version}-dev.${hash} --git-tag-version false`, execOpts);

    // create dist files
    execSync('npm run compile && npm run compile-rtl && npm run build-scss', execOpts);

    // publish to dev tag
    execSync('npm publish --tag dev', execOpts);
}
