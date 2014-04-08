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
               this.options.lblCodeview     = "Markdown";
            }

            tpl = tpl.replace(/\{\:lblPreview\}/g, this.options.lblPreview);
            tpl = tpl.replace(/\{\:lblCodeview\}/g, this.options.lblCodeview);

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

                    var value   = $this.editor.getValue();

                    $this.currentvalue  = String(value);

                    $this.element.trigger("htmleditor-before", [$this]);

                    $this.applyPlugins();

                    if($this.options.markdown && $this.marked) {

                        $this.marked.setOptions($this.options.markedOptions);

                        $this.marked($this.currentvalue, function (err, markdown) {

                            if (err) throw err;

                            $this.preview.html(markdown);
                            $this.element.val($this.editor.getValue()).trigger("htmleditor-update", [$this]);
                        });

                    } else {

                        try{
                            var source = Htmleditor.HTMLtoXML($this.currentvalue);
                            $this.preview.html(source);
                            $this.element.val($this.editor.getValue()).trigger("htmleditor-update", [$this]);
                        }catch(e) {}
                    }
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
                                    "area" : $this,
                                    "found": arguments,
                                    "line" : line,
                                    "pos"  : i++,
                                    "uid"  : [name, line, i, (new Date().getTime())+"RAND"+(Math.ceil(Math.random() *100000))].join('-'),
                                    "replace": function(strwith){
                                        var src   = this.area.editor.getLine(this.line),
                                            start = src.indexOf(this.found[0]);
                                            end   = start + this.found[0].length;

                                        this.area.editor.replaceRange(strwith, {"line": this.line, "ch":start}, {"line": this.line, "ch":end} );
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

            if (this.options.codemirror.mode == "gfm") {
                var pos = this.editor.getDoc().getCursor();
                return this.editor.getTokenAt(pos).state.base.htmlState ? 'html':'markdown';
            } else {
                return "html";
            }
        }
    });

    var baseReplacer = function(replace, editor){
        var text     = editor.getSelection(),
            markdown = replace.replace('$1', text);

        editor.replaceSelection(markdown, 'end');
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
                baseReplacer(this.getMode() == 'html' ? "<blockquote><p>$1</p></blockquote>":"> $1", editor);
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
                if(this.getMode() == 'markdown') baseReplacer("* $1", editor);
            }
        },
        "listOl" : {
            "title"  : "Ordered List",
            "label"  : '<i class="uk-icon-list-ol"></i>',
            "action" : function(editor){
                if(this.getMode() == 'markdown') baseReplacer("1. $1", editor);
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
        "codemirror"   : { mode: 'htmlmixed', tabMode: 'indent', tabindex: "2", lineWrapping: true, dragDrop: false, autoCloseTags: true, matchTags: true },
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
            var area = $(this), obj;

            if (!area.data("htmleditor")) {
                obj = new Htmleditor(area, UI.Utils.options(area.attr("data-uk-htmleditor")));
            }
        });
    });


    /*
     * HTML Parser By John Resig (ejohn.org)
     * Original code by Erik Arvidsson, Mozilla Public License
     * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
     *
     * // Use like so:
     * HTMLParser(htmlString, {
     *     start: function(tag, attrs, unary) {},
     *     end: function(tag) {},
     *     chars: function(text) {},
     *     comment: function(text) {}
     * });
     *
     * // or to get an XML string:
     * HTMLtoXML(htmlString);
     *
     * // or to get an XML DOM Document
     * HTMLtoDOM(htmlString);
     *
     * // or to inject into an existing document/DOM node
     * HTMLtoDOM(htmlString, document);
     * HTMLtoDOM(htmlString, document.body);
     *
     */

    (function(namespace){

        // Regular Expressions for parsing tags and attributes
        var startTag = /^<([-A-Za-z0-9_]+)((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,
            endTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/,
            attr = /([-A-Za-z0-9_]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;

        // Empty Elements - HTML 4.01
        var empty = makeMap("area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed");

        // Block Elements - HTML 4.01
        var block = makeMap("address,applet,blockquote,button,center,dd,del,dir,div,dl,dt,fieldset,form,frameset,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul");

        // Inline Elements - HTML 4.01
        var inline = makeMap("a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var");

        // Elements that you can, intentionally, leave open
        // (and which close themselves)
        var closeSelf = makeMap("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr");

        // Attributes that have their values filled in disabled="disabled"
        var fillAttrs = makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected");

        // Special Elements (can contain anything)
        var special = makeMap("script,style");

        var HTMLParser = namespace.HTMLParser = function( html, handler ) {
            var index, chars, match, stack = [], last = html;
            stack.last = function(){
                return this[ this.length - 1 ];
            };

            while ( html ) {
                chars = true;

                // Make sure we're not in a script or style element
                if ( !stack.last() || !special[ stack.last() ] ) {

                    // Comment
                    if ( html.indexOf("<!--") == 0 ) {
                        index = html.indexOf("-->");

                        if ( index >= 0 ) {
                            if ( handler.comment )
                                handler.comment( html.substring( 4, index ) );
                            html = html.substring( index + 3 );
                            chars = false;
                        }

                    // end tag
                    } else if ( html.indexOf("</") == 0 ) {
                        match = html.match( endTag );

                        if ( match ) {
                            html = html.substring( match[0].length );
                            match[0].replace( endTag, parseEndTag );
                            chars = false;
                        }

                    // start tag
                    } else if ( html.indexOf("<") == 0 ) {
                        match = html.match( startTag );

                        if ( match ) {
                            html = html.substring( match[0].length );
                            match[0].replace( startTag, parseStartTag );
                            chars = false;
                        }
                    }

                    if ( chars ) {
                        index = html.indexOf("<");

                        var text = index < 0 ? html : html.substring( 0, index );
                        html = index < 0 ? "" : html.substring( index );

                        if ( handler.chars )
                            handler.chars( text );
                    }

                } else {
                    html = html.replace(new RegExp("(.*)<\/" + stack.last() + "[^>]*>"), function(all, text){
                        text = text.replace(/<!--(.*?)-->/g, "$1")
                            .replace(/<!\[CDATA\[(.*?)]]>/g, "$1");

                        if ( handler.chars )
                            handler.chars( text );

                        return "";
                    });

                    parseEndTag( "", stack.last() );
                }

                if ( html == last )
                    throw "Parse Error: " + html;
                last = html;
            }

            // Clean up any remaining tags
            parseEndTag();

            function parseStartTag( tag, tagName, rest, unary ) {
                tagName = tagName.toLowerCase();

                if ( block[ tagName ] ) {
                    while ( stack.last() && inline[ stack.last() ] ) {
                        parseEndTag( "", stack.last() );
                    }
                }

                if ( closeSelf[ tagName ] && stack.last() == tagName ) {
                    parseEndTag( "", tagName );
                }

                unary = empty[ tagName ] || !!unary;

                if ( !unary )
                    stack.push( tagName );

                if ( handler.start ) {
                    var attrs = [];

                    rest.replace(attr, function(match, name) {
                        var value = arguments[2] ? arguments[2] :
                            arguments[3] ? arguments[3] :
                            arguments[4] ? arguments[4] :
                            fillAttrs[name] ? name : "";

                        attrs.push({
                            name: name,
                            value: value,
                            escaped: value.replace(/(^|[^\\])"/g, '$1\\\"') //"
                        });
                    });

                    if ( handler.start )
                        handler.start( tagName, attrs, unary );
                }
            }

            function parseEndTag( tag, tagName ) {
                // If no tag name is provided, clean shop
                if ( !tagName )
                    var pos = 0;

                // Find the closest opened tag of the same type
                else
                    for ( var pos = stack.length - 1; pos >= 0; pos-- )
                        if ( stack[ pos ] == tagName )
                            break;

                if ( pos >= 0 ) {
                    // Close all the open elements, up the stack
                    for ( var i = stack.length - 1; i >= pos; i-- )
                        if ( handler.end )
                            handler.end( stack[ i ] );

                    // Remove the open elements from the stack
                    stack.length = pos;
                }
            }
        };

        namespace.HTMLtoXML = function( html ) {
            var results = "";

            HTMLParser(html, {
                start: function( tag, attrs, unary ) {
                    results += "<" + tag;

                    for ( var i = 0; i < attrs.length; i++ )
                        results += " " + attrs[i].name + '="' + attrs[i].escaped + '"';

                    results += (unary ? "/" : "") + ">";
                },
                end: function( tag ) {
                    results += "</" + tag + ">";
                },
                chars: function( text ) {
                    results += text;
                },
                comment: function( text ) {
                    results += "<!--" + text + "-->";
                }
            });

            return results;
        };

        function makeMap(str){
            var obj = {}, items = str.split(",");
            for ( var i = 0; i < items.length; i++ )
                obj[ items[i] ] = true;
            return obj;
        }

    })(Htmleditor);

    return Htmleditor;
});