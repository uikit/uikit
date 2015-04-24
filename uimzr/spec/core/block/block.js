(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['Spec'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('Spec'));
    }
}(this, function (Spec) {


    var BlockSpec = React.createClass({displayName: "BlockSpec",

        render: function(){

            return (

                React.createElement(Spec, {title: "Block (css)", anchor: "Core_BlockSpec", group: "core"}, 
                    React.createElement("p", null, "Является основным блоком отображения контента."), 
                    React.createElement("code", null, "Less: themes/default/mzr-style/mzr-block.less"), 
                    React.createElement("p", null, "Примеры:"), 
                    React.createElement("section", {className: "mzr-block"}, 
                        React.createElement("div", {className: "mzr-block-header"}, "Заголовок"), 
                        React.createElement("div", {className: "mzr-block-content"}, 
                            React.createElement("pre", null, 
                                React.createElement("code", {className: "html"}, 
                                    '<div class="mzr-block">'  + "\n"+
                                    '   <div class="mzr-block-header">Заголовок блока</div>'  + "\n"+
                                    '   <div class="mzr-block-content">контент ...</div>'  + "\n"+
                                    '</div>'

                                )
                            )

                        )
                    )

                )

            );

        }
    });
    return BlockSpec;

}));
