(function(addon) {

    if (typeof define == "function" && define.amd) { // AMD
        define(["uikit"], function(){
            return jQuery.UIkit || addon(window.jQuery, window.jQuery.UIkit);
        });
    }

    if (window && window.jQuery && window.jQuery.UIkit) {
        addon(window.jQuery, window.jQuery.UIkit);
    }

})(function($, UI){

    var UploadSelect = function(element, options) {

        var $this    = this,
            $element = $(element),
            options  = $.extend({}, xhrupload.defaults, UploadSelect.defaults, options);

        if ($element.data("uploadSelect")) return;

        this.element = $element;

        this.element.on("change", function() {
            if (options.allow!=='*.*') {

                for(var i=0,file;file=e.dataTransfer.files[i];i++) {
                    if(!matchName(options.allow, file.name)) {
                        if(typeof(options.notallowed) == 'string') {
                           alert(options.notallowed);
                        } else {
                           options.notallowed(file);
                        }
                        return;
                    }
                }
            }

            xhrupload($this.element.files, options);
        });

        $element.data("uploadSelect", this);
    };

    UploadSelect.defaults = {
        'action': '/',
        'allow': '*.*',
        // events
        'notallowed': function(file) {}
    };

    var UploadDrop = function(element, options) {

        var $this    = this,
            $element = $(element),
            options  = $.extend({}, xhrupload.defaults, UploadDrop.defaults, options);

        if ($element.data("uploadDrop")) return;

        $element.on("drop", function(e){

            if (e.dataTransfer && e.dataTransfer.files) {

                e.stopPropagation();
                e.preventDefault();
                $element.removeClass(options.dragoverClass);

                if (options.allow!=='*.*') {

                    for(var i=0,file;file=e.dataTransfer.files[i];i++) {

                        if(!matchName(options.allow, file.name)) {

                            if(typeof(options.notallowed) == 'string') {
                               alert(options.notallowed);
                            } else {
                               options.notallowed(file);
                            }
                            return;
                        }
                    }
                }

                xhrupload(e.dataTransfer.files, options);
            }

        }).on("dragenter", function(e){
            e.stopPropagation();
            e.preventDefault();
            $element.addClass(options.dragoverClass);
        }).on("dragover", function(e){
            e.stopPropagation();
            e.preventDefault();
        }).on("dragleave", function(e){
            e.stopPropagation();
            e.preventDefault();
            $element.removeClass(options.dragoverClass);
        });

        $element.data("uploadDrop", this);
    };

    UploadDrop.defaults = {
        'action': '/',
        'dragoverClass': 'uk-dragover',
        'allow': '*.*',
        // events
        'notallowed': function(file) {}
    };

    UI["upload"] = { "select" : UploadSelect, "drop" : UploadDrop };

    UI.support.ajaxupload = (function() {

        function supportFileAPI() {
            var fi = document.createElement('INPUT'); fi.type = 'file'; return 'files' in fi;
        }

        function supportAjaxUploadProgressEvents() {
            var xhr = new XMLHttpRequest(); return !! (xhr && ('upload' in xhr) && ('onprogress' in xhr.upload));
        }

        function supportFormData() {
            return !! window.FormData;
        }

        return supportFileAPI() && supportAjaxUploadProgressEvents() && supportFormData();
    })();

    if (UI.support.ajaxupload){
        $.event.props.push("dataTransfer");
    }

    function xhrupload(files, settings) {

        if (!UI.support.ajaxupload){
            return this;
        }

        settings = $.extend({}, xhrupload.defaults, settings);

        if (!files.length){
            return;
        }

        var complete = settings.complete;

        if (settings.single){

            var count    = files.length,
                uploaded = 0;

                settings.complete = function(response, xhr){
                    uploaded = uploaded+1;
                    complete(response, xhr);
                    if (uploaded<count){
                        upload([files[uploaded]], settings);
                    } else {
                        settings.allcomplete(response, xhr);
                    }
                };

                upload([files[0]], settings);

        } else {

            settings.complete = function(response, xhr){
                complete(response, xhr);
                settings.allcomplete(response, xhr);
            };

            upload(files, settings);
        }

        function upload(files, settings){

            // upload all at once
            var formData = new FormData(), xhr = new XMLHttpRequest();

            if (settings.before(settings, files)===false) return;

            for (var i = 0, f; f = files[i]; i++) { formData.append(settings.param, f); }
            for (var p in settings.params) { formData.append(p, settings.params[p]); }

            // Add any event handlers here...
            xhr.upload.addEventListener("progress", function(e){
                var percent = (e.loaded / e.total)*100;
                settings.progress(percent, e);
            }, false);

            xhr.addEventListener("loadstart", function(e){ settings.loadstart(e); }, false);
            xhr.addEventListener("load",      function(e){ settings.load(e); }, false);
            xhr.addEventListener("loadend",   function(e){ settings.loadend(e); }, false);
            xhr.addEventListener("error",     function(e){ settings.error(e); }, false);
            xhr.addEventListener("abort",     function(e){ settings.abort(e); }, false);

            xhr.open(settings.method, settings.action, true);
            xhr.onreadystatechange = function() {

                settings.readystatechange(xhr);

                if (xhr.readyState==4){

                    var response = xhr.responseText;

                    if (settings.type=="json") {
                        try {
                            response = $.parseJSON(response);
                        } catch(e) {
                            response = false;
                        }
                    }

                    settings.complete(response, xhr);
                }
            };

            xhr.send(formData);
        }
    }

    xhrupload.defaults = {
        'action': '',
        'single': true,
        'method': 'POST',
        'param' : 'files[]',
        'params': {},

        // events
        'before'          : function(o){},
        'loadstart'       : function(){},
        'load'            : function(){},
        'loadend'         : function(){},
        'progress'        : function(){},
        'complete'        : function(){},
        'allcomplete'     : function(){},
        'readystatechange': function(){}
    };

    function matchName(pattern, path) {

        var parsedPattern = '^' + pattern.replace(/\//g, '\\/').
            replace(/\*\*/g, '(\\/[^\\/]+)*').
            replace(/\*/g, '[^\\/]+').
            replace(/((?!\\))\?/g, '$1.') + '$';

        parsedPattern = '^' + parsedPattern + '$';

        return (path.match(new RegExp(parsedPattern)) !== null);
    }

    UI.Utils.xhrupload = xhrupload;

    return xhrupload;
});