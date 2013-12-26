(function($, UI){

    var Nav = UI["nav"];
    var open = Nav.prototype.open;

    $.extend(Nav.prototype, {
        open: function(li, noanimation) {
            open.call(this, li, noanimation);
            var $li = $(li);

            if ($li.parent().hasClass("uk-parent-ul") || $li.parent().hasClass("uk-parent-offcanvas")) {
                var $parent = $li.parents("li.uk-parent");
                if (noanimation) {
                    $parent.data('list-container').stop().height($parent.hasClass("uk-open") ? "auto" : 0);
                } else {
                    var height = ($li.hasClass("uk-open") ? 1 : -1) * getHeight($li.data('list-container').find('ul:first'));
                    $parent.data('list-container').stop().animate({
                        height: ($parent.hasClass("uk-open") ? getHeight($parent.data('list-container').find('ul:first')) + height : 0)
                    });
                }
            }
        }
    });

    // helper
    function getHeight(ele) {
        var $ele = $(ele), height = "auto";

        if ($ele.is(":visible")) {
            height = $ele.outerHeight();
        } else {
            var tmp = {
                position: $ele.css("position"),
                visibility: $ele.css("visibility"),
                display: $ele.css("display")
            };

            height = $ele.css({position: 'absolute', visibility: 'hidden', display: 'block'}).outerHeight();

            $ele.css(tmp); // reset element
        }

        return height;
    }

})(jQuery, jQuery.UIkit);