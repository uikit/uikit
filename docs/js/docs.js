jQuery(function($) {

    if (window.hljs) {
        $('pre > code').each(function(i, e) { hljs.highlightBlock(e); });
    }

    $('article').on('click', '[href="#"], [href=""]', function (e) {
        e.preventDefault();
    });

});
