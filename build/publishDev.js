
/* eslint-env node */
const path = require('path');
const {execSync} = require('child_process');
const jsonData = require('../package.json');

//default exec options
const execOpts = {cwd: path.resolve(__dirname + '/..'), encoding: 'utf8'};

//get clean version string
let [, version] = /(\d+\.\d+\.\d+)/.exec(jsonData.version);

//if this is a regular version, e.g. no 'beta', 'alpha' or 'rc', do increment the version by 1
if (!['-alpha', '-beta', '-rc'].some(qualifier => jsonData.version.includes(qualifier))) {
    const versionSplit = version.split('.');
    const patch = parseInt(versionSplit.pop());
    version = [...versionSplit, patch + 1].join('.');
}

//get current git hash
const hash = execSync('git rev-parse --short HEAD', execOpts).trim();

//set version of package.json
execSync(`npm version ${version}-dev.${hash} --git-tag-version false`, execOpts);

//publish to dev tag
execSync('npm publish --tag dev', execOpts);
