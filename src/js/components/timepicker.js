(function(addon) {

    var component;

    if (window.UIkit) {
        component = addon(UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-timepicker", ["uikit"], function(){
            return component || addon(UIkit);
        });
    }

})(function(UI){

    "use strict";


    UI.component('timepicker', {

        defaults: {
            format     : '24h',
            delay      : 0,
            start      : 0,
            end        : 24,
            showSeconds: false,
        },

        boot: function() {

            // init code
            UI.$html.on("focus.timepicker.uikit", "[data-uk-timepicker]", function(e) {

                var ele = UI.$(this);

                if (!ele.data("timepicker")) {
                    var obj = UI.timepicker(ele, UI.Utils.options(ele.attr("data-uk-timepicker")));

                    setTimeout(function(){
                        obj.autocomplete.input.focus();
                    }, 40);
                }
            });
        },

        init: function() {

            var $this  = this, times = getTimeRange(this.options.start, this.options.end, this.options.showSeconds), container;

            this.options.minLength = 0;
            this.options.template  = '<ul class="uk-nav uk-nav-autocomplete uk-autocomplete-results">{{~items}}<li data-value="{{$item.value}}"><a>{{$item.value}}</a></li>{{/items}}</ul>';

            this.options.source = function(release) {
                release(times[$this.options.format] || times['12h']);
            };

            if (this.element.is('input')) {
                this.element.wrap('<div class="uk-autocomplete"></div>');
                container = this.element.parent();
            } else {
                container = this.element.addClass('uk-autocomplete');
            }

            this.autocomplete = UI.autocomplete(container, this.options);
            this.autocomplete.dropdown.addClass('uk-dropdown-small uk-dropdown-scrollable');

            this.autocomplete.on('show.uk.autocomplete', function() {

                var selected = $this.autocomplete.dropdown.find('[data-value="'+$this.autocomplete.input.val()+'"]');

                setTimeout(function(){
                    $this.autocomplete.pick(selected, true);
                }, 10);
            });

            this.autocomplete.input.on('focus', function(){

                $this.autocomplete.value = Math.random();
                $this.autocomplete.triggercomplete();

            }).on('blur', UI.Utils.debounce(function() {
                $this.checkTime();
            }, 100));

            this.element.data("timepicker", this);
        },

        checkTime: function() {

            var arr, timeArray, meridian = 'AM', hour, minute, seconds, time = this.autocomplete.input.val();

            if (this.options.format == '12h') {
                arr = time.split(' ');
                timeArray = arr[0].split(':');
                meridian = arr[1];
            } else {
                timeArray = time.split(':');
            }

            hour    = parseInt(timeArray[0], 10);
            minute  = parseInt(timeArray[1], 10);
            seconds = this.options.showSeconds ? parseInt(timeArray[2], 10) : 0;

            if (isNaN(hour))    hour = 0;
            if (isNaN(minute))  minute = 0;
            if (isNaN(seconds)) seconds = 0;

            if (this.options.format == '12h') {
                if (hour > 12) {
                    hour = 12;
                } else if (hour < 0) {
                    hour = 12;
                }

                if (meridian === 'am' || meridian === 'a') {
                    meridian = 'AM';
                } else if (meridian === 'pm' || meridian === 'p') {
                    meridian = 'PM';
                }

                if (meridian !== 'AM' && meridian !== 'PM') {
                    meridian = 'AM';
                }

            } else {

                if (hour >= 24) {
                    hour = 23;
                } else if (hour < 0) {
                    hour = 0;
                }
            }

            if (minute < 0) {
                minute = 0;
            } else if (minute >= 60) {
                minute = 0;
            }
            
            if (seconds < 0) {
                seconds = 0;
            } else if (seconds >= 60) {
                seconds = 0;
            }

            this.autocomplete.input.val(this.formatTime(hour, minute, meridian, seconds)).trigger('change');
        },

        formatTime: function(hour, minute, meridian, seconds) {
            hour = hour < 10 ? '0' + hour : hour;
            minute = minute < 10 ? '0' + minute : minute;
            var time = hour + ':' + minute;
            if (this.options.showSeconds) {
                seconds = seconds < 10 ? '0' + seconds : seconds;
                time += ':' + seconds;
            }

            return time + (this.options.format == '12h' ? ' ' + meridian : '');
        }
    });

    // helper

    function getTimeRange(start, end, showSeconds) {

        start = start || 0;
        end   = end || 24;

        var times = {'12h':[], '24h':[]}, i, h;

        var topHour      = showSeconds ? ':00:00' : ':00';
        var topHourAM    = topHour + ' AM';
        var topHourPM    = topHour + ' PM';
        var bottomHour   = showSeconds ? ':30:00' : ':30';
        var bottomHourAM = bottomHour + ' AM';
        var bottomHourPM = bottomHour + ' PM';

        for (i = start, h=''; i<end; i++) {

            h = ''+i;

            if (i<10)  h = '0'+h;

            times['24h'].push({value: (h + topHour)});
            times['24h'].push({value: (h + bottomHour)});

            if (i === 0) {
                h = 12;
                times['12h'].push({value: (h + topHourAM)});
                times['12h'].push({value: (h + bottomHourAM)});
            }

            if (i > 0 && i<13 && i!==12) {
                times['12h'].push({value: (h + topHourAM)});
                times['12h'].push({value: (h + bottomHourAM)});
            }

            if (i >= 12) {

                h = h-12;
                if (h === 0) h = 12;
                if (h < 10) h = '0'+String(h);

                times['12h'].push({value: (h + topHourPM)});
                times['12h'].push({value: (h + bottomHourPM)});
            }
        }

        return times;
    }

});
