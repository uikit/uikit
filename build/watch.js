import { execSync } from 'node:child_process';
import fs from 'node:fs';

watch('src/less', '.less', 'node build/less');

function watch(path, pattern, cmd) {
    let debounceTimer;

    execute();

    fs.watch(path, { recursive: true }, (event, filename) => {
        if (filename?.endsWith(pattern)) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(execute, 100);
        }
    });

    function execute() {
        execSync(cmd, { stdio: 'inherit' });
    }
}
