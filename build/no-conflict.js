var exec = require('child_process').exec;
var fs = require('fs');
var glob = require('glob');

glob('dist/**/*.css', (err, files) =>
    files.forEach(file =>
        fs.readFile(file, 'utf8', (err, data) => {

            let lessfile = file.replace('.css', '.less');

            data = `.uk-noconflict {\n${data}\n}`;

            fs.writeFile(lessfile, data, err => {

                if (err) {
                    throw err;
                }

                exec(`lessc ${lessfile} > ${file}`, (error, stdout, stderr) => {

                    if (stderr) {
                        console.log(`Error building: ${file}`, stderr);
                    } else {

                        fs.readFile(file, 'utf8', (err, data) => {

                            data = data.replace(/\.uk-noconflict \{(.|[\r\n])*?\}/, '')
                                       .replace(`.uk-noconflict html`, `.uk-noconflict`)
                                       .replace(/\.uk-noconflict\s(\.(uk-(drag|modal-page)))/g, '$1');

                            fs.writeFile(file, data);
                        });

                        console.log(`${file} build`);
                    }

                    fs.unlink(lessfile);

                });
            });

        })
    )
);
