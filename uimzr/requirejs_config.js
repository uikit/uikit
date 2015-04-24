requirejs.config({
    //baseUrl : "../",
    baseUrl : "http://localhost:63377/uikit/",
    urlArgs: "bust=" + (new Date()).getTime(),
    paths: {
        core: "core",
        Spec: "uimzr/spec/core/spec/Spec"
    },


    generateSourceMaps:true,
    preserveLicenseComments:false
});