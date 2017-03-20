var fs = require('fs'),
    exec = require('child_process').exec,
    path = require('path'),
    util = require('./util'),
    glob = require('glob');

var read = util.read,
    write = util.write;

var mixins = new Set(),
    themeVar = [],
    coreVar = [],
    /* define the order of the hooks to have the same output as in LESS */
    coreHookInverse = {
        'variables.scss': '',
        'mixin.scss': '',
        'base.scss': '',
        'link.scss': '',
        'heading.scss': '',
        'divider.scss': '',
        'list.scss': '',
        'description-list.scss': '',
        'table.scss': '',
        'icon.scss': '',
        'form.scss': '',
        'button.scss': '',
        'section.scss': '',
        'container.scss': '',
        'grid.scss': '',
        'tile.scss': '',
        'card.scss': '',
        'close.scss': '',
        'spinner.scss': '',
        'totop.scss': '',
        'alert.scss': '',
        'badge.scss': '',
        'label.scss': '',
        'overlay.scss': '',
        'article.scss': '',
        'comment.scss': '',
        'search.scss': '',
        'nav.scss': '',
        'navbar.scss': '',
        'subnav.scss': '',
        'breadcrumb.scss': '',
        'pagination.scss': '',
        'tab.scss': '',
        'slidenav.scss': '',
        'dotnav.scss': '',
        'accordion.scss': '',
        'drop.scss': '',
        'dropdown.scss': '',
        'modal.scss': '',
        'sticky.scss': '',
        'offcanvas.scss': '',
        'switcher.scss': '',
        'iconnav.scss': '',
        'notification.scss': '',
        'tooltip.scss': '',
        'placeholder.scss': '',
        'progress.scss': '',
        'sortable.scss': '',
        'animation.scss': '',
        'width.scss': '',
        'text.scss': '',
        'column.scss': '',
        'cover.scss': '',
        'background.scss': '',
        'align.scss': '',
        'utility.scss': '',
        'flex.scss': '',
        'margin.scss': '',
        'padding.scss': '',
        'position.scss': '',
        'transition.scss': '',
        'visibility.scss': '',
        'inverse.scss': '',
        'print.scss': '',
    },
    /* save all the hook-inverse overwrites for the core/theme */
    themeHookInverse = {
        'variables.scss': '',
        'base.scss': '',
        'link.scss': '',
        'heading.scss': '',
        'divider.scss': '',
        'list.scss': '',
        'description-list.scss': '',
        'table.scss': '',
        'icon.scss': '',
        'form.scss': '',
        'button.scss': '',
        'section.scss': '',
        'container.scss': '',
        'grid.scss': '',
        'tile.scss': '',
        'card.scss': '',
        'close.scss': '',
        'spinner.scss': '',
        'totop.scss': '',
        'alert.scss': '',
        'badge.scss': '',
        'label.scss': '',
        'overlay.scss': '',
        'article.scss': '',
        'comment.scss': '',
        'search.scss': '',
        'nav.scss': '',
        'navbar.scss': '',
        'subnav.scss': '',
        'breadcrumb.scss': '',
        'pagination.scss': '',
        'tab.scss': '',
        'slidenav.scss': '',
        'dotnav.scss': '',
        'accordion.scss': '',
        'drop.scss': '',
        'dropdown.scss': '',
        'modal.scss': '',
        'sticky.scss': '',
        'offcanvas.scss': '',
        'iconnav.scss': '',
        'notification.scss': '',
        'tooltip.scss': '',
        'placeholder.scss': '',
        'progress.scss': '',
        'sortable.scss': '',
        'animation.scss': '',
        'width.scss': '',
        'text.scss': '',
        'column.scss': '',
        'background.scss': '',
        'align.scss': '',
        'utility.scss': '',
        'margin.scss': '',
        'padding.scss': '',
        'position.scss': '',
        'transition.scss': '',
        'inverse.scss': '',
    };

/* template for the new components/mixins.scss file*/
var mixinTemplate = `//
// Component:       Mixin
// Description:     Defines mixins which are used across all components
//
// ========================================================================


// SVG
// ========================================================================

/// Replace \`$search\` with \`$replace\` in \`$string\`
/// @author Hugo Giraudel
/// @param {String} $string - Initial string
/// @param {String} $search - Substring to replace
/// @param {String} $replace ('') - New value
/// @return {String} - Updated string
@function str-replace($string, $search, $replace: '') {
  $index: str-index($string, $search);

  @if $index {
    @return str-slice($string, 1, $index - 1) + $replace + str-replace(str-slice($string, $index + str-length($search)), $search, $replace);
  }

  @return $string;
}

@mixin svg-fill($src, $color-default, $color-new){

    $replace-src: str-replace($src, $color-default, $color-new) !default;
    $replace-src: str-replace($replace-src, "#", "%23");
    background-image: url(quote($replace-src));
}`;

/* First Step: Go through all files */
Promise.all(glob.sync('src/less/**/*.less').map(file =>

    read(file).then(data => {
        /* replace all LESS stuff with SCSS */
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

        /* get all the mixins */
        var regex = /@include ([a-z0-9\-]+)/g;
        var match = regex.exec(scssData);

        while (match) {
            mixins.add(`@mixin ${match[1]}(){}`);
            match = regex.exec(scssData);
        }

        /* get all Variables but not from the mixin.less file */
        if (file != 'src/less/components/mixin.less') {

            regex = /(\$[\w\-]*)\s*:\s*(.*);/g;
            match = regex.exec(scssData);

            while (match) {

                /* check if variable is an background icon, if so replace it directly by the SVG */
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

                    /* add SVG to the coreVar and themeVar only if it is a theme file and make it optional */
                    if (file.indexOf('theme/') < 0) {
                        coreVar[iconmatch[1]] = {value: `${svg} !default;` , dependencies: []};
                    }

                    themeVar[iconmatch[1]] = {value: `${svg} !default;`, dependencies: []};

                    /* add SVG to the variable within the file itself as well */
                    inlineSVG = `${iconmatch[1]}: ${svg} !default;`;
                    scssData = scssData.replace(match[0], inlineSVG);

                } else {

                    /* when it is not an SVG add the variable and search for its dependencies */
                    variablesRegex = /(\$[\w\-]+)/g;
                    variablesMatch = variablesRegex.exec(match[2]);
                    var dependencies = [];

                    while (variablesMatch) {
                        dependencies.push(variablesMatch[1]);
                        variablesMatch = variablesRegex.exec(match[2]);
                    }

                    /* add variables only to the core Variables if it is not a theme file */
                    if (file.indexOf('theme/') < 0) {
                        coreVar[match[1]] = {value: `${match[2]};`, dependencies: Array.from(dependencies)};
                    }
                    themeVar[match[1]] = {value: `${match[2]};`, dependencies: Array.from(dependencies)};
                }
                match = regex.exec(scssData);
            }
        }

        /* get all the hook-inverse overwrites */
        regex = /\@mixin hook-inverse\(\)\{\s*([\w\W]*)\s+\}/g;
        match = regex.exec(scssData);

        while (match) {
            /* add it to the correct list */
            if (file.indexOf('theme/') < 0) {
                coreHookInverse[file.replace(/less/g, 'scss').split('components/')[1]] = match[1];
            } else {
                themeHookInverse[file.replace(/less/g, 'scss').split('theme/')[1]] = match[1];
            }
            match = regex.exec(scssData);
        }

        if (file == 'src/less/uikit.theme.less') {
            /* remove the theme import first place */
            scssData = scssData.replace(/\/\/\n\/\/ Theme\n\/\/\n\n@import "theme\/_import.scss";/,'');
            /* add uikit-mixins and uikit-variables include to the uikit.scss file and change order, to load theme files first */
            scssData = scssData.replace(/\/\/ Core\n\/\//g, '// Theme\n//\n\n\@import "theme/_import.scss";');
        }

        /* mixin.less needs to be fully replaced by the new mixin file*/
        if (file == 'src/less/components/mixin.less') {
            scssData = mixinTemplate;
        }

        return write(file.replace(/less/g, 'scss') , scssData);
    })

)).then( () => {
    /* Second Step write all new needed files for SASS */

    /* write mixins into new file */
    write('src/scss/uikit-mixins.scss', Array.from(mixins).join('\n'));

    /* write core variables */
    compactCoreVar = new Set();
    Object.keys(coreVar).map(key => getAllDependencies(coreVar, key).forEach(dependency => compactCoreVar.add(dependency)));

    write('src/scss/uikit-variables.scss', Array.from(compactCoreVar).join('\n'));

    /* write theme variables */
    compactThemeVar = new Set();
    Object.keys(themeVar).map(key => getAllDependencies(themeVar, key).forEach(dependency => compactThemeVar.add(dependency)));

    write('src/scss/uikit-theme-variables.scss', Array.from(compactThemeVar).join('\n'));

    /* write the core inverse-hook into components/inverse.scss file */
    coreHooks = new Set();

    Object.keys(coreHookInverse).map(key => coreHooks.add(coreHookInverse[key]));

    read("src/scss/components/inverse.scss").then( data => {
        joinedHook = `@mixin hook-inverse(){\n    ${Array.from(coreHooks).join('\n    ')}\n    @if mixin-exists(hook-theme-inverse) {\n        @include hook-theme-inverse();\n    }\n}\n`;
        scssData = data.replace(/\*\//, '*/\n'+joinedHook);
        write("src/scss/components/inverse.scss" , scssData);
    })

    /* write the theme inverse-hook into theme/inverse.scss file */
    themeHooks = new Set();

    Object.keys(themeHookInverse).map(key => themeHooks.add(themeHookInverse[key]));

    read("src/scss/theme/inverse.scss").then( data => {
        joinedHook = `@mixin hook-theme-inverse(){\n    ${Array.from(themeHooks).join('\n    ')}\n}\n`;
        scssData = data.replace(/\/\/ @mixin hook-inverse\(\)\{\}/, `${joinedHook}`);
        write("src/scss/theme/inverse.scss" , scssData);
    })
});

/*
 * recursive function to get a dependencie Set which is ordered so that no depencies exist to a later on entry
 * @return Set with all the dependencies.
 */
function getAllDependencies (allVariables, currentKey, dependencies = new Set()) {

    if (!allVariables[currentKey].dependencies.length) {

        dependencies.add(`${currentKey}: ${allVariables[currentKey].value}`);
        return Array.from(dependencies);
    } else {

        allVariables[currentKey].dependencies.forEach(dependecy => {
            getAllDependencies(allVariables, dependecy, dependencies).forEach(newDependency => dependencies.add(newDependency));
        });

        dependencies.add(`${currentKey}: ${allVariables[currentKey].value}`);
        return Array.from(dependencies);
    }
}
