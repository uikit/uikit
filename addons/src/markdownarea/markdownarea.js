(function(global, $, UI){

    var Markdownarea = function(element, options){

        var $element = $(element);

        if($element.data("markdownarea")) return;

        this.element = $element;
        this.options = $.extend({}, Markdownarea.defaults, options);

        this.init();

        this.element.data("markdownarea", this);
    };

    $.extend(Markdownarea.prototype, {

        "init": function(){

            var $this = this, $element = $(), tpl = Markdownarea.template;

            tpl = tpl.replace(/\{\:lblPreview\}/g, this.options.lblPreview);
            tpl = tpl.replace(/\{\:lblCodeview\}/g, this.options.lblCodeview);

            this.markdownarea = $(tpl);
            this.container    = this.markdownarea.find(".uk-markdownarea-container");
            this.toolbar      = this.markdownarea.find(".uk-markdownarea-toolbar");
            this.preview      = this.markdownarea.find(".uk-markdownarea-preview");
            this.code         = this.markdownarea.find(".uk-markdownarea-code");

            this.element.before(this.markdownarea).appendTo(this.code);

            this.showdown = new Showdown.converter(this.options.showdown);
            this.editor   = CodeMirror.fromTextArea(this.element[0], this.options.codemirror);

            this.editor.on("change", (function(){
                var render = function(){

                        var value = $this.editor.getValue();

                        $this.preview.html($this.showdown.makeHtml(value));
                        $this.element.val(value).trigger("update", [$this]);
                };
                render();
                return render;
            })());

            this._buildtoolbar();
            this.fit();

            $(window).on("resize", UI.Utils.debounce(function(){
                $this.fit();
            }, 200));


            var codeContent     = this.code.find('.CodeMirror-sizer'),
                previewViewport = this.preview.parent(),
                codeScroll      = this.code.find('.CodeMirror-scroll').on('scroll',UI.Utils.debounce(function() {

                    if($this.markdownarea.attr("data-mode")=="tab") return;

                    // calc position
                    var codeHeight       = codeContent.height()   - codeScroll.height(),
                        previewHeight    = $this.preview.height() - previewViewport.height(),
                        ratio            = previewHeight / codeHeight,
                        previewPostition = codeScroll.scrollTop() * ratio;

                    // apply new scroll
                    previewViewport.scrollTop(previewPostition);
            }, 10));

            this.markdownarea.on("click", ".uk-markdownarea-codetab, .uk-markdownarea-previewtab", function(){
                if($this.markdownarea.attr("data-mode")=="tab") {
                    $this.activetab = $this.activetab == "code" ? "preview":"code";
                    $this.markdownarea.attr("data-active-tab", $this.activetab);
                }
            });

            this.preview.parent().css("height", this.code.outerHeight());
        },

        "_buildtoolbar": function(){

            if(!(this.options.toolbar && this.options.toolbar.length)) return;

            var $this = this, bar = [];

            this.options.toolbar.forEach(function(cmd){
                if(Markdownarea.commands[cmd]) {

                   var title = Markdownarea.commands[cmd].title ? Markdownarea.commands[cmd].title : cmd;

                   bar.push('<a data-cmd="'+cmd+'" title="'+title+'" data-uk-tooltip>'+Markdownarea.commands[cmd].label+'</a>');

                   if(Markdownarea.commands[cmd].shortcut) {
                       $this.registerShortcut(Markdownarea.commands[cmd].shortcut, Markdownarea.commands[cmd].action);
                   }
                }
            });

            this.toolbar.html(bar.join("\n")).on("click", "a[data-cmd]", function(){
                var cmd = $(this).data("cmd");

                if(cmd && Markdownarea.commands[cmd]) {
                    Markdownarea.commands[cmd].action.apply($this, [$this.editor])
                }

            });
        },

        "fit": function() {

            var mode = this.options.mode;

            if(mode=="split" && this.markdownarea.width() < this.options.maxsplitsize) {
                mode = "tab";
            }

            if(mode=="tab") {

                if(!this.activetab) {
                    this.activetab = "code";
                    this.markdownarea.attr("data-active-tab", this.activetab);
                }

            } else {

            }

            this.markdownarea.attr("data-mode", mode);
        },

        registerShortcut: function(combination, callback){

            var $this = this;

            combination = $.isArray(combination) ? combination : [combination];

            for(var i=0,max=combination.length;i < max;i++) {
                var map = {};

                map[combination[i]] = function(){
                    callback.apply($this, [$this.editor]);
                }

                $this.editor.addKeyMap(map);
            }
        }
    });

    //jQuery plugin

    $.fn.markdownarea = function(options){

        return this.each(function(){

            var ele = $(this);

            if(!ele.data("markdownarea")) {
                var obj = new Markdownarea(ele, options);
            }
        });
    };

    var baseReplacer = function(replace, editor){
        var text     = editor.getSelection(),
            markdown = replace.replace('$1', text),
            cursor   = editor.getCursor();

        editor.replaceSelection(markdown, 'end');
    };

    Markdownarea.commands = {
        "bold" : {
            "title"  : "Bold",
            "label"  : '<i class="uk-icon-bold"></i>',
            "shortcut": ['Ctrl-B', 'Cmd-B'],
            "action" : function(editor){

                baseReplacer("**$1**", editor);
            }
        },
        "italic" : {
            "title"  : "Italic",
            "label"  : '<i class="uk-icon-italic"></i>',
            "action" : function(editor){
                baseReplacer("*$1*", editor);
            }
        },
        "strike" : {
            "title"  : "Strikethrough",
            "label"  : '<i class="uk-icon-strikethrough"></i>',
            "action" : function(editor){
                baseReplacer("~~$1~~", editor);
            }
        },
        "blockquote" : {
            "title"  : "Blockquote",
            "label"  : '<i class="uk-icon-quote-right"></i>',
            "action" : function(editor){
                baseReplacer("> $1", editor);
            }
        },
        "link" : {
            "title"  : "Link",
            "label"  : '<i class="uk-icon-link"></i>',
            "action" : function(editor){
                baseReplacer("[$1](http://)", editor);
            }
        },
        "picture" : {
            "title"  : "Picture",
            "label"  : '<i class="uk-icon-picture"></i>',
            "action" : function(editor){
                baseReplacer("![$1](http://)", editor);
            }
        },
        "listUl" : {
            "title"  : "Unordered List",
            "label"  : '<i class="uk-icon-list-ul"></i>',
            "action" : function(editor){
                baseReplacer("* $1", editor);
            }
        },
        "listOl" : {
            "title"  : "Ordered List",
            "label"  : '<i class="uk-icon-list-ol"></i>',
            "action" : function(editor){
                baseReplacer("1. $1", editor);
            }
        }
    }

    Markdownarea.defaults = {
        "mode"         : "split",
        "maxsplitsize" : 1000,
        "showdown"     : { extensions: ['github'] },
        "codemirror"   : { mode: 'gfm', tabMode: 'indent', tabindex: "2", lineWrapping: true, dragDrop: false },
        "toolbar"      : [ "bold", "italic", "strike", "link", "picture", "blockquote", "listUl", "listOl" ],
        "lblPreview"   : "Preview",
        "lblCodeview"  : "Markdown"
    };

    Markdownarea.template = '<div class="uk-markdownarea">' +
                                '<div class="uk-markdownarea-tabs uk-clearfix">'+
                                    '<div class="uk-markdownarea-toolbar"></div>'+
                                    '<div class="uk-markdownarea-previewtab"><i class="uk-icon-eye-open"></i><span class="uk-hidden-small"> {:lblPreview}</span></div>'+
                                    '<div class="uk-markdownarea-codetab"><i class="uk-icon-code"></i><span class="uk-hidden-small"> {:lblCodeview}</span></div>'+
                                '</div>'+
                                '<div class="uk-markdownarea-container">'+
                                    '<div><div class="uk-markdownarea-code"></div></div>'+
                                    '<div style=""><div class="uk-markdownarea-preview"></div></div>'+
                                '</div>'+
                            '</div>';

    UI["markdownarea"] = Markdownarea;

    // init code
    $(function() {
        $("textarea[data-uk-markdownarea]").each(function() {
            var area = $(this), obj;

            if (!area.data("markdownarea")) {
                obj = new Markdownarea(area, UI.Utils.options(area.attr("data-uk-markdownarea")));
            }
        });
    });

})(this, jQuery, jQuery.UIkit);