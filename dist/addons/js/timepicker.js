/*! UIkit 2.3.1 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */

/*
 * Based on https://github.com/jdewit/bootstrap-timepicker
 */

(function(global, $, UI){

    // Timepicker

    var TimePicker = function(element, options) {

        var $this = this, $element = $(element);

        if($element.data("timepicker")) return;

        this.$element = $element;
        this.element  = this.$element[0];
        this.options  = $.extend({}, TimePicker.defaults, options);

        this.$element.on({
            'focus.timepicker.uikit'  : $.proxy(this.highlightUnit, this),
            'click.timepicker.uikit'  : $.proxy(this.highlightUnit, this),
            'keydown.timepicker.uikit': $.proxy(this.onKeydown, this),
            'blur.timepicker.uikit'   : $.proxy(this.blurElement, this)
        });

        this.setDefaultTime(this.options.defaultTime);

        this.element.data("timepicker", this);
    };

    TimePicker.defaults = {
        defaultTime: 'current',
        disableFocus: false,
        minuteStep: 15,
        secondStep: 15,
        showSeconds: false,
        showMeridian: false
    };

    $.extend(TimePicker.prototype, {

        setDefaultTime: function(defaultTime){

          if (!this.element.value) {

            if (defaultTime === 'current') {

              var d = new Date();

              this.hour     = d.getHours(),
              this.minute   = Math.floor(d.getMinutes() / this.options.minuteStep) * this.options.minuteStep,
              this.second   = Math.floor(d.getSeconds() / this.options.secondStep) * this.options.secondStep,
              this.meridian = 'AM';

              if (this.options.showMeridian) {
                    if (this.hour === 0) {
                        this.hour = 12;
                    } else if (this.hour >= 12) {
                        if (this.hour > 12)  this.hour = this.hour - 12;
                        this.meridian = 'PM';
                    } else {
                        this.meridian = 'AM';
                    }
              }

              this.update();

            } else if (defaultTime === false) {
              this.hour     = 0;
              this.minute   = 0;
              this.second   = 0;
              this.meridian = 'AM';
            } else {
              this.setTime(defaultTime);
            }

          } else {
            this.updateFromElementVal();
          }
        },

        setTime: function(time) {
          var arr, timeArray;

          if (this.options.showMeridian) {
            arr = time.split(' ');
            timeArray = arr[0].split(':');
            this.meridian = arr[1];
          } else {
            timeArray = time.split(':');
          }

          this.hour   = parseInt(timeArray[0], 10);
          this.minute = parseInt(timeArray[1], 10);
          this.second = parseInt(timeArray[2], 10);

          if (isNaN(this.hour))   this.hour = 0;
          if (isNaN(this.minute)) this.minute = 0;

          if (this.options.showMeridian) {
            if (this.hour > 12) {
              this.hour = 12;
            } else if (this.hour < 1) {
              this.hour = 12;
            }

            if (this.meridian === 'am' || this.meridian === 'a') {
              this.meridian = 'AM';
            } else if (this.meridian === 'pm' || this.meridian === 'p') {
              this.meridian = 'PM';
            }

            if (this.meridian !== 'AM' && this.meridian !== 'PM') {
              this.meridian = 'AM';
            }

          } else {

            if (this.hour >= 24) {
              this.hour = 23;
            } else if (this.hour < 0) {
              this.hour = 0;
            }
          }

          if (this.minute < 0) {
            this.minute = 0;
          } else if (this.minute >= 60) {
            this.minute = 59;
          }

          if (this.options.showSeconds) {
            if (isNaN(this.second)) {
              this.second = 0;
            } else if (this.second < 0) {
              this.second = 0;
            } else if (this.second >= 60) {
              this.second = 59;
            }
          }

          this.update();
        },

        blurElement: function() {
          this.highlightedUnit = undefined;
          this.updateFromElementVal();
        },

        decrementHour: function() {
          if (this.options.showMeridian) {
            if (this.hour === 1) {
              this.hour = 12;
            } else if (this.hour === 12) {
              this.hour--;

              return this.toggleMeridian();
            } else if (this.hour === 0) {
              this.hour = 11;

              return this.toggleMeridian();
            } else {
              this.hour--;
            }
          } else {
            if (this.hour === 0) {
              this.hour = 23;
            } else {
              this.hour--;
            }
          }
          this.update();
        },

        decrementMinute: function(step) {

          var newVal = (step) ? this.minute - step : this.minute - this.options.minuteStep;

          if (newVal < 0) {
            this.decrementHour();
            this.minute = newVal + 60;
          } else {
            this.minute = newVal;
          }
          this.update();
        },

        decrementSecond: function() {
          var newVal = this.second - this.options.secondStep;

          if (newVal < 0) {
            this.decrementMinute(true);
            this.second = newVal + 60;
          } else {
            this.second = newVal;
          }
          this.update();
        },

        onKeydown: function(e) {
          switch (e.keyCode) {
          case 9: //tab
            this.updateFromElementVal();

            switch (this.highlightedUnit) {
            case 'hour':
              e.preventDefault();
              this.highlightNextUnit();
              break;
            case 'minute':
              if (this.options.showMeridian || this.options.showSeconds) {
                e.preventDefault();
                this.highlightNextUnit();
              }
              break;
            case 'second':
              if (this.options.showMeridian) {
                e.preventDefault();
                this.highlightNextUnit();
              }
              break;
            }
            break;
          case 27: // escape
            this.updateFromElementVal();
            break;
          case 37: // left arrow
            e.preventDefault();
            this.highlightPrevUnit();
            this.updateFromElementVal();
            break;
          case 38: // up arrow
            e.preventDefault();
            switch (this.highlightedUnit) {
            case 'hour':
              this.incrementHour();
              this.highlightHour();
              break;
            case 'minute':
              this.incrementMinute();
              this.highlightMinute();
              break;
            case 'second':
              this.incrementSecond();
              this.highlightSecond();
              break;
            case 'meridian':
              this.toggleMeridian();
              this.highlightMeridian();
              break;
            }
            break;
          case 39: // right arrow
            e.preventDefault();
            this.updateFromElementVal();
            this.highlightNextUnit();
            break;
          case 40: // down arrow
            e.preventDefault();
            switch (this.highlightedUnit) {
            case 'hour':
              this.decrementHour();
              this.highlightHour();
              break;
            case 'minute':
              this.decrementMinute();
              this.highlightMinute();
              break;
            case 'second':
              this.decrementSecond();
              this.highlightSecond();
              break;
            case 'meridian':
              this.toggleMeridian();
              this.highlightMeridian();
              break;
            }
            break;
          }
        },

        formatTime: function(hour, minute, second, meridian) {
          hour = hour < 10 ? '0' + hour : hour;
          minute = minute < 10 ? '0' + minute : minute;
          second = second < 10 ? '0' + second : second;

          return hour + ':' + minute + (this.options.showSeconds ? ':' + second : '') + (this.options.showMeridian ? ' ' + meridian : '');
        },

        getCursorPosition: function() {

          if ('selectionStart' in this.element) {// Standard-compliant browsers

            return this.element.selectionStart;
          } else if (document.selection) {// IE fix
            this.element.focus();
            var sel = document.selection.createRange(),
              selLen = document.selection.createRange().text.length;

            sel.moveStart('character', - this.element.value.length);

            return sel.text.length - selLen;
          }
        },

        getTime: function() {
          return this.formatTime(this.hour, this.minute, this.second, this.meridian);
        },

        highlightUnit: function() {
          this.position = this.getCursorPosition();
          if (this.position >= 0 && this.position <= 2) {
            this.highlightHour();
          } else if (this.position >= 3 && this.position <= 5) {
            this.highlightMinute();
          } else if (this.position >= 6 && this.position <= 8) {
            if (this.options.showSeconds) {
              this.highlightSecond();
            } else {
              this.highlightMeridian();
            }
          } else if (this.position >= 9 && this.position <= 11) {
            this.highlightMeridian();
          }
        },

        highlightNextUnit: function() {
          switch (this.highlightedUnit) {
          case 'hour':
            this.highlightMinute();
            break;
          case 'minute':
            if (this.options.showSeconds) {
              this.highlightSecond();
            } else if (this.options.showMeridian){
              this.highlightMeridian();
            } else {
              this.highlightHour();
            }
            break;
          case 'second':
            if (this.options.showMeridian) {
              this.highlightMeridian();
            } else {
              this.highlightHour();
            }
            break;
          case 'meridian':
            this.highlightHour();
            break;
          }
        },

        highlightPrevUnit: function() {
          switch (this.highlightedUnit) {
          case 'hour':
            this.highlightMeridian();
            break;
          case 'minute':
            this.highlightHour();
            break;
          case 'second':
            this.highlightMinute();
            break;
          case 'meridian':
            if (this.options.showSeconds) {
              this.highlightSecond();
            } else {
              this.highlightMinute();
            }
            break;
          }
        },

        highlightHour: function() {
          var $element = this.element;

          this.highlightedUnit = 'hour';

          if ($element.setSelectionRange) {
              setTimeout(function() {
                  $element.setSelectionRange(0,2);
              }, 0);
          }
        },

        highlightMinute: function() {
          var $element = this.element;

          this.highlightedUnit = 'minute';

          if ($element.setSelectionRange) {
              setTimeout(function() {
                  $element.setSelectionRange(3,5);
              }, 0);
          }
        },

        highlightSecond: function() {
          var $element = this.element;

          this.highlightedUnit = 'second';

          if ($element.setSelectionRange) {
              setTimeout(function() {
                  $element.setSelectionRange(6,8);
              }, 0);
          }
        },

        highlightMeridian: function() {
          var $element = this.element;

          this.highlightedUnit = 'meridian';

          if ($element.setSelectionRange) {
              if (this.options.showSeconds) {
                  setTimeout(function() {
                      $element.setSelectionRange(9,11);
                  }, 0);
              } else {
                  setTimeout(function() {
                      $element.setSelectionRange(6,8);
                  }, 0);
              }
          }
        },

        incrementHour: function() {
          if (this.options.showMeridian) {
            if (this.hour === 11) {
              this.hour++;
              return this.toggleMeridian();
            } else if (this.hour === 12) {
              this.hour = 0;
            }
          }

          if (this.hour === 23) {
            this.hour = 0;
            return;
          }

          this.hour++;
          this.update();
        },

        incrementMinute: function(step) {

          var newVal = step ? (this.minute + step) : (this.minute + this.options.minuteStep - (this.minute % this.options.minuteStep));

          if (newVal > 59) {
            this.incrementHour();
            this.minute = newVal - 60;
          } else {
            this.minute = newVal;
          }
          this.update();
        },

        incrementSecond: function() {
          var newVal = this.second + this.options.secondStep - (this.second % this.options.secondStep);

          if (newVal > 59) {
            this.incrementMinute(true);
            this.second = newVal - 60;
          } else {
            this.second = newVal;
          }
          this.update();
        },

        remove: function() {
          $('document').off('.timepicker.uikit');
          delete this.$element.data().timepicker;
        },

        toggleMeridian: function() {
          this.meridian = this.meridian === 'AM' ? 'PM' : 'AM';
          this.update();
        },

        update: function() {
          this.$element.trigger({
            'type': 'changeTime.timepicker',
            'time': {
              'value': this.getTime(),
              'hours': this.hour,
              'minutes': this.minute,
              'seconds': this.second,
              'meridian': this.meridian
            }
          });

          this.updateElement();
        },

        updateElement: function() {
          this.$element.val(this.getTime()).trigger("change");
        },

        updateFromElementVal: function() {
          if (this.element.value) this.setTime(this.element.value);
        }

    });

    // init code
    $(document).on("focus.timepicker.uikit", "[data-uk-timepicker]", function(e) {

        var ele = $(this);
        if (!ele.data("timepicker")) {
            e.preventDefault();
            var obj = new TimePicker(ele, UI.Utils.options(ele.attr("data-uk-timepicker")));
            ele.trigger("focus");
        }
    });

})(this, jQuery, jQuery.UIkit);