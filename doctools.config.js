module.exports = {
    include: ['src/js/util/*', 'src/js/core/*', 'src/js/component/*'],
    menu: [
        {
            label:'package',
            match: [ (file, desc) => desc.type === 'package']
        },
        {
            label:'core',
            match: ['src/js/core/*']
        },
        {
            label:'components',
            match: ['src/js/components/*']
        },
        {
            label:'utils',
            match: ['src/js/util/*']
        }
    ],

    menus: {
        menu: true
    }
};