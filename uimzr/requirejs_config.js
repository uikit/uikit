requirejs.config({
    //baseUrl : "../",
    baseUrl : "http://localhost:63377/uikit/",
    urlArgs: "bust=" + (new Date()).getTime(),
    paths: {
        //core: "core",
        Spec: "uimzr/spec/core/spec/Spec",
        SpecMenu: "uimzr/spec/core/spec/SpecMenu",
        'beautify': "../bower_components/js-beautify/js/",
        'beautify-lib': "../bower_components/js-beautify/js/lib/"

    },


    generateSourceMaps:true,
    preserveLicenseComments:false
});