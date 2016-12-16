import { util } from 'uikit';

const {$, merge} = util;

UIkit.component('htmleditor', {

    name: 'htmleditor',

    props: {
        detect: Array,
        height: Number,
        lblCodeview: String,
    },

    defaults: {
        detect: ['codemirror', 'tinymce'],
        height: 500,
        lblCodeview: 'Text',
        mode: 'code',
        current_mode: '',
        editor: false,
    },

    created() {

        this.textarea = $(this.$options.el);

        this.$mount($(`<div class="uk-htmleditor"></div>`));

        //TODO how to get the new el in DOM without destroying the textarea?
        $(this.$options.el).replaceWith(this.$el);

        //prevent double mounting
        this.$options.el = null;
    },

    ready() {
        let tpl = UIkit.components.htmleditor.template;

        tpl = tpl.replace(/{:lblCodeview}/g, this.lblCodeview);

        //insert template
        this.$el.append($(tpl));
        this.textarea.css({width: '100%', height: this.height}).appendTo(this.code);

        this.controls = this.$el.find('.uk-htmleditor-controls');
        this.code = this.$el.find('.uk-htmleditor-code');

console.log(this.detect);
        this.$el.trigger($.Event('initEditor'));

        //add fullscreen after editors
        this.controls.append(`<li><a data-htmleditor-fullscreen><span uk-icon="icon: expand"></span></a></li>`);

        //show editor
        this.$el.trigger($.Event('showEditor'), this.mode);
        this.current_mode = this.mode;

        //click events
        const $this = this;
        this.$el.on('click', '[data-htmleditor-mode]', function () {

            const mode = $(this).data('htmleditorMode');
            if ($this.current_mode === mode) {
                return;
            }

            $this.$el.trigger($.Event('hideEditor'), $this.current_mode);

            $this.$el.trigger($.Event('showEditor'), mode);

            $this.current_mode = mode;
            $this.setControls();

        });
        this.$el.on('click', '[data-htmleditor-fullscreen]',() => {
            console.log('todo');
        });

        this.setControls();
    },


    update: {

        handler() {
            console.log('update ' + this.tinyMce);

        },

        events: ['resize', 'orientationchange']

    },

    events: {

    },

    methods: {
        setControls() {
            this.controls.find('li').removeClass('uk-active');
            this.$el.find(`[data-htmleditor-mode="${this.current_mode}"]`).parent().addClass('uk-active');
        },

    }

});

UIkit.components.htmleditor.template = `<ul class="uk-htmleditor-controls uk-tab uk-flex-right uk-margin-remove-bottom">
          <li><a data-htmleditor-mode="code">{:lblCodeview}</a></li>
    </ul>
    <div class="uk-htmleditor-content">
        <div class="uk-htmleditor-code"></div>
    </div>`;

//toolbar
UIkit.mixin({

    props: {
        toolbar: Array,
    },

    defaults: {
        toolbar: ['paragraph', 'bold', 'italic', 'strike', 'link', 'image', 'blockquote', 'listUl' ],
    },

    events: {

        initEditor() {
            this.buttons = {};

            this.addButtons({

                paragraph: {
                    title: 'Paragraph',
                    label: '<span class="uk-icon-button">&sect;</span>',
                    before: '<p>',
                    after: '</p>',
                    type: 'block',
                },
                bold: {
                    title: 'Bold',
                    label: '<span class="uk-icon-button" uk-icon="icon: bold"></span>',
                    before: '<strong>',
                    after: '</strong>',
                },
                italic: {
                    title  : 'Italic',
                    label: '<span class="uk-icon-button" uk-icon="icon: italic"></span>',
                    before: '<em>',
                    after: '</em>',
                },
                strike: {
                    title  : 'Strikethrough',
                    label: '<span class="uk-icon-button" uk-icon="icon: strikethrough"></span>',
                    before: '<del>',
                    after: '</del>',
                },
                blockquote: {
                    title  : 'Blockquote',
                    label: '<span class="uk-icon-button" uk-icon="icon: quote-right"></span>',
                    before: '<p><blockquote>',
                    after: '</blockquote></p>',
                    type: 'block',
                },
                link: {
                    title  : 'Link',
                    label: '<span class="uk-icon-button" uk-icon="icon: link"></span>',
                    before: '<a href="">',
                    after: '</a>',
                },
                image: {
                    title  : 'Image',
                    label: '<span class="uk-icon-button" uk-icon="icon: image"></span>',
                    before: '<img src="" alt=""/>',
                },
                listUl: {
                    title  : 'Unordered List',
                    label: '<span class="uk-icon-button" uk-icon="icon: list"></span>',
                    before: '<ul>\n\t<li>',
                    after: '</li>\n</ul>',
                    type: 'block',
                },

            });
            this.buildtoolbar();

            this.$el.find('.uk-htmleditor-content').prepend(this.tools);

            const $this = this;
            this.$el.on('click', '[data-htmleditor-button]', function () {

                $this.buttonAction($(this).data('htmleditorButton'));

            });

        },

        showEditor(e, mode) {

            if (mode !== 'code' || this.current_mode === 'code') {
                return;
            }
            this.tools.removeClass('uk-hidden');

        },

        hideEditor(e, mode) {
            if (mode !== 'code') {
                return;
            }
            this.tools.addClass('uk-hidden');

        },

    },

    methods: {
        addButton(name, button) {
            this.buttons[name] = button;
        },

        addButtons(buttons) {
            $.extend(this.buttons, buttons);
        },

        buildtoolbar() {

            if (!(this.toolbar && this.toolbar.length)) {
                return;
            }

            this.tools = $(`<div class="uk-navbar-container uk-htmleditor-toolbar uk-hidden" uk-navbar>
                <div class="uk-navbar-left">
                    <ul class="uk-navbar-nav uk-htmleditor-toolbar">
                    </ul>
                </div>
            </div>`);

            let bar = [];

            this.toolbar.forEach(button => {
                if (!this.buttons[button]) {
                    return;
                }

                let title = this.buttons[button].title || button;

                bar.push(`<li><a data-htmleditor-button="${button}" title="${title}" uk-tooltip>${this.buttons[button].label}</a></li>`);
            });

            this.tools.find('.uk-htmleditor-toolbar').html(bar.join('\n'));
        },

        buttonAction(button) {
            if (!this.buttons[button]) {
                return;
            }
            let before = (this.buttons[button].before || '');
            let after = (this.buttons[button].after || '');

            if (this.buttons[button].type === 'block') {
                before = `\n${before}`;
            }
            if (this.editor) {
                //use codemirror
                const text = this.editor.getSelection();

                const replace = before + text + after;

                this.editor.replaceSelection(replace);

                //todo set cursor

            } else {
                //use rangy
                this.textarea.focus();
                const {text, start, end} = this.textarea.getSelection();
                let position;


                if (text) {

                    this.textarea.surroundSelectedText(before, after);
                    position = end + before.length + after.length;

                } else {

                    position = start + before.length;

                    this.textarea.insertText(before + after, start);
                }

                //set cursor
                this.textarea.setSelection(position, position);
            }


        },
    }

}, 'htmleditor');


//codemirror plugin
UIkit.mixin({

    props: {
        codemirror:  Object,
        Codemirror:  Object,
    },

    defaults: {
        Codemirror:  false,
        codemirror: {
            mode: 'htmlmixed',
            lineWrapping: true,
            lineNumbers: true,
            dragDrop: false,
            autoCloseTags: true,
            matchTags: true,
            autoCloseBrackets: true,
            matchBrackets: true,
            indentUnit: 4,
            indentWithTabs: false,
            tabSize: 4,
            hintOptions: {completionSingle:false},
        },
    },

    events: {

        initEditor() {
            //detect codemirror
            if (this.detect.indexOf('codemirror') > -1) {
                this.CodeMirror = this.CodeMirror || window.CodeMirror;
            }
        },

        showEditor(e, mode) {

            if (mode !== 'code' || this.current_mode === 'code') {
                return;
            }

            if (this.CodeMirror) {
                this.editor = this.CodeMirror.fromTextArea(this.textarea[0], this.codemirror);
                this.code.find('.CodeMirror').css('height', this.height);
            }

        },

        hideEditor(e, mode) {
            if (mode !== 'code') {
                return;
            }

            if (this.editor) {
                this.editor.toTextArea();
                this.editor = false;
            }
        },

    },

}, 'htmleditor');

//tinyMce plugin
UIkit.mixin({

    props: {
        tinymce: Object,
        TinyMce:  Object,
        lblWysiwyg: String,
    },

    defaults: {
        TinyMce: false,
        tinymce: {
            menubar: true,
        },
        lblWysiwyg:  'Visual',
    },

    events: {

        initEditor() {
            //detect tinyMCE
            if (this.detect.indexOf('tinymce') > -1) {
                this.TinyMce = this.TinyMce || window.tinymce;
            }
            if (this.TinyMce) {
                this.controls.append(`<li><a data-htmleditor-mode="wysiwyg">{:lblWysiwyg}</a></li>`.replace(/{:lblWysiwyg}/g, this.lblWysiwyg));
            }
        },

        showEditor(e, mode) {

            if (mode !== 'wysiwyg' || this.current_mode === 'wysiwyg' || !this.TinyMce) {
                return;
            }

            this.TinyMce.init(Object.assign({
                target: this.textarea[0],
                height: this.height,
            }, this.tinymce)).then(editors => {
                this.editor = editors[0];
            });

        },

        hideEditor(e, mode) {
            if (mode !== 'wysiwyg') {
                return;
            }

            if (this.editor) {
                this.editor.remove();
                this.editor = false;
            }

        },

    },

}, 'htmleditor');



/**
 * @license Rangy Inputs, a jQuery plug-in for selection and caret manipulation within textareas and text inputs.
 *
 * https://github.com/timdown/rangyinputs
 *
 * For range and selection features for contenteditable, see Rangy.

 * http://code.google.com/p/rangy/
 *
 * Depends on jQuery 1.0 or later.
 *
 * Copyright 2014, Tim Down
 * Licensed under the MIT license.
 * Version: 1.2.0
 * Build date: 30 November 2014
 */
(function($) {
    var UNDEF = "undefined";
    var getSelection, setSelection, deleteSelectedText, deleteText, insertText;
    var replaceSelectedText, surroundSelectedText, extractSelectedText, collapseSelection;

    // Trio of isHost* functions taken from Peter Michaux's article:
    // http://peter.michaux.ca/articles/feature-detection-state-of-the-art-browser-scripting
    function isHostMethod(object, property) {
        var t = typeof object[property];
        return t === "function" || (!!(t == "object" && object[property])) || t == "unknown";
    }

    function isHostProperty(object, property) {
        return typeof(object[property]) != UNDEF;
    }

    function isHostObject(object, property) {
        return !!(typeof(object[property]) == "object" && object[property]);
    }

    function fail(reason) {
        if (window.console && window.console.log) {
            window.console.log("RangyInputs not supported in your browser. Reason: " + reason);
        }
    }

    function adjustOffsets(el, start, end) {
        if (start < 0) {
            start += el.value.length;
        }
        if (typeof end == UNDEF) {
            end = start;
        }
        if (end < 0) {
            end += el.value.length;
        }
        return { start: start, end: end };
    }

    function makeSelection(el, start, end) {
        return {
            start: start,
            end: end,
            length: end - start,
            text: el.value.slice(start, end)
        };
    }

    function getBody() {
        return isHostObject(document, "body") ? document.body : document.getElementsByTagName("body")[0];
    }

    $(document).ready(function() {
        var testTextArea = document.createElement("textarea");

        getBody().appendChild(testTextArea);

        if (isHostProperty(testTextArea, "selectionStart") && isHostProperty(testTextArea, "selectionEnd")) {
            getSelection = function(el) {
                var start = el.selectionStart, end = el.selectionEnd;
                return makeSelection(el, start, end);
            };

            setSelection = function(el, startOffset, endOffset) {
                var offsets = adjustOffsets(el, startOffset, endOffset);
                el.selectionStart = offsets.start;
                el.selectionEnd = offsets.end;
            };

            collapseSelection = function(el, toStart) {
                if (toStart) {
                    el.selectionEnd = el.selectionStart;
                } else {
                    el.selectionStart = el.selectionEnd;
                }
            };
        } else if (isHostMethod(testTextArea, "createTextRange") && isHostObject(document, "selection") &&
            isHostMethod(document.selection, "createRange")) {

            getSelection = function(el) {
                var start = 0, end = 0, normalizedValue, textInputRange, len, endRange;
                var range = document.selection.createRange();

                if (range && range.parentElement() == el) {
                    len = el.value.length;

                    normalizedValue = el.value.replace(/\r\n/g, "\n");
                    textInputRange = el.createTextRange();
                    textInputRange.moveToBookmark(range.getBookmark());
                    endRange = el.createTextRange();
                    endRange.collapse(false);
                    if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                        start = end = len;
                    } else {
                        start = -textInputRange.moveStart("character", -len);
                        start += normalizedValue.slice(0, start).split("\n").length - 1;
                        if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                            end = len;
                        } else {
                            end = -textInputRange.moveEnd("character", -len);
                            end += normalizedValue.slice(0, end).split("\n").length - 1;
                        }
                    }
                }

                return makeSelection(el, start, end);
            };

            // Moving across a line break only counts as moving one character in a TextRange, whereas a line break in
            // the textarea value is two characters. This function corrects for that by converting a text offset into a
            // range character offset by subtracting one character for every line break in the textarea prior to the
            // offset
            var offsetToRangeCharacterMove = function(el, offset) {
                return offset - (el.value.slice(0, offset).split("\r\n").length - 1);
            };

            setSelection = function(el, startOffset, endOffset) {
                var offsets = adjustOffsets(el, startOffset, endOffset);
                var range = el.createTextRange();
                var startCharMove = offsetToRangeCharacterMove(el, offsets.start);
                range.collapse(true);
                if (offsets.start == offsets.end) {
                    range.move("character", startCharMove);
                } else {
                    range.moveEnd("character", offsetToRangeCharacterMove(el, offsets.end));
                    range.moveStart("character", startCharMove);
                }
                range.select();
            };

            collapseSelection = function(el, toStart) {
                var range = document.selection.createRange();
                range.collapse(toStart);
                range.select();
            };
        } else {
            getBody().removeChild(testTextArea);
            fail("No means of finding text input caret position");
            return;
        }

        // Clean up
        getBody().removeChild(testTextArea);

        function getValueAfterPaste(el, text) {
            var val = el.value, sel = getSelection(el), selStart = sel.start;
            return {
                value: val.slice(0, selStart) + text + val.slice(sel.end),
                index: selStart,
                replaced: sel.text
            };
        }

        function pasteTextWithCommand(el, text) {
            el.focus();
            var sel = getSelection(el);

            // Hack to work around incorrect delete command when deleting the last word on a line
            setSelection(el, sel.start, sel.end);
            if (text == "") {
                document.execCommand("delete", false, null);
            } else {
                document.execCommand("insertText", false, text);
            }

            return {
                replaced: sel.text,
                index: sel.start
            };
        }

        function pasteTextWithValueChange(el, text) {
            el.focus();
            var valueAfterPaste = getValueAfterPaste(el, text);
            el.value = valueAfterPaste.value;
            return valueAfterPaste;
        }

        var pasteText = function(el, text) {
            var valueAfterPaste = getValueAfterPaste(el, text);
            try {
                var pasteInfo = pasteTextWithCommand(el, text);
                if (el.value == valueAfterPaste.value) {
                    pasteText = pasteTextWithCommand;
                    return pasteInfo;
                }
            } catch (ex) {
                // Do nothing and fall back to changing the value manually
            }
            pasteText = pasteTextWithValueChange;
            el.value = valueAfterPaste.value;
            return valueAfterPaste;
        };

        deleteText = function(el, start, end, moveSelection) {
            if (start != end) {
                setSelection(el, start, end);
                pasteText(el, "");
            }
            if (moveSelection) {
                setSelection(el, start);
            }
        };

        deleteSelectedText = function(el) {
            setSelection(el, pasteText(el, "").index);
        };

        extractSelectedText = function(el) {
            var pasteInfo = pasteText(el, "");
            setSelection(el, pasteInfo.index);
            return pasteInfo.replaced;
        };

        var updateSelectionAfterInsert = function(el, startIndex, text, selectionBehaviour) {
            var endIndex = startIndex + text.length;

            selectionBehaviour = (typeof selectionBehaviour == "string") ?
                selectionBehaviour.toLowerCase() : "";

            if ((selectionBehaviour == "collapsetoend" || selectionBehaviour == "select") && /[\r\n]/.test(text)) {
                // Find the length of the actual text inserted, which could vary
                // depending on how the browser deals with line breaks
                var normalizedText = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
                endIndex = startIndex + normalizedText.length;
                var firstLineBreakIndex = startIndex + normalizedText.indexOf("\n");

                if (el.value.slice(firstLineBreakIndex, firstLineBreakIndex + 2) == "\r\n") {
                    // Browser uses \r\n, so we need to account for extra \r characters
                    endIndex += normalizedText.match(/\n/g).length;
                }
            }

            switch (selectionBehaviour) {
                case "collapsetostart":
                    setSelection(el, startIndex, startIndex);
                    break;
                case "collapsetoend":
                    setSelection(el, endIndex, endIndex);
                    break;
                case "select":
                    setSelection(el, startIndex, endIndex);
                    break;
            }
        };

        insertText = function(el, text, index, selectionBehaviour) {
            setSelection(el, index);
            pasteText(el, text);
            if (typeof selectionBehaviour == "boolean") {
                selectionBehaviour = selectionBehaviour ? "collapseToEnd" : "";
            }
            updateSelectionAfterInsert(el, index, text, selectionBehaviour);
        };

        replaceSelectedText = function(el, text, selectionBehaviour) {
            var pasteInfo = pasteText(el, text);
            updateSelectionAfterInsert(el, pasteInfo.index, text, selectionBehaviour || "collapseToEnd");
        };

        surroundSelectedText = function(el, before, after, selectionBehaviour) {
            if (typeof after == UNDEF) {
                after = before;
            }
            var sel = getSelection(el);
            var pasteInfo = pasteText(el, before + sel.text + after);
            updateSelectionAfterInsert(el, pasteInfo.index + before.length, sel.text, selectionBehaviour || "select");
        };

        function jQuerify(func, returnThis) {
            return function() {
                var el = this.jquery ? this[0] : this;
                var nodeName = el.nodeName.toLowerCase();

                if (el.nodeType == 1 && (nodeName == "textarea" ||
                    (nodeName == "input" && /^(?:text|email|number|search|tel|url|password)$/i.test(el.type)))) {
                    var args = [el].concat(Array.prototype.slice.call(arguments));
                    var result = func.apply(this, args);
                    if (!returnThis) {
                        return result;
                    }
                }
                if (returnThis) {
                    return this;
                }
            };
        }

        $.fn.extend({
            getSelection: jQuerify(getSelection, false),
            setSelection: jQuerify(setSelection, true),
            collapseSelection: jQuerify(collapseSelection, true),
            deleteSelectedText: jQuerify(deleteSelectedText, true),
            deleteText: jQuerify(deleteText, true),
            extractSelectedText: jQuerify(extractSelectedText, false),
            insertText: jQuerify(insertText, true),
            replaceSelectedText: jQuerify(replaceSelectedText, true),
            surroundSelectedText: jQuerify(surroundSelectedText, true)
        });
    });
})(jQuery);