import { $ } from 'execa';
import semver from 'semver';
import { getVersion } from './util.js';

const $$ = $({ stdio: 'inherit' });

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
