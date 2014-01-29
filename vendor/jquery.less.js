(function($) {

    var cache = {};

    function getCSS(source, options) {

        var deferred = $.Deferred(), opts = options || {};

        (opts.imports ? resolveImports(source) : $.Deferred().resolve(source)).done(function(source) {

            if (opts.id && cache[opts.id]) {

                createCSS(cache[opts.id]);

            } else {

                new(less.Parser)().parse(source, function(error, tree) {

                    if (error) {
                        return deferred.reject(error);
                    }

                    if (opts.id) {
                        cache[opts.id] = tree;
                    }

                    createCSS(tree);

                });

            }
        });

        function createCSS(tree) {

            var variables = "";

            if (opts.variables) {
                $.each(opts.variables, function(name, value) {
                    variables += ((name.slice(0,1) === "@") ? "" : "@") + name + ": " + ((value.slice(-1) === ";") ? value : value + ";");
                });
            }

            if (variables) {

                new(less.Parser)().parse(variables, function(error, vars) {

                    if (error) {
                        return deferred.reject(error);
                    }

                    var rules = tree.rules;

                    tree.rules = tree.rules.concat(vars.rules);
                    toCSS(tree);
                    tree.rules = rules;

                });

            } else {

                toCSS(tree);

            }
        }

        function toCSS(tree) {

            try {
                deferred.resolve(tree.toCSS(opts));
            } catch (e) {

                if (opts.id && cache[opts.id]) {
                    delete cache[opts.id];
                }

                deferred.reject(e);
            }

        }

        return deferred.promise();
    }

    function resolveImports(source) {

        var deferred = $.Deferred(), imports = {}, host = extractUrlParts(window.location.href).host, importRegex = /@import\s+url\s*\(['"]?(.+?)['"]?\)\s*;/g, urlRegex = /url\s*\(['"]?(.+?)['"]?\)/g;

        function queuedWhen(queue) {

            var deferreds = [], prev = null;

            $.each(queue, function(i, fn) {
                deferreds.push(prev = prev ? prev.then(fn) : fn.call());
            });

            return $.when.apply($, deferreds);
        }

        function rewrite(source, baseUrl) {

            source = source.replace(/@import\s['"]?(.+?)['"]?\s*;/g, function(match, url) {
                return match.indexOf("url(")!=-1 ? match:'@import url("'+url+'");';
            });

            return source.replace(urlRegex, function(match, url) {
                return match.match(/data\:image\//) ? match : match.replace(url, extractUrlParts(url, baseUrl).url);
            });
        }

        (function resolve(source) {

            var queue = [];

            source = source.replace(/@import\s['"]?(.+?)['"]?\s*;/g, function(match, url) {
                return match.indexOf("url(")!=-1 ? match:'@import url("'+url+'");';
            });

            source.replace(importRegex, function(match, url) {

                if (!imports[url] && host == extractUrlParts(url).host) {
                    queue.push(
                        function() {
                            return $.ajax({url: url, cache: false}).done(function(data) {
                                imports[url] = rewrite(data.replace(/\/\*(?:[^*]|\*+[^\/*])*\*+\/|^((?!:).)?\/\/.*/g, ''), url);
                            }).fail(function(xhr, status, error) {
                                imports[url] = "/* Can't resolve import '" + url + "' (" + status + ", " + error + ") */";
                            });
                        }
                    );
                }

                return match;
            });

            queuedWhen(queue).always(function() {

                source = source.replace(importRegex, function(match, url) {
                    return imports[url] ? imports[url] : match;
                });

                if (queue.length) {
                    source = resolve(source);
                } else {
                    deferred.resolve(source);
                }
            });

            return source;

        })(rewrite(source.replace(/\/\*(?:[^*]|\*+[^\/*])*\*+\/|^((?!:).)?\/\/.*/g, '')));

        return deferred.promise();
    }

    function getVars(source) {

        var i, vars = {}, lines = source.split("\n");

        for (i = 0, max = lines.length; i < max; i++) {

            var line = $.trim(lines[i]);

            if (!line.length) continue;
            if (!/@[\w\-]+\s*:.[^;]*;/.test(line)) continue;

            var keyval = $.trim(line.replace(";", "").replace(/\s+/, "")).split(":");

            keyval[1] = $.trim(keyval[1].replace(";","").split('//')[0]);
            vars[keyval[0]] = keyval[1];
        }

        return vars;
    }

    function rewriteUrls(source, baseUrl) {
        return source.replace(/url\s*\(['"]?(.+?)['"]?\)/g, function(match, url) {
            return (url.match(/^(http|\/\/)/) || match.match(/data\:image\//)) ? match : match.replace(url, pathDiff(extractUrlParts(url, baseUrl).url, baseUrl));
        });
    }

    function pathDiff(url, baseUrl) {

        var urlParts = extractUrlParts(url), urlDirs,
            baseUrlParts = extractUrlParts(baseUrl), baseUrlDirs,
            diff = "", max, i;

        if (urlParts.host !== baseUrlParts.host) {
            return "";
        }

        max = Math.max(baseUrlParts.dirs.length, urlParts.dirs.length);

        for (i = 0; i < max; i++) {
            if (baseUrlParts.dirs[i] !== urlParts.dirs[i]) { break; }
        }

        urlDirs = urlParts.dirs.slice(i);
        baseUrlDirs = baseUrlParts.dirs.slice(i);

        for (i = 0; i < baseUrlDirs.length - 1; i++) {
            diff += "../";
        }

        for (i = 0; i < urlDirs.length - 1; i++) {
            diff += urlDirs[i] + "/";
        }

        return diff + urlParts.file + urlParts.query;
    }

    function extractUrlParts(url, baseUrl) {

        var urlPartsRegex = /^((?:[a-z-]+:)?\/\/(?:[^\/\?#]*\/)|([\/\\]))?((?:[^\/\\\?#]*[\/\\])*)([^\/\\\?#]*)([#\?].*)?$/,
            urlParts = url.match(urlPartsRegex), baseUrlParts,
            parts = {}, dirs = [], i;

        if (!urlParts) {
            throw new Exception("Could not parse url - '" + url + "'");
        }

        if (!urlParts[1] || urlParts[2]) {

            if (!baseUrl) {
                baseUrl = window.location.href;
            }

            baseUrlParts = baseUrl.match(urlPartsRegex);

            if (!baseUrlParts) {
                throw new Exception("Could not parse url - '" + baseUrl + "'");
            }

            urlParts[1] = baseUrlParts[1];

            if (!urlParts[2]) {
                urlParts[3] = baseUrlParts[3] + urlParts[3];
            }
        }

        if (urlParts[3]) {

            dirs = urlParts[3].replace("\\", "/").split("/");

            for (i = 0; i < dirs.length; i++) {
                if (dirs[i] === ".." && i > 0) {
                    dirs.splice(i-1, 2);
                    i -= 2;
                }
            }
        }

        parts.host = urlParts[1];
        parts.path = urlParts[1] + dirs.join("/");
        parts.file = urlParts[4] || "";
        parts.query = urlParts[5] || "";
        parts.url = parts.path + parts.file + parts.query;
        parts.dirs = dirs;

        return parts;
    }

    $.less = $.less || (function() {
        return {
            'getCSS': getCSS,
            'getVars': getVars,
            'resolveImports': resolveImports,
            'rewriteUrls': rewriteUrls,
            'pathDiff': pathDiff,
            'extractUrlParts': extractUrlParts
        };
    })();

})(jQuery);