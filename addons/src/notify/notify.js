(function($, UI){

    var container = null,
        messages  = {},
        notify    =  function(options){

            if ($.type(options) == 'string') {
                options = { message: options };
            }

            if (arguments[1]) {
                options = $.extend(options, $.type(arguments[1]) == 'string' ? {status:arguments[1]} : arguments[1]);
            }

            return (new Message(options)).show();
        },
        closeAll  = function(){
            for(var id in messages) { messages[id].close(); }
        },
        icons     = {
            "info"    : 'uk-icon-exclamation-circle',
            "warning" : 'uk-icon-warning',
            "success" : 'uk-icon-check',
            "danger"  : 'uk-icon-bolt'
        };

    var Message = function(options){

        var $this = this;

        this.options = $.extend({}, Message.defaults, options);

        this.uuid    = "ID"+(new Date().getTime())+"RAND"+(Math.ceil(Math.random() * 100000));
        this.element = this.status = $([

            '<div class="uk-notify-message" data-status="'+this.options.status+'">',
                '<a class="uk-close"></a>',
                (this.options.title ? '<strong>'+this.options.title+'</strong>':''),
                '<div>'+this.options.message+'</div>',
            '</div>'

        ].join('')).data("notifyMessage", this);

        // icon
        if (this.options.icon!==false) {

            var icon = "";

            if(!this.options.icon && icons[this.options.status]) {
                icon = icons[this.options.status];
            } else if(this.options.icon) {
                icon = icons[this.options.icon];
            }

            this.element.append('<span class="'+icon+'"></span>').addClass("uk-notify-message-icon");
        }

        messages[this.uuid] = this;
    };


    $.extend(Message.prototype, {

        uuid: false,
        element: false,
        timout: false,

        show: function() {

            if (this.element.is(":visible")) return;

            var $this = this;

            container.prepend(this.element);

            if (this.options.timeout) {

                var closefn = function(){ $this.close(); };

                this.timeout = setTimeout(closefn, $this.options.timeout);

                this.element.hover(
                    function() { clearTimeout($this.timeout); },
                    function() { $this.timeout = setTimeout(closefn, $this.options.timeout);  }
                );
            }

            return this;
        },

        close: function() {
            if(this.timeout) clearTimeout(this.timeout);
            delete messages[this.uuid];
            this.element.remove();
        }
    });

    Message.defaults = {
        icon: null,
        title: false,
        message: "",
        status: "info",
        timeout: 5000
    };

    $(function(){

        var msg;

        container = $('<div class="uk-notify"></div>').appendTo('body').on("click", ".uk-close", function(){
            msg = $(this).closest('.uk-notify-message');
            if (msg.length) msg.data("notifyMessage").close();
        });
    });


    UI["notify"]          = notify;
    UI["notify"].message  = Message;
    UI["notify"].closeAll = closeAll;

})(jQuery, jQuery.UIkit);