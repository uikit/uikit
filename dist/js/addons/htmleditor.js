/*! UIkit 2.6.0 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */

(function(addon) {

    if (typeof define == "function" && define.amd) { // AMD
        define("uikit-htmleditor", ["uikit"], function(){
            return jQuery.UIkit.htmleditor || addon(window, window.jQuery, window.jQuery.UIkit);
        });
    }

    if(window && window.jQuery && window.jQuery.UIkit) {
        addon(window, window.jQuery, window.jQuery.UIkit);
    }

})(function(global, $, UI){

    var Htmleditor = function(element, options){

        var $element = $(element);

        if ($element.data("htmleditor")) return;

        this.element = $element;
        this.options = $.extend(true, {}, Htmleditor.defaults, options);

        this.marked     = this.options.marked || marked;
        this.CodeMirror = this.options.CodeMirror || CodeMirror;

        this.init();

        this.element.data("htmleditor", this);
    };

    $.extend(Htmleditor.prototype, {

        init: function(){

            var $this = this, tpl = Htmleditor.template;

            if (this.options.markdown) {
               this.options.codemirror.mode = "gfm";
            }

            tpl = tpl.replace(/\{\:lblPreview\}/g, this.options.lblPreview);
            tpl = tpl.replace(/\{\:lblCodeview\}/g, this.options.markdown ? "Markdown" : this.options.lblCodeview);

            this.htmleditor = $(tpl);
            this.content      = this.htmleditor.find(".uk-htmleditor-content");
            this.toolbar      = this.htmleditor.find(".uk-htmleditor-toolbar");
            this.preview      = this.htmleditor.find(".uk-htmleditor-preview").children().eq(0);
            this.code         = this.htmleditor.find(".uk-htmleditor-code");

            this.element.before(this.htmleditor).appendTo(this.code);

            this.editor = this.CodeMirror.fromTextArea(this.element[0], this.options.codemirror);

            this.editor.htmleditor = this;

            this.editor.on("change", (function(){
                var render = function(){
                    $this.render();
                };

                render();

                return UI.Utils.debounce(render, 150);
            })());

            this.code.find(".CodeMirror").css("height", this.options.height);

            this._buildtoolbar();
            this.fit();

            $(window).on("resize", UI.Utils.debounce(function(){
                $this.fit();
            }, 200));


            var previewContainer = $this.preview.parent(),
                codeContent      = this.code.find('.CodeMirror-sizer'),
                codeScroll       = this.code.find('.CodeMirror-scroll').on('scroll',UI.Utils.debounce(function() {

                    if($this.htmleditor.attr("data-mode")=="tab") return;

                    // calc position
                    var codeHeight       = codeContent.height()   - codeScroll.height(),
                        previewHeight    = previewContainer[0].scrollHeight - previewContainer.height(),
                        ratio            = previewHeight / codeHeight,
                        previewPostition = codeScroll.scrollTop() * ratio;

                    // apply new scroll
                    previewContainer.scrollTop(previewPostition);
            }, 10));

            this.htmleditor.on("click", ".uk-htmleditor-button-code, .uk-htmleditor-button-preview", function(e){

                e.preventDefault();

                if($this.htmleditor.attr("data-mode")=="tab") {

                    $this.htmleditor.find(".uk-htmleditor-button-code, .uk-htmleditor-button-preview").removeClass("uk-active").filter(this).addClass("uk-active");

                    $this.activetab = $(this).hasClass("uk-htmleditor-button-code") ? "code":"preview";
                    $this.htmleditor.attr("data-active-tab", $this.activetab);
                }
            });

            this.preview.parent().css("height", this.code.height());

            // autocomplete
            if (this.options.autocomplete && this.CodeMirror.showHint && this.CodeMirror.hint && this.CodeMirror.hint.html) {

                this.editor.on('inputRead', UI.Utils.debounce(function() {
                    var doc = $this.editor.getDoc(), POS = doc.getCursor(), mode = $this.CodeMirror.innerMode($this.editor.getMode(), $this.editor.getTokenAt(POS).state).mode.name;

                    if (mode == 'xml') { //html depends on xml

                        var cur = $this.editor.getCursor(), token = $this.editor.getTokenAt(cur);

                        if (token.string.charAt(0) == "<" || token.type == "attribute") {
                            $this.CodeMirror.showHint($this.editor, $this.CodeMirror.hint.html, { completeSingle: false });
                        }
                    }
                }, 100));
            }

            // switch markdown mode on event
            this.element.on({
                "enableMarkdown"  : function(){ $this.enableMarkdown(); },
                "disableMarkdown" : function(){ $this.disableMarkdown(); }
            })
        },

        applyPlugins: function(){

            var $this   = this,
                plugins = Object.keys(Htmleditor.plugins),
                plgs    = Htmleditor.plugins;

            this.markers = {};

            if(plugins.length) {

                var lines = this.currentvalue.split("\n");

                plugins.forEach(function(name){
                    this.markers[name] = [];
                }, this);

                for(var line=0,max=lines.length;line<max;line++) {

                    (function(line){
                        plugins.forEach(function(name){

                            var i = 0;

                            lines[line] = lines[line].replace(plgs[name].identifier, function(){

                                var replacement =  plgs[name].cb({
                                    "editor" : $this,
                                    "found": arguments,
                                    "line" : line,
                                    "pos"  : i++,
                                    "uid"  : [name, line, i, (new Date().getTime())+"RAND"+(Math.ceil(Math.random() *100000))].join('-'),
                                    "replace": function(strwith){
                                        var src   = this.editor.editor.getLine(this.line),
                                            start = src.indexOf(this.found[0]);
                                            end   = start + this.found[0].length;

                                        this.editor.editor.replaceRange(strwith, {"line": this.line, "ch":start}, {"line": this.line, "ch":end} );
                                    }
                                });

                                return replacement;
                            });
                        });
                    })(line);
                }

                this.currentvalue = lines.join("\n");

            }
        },

        _buildtoolbar: function(){

            if(!(this.options.toolbar && this.options.toolbar.length)) return;

            var $this = this, bar = [];

            this.options.toolbar.forEach(function(cmd){
                if(Htmleditor.commands[cmd]) {

                   var title = Htmleditor.commands[cmd].title ? Htmleditor.commands[cmd].title : cmd;

                   bar.push('<li><a data-htmleditor-cmd="'+cmd+'" title="'+title+'" data-uk-tooltip>'+Htmleditor.commands[cmd].label+'</a></li>');

                   if(Htmleditor.commands[cmd].shortcut) {
                       $this.registerShortcut(Htmleditor.commands[cmd].shortcut, Htmleditor.commands[cmd].action);
                   }
                }
            });

            this.toolbar.html(bar.join("\n"));

            this.htmleditor.on("click", "a[data-htmleditor-cmd]", function(){
                var cmd = $(this).data("htmleditorCmd");

                if(cmd && Htmleditor.commands[cmd] && (!$this.activetab || $this.activetab=="code" || cmd=="fullscreen")) {
                    Htmleditor.commands[cmd].action.apply($this, [$this.editor])
                }

            });
        },

        fit: function() {

            var mode = this.options.mode;

            if(mode=="split" && this.htmleditor.width() < this.options.maxsplitsize) {
                mode = "tab";
            }

            if(mode=="tab") {

                if(!this.activetab) {
                    this.activetab = "code";
                    this.htmleditor.attr("data-active-tab", this.activetab);
                }

                this.htmleditor.find(".uk-htmleditor-button-code, .uk-htmleditor-button-preview").removeClass("uk-active")
                               .filter(this.activetab=="code" ? '.uk-htmleditor-button-code':'.uk-htmleditor-button-preview').addClass("uk-active");

            }

            this.editor.refresh();
            this.preview.parent().css("height", this.code.height());

            this.htmleditor.attr("data-mode", mode);
        },

        registerShortcut: function(combination, callback){

            var $this = this;

            combination = $.isArray(combination) ? combination : [combination];

            for(var i=0,max=combination.length;i < max;i++) {
                var map = {};

                map[combination[i]] = function(){
                    callback.apply($this, [$this.editor]);
                };

                $this.editor.addKeyMap(map);
            }
        },

        getMode: function(){

            if (this.editor.options.mode == "gfm") {
                var pos = this.editor.getDoc().getCursor();
                return this.editor.getTokenAt(pos).state.base.htmlState ? 'html':'markdown';
            } else {
                return "html";
            }
        },

        render: function() {

            var $this = this, value = this.editor.getValue();

            this.currentvalue  = String(value);

            this.element.trigger("htmleditor-before", [this]);

            this.applyPlugins();

            if(this.editor.options.mode == 'gfm' && this.marked) {

                this.marked.setOptions(this.options.markedOptions);

                this.marked($this.currentvalue, function (err, markdown) {

                    if (err) throw err;

                    $this.preview.html(markdown);
                    $this.element.val($this.editor.getValue()).trigger("htmleditor-update", [$this]);
                });

            } else {

                var html = $.parseHTML($this.currentvalue);

                if(html && html.length) {
                    this.preview.html(html);
                    this.element.val(this.editor.getValue()).trigger("htmleditor-update", [$this]);
                }
            }
        },

        enableMarkdown: function(){
            this.editor.setOption("mode", "gfm");
            this.htmleditor.find('.uk-htmleditor-button-code a').html("Markdown");
            this.render();
        },

        disableMarkdown: function(){
            this.editor.setOption("mode", "htmlmixed");
            this.htmleditor.find('.uk-htmleditor-button-code a').html(this.options.lblCodeview);
            this.render();
        }
    });

    var baseReplacer = function(replace, editor){

            var text     = editor.getSelection();

            if (!text.length) {

                var cur     = editor.getCursor(),
                    curLine = editor.getLine(cur.line),
                    start   = cur.ch,
                    end     = start;

                while (end < curLine.length && /[\w$]+/.test(curLine.charAt(end))) ++end;
                while (start && /[\w$]+/.test(curLine.charAt(start - 1))) --start;

                var curWord = start != end && curLine.slice(start, end);

                if (curWord) {
                    editor.setSelection({"line": cur.line, "ch":start}, {"line": cur.line, "ch":end} );
                    text = curWord;
                }
            }

            var markdown = replace.replace('$1', text);

            editor.replaceSelection(markdown, 'end');
            editor.focus();
        },

        lineReplacer = function(replace, editor){

            var pos      = editor.getDoc().getCursor(),
                text     = editor.getLine(pos.line),
                markdown = replace.replace('$1', text);

            editor.replaceRange(markdown, {"line": pos.line, "ch":0}, {"line": pos.line, "ch":text.length} );
            editor.setCursor({"line":pos.line, "ch":markdown.length});
            editor.focus();
        };

    Htmleditor.commands = {
        "fullscreen": {
            "title"  : 'Fullscreen',
            "label"  : '<i class="uk-icon-expand"></i>',
            "action" : function(editor){

                editor.htmleditor.htmleditor.toggleClass("uk-htmleditor-fullscreen");

                var wrap = editor.getWrapperElement();

                if(editor.htmleditor.htmleditor.hasClass("uk-htmleditor-fullscreen")) {

                    editor.state.fullScreenRestore = {scrollTop: window.pageYOffset, scrollLeft: window.pageXOffset, width: wrap.style.width, height: wrap.style.height};
                    wrap.style.width  = "";
                    wrap.style.height = editor.htmleditor.content.height()+"px";
                    document.documentElement.style.overflow = "hidden";

                } else {

                    document.documentElement.style.overflow = "";
                    var info = editor.state.fullScreenRestore;
                    wrap.style.width = info.width; wrap.style.height = info.height;
                    window.scrollTo(info.scrollLeft, info.scrollTop);
                }

                editor.refresh();
                editor.htmleditor.preview.parent().css("height", editor.htmleditor.code.height());
            }
        },

        "bold" : {
            "title"  : "Bold",
            "label"  : '<i class="uk-icon-bold"></i>',
            "shortcut": ['Ctrl-B', 'Cmd-B'],
            "action" : function(editor){
                baseReplacer(this.getMode() == 'html' ? "<strong>$1</strong>":"**$1**", editor);
            }
        },
        "italic" : {
            "title"  : "Italic",
            "label"  : '<i class="uk-icon-italic"></i>',
            "action" : function(editor){
                baseReplacer(this.getMode() == 'html' ? "<em>$1</em>":"*$1*", editor);
            }
        },
        "strike" : {
            "title"  : "Strikethrough",
            "label"  : '<i class="uk-icon-strikethrough"></i>',
            "action" : function(editor){
                baseReplacer(this.getMode() == 'html' ? "<del>$1</del>":"~~$1~~", editor);
            }
        },
        "blockquote" : {
            "title"  : "Blockquote",
            "label"  : '<i class="uk-icon-quote-right"></i>',
            "action" : function(editor){
                lineReplacer(this.getMode() == 'html' ? "<blockquote><p>$1</p></blockquote>":"> $1", editor);
            }
        },
        "link" : {
            "title"  : "Link",
            "label"  : '<i class="uk-icon-link"></i>',
            "action" : function(editor){
                baseReplacer(this.getMode() == 'html' ? '<a href="http://">$1</a>':"[$1](http://)", editor);
            }
        },
        "picture" : {
            "title"  : "Picture",
            "label"  : '<i class="uk-icon-picture-o"></i>',
            "action" : function(editor){
                baseReplacer(this.getMode() == 'html' ? '<img src="http://" alt="$1">':"![$1](http://)", editor);
            }
        },
        "listUl" : {
            "title"  : "Unordered List",
            "label"  : '<i class="uk-icon-list-ul"></i>',
            "action" : function(editor){
                if(this.getMode() == 'markdown') lineReplacer("* $1", editor);
            }
        },
        "listOl" : {
            "title"  : "Ordered List",
            "label"  : '<i class="uk-icon-list-ol"></i>',
            "action" : function(editor){
                if(this.getMode() == 'markdown') lineReplacer("1. $1", editor);
            }
        }
    }

    Htmleditor.defaults = {
        "mode"         : "split",
        "markdown"     : false,
        "autocomplete" : true,
        "height"       : 500,
        "maxsplitsize" : 1000,
        "markedOptions": { gfm: true, tables: true, breaks: true, pedantic: true, sanitize: false, smartLists: true, smartypants: false, langPrefix: 'lang-'},
        "codemirror"   : { mode: 'htmlmixed', tabMode: 'indent', tabindex: "4", lineWrapping: true, dragDrop: false, autoCloseTags: true, matchTags: true },
        "toolbar"      : [ "bold", "italic", "strike", "link", "picture", "blockquote", "listUl", "listOl" ],
        "lblPreview"   : "Preview",
        "lblCodeview"  : "HTML"
    };

    Htmleditor.template = '<div class="uk-htmleditor uk-clearfix" data-mode="split">' +
                                '<div class="uk-htmleditor-navbar">' +
                                    '<ul class="uk-htmleditor-navbar-nav uk-htmleditor-toolbar"></ul>' +
                                    '<div class="uk-htmleditor-navbar-flip">' +
                                        '<ul class="uk-htmleditor-navbar-nav">' +
                                            '<li class="uk-htmleditor-button-code"><a>{:lblCodeview}</a></li>' +
                                            '<li class="uk-htmleditor-button-preview"><a>{:lblPreview}</a></li>' +
                                            '<li><a data-htmleditor-cmd="fullscreen"><i class="uk-icon-expand"></i></a></li>' +
                                        '</ul>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="uk-htmleditor-content">' +
                                    '<div class="uk-htmleditor-code"></div>' +
                                    '<div class="uk-htmleditor-preview"><div></div></div>' +
                                '</div>' +
                            '</div>';

    Htmleditor.plugins   = {};
    Htmleditor.addPlugin = function(name, identifier, callback) {
        Htmleditor.plugins[name] = {"identifier":identifier, "cb":callback};
    };

    UI["htmleditor"] = Htmleditor;

    // init code
    $(function() {

        $("textarea[data-uk-htmleditor]").each(function() {
            var editor = $(this), obj;

            if (!editor.data("htmleditor")) {
                obj = new Htmleditor(editor, UI.Utils.options(editor.attr("data-uk-htmleditor")));
            }
        });
    });

    return Htmleditor;
});