var fs = require('fs'),
    exec = require('child_process').exec,
    path = require('path'),
    scssTemplates = require('./scssTemplates'),
    util = require('./util'),
    glob = require('glob');

var mixins = new Set(),
    themeVariables = [],
    coreVariables = [],
    // define the order of the hooks to have the same output as in less
    coreHookInverse = {
        "variables.scss": '',
        "mixin.scss": '',
        "base.scss": '',
        "link.scss": '',
        "heading.scss": '',
        "divider.scss": '',
        "list.scss": '',
        "description-list.scss": '',
        "table.scss": '',
        "icon.scss": '',
        "form.scss": '',
        "button.scss": '',
        "section.scss": '',
        "container.scss": '',
        "grid.scss": '',
        "tile.scss": '',
        "card.scss": '',
        "close.scss": '',
        "spinner.scss": '',
        "totop.scss": '',
        "alert.scss": '',
        "badge.scss": '',
        "label.scss": '',
        "overlay.scss": '',
        "article.scss": '',
        "comment.scss": '',
        "search.scss": '',
        "nav.scss": '',
        "navbar.scss": '',
        "subnav.scss": '',
        "breadcrumb.scss": '',
        "pagination.scss": '',
        "tab.scss": '',
        "slidenav.scss": '',
        "dotnav.scss": '',
        "accordion.scss": '',
        "drop.scss": '',
        "dropdown.scss": '',
        "modal.scss": '',
        "sticky.scss": '',
        "offcanvas.scss": '',
        "switcher.scss": '',
        "iconnav.scss": '',
        "notification.scss": '',
        "tooltip.scss": '',
        "placeholder.scss": '',
        "progress.scss": '',
        "sortable.scss": '',
        "animation.scss": '',
        "width.scss": '',
        "text.scss": '',
        "column.scss": '',
        "cover.scss": '',
        "background.scss": '',
        "align.scss": '',
        "utility.scss": '',
        "flex.scss": '',
        "margin.scss": '',
        "padding.scss": '',
        "position.scss": '',
        "transition.scss": '',
        "visibility.scss": '',
        "inverse.scss": '',
        "print.scss": '',
    },  // save all the hook-inverse overwrites for the core/theme
    themeHookInverse = {
        "variables.scss": '',
        "base.scss": '',
        "link.scss": '',
        "heading.scss": '',
        "divider.scss": '',
        "list.scss": '',
        "description-list.scss": '',
        "table.scss": '',
        "icon.scss": '',
        "form.scss": '',
        "button.scss": '',
        "section.scss": '',
        "container.scss": '',
        "grid.scss": '',
        "tile.scss": '',
        "card.scss": '',
        "close.scss": '',
        "spinner.scss": '',
        "totop.scss": '',
        "alert.scss": '',
        "badge.scss": '',
        "label.scss": '',
        "overlay.scss": '',
        "article.scss": '',
        "comment.scss": '',
        "search.scss": '',
        "nav.scss": '',
        "navbar.scss": '',
        "subnav.scss": '',
        "breadcrumb.scss": '',
        "pagination.scss": '',
        "tab.scss": '',
        "slidenav.scss": '',
        "dotnav.scss": '',
        "accordion.scss": '',
        "drop.scss": '',
        "dropdown.scss": '',
        "modal.scss": '',
        "sticky.scss": '',
        "offcanvas.scss": '',
        "iconnav.scss": '',
        "notification.scss": '',
        "tooltip.scss": '',
        "placeholder.scss": '',
        "progress.scss": '',
        "sortable.scss": '',
        "animation.scss": '',
        "width.scss": '',
        "text.scss": '',
        "column.scss": '',
        "background.scss": '',
        "align.scss": '',
        "utility.scss": '',
        "margin.scss": '',
        "padding.scss": '',
        "position.scss": '',
        "transition.scss": '',
        "inverse.scss": '',
    };

Promise.all([
    // Read global variables from variables.less and inverse.less files first
    util.read("src/less/components/variables.less").then(data => {

        // Replace all LESS stuff with SCSS
        scssData = data.replace(/@/g, '$')                                                                                   // convert variables
                       .replace(/(\$[\w\-]*)\s*:(.*);/g, '$1: $2 !default;')                                                 // make variables optional
                       .replace(/tint\((\$[\w\-]+),\s([^\)]*)\)/g, 'mix(white, $1, $2)')                                     // replace LESS function tint with mix
                       .replace(/fade\((\$[\w\-]*), ([0-9]+)\%\)/g, (match, p1, p2) => { return `rgba(${p1}, ${p2/100})`})   // replace LESS function fade with rgba

        // get all variables and make theme optional
        var regex = /(\$[\w\-]*):\s*(.*);/g
        var match = regex.exec(scssData);

        while (match) {
            variablesRegex = /(\$[\w\-]+)/g;
            variablesMatch = variablesRegex.exec(match[2]);
            dependencies = [];

            while (variablesMatch) {
                dependencies.push[variablesMatch[1]];
                variablesMatch = variablesRegex.exec(match[2]);
            }

            themeVariables[match[1]] = {value: `${match[2]};`, dependencies: dependencies};
            coreVariables[match[1]] = {value: `${match[2]};`, dependencies: dependencies};

            match = regex.exec(scssData);
        }
    }),

    // Read global variables from variables.less files next
    util.read("src/less/components/inverse.less").then(data => {

        // Replace all LESS stuff with SCSS
        scssData = data.replace(/@/g, '$')                                                                                   // convert variables
                       .replace(/(\$[\w\-]*)\s*:(.*);/g, '$1: $2 !default;')                                                 // make variables optional
                       .replace(/tint\((\$[\w\-]+),\s([^\)]*)\)/g, 'mix(white, $1, $2)')                                     // replace LESS function tint with mix
                       .replace(/fade\((\$[\w\-]*), ([0-9]+)\%\)/g, (match, p1, p2) => { return `rgba(${p1}, ${p2/100})`})   // replace LESS function fade with rgba

        // get all variables and make theme optional
        var regex = /(\$[\w\-]*):\s*(.*);/g
        var match = regex.exec(scssData);

       while (match) {
            variablesRegex = /(\$[\w\-]+)/g;
            variablesMatch = variablesRegex.exec(match[2]);
            dependencies = [];

            while (variablesMatch) {
                dependencies.push[variablesMatch[1]];
                variablesMatch = variablesRegex.exec(match[2]);
            }

            themeVariables[match[1]] = {value: `${match[2]};`, dependencies: dependencies};
            coreVariables[match[1]] = {value: `${match[2]};`, dependencies: dependencies}

            match = regex.exec(scssData);
        }
    })]).then(() => // read all the files in the second step
        Promise.all([].concat(glob.sync('src/less/**/*.less').map(file =>
             util.read(file).then(data => {
                // Replace all LESS stuff with SCSS
                scssData = data.replace(/\/less\//g, '/scss/')                                                                                                    // change less/ dir to scss/ on imports
                    .replace(/\.less/g, '.scss')                                                                                                                  // change .less extensions to .scss on imports
                    .replace(/@/g, '$')                                                                                                                           // convert variables
                    .replace(/\\\$/g, '\\@')                                                                                                                      // revert classes using the @ symbol
                    .replace(/ e\(/g, ' unquote(')                                                                                                                // convert escape function
                    .replace(/\.([\w\-]*)\s*\((.*)\)\s*\{/g, '@mixin $1($2){')                                                                                    // hook -> mixins
                    .replace(/(\$[\w\-]*)\s*:(.*);/g, '$1: $2 !default;')                                                                                         // make variables optional
                    .replace(/@mixin ([\w\-]*)\s*\((.*)\)\s*\{\s*\}/g, '// @mixin $1($2){}')                                                                      // comment empty mixins
                    .replace(/\.(hook[a-zA-Z\-\d]+);/g, '@include $1();')                                                                                         // hook calls
                    .replace(/\$(import|supports|media|font-face|page|-ms-viewport|keyframes|-webkit-keyframes)/g, '@$1')                                         // replace valid '@' statements
                    .replace(/tint\((\$[\w\-]+),\s([^\)]*)\)/g, 'mix(white, $1, $2)')                                                                             // replace LESS function tint with mix
                    .replace(/fade\((\$[\w\-]*), ([0-9]+)\%\)/g, (match, p1, p2) => { return `rgba(${p1}, ${p2/100})`})                                           // replace LESS function fade with rgba
                    .replace(/fadeout\((\$[\w\-]*), ([0-9]+)\%\)/g, (match, p1, p2) => { return `fade-out(${p1}, ${p2/100})`})                                    // replace LESS function fadeout with fade-out
                    .replace(/\.svg-fill/g, '@include svg-fill')                                                                                                  // include svg-fill mixin
                    .replace(/(.*)\:extend\((\.[\w\-]*) all\) when \((\$[\w\-]*) = ([\w]+)\) {}/g, '@if ( $3 == $4 ) { $1 { @extend $2;} }')                      // update conditional extend
                    .replace(/(\.[\w\-]+)\s*when\s*\((\$[\w\-]*)\s*=\s*(\w+)\)\s*\{\s*\@include\s([\w\-]*)\(\);\s*\}/g, '@if ($2 == $3) { $1 { @include $4();}}') // update conditional hook
                    .replace(/\$\{/g, '#{$')                                                                                                                      // string literals: from: /~"(.*)"/g, to: '#{"$1"}'
                    .replace(/[^\(](\-\$[\w\-]*)/g, ' ($1)')                                                                                                      // surround negative variables with brackets
                    .replace(/~('[^']+')/g, 'unquote($1)');                                                                                                       // string literals: for real

                // get all the mixins
                var regex = /@include ([a-z0-9\-]+)/g;
                var match = regex.exec(scssData);

                while (match) {
                    mixins.add(`@mixin ${match[1]}(){}`);
                    match = regex.exec(scssData);
                }

                // Don't use the variables from within the mixin.less file
                if (file != 'src/less/components/mixin.less') {

                    // get all variables
                    regex = /(\$[\w\-]*)\s*:\s*(.*);/g;
                    match = regex.exec(scssData);

                    while (match) {
                        // check if variable is an background icon, if so replace it directly by the svg.
                        if (match[0].indexOf('../../images/backgrounds') >= 0) {

                            iconregex = /(\$[\w\-]+)\s*:\s*"\.\.\/\.\.\/images\/backgrounds\/([\w\.\/\-]+)" !default;/g;
                            iconmatch = iconregex.exec(match[0]);
                            svg = fs.readFileSync(`src/images/backgrounds/${iconmatch[2]}`).toString();
                            svg =  '"' + svg.replace(/\r?\n|\r/g, '%0A')
                                    .replace(/"/g, '\'')
                                    .replace(/\s/g, '%20')
                                    .replace(/\</g, '%3C')
                                    .replace(/\=/g, '%3D')
                                    .replace(/\'/g, '%22')
                                    .replace(/\:/g, '%3A')
                                    .replace(/\//g, '%2F')
                                    .replace(/\>/g, '%3E')
                                    .replace(/%3Csvg/, 'data:image/svg+xml;charset=UTF-8,%3Csvg') + '"';

                            // Add SVG to the coreVariables and themeVariables only if it is a theme file and make it optional
                            if (file.indexOf('theme/') < 0) {
                                coreVariables[iconmatch[1]] = {value: `${svg} !default;` , dependencies: []};
                            }
                            themeVariables[iconmatch[1]] = {value: `${svg} !default;`, dependencies: []};

                            // Add SVG into the file as well.
                            inlineSVG = `${iconmatch[1]}: ${svg} !default;`;
                            scssData = scssData.replace(match[0], inlineSVG);

                        } else { // When it is not an SVG add the variable and search for its dependencies

                            variablesRegex = /(\$[\w\-]+)/g;
                            variablesMatch = variablesRegex.exec(match[2]);
                            var foundDependencies = [];

                            while(variablesMatch) {
                                foundDependencies.push(variablesMatch[1]);
                                variablesMatch = variablesRegex.exec(match[2]);
                            }
                            if (file.indexOf('theme/') < 0) {
                                coreVariables[match[1]] = {value: `${match[2]};`, dependencies: Array.from(foundDependencies)};
                            }
                            themeVariables[match[1]] = {value: `${match[2]};`, dependencies: Array.from(foundDependencies)};
                        }
                        match = regex.exec(scssData);
                    }
                }

                // get all the hook-inverse Overwrites
                regex = /\@mixin hook-inverse\(\)\{\s*([\w\W]*)\s+\}/g;
                match = regex.exec(scssData);

                while (match) {
                    if (file.indexOf('theme/') < 0) {
                        coreHookInverse[file.replace(/less/g, 'scss').split('components/')[1]] = match[1];
                    } else {
                        themeHookInverse[file.replace(/less/g, 'scss').split('theme/')[1]] = match[1];
                    }
                    match = regex.exec(scssData);
                }

                if (file == 'src/less/uikit.theme.less') {
                    // Remove the theme import first place
                    scssData = scssData.replace(/\/\/\n\/\/ Theme\n\/\/\n\n "theme\/_import.scss";/,'');
                    // Add uikit-mixins and uikit-variables include to the uikit.scss file and change order, to load theme files first.
                    scssData = scssData.replace(/\/\/ Core\n\/\//g, '// Theme\n//\n\n "theme/_import.scss";');
                }

                // Mixin.scss needs to be fully replaced
                if (file == 'src/less/components/mixin.less') {
                    scssData = scssTemplates.templates.mixin;
                }

                return util.write(file.replace(/less/g, 'scss') , scssData);
            })
    )
))).then( () => {
    // write the mixins, variables and inverse hooks last.
    util.write('src/scss/uikit-mixins.scss', Array.from(mixins).join('\n'));

    // write core variables
    compactCoreVariables = new Set();
    Object.keys(coreVariables).map(key => {
        foundDependencies = Array.from(getAllDependencies(coreVariables, key));
        for(var j = 0; j < foundDependencies.length; ++j) {
            compactCoreVariables.add(foundDependencies[j]);
        }
    });
    util.write('src/scss/uikit-variables.scss', Array.from(compactCoreVariables).join('\n'));

    // write theme variables
    compactThemeVariables = new Set();
    Object.keys(themeVariables).map(key => {
        foundDependencies = Array.from(getAllDependencies(themeVariables, key));
        for(var j = 0; j < foundDependencies.length; ++j) {
            compactThemeVariables.add(foundDependencies[j]);
        }
    });
    util.write('src/scss/uikit-theme-variables.scss', Array.from(compactThemeVariables).join('\n'));

    // After all files read write core inverse hook into components/inverse.svss file
    coreHooks = new Set();

    Object.keys(coreHookInverse).map(key => {
        coreHooks.add(coreHookInverse[key]);
    });

    util.read("src/scss/components/inverse.scss").then( data => {
        joinedHook = `@mixin hook-inverse(){\n    ${Array.from(coreHooks).join('\n    ')}\n    @if mixin-exists(hook-theme-inverse) {\n        @include hook-theme-inverse();\n    }\n}\n`;
        scssData = data.replace(/\*\//, '*/\n'+joinedHook);
        util.write("src/scss/components/inverse.scss" , scssData);
    })

    // After all files read write theme inverse hook into theme/inverse.svss file
    themeHooks = new Set();

    Object.keys(themeHookInverse).map(key => {
        themeHooks.add(themeHookInverse[key]);
    });

    util.read("src/scss/theme/inverse.scss").then( data => {
        joinedHook = `@mixin hook-theme-inverse(){\n    ${Array.from(themeHooks).join('\n    ')}\n}\n`;
        scssData = data.replace(/\/\/ @mixin hook-inverse\(\)\{\}/, `${joinedHook}`);
        util.write("src/scss/theme/inverse.scss" , scssData);
    })
});

// recursive function to get a dependencie Set which is ordered so that no depencies exist to a later on entry
// @return Set with all the dependencies.
function getAllDependencies (allVariables, currentKey, dependencies = new Set()) {
    if (!allVariables[currentKey].dependencies.length) {
        dependencies.add(`${currentKey}: ${allVariables[currentKey].value}`);
        return dependencies;
    } else {
        for (var i = 0; i < allVariables[currentKey].dependencies.length; ++i) {
            dependencie = allVariables[currentKey].dependencies[i];
            foundDependencies = getAllDependencies(allVariables, dependencie, dependencies);
            for(var j = 0; j < foundDependencies.length; ++j) {
                dependencies.add(foundDependencies[i]);
            }
        }
        dependencies.add(`${currentKey}: ${allVariables[currentKey].value}`);
        return dependencies;
    }
}