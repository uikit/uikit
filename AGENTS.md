# Agent Instructions

- Use [Conventional Commits](https://www.conventionalcommits.org/) format for commit messages.
- Follow [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/). Maintain a topmost
  `## WIP` section in `CHANGELOG.md`, before the latest versioned release.
  Add entries under non-empty `### Added`, `### Changed`, `### Deprecated`, `### Removed`,
  `### Fixed`, or `### Security` categories.
- Never commit generated `dist` files.
- Do not modify SCSS files; they are generated from the LESS source files. Make stylesheet changes in the corresponding LESS files instead.
