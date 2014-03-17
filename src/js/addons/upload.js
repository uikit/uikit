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

    var FileSelect = function(element, options) {

        var $this    = this,
            $element = $(element).addClass("uk-form-file"),
            options  = $.extend({}, xhrupload.defaults, FileSelect.defaults, options);

        if ($element.data("fileSelect")) return;


        this.progressbar = options.progressbar ? $(options.progressbar) : false;

        if (this.progressbar && this.progressbar.length) {

            var bar           = this.progressbar.css("visibility", "hidden").find('.uk-progress-bar'),
                onloadstart   = options.loadstart,
                onprogress    = options.progress,
                onallcomplete = options.nallcomplete;

            options.loadstart = function() {
                $this.progressbar.css("visibility", "visible");
            };

            options.progress = function(percent) {
                percent = Math.ceil(percent);
                bar.css("width", percent+"%");
                onprogress(percent)
            };

            options.allcomplete = function(response) {
                setTimeout(function(){
                    $this.progressbar.css("visibility", "hidden");
                }, 250);
            };
        }

        this.fileinput = $element.find('input[type="file"]');

        if (!this.fileinput.length) {
            this.fileinput = $('<input type="file" />').appendTo($element);
        }

        this.fileinput.on("change", function() {
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

            xhrupload(this.files, options);
        });

        $element.data("fileSelect", this);
    };

    FileSelect.defaults = {
        'action': '/',
        'allow': '*.*',
        'progressbar': false,
        // events
        'notallowed': function(file) {}
    };

    var FileDrop = function(element, options) {

        var $this    = this,
            $element = $(element),
            options  = $.extend({}, xhrupload.defaults, FileSelect.defaults, options);

        if ($element.data("fileDrop")) return;

        this.progressbar = options.progressbar ? $(options.progressbar) : false;

        if (this.progressbar && this.progressbar.length) {

            var bar           = this.progressbar.css("visibility", "hidden").find('.uk-progress-bar'),
                onloadstart   = options.loadstart,
                onprogress    = options.progress,
                onallcomplete = options.nallcomplete;

            options.loadstart = function() {
                $this.progressbar.css("visibility", "visible");
            };

            options.progress = function(percent) {
                percent = Math.ceil(percent);
                bar.css("width", percent+"%");
                onprogress(percent)
            };

            options.allcomplete = function(response) {
                setTimeout(function(){
                    $this.progressbar.css("visibility", "hidden");
                }, 250);
            };
        }

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

        $element.data("fileDrop", this);
    };

    FileDrop.defaults = {
        'action': '/',
        'dragoverClass': 'uk-dragover',
        'allow': '*.*',
        'progressbar': false,
        // events
        'notallowed': function(file) {}
    };

    UI["fileDrop"]   = FileDrop;
    UI["fileSelect"] = FileSelect;

    $(document).on("uk-domready", function(e) {

        $("[data-uk-file-drop], [data-uk-file-select]").each(function(){

          var ele  = $(this),
              attr = ele.is('[data-uk-file-drop]') ? 'data-uk-file-drop' : 'data-uk-file-select',
              cls  = attr == 'data-uk-file-drop' ? 'fileDrop' : 'fileSelect';

          if (!ele.data(cls)) {
              var obj = new UI[cls](ele, UI.Utils.options(ele.attr(attr)));
          }
        });
    });

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

});