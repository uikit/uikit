/*! UIkit 2.1.0 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */

(function($, UI){

    var containers = {},
        messages   = {},
        notify     =  function(options){

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
        };

    var Message = function(options){

        var $this = this;

        this.options = $.extend({}, Message.defaults, options);

        this.uuid    = "ID"+(new Date().getTime())+"RAND"+(Math.ceil(Math.random() * 100000));
        this.element = this.status = $([

            '<div class="uk-notify-message">',
                '<a class="uk-close"></a>',
                '<div>'+this.options.message+'</div>',
            '</div>'

        ].join('')).data("notifyMessage", this);

        // status
        if (this.options.status) {
            this.element.addClass('uk-notify-message-'+this.options.status);
        }

        messages[this.uuid] = this;

        if(!containers[this.options.pos]) {
            containers[this.options.pos] = $('<div class="uk-notify uk-notify-'+this.options.pos+'"></div>').appendTo('body').on("click", ".uk-notify-message", function(){
                $(this).data("notifyMessage").close();
            });
        }
    };


    $.extend(Message.prototype, {

        uuid: false,
        element: false,
        timout: false,

        show: function() {

            if (this.element.is(":visible")) return;

            var $this = this;

            containers[this.options.pos].show().prepend(this.element);

            var marginbottom = parseInt(this.element.css("margin-bottom"), 10);

            this.element.css({"opacity":0, "margin-top": -1*this.element.outerHeight(), "margin-bottom":0}).animate({"opacity":1, "margin-top": 0, "margin-bottom":marginbottom}, function(){

                if ($this.options.timeout) {

                    var closefn = function(){ $this.close(); };

                    $this.timeout = setTimeout(closefn, $this.options.timeout);

                    $this.element.hover(
                        function() { clearTimeout($this.timeout); },
                        function() { $this.timeout = setTimeout(closefn, $this.options.timeout);  }
                    );
                }

            });

            return this;
        },

        close: function() {

            var $this = this;

            if(this.timeout) clearTimeout(this.timeout);

            this.element.animate({"opacity":0, "margin-top": -1* this.element.outerHeight(), "margin-bottom":0}, function(){

                $this.element.remove();

                if(!containers[$this.options.pos].children().length) {
                    containers[$this.options.pos].hide();
                }

                delete messages[$this.uuid];
            });
        }
    });

    Message.defaults = {
        message: "",
        status: "",
        timeout: 5000,
        pos: 'top-center'
    };


    UI["notify"]          = notify;
    UI["notify"].message  = Message;
    UI["notify"].closeAll = closeAll;

})(jQuery, jQuery.UIkit);