/*! UIkit 2.6.0 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */

(function(addon) {

    if (typeof define == "function" && define.amd) { // AMD
        define("uikit-search", ["uikit"], function(){
            return jQuery.UIkit.search || addon(window, window.jQuery, window.jQuery.UIkit);
        });
    }

    if(window && window.jQuery && window.jQuery.UIkit) {
        addon(window, window.jQuery, window.jQuery.UIkit);
    }

})(function(global, $, UI){

    "use strict";

    var Search = function(element, options) {

        var $element = $(element), $this = this;

        if ($element.data("search")) return;

        this.autocomplete = new UI.autocomplete($element, $.extend({}, Search.defaults, options));

        this.autocomplete.dropdown.addClass('uk-dropdown-search');

        this.autocomplete.input.on("keyup", function(){
            $element[this.value ? "addClass":"removeClass"]("uk-active");
        }).closest("form").on("reset", function(){
            this.value="";
            $element.removeClass("uk-active");
        });

        $element.on('autocomplete-select', function(e, data) {
            if (data.url) {
              location.href = data.url;
            } else if(data.moreresults) {
              $this.autocomplete.input.closest('form').submit();
            }
        });

        $element.data("search", this);
    };

    Search.defaults = {
        msgResultsHeader   : 'Search Results',
        msgMoreResults     : 'More Results',
        msgNoResults       : 'No results found',
        template           : '<ul class="uk-nav uk-nav-search uk-autocomplete-results">\
                                  {{#msgResultsHeader}}<li class="uk-nav-header uk-skip">{{msgResultsHeader}}</li>{{/msgResultsHeader}}\
                                  {{#items && items.length}}\
                                      {{~items}}\
                                      <li data-url="{{!$item.url}}">\
                                          <a href="{{!$item.url}}">\
                                              {{{$item.title}}}\
                                              {{#$item.text}}<div>{{{$item.text}}}</div>{{/$item.text}}\
                                          </a>\
                                      </li>\
                                      {{/items}}\
                                      {{#msgMoreResults}}\
                                          <li class="uk-nav-divider uk-skip"></li>\
                                          <li class="uk-search-moreresults" data-moreresults="true"><a href="javascript:jQuery(this).closest(\'form\').submit();">{{msgMoreResults}}</a></li>\
                                      {{/msgMoreResults}}\
                                  {{/end}}\
                                  {{^items.length}}\
                                    {{#msgNoResults}}<li class="uk-skip"><a>{{msgNoResults}}</a></li>{{/msgNoResults}}\
                                  {{/end}}\
                              </ul>',

        renderer: function(data) {

            var $this = this, opts = this.options;

            this.dropdown.append(this.template({"items":data.results || [], "msgResultsHeader":opts.msgResultsHeader, "msgMoreResults": opts.msgMoreResults, "msgNoResults": opts.msgNoResults}));
            this.show();
        }
    };

    UI["search"] = Search;

    // init code
    $(document).on("focus.search.uikit", "[data-uk-search]", function(e) {
        var ele = $(this);

        if (!ele.data("search")) {
            var obj = new Search(ele, UI.Utils.options(ele.attr("data-uk-search")));
        }
    });

    return Search;

});