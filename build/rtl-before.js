// Renames files in the images directory
// Swaps "next" and "previous" graphics
// Run AFTER images have been created, but BEFORE less files are compiled
// This is needed because some images are inlined during less compilation

var rtl = require('../src/js/util/rtl');

var fs = require('fs');
var glob = require('glob');

// IMAGES
// ----------------

var dst, protect = {
    next: 'PROTECT_NEXT',
    prev: 'PROTECT_PREV',
    new: 'PROTECT_NEW'
};

var dist = 'dist/images';

// write new images with swapped names
glob.sync(`${dist}/*-@(next|previous).svg`)
    .forEach(img => {
        dst = img.replace('next.svg', protect.next)
            .replace('previous.svg', protect.prev)
            .replace(protect.next, 'previous.svg')
            .replace(protect.prev, 'next.svg');
        fs.renameSync(img, dst+protect.new);
    });

// overwrite old with new images
glob(`${dist}/*.svg${protect.new}`, (err, files) => {
    files.forEach(img => fs.renameSync(img, img.replace(protect.new, '')))
});
