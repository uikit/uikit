var fs = require('fs');

function getSize(code) {
    return `${(code.length / 1024).toFixed(2)}kb`;
}

function cyan(str) {
    return `\x1b[1m\x1b[36m${str}\x1b[39m\x1b[22m`;
}


exports.write = function(dest, code) {
    return new Promise((resolve, reject) =>
        fs.writeFile(dest, code, err => {
            if (err) {
                return reject(err);
            }
            console.log(`${cyan(dest)} ${getSize(code)}`);
            resolve();
        })
    );
}
