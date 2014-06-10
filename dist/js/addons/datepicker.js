/*! UIkit 2.7.1 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */

(function(addon) {

    var component;

    if (jQuery && jQuery.UIkit) {
        component = addon(jQuery, jQuery.UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-datepicker", ["uikit"], function(){
            return component || addon(jQuery, jQuery.UIkit);
        });
    }

})(function($, UI){

    // Datepicker

    var active = false, dropdown, moment;

    UI.component('datepicker', {

        defaults: {
            weekstart: 1,
            i18n: {
                months        : ['January','February','March','April','May','June','July','August','September','October','November','December'],
                weekdays      : ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
            },
            format: "DD.MM.YYYY",
            offsettop: 5,
            maxDate: false,
            minDate: false,
            template: function(data, opts) {

                var content = '', maxDate, minDate;

                if (opts.maxDate!==false){
                    maxDate = isNaN(opts.maxDate) ? moment(opts.maxDate, opts.format) : moment().add('days',opts.maxDate);
                }

                if (opts.minDate!==false){
                    minDate = isNaN(opts.minDate) ? moment(opts.minDate, opts.format) : moment().add('days',opts.minDate-1);
                }

                content += '<div class="uk-datepicker-nav">';
                content += '<a href="" class="uk-datepicker-previous"></a>';
                content += '<a href="" class="uk-datepicker-next"></a>';
                content += '<div class="uk-datepicker-heading">'+ opts.i18n.months[data.month] +' '+ data.year+'</div>';
                content += '</div>';

                content += '<table class="uk-datepicker-table">';
                content += '<thead>';
                for(var i = 0; i < data.weekdays.length; i++) {
                    if (data.weekdays[i]) {
                        content += '<th>'+data.weekdays[i]+'</th>';
                    }
                }
                content += '</thead>';

                content += '<tbody>';
                for(var i = 0; i < data.days.length; i++) {
                    if (data.days[i] && data.days[i].length){
                        content += '<tr>';
                        for(var d = 0; d < data.days[i].length; d++) {
                            if (data.days[i][d]) {
                                var day = data.days[i][d],
                                    cls = [];

                                if(!day.inmonth) cls.push("uk-datepicker-table-muted");
                                if(day.selected) cls.push("uk-active");

                                if (maxDate && day.day > maxDate) cls.push('uk-datepicker-date-disabled uk-datepicker-table-muted');
                                if (minDate && minDate > day.day) cls.push('uk-datepicker-date-disabled uk-datepicker-table-muted');

                                content += '<td><a href="" class="'+cls.join(" ")+'" data-date="'+day.day.format()+'">'+day.day.format("D")+'</a></td>';
                            }
                        }
                        content += '</tr>';
                    }
                }
                content += '</tbody>';

                content += '</table>';

                return content;
            }
        },

        init: function() {

            var $this = this;

            this.current  = this.element.val() ? moment(this.element.val(), this.options.format) : moment();

            this.on("click", function(){
                if(active!==$this) $this.pick(this.value);
            }).on("change", function(){

                if($this.element.val() && !moment($this.element.val(), $this.options.format).isValid()) {
                   $this.element.val(moment().format($this.options.format));
                }

            });

            // init dropdown
            if (!dropdown) {

                dropdown = $('<div class="uk-dropdown uk-datepicker"></div>');

                dropdown.on("click", ".uk-datepicker-next, .uk-datepicker-previous, [data-date]", function(e){
                    e.stopPropagation();
                    e.preventDefault();

                    var ele = $(this);

                    if (ele.hasClass('uk-datepicker-date-disabled')) return false;

                    if(ele.is('[data-date]')) {
                        active.element.val(moment(ele.data("date")).format(active.options.format)).trigger("change");
                        dropdown.hide();
                        active = false;
                    } else {
                       active.add("months", 1 * (ele.hasClass("uk-datepicker-next") ? 1:-1));
                    }
                });

                dropdown.appendTo("body");
            }
        },

        pick: function(initdate) {

            var offset = this.element.offset(),
                css    = {"top": offset.top + this.element.outerHeight() + this.options.offsettop, "left": offset.left, "right":""};

            this.current  = initdate ? moment(initdate, this.options.format):moment();
            this.initdate = this.current.format("YYYY-MM-DD");

            this.update();

            if ($.UIkit.langdirection == 'right') {
                css.right = window.innerWidth - (css.left + this.element.outerWidth());
                css.left  = "";
            }

            dropdown.css(css).show();

            active = this;
        },

        add: function(unit, value) {
            this.current.add(unit, value);
            this.update();
        },

        setMonth: function(month) {
            this.current.month(month);
            this.update();
        },

        setYear: function(year) {
            this.current.year(year);
            this.update();
        },

        update: function() {

            var data = this.getRows(this.current.year(), this.current.month()),
                tpl  = this.options.template(data, this.options);

            dropdown.html(tpl);
        },

        getRows: function(year, month) {

            var opts   = this.options,
                now    = moment().format('YYYY-MM-DD'),
                days   = [31, (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month],
                before = new Date(year, month, 1).getDay(),
                data   = {"month":month, "year":year,"weekdays":[],"days":[]},
                row    = [];

            data.weekdays = (function(){

                for (var i=0, arr=[]; i < 7; i++) {

                    var day = i + (opts.weekstart || 0);

                    while (day >= 7) {
                        day -= 7;
                    }

                    arr.push(opts.i18n.weekdays[day]);
                }

                return arr;
            })();

            if (opts.weekstart && opts.weekstart > 0) {
                before -= opts.weekstart;
                if (before < 0) {
                    before += 7;
                }
            }

            var cells = days + before, after = cells;

            while(after > 7) { after -= 7; }

            cells += 7 - after;

            var day, isDisabled, isSelected, isToday, isInMonth;

            for (var i = 0, r = 0; i < cells; i++) {

                day        = new Date(year, month, 1 + (i - before));
                isDisabled = (opts.mindate && day < opts.mindate) || (opts.maxdate && day > opts.maxdate);
                isInMonth  = !(i < before || i >= (days + before));

                day = moment(day);

                isSelected = this.initdate == day.format("YYYY-MM-DD");
                isToday    = now == day.format("YYYY-MM-DD");

                row.push({"selected": isSelected, "today": isToday, "disabled": isDisabled, "day":day, "inmonth":isInMonth});

                if (++r === 7) {
                    data.days.push(row);
                    row = [];
                    r = 0;
                }
            }

            return data;
        }
    });


    // init code
    $(document).on("focus.datepicker.uikit", "[data-uk-datepicker]", function(e) {

        var ele = $(this);
        if (!ele.data("datepicker")) {
            e.preventDefault();
            var obj = UI.datepicker(ele, UI.Utils.options(ele.attr("data-uk-datepicker")));
            ele.trigger("focus");
        }
    });

    $(document).on("click.datepicker.uikit", function(e) {

        var target = $(e.target);

        if (active && target[0] != dropdown[0] && !target.data("datepicker") && !target.parents(".uk-datepicker:first").length) {
            dropdown.hide();
            active = false;
        }
    });

    //! moment.js
    //! version : 2.5.1
    //! authors : Tim Wood, Iskren Chernev, Moment.js contributors
    //! license : MIT
    //! momentjs.com

    moment = (function(B){function G(){return{empty:!1,unusedTokens:[],unusedInput:[],overflow:-2,charsLeftOver:0,nullInput:!1,invalidMonth:null,invalidFormat:!1,userInvalidated:!1,iso:!1}}function Z(a,b){return function(c){return l(a.call(this,c),b)}}function ta(a,b){return function(c){return this.lang().ordinal(a.call(this,c),b)}}function $(){}function H(a){aa(a);v(this,a)}function I(a){a=ba(a);var b=a.year||0,c=a.month||0,d=a.week||0,f=a.day||0;this._milliseconds=+(a.millisecond||0)+1E3*(a.second||0)+6E4*(a.minute||
    0)+36E5*(a.hour||0);this._days=+f+7*d;this._months=+c+12*b;this._data={};this._bubble()}function v(a,b){for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c]);b.hasOwnProperty("toString")&&(a.toString=b.toString);b.hasOwnProperty("valueOf")&&(a.valueOf=b.valueOf);return a}function w(a){return 0>a?Math.ceil(a):Math.floor(a)}function l(a,b,c){for(var d=""+Math.abs(a);d.length<b;)d="0"+d;return(0<=a?c?"+":"":"-")+d}function J(a,b,c,d){var f=b._milliseconds,g=b._days;b=b._months;var m,h;f&&a._d.setTime(+a._d+
    f*c);if(g||b)m=a.minute(),h=a.hour();g&&a.date(a.date()+g*c);b&&a.month(a.month()+b*c);f&&!d&&e.updateOffset(a,g||b);if(g||b)a.minute(m),a.hour(h)}function K(a){return"[object Array]"===Object.prototype.toString.call(a)}function ca(a,b,c){var d=Math.min(a.length,b.length),f=Math.abs(a.length-b.length),g=0,e;for(e=0;e<d;e++)(c&&a[e]!==b[e]||!c&&h(a[e])!==h(b[e]))&&g++;return g+f}function n(a){if(a){var b=a.toLowerCase().replace(/(.)s$/,"$1");a=ua[a]||va[b]||b}return a}function ba(a){var b={},c,d;for(d in a)a.hasOwnProperty(d)&&
    (c=n(d))&&(b[c]=a[d]);return b}function wa(a){var b,c;if(0===a.indexOf("week"))b=7,c="day";else if(0===a.indexOf("month"))b=12,c="month";else return;e[a]=function(d,f){var g,m,h=e.fn._lang[a],k=[];"number"===typeof d&&(f=d,d=B);m=function(a){a=e().utc().set(c,a);return h.call(e.fn._lang,a,d||"")};if(null!=f)return m(f);for(g=0;g<b;g++)k.push(m(g));return k}}function h(a){a=+a;var b=0;0!==a&&isFinite(a)&&(b=0<=a?Math.floor(a):Math.ceil(a));return b}function L(a,b){return(new Date(Date.UTC(a,b+1,0))).getUTCDate()}
    function da(a,b,c){return C(e([a,11,31+b-c]),b,c).week}function M(a){return 0===a%4&&0!==a%100||0===a%400}function aa(a){var b;a._a&&-2===a._pf.overflow&&(b=0>a._a[x]||11<a._a[x]?x:1>a._a[q]||a._a[q]>L(a._a[r],a._a[x])?q:0>a._a[p]||23<a._a[p]?p:0>a._a[y]||59<a._a[y]?y:0>a._a[D]||59<a._a[D]?D:0>a._a[E]||999<a._a[E]?E:-1,a._pf._overflowDayOfYear&&(b<r||b>q)&&(b=q),a._pf.overflow=b)}function ea(a){null==a._isValid&&(a._isValid=!isNaN(a._d.getTime())&&0>a._pf.overflow&&!a._pf.empty&&!a._pf.invalidMonth&&
    !a._pf.nullInput&&!a._pf.invalidFormat&&!a._pf.userInvalidated,a._strict&&(a._isValid=a._isValid&&0===a._pf.charsLeftOver&&0===a._pf.unusedTokens.length));return a._isValid}function N(a){return a?a.toLowerCase().replace("_","-"):a}function O(a,b){return b._isUTC?e(a).zone(b._offset||0):e(a).local()}function s(a){var b=0,c,d,f,g,m=function(a){if(!z[a]&&xa)try{require("./lang/"+a)}catch(b){}return z[a]};if(!a)return e.fn._lang;if(!K(a)){if(d=m(a))return d;a=[a]}for(;b<a.length;){g=N(a[b]).split("-");
    c=g.length;for(f=(f=N(a[b+1]))?f.split("-"):null;0<c;){if(d=m(g.slice(0,c).join("-")))return d;if(f&&f.length>=c&&ca(g,f,!0)>=c-1)break;c--}b++}return e.fn._lang}function ya(a){return a.match(/\[[\s\S]/)?a.replace(/^\[|\]$/g,""):a.replace(/\\/g,"")}function za(a){var b=a.match(fa),c,d;c=0;for(d=b.length;c<d;c++)b[c]=u[b[c]]?u[b[c]]:ya(b[c]);return function(f){var g="";for(c=0;c<d;c++)g+=b[c]instanceof Function?b[c].call(f,a):b[c];return g}}function P(a,b){if(!a.isValid())return a.lang().invalidDate();
    b=ga(b,a.lang());Q[b]||(Q[b]=za(b));return Q[b](a)}function ga(a,b){function c(a){return b.longDateFormat(a)||a}var d=5;for(F.lastIndex=0;0<=d&&F.test(a);)a=a.replace(F,c),F.lastIndex=0,d-=1;return a}function Aa(a,b){var c=b._strict;switch(a){case "DDDD":return ha;case "YYYY":case "GGGG":case "gggg":return c?Ba:Ca;case "Y":case "G":case "g":return Da;case "YYYYYY":case "YYYYY":case "GGGGG":case "ggggg":return c?Ea:Fa;case "S":if(c)return Ga;case "SS":if(c)return ia;case "SSS":if(c)return ha;case "DDD":return Ha;
    case "MMM":case "MMMM":case "dd":case "ddd":case "dddd":return Ia;case "a":case "A":return s(b._l)._meridiemParse;case "X":return Ja;case "Z":case "ZZ":return R;case "T":return Ka;case "SSSS":return La;case "MM":case "DD":case "YY":case "GG":case "gg":case "HH":case "hh":case "mm":case "ss":case "ww":case "WW":return c?ia:ja;case "M":case "D":case "d":case "H":case "h":case "m":case "s":case "w":case "W":case "e":case "E":return ja;case "Do":return Ma;default:var c=RegExp,d;d=Na(a.replace("\\","")).replace(/[-\/\\^$*+?.()|[\]{}]/g,
    "\\$&");return new c(d)}}function ka(a){a=(a||"").match(R)||[];a=((a[a.length-1]||[])+"").match(Oa)||["-",0,0];var b=+(60*a[1])+h(a[2]);return"+"===a[0]?-b:b}function S(a){var b,c=[],d,f,g,m,k;if(!a._d){d=Pa(a);a._w&&null==a._a[q]&&null==a._a[x]&&(b=function(b){var c=parseInt(b,10);return b?3>b.length?68<c?1900+c:2E3+c:c:null==a._a[r]?e().weekYear():a._a[r]},f=a._w,null!=f.GG||null!=f.W||null!=f.E?b=la(b(f.GG),f.W||1,f.E,4,1):(g=s(a._l),m=null!=f.d?ma(f.d,g):null!=f.e?parseInt(f.e,10)+g._week.dow:
    0,k=parseInt(f.w,10)||1,null!=f.d&&m<g._week.dow&&k++,b=la(b(f.gg),k,m,g._week.doy,g._week.dow)),a._a[r]=b.year,a._dayOfYear=b.dayOfYear);a._dayOfYear&&(b=null==a._a[r]?d[r]:a._a[r],a._dayOfYear>(M(b)?366:365)&&(a._pf._overflowDayOfYear=!0),b=T(b,0,a._dayOfYear),a._a[x]=b.getUTCMonth(),a._a[q]=b.getUTCDate());for(b=0;3>b&&null==a._a[b];++b)a._a[b]=c[b]=d[b];for(;7>b;b++)a._a[b]=c[b]=null==a._a[b]?2===b?1:0:a._a[b];c[p]+=h((a._tzm||0)/60);c[y]+=h((a._tzm||0)%60);a._d=(a._useUTC?T:Qa).apply(null,c)}}
    function Pa(a){var b=new Date;return a._useUTC?[b.getUTCFullYear(),b.getUTCMonth(),b.getUTCDate()]:[b.getFullYear(),b.getMonth(),b.getDate()]}function U(a){a._a=[];a._pf.empty=!0;var b=s(a._l),c=""+a._i,d,f,g,e,k=c.length,l=0;f=ga(a._f,b).match(fa)||[];for(b=0;b<f.length;b++){g=f[b];if(d=(c.match(Aa(g,a))||[])[0])e=c.substr(0,c.indexOf(d)),0<e.length&&a._pf.unusedInput.push(e),c=c.slice(c.indexOf(d)+d.length),l+=d.length;if(u[g]){d?a._pf.empty=!1:a._pf.unusedTokens.push(g);e=a;var n=void 0,t=e._a;
    switch(g){case "M":case "MM":null!=d&&(t[x]=h(d)-1);break;case "MMM":case "MMMM":n=s(e._l).monthsParse(d);null!=n?t[x]=n:e._pf.invalidMonth=d;break;case "D":case "DD":null!=d&&(t[q]=h(d));break;case "Do":null!=d&&(t[q]=h(parseInt(d,10)));break;case "DDD":case "DDDD":null!=d&&(e._dayOfYear=h(d));break;case "YY":t[r]=h(d)+(68<h(d)?1900:2E3);break;case "YYYY":case "YYYYY":case "YYYYYY":t[r]=h(d);break;case "a":case "A":e._isPm=s(e._l).isPM(d);break;case "H":case "HH":case "h":case "hh":t[p]=h(d);break;
    case "m":case "mm":t[y]=h(d);break;case "s":case "ss":t[D]=h(d);break;case "S":case "SS":case "SSS":case "SSSS":t[E]=h(1E3*("0."+d));break;case "X":e._d=new Date(1E3*parseFloat(d));break;case "Z":case "ZZ":e._useUTC=!0;e._tzm=ka(d);break;case "w":case "ww":case "W":case "WW":case "d":case "dd":case "ddd":case "dddd":case "e":case "E":g=g.substr(0,1);case "gg":case "gggg":case "GG":case "GGGG":case "GGGGG":g=g.substr(0,2),d&&(e._w=e._w||{},e._w[g]=d)}}else a._strict&&!d&&a._pf.unusedTokens.push(g)}a._pf.charsLeftOver=
    k-l;0<c.length&&a._pf.unusedInput.push(c);a._isPm&&12>a._a[p]&&(a._a[p]+=12);!1===a._isPm&&12===a._a[p]&&(a._a[p]=0);S(a);aa(a)}function Na(a){return a.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,function(a,c,d,f,e){return c||d||f||e})}function Qa(a,b,c,d,f,e,h){b=new Date(a,b,c,d,f,e,h);1970>a&&b.setFullYear(a);return b}function T(a){var b=new Date(Date.UTC.apply(null,arguments));1970>a&&b.setUTCFullYear(a);return b}function ma(a,b){if("string"===typeof a)if(isNaN(a)){if(a=b.weekdaysParse(a),"number"!==
    typeof a)return null}else a=parseInt(a,10);return a}function Ra(a,b,c,d,f){return f.relativeTime(b||1,!!c,a,d)}function C(a,b,c){b=c-b;c-=a.day();c>b&&(c-=7);c<b-7&&(c+=7);a=e(a).add("d",c);return{week:Math.ceil(a.dayOfYear()/7),year:a.year()}}function la(a,b,c,d,f){var e=T(a,0,1).getUTCDay();b=7*(b-1)+((null!=c?c:f)-f)+(f-e+(e>d?7:0)-(e<f?7:0))+1;return{year:0<b?a:a-1,dayOfYear:0<b?b:(M(a-1)?366:365)+b}}function na(a){var b=a._i,c=a._f;if(null===b)return e.invalid({nullInput:!0});"string"===typeof b&&
    (a._i=b=s().preparse(b));if(e.isMoment(b)){a=b;var d={},f;for(f in a)a.hasOwnProperty(f)&&Sa.hasOwnProperty(f)&&(d[f]=a[f]);a=d;a._d=new Date(+b._d)}else if(c)if(K(c)){var b=a,g,h;if(0===b._f.length)b._pf.invalidFormat=!0,b._d=new Date(NaN);else{for(f=0;f<b._f.length;f++)if(c=0,d=v({},b),d._pf=G(),d._f=b._f[f],U(d),ea(d)&&(c+=d._pf.charsLeftOver,c+=10*d._pf.unusedTokens.length,d._pf.score=c,null==h||c<h))h=c,g=d;v(b,g||d)}}else U(a);else if(d=a,g=d._i,h=Ta.exec(g),g===B)d._d=new Date;else if(h)d._d=
    new Date(+h[1]);else if("string"===typeof g)if(b=d._i,f=Ua.exec(b)){d._pf.iso=!0;g=0;for(h=V.length;g<h;g++)if(V[g][1].exec(b)){d._f=V[g][0]+(f[6]||" ");break}g=0;for(h=W.length;g<h;g++)if(W[g][1].exec(b)){d._f+=W[g][0];break}b.match(R)&&(d._f+="Z");U(d)}else d._d=new Date(b);else K(g)?(d._a=g.slice(0),S(d)):"[object Date]"===Object.prototype.toString.call(g)||g instanceof Date?d._d=new Date(+g):"object"===typeof g?d._d||(g=ba(d._i),d._a=[g.year,g.month,g.day,g.hour,g.minute,g.second,g.millisecond],
    S(d)):d._d=new Date(g);return new H(a)}function oa(a,b){var c="date"===b||"month"===b||"year"===b;e.fn[a]=e.fn[a+"s"]=function(a,f){var g=this._isUTC?"UTC":"";null==f&&(f=c);return null!=a?(this._d["set"+g+b](a),e.updateOffset(this,f),this):this._d["get"+g+b]()}}function Va(a){e.duration.fn[a]=function(){return this._data[a]}}function pa(a,b){e.duration.fn["as"+a]=function(){return+this/b}}for(var e,A=Math.round,k,r=0,x=1,q=2,p=3,y=4,D=5,E=6,z={},Sa={_isAMomentObject:null,_i:null,_f:null,_l:null,
    _strict:null,_isUTC:null,_offset:null,_pf:null,_lang:null},xa="undefined"!==typeof module&&module.exports&&"undefined"!==typeof require,Ta=/^\/?Date\((\-?\d+)/i,Wa=/(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,Xa=/^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,fa=/(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|X|zz?|ZZ?|.)/g,
    F=/(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,ja=/\d\d?/,Ha=/\d{1,3}/,Ca=/\d{1,4}/,Fa=/[+\-]?\d{1,6}/,La=/\d+/,Ia=/[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,R=/Z|[\+\-]\d\d:?\d\d/gi,Ka=/T/i,Ja=/[\+\-]?\d+(\.\d{1,3})?/,Ma=/\d{1,2}/,Ga=/\d/,ia=/\d\d/,ha=/\d{3}/,Ba=/\d{4}/,Ea=/[+-]?\d{6}/,Da=/[+-]?\d+/,Ua=/^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
    V=[["YYYYYY-MM-DD",/[+-]\d{6}-\d{2}-\d{2}/],["YYYY-MM-DD",/\d{4}-\d{2}-\d{2}/],["GGGG-[W]WW-E",/\d{4}-W\d{2}-\d/],["GGGG-[W]WW",/\d{4}-W\d{2}/],["YYYY-DDD",/\d{4}-\d{3}/]],W=[["HH:mm:ss.SSSS",/(T| )\d\d:\d\d:\d\d\.\d{1,3}/],["HH:mm:ss",/(T| )\d\d:\d\d:\d\d/],["HH:mm",/(T| )\d\d:\d\d/],["HH",/(T| )\d\d/]],Oa=/([\+\-]|\d\d)/gi,X=["Date","Hours","Minutes","Seconds","Milliseconds"],Y={Milliseconds:1,Seconds:1E3,Minutes:6E4,Hours:36E5,Days:864E5,Months:2592E6,Years:31536E6},ua={ms:"millisecond",s:"second",
    m:"minute",h:"hour",d:"day",D:"date",w:"week",W:"isoWeek",M:"month",y:"year",DDD:"dayOfYear",e:"weekday",E:"isoWeekday",gg:"weekYear",GG:"isoWeekYear"},va={dayofyear:"dayOfYear",isoweekday:"isoWeekday",isoweek:"isoWeek",weekyear:"weekYear",isoweekyear:"isoWeekYear"},Q={},qa="DDD w W M D d".split(" "),ra="MDHhmswW".split(""),u={M:function(){return this.month()+1},MMM:function(a){return this.lang().monthsShort(this,a)},MMMM:function(a){return this.lang().months(this,a)},D:function(){return this.date()},
    DDD:function(){return this.dayOfYear()},d:function(){return this.day()},dd:function(a){return this.lang().weekdaysMin(this,a)},ddd:function(a){return this.lang().weekdaysShort(this,a)},dddd:function(a){return this.lang().weekdays(this,a)},w:function(){return this.week()},W:function(){return this.isoWeek()},YY:function(){return l(this.year()%100,2)},YYYY:function(){return l(this.year(),4)},YYYYY:function(){return l(this.year(),5)},YYYYYY:function(){var a=this.year();return(0<=a?"+":"-")+l(Math.abs(a),
    6)},gg:function(){return l(this.weekYear()%100,2)},gggg:function(){return l(this.weekYear(),4)},ggggg:function(){return l(this.weekYear(),5)},GG:function(){return l(this.isoWeekYear()%100,2)},GGGG:function(){return l(this.isoWeekYear(),4)},GGGGG:function(){return l(this.isoWeekYear(),5)},e:function(){return this.weekday()},E:function(){return this.isoWeekday()},a:function(){return this.lang().meridiem(this.hours(),this.minutes(),!0)},A:function(){return this.lang().meridiem(this.hours(),this.minutes(),
    !1)},H:function(){return this.hours()},h:function(){return this.hours()%12||12},m:function(){return this.minutes()},s:function(){return this.seconds()},S:function(){return h(this.milliseconds()/100)},SS:function(){return l(h(this.milliseconds()/10),2)},SSS:function(){return l(this.milliseconds(),3)},SSSS:function(){return l(this.milliseconds(),3)},Z:function(){var a=-this.zone(),b="+";0>a&&(a=-a,b="-");return b+l(h(a/60),2)+":"+l(h(a)%60,2)},ZZ:function(){var a=-this.zone(),b="+";0>a&&(a=-a,b="-");
    return b+l(h(a/60),2)+l(h(a)%60,2)},z:function(){return this.zoneAbbr()},zz:function(){return this.zoneName()},X:function(){return this.unix()},Q:function(){return this.quarter()}},sa=["months","monthsShort","weekdays","weekdaysShort","weekdaysMin"];qa.length;)k=qa.pop(),u[k+"o"]=ta(u[k],k);for(;ra.length;)k=ra.pop(),u[k+k]=Z(u[k],2);u.DDDD=Z(u.DDD,3);v($.prototype,{set:function(a){var b,c;for(c in a)b=a[c],"function"===typeof b?this[c]=b:this["_"+c]=b},_months:"January February March April May June July August September October November December".split(" "),
    months:function(a){return this._months[a.month()]},_monthsShort:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),monthsShort:function(a){return this._monthsShort[a.month()]},monthsParse:function(a){var b,c;this._monthsParse||(this._monthsParse=[]);for(b=0;12>b;b++)if(this._monthsParse[b]||(c=e.utc([2E3,b]),c="^"+this.months(c,"")+"|^"+this.monthsShort(c,""),this._monthsParse[b]=RegExp(c.replace(".",""),"i")),this._monthsParse[b].test(a))return b},_weekdays:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
    weekdays:function(a){return this._weekdays[a.day()]},_weekdaysShort:"Sun Mon Tue Wed Thu Fri Sat".split(" "),weekdaysShort:function(a){return this._weekdaysShort[a.day()]},_weekdaysMin:"Su Mo Tu We Th Fr Sa".split(" "),weekdaysMin:function(a){return this._weekdaysMin[a.day()]},weekdaysParse:function(a){var b,c;this._weekdaysParse||(this._weekdaysParse=[]);for(b=0;7>b;b++)if(this._weekdaysParse[b]||(c=e([2E3,1]).day(b),c="^"+this.weekdays(c,"")+"|^"+this.weekdaysShort(c,"")+"|^"+this.weekdaysMin(c,
    ""),this._weekdaysParse[b]=RegExp(c.replace(".",""),"i")),this._weekdaysParse[b].test(a))return b},_longDateFormat:{LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D YYYY",LLL:"MMMM D YYYY LT",LLLL:"dddd, MMMM D YYYY LT"},longDateFormat:function(a){var b=this._longDateFormat[a];!b&&this._longDateFormat[a.toUpperCase()]&&(b=this._longDateFormat[a.toUpperCase()].replace(/MMMM|MM|DD|dddd/g,function(a){return a.slice(1)}),this._longDateFormat[a]=b);return b},isPM:function(a){return"p"===(a+"").toLowerCase().charAt(0)},
    _meridiemParse:/[ap]\.?m?\.?/i,meridiem:function(a,b,c){return 11<a?c?"pm":"PM":c?"am":"AM"},_calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},calendar:function(a,b){var c=this._calendar[a];return"function"===typeof c?c.apply(b):c},_relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",
    y:"a year",yy:"%d years"},relativeTime:function(a,b,c,d){var f=this._relativeTime[c];return"function"===typeof f?f(a,b,c,d):f.replace(/%d/i,a)},pastFuture:function(a,b){var c=this._relativeTime[0<a?"future":"past"];return"function"===typeof c?c(b):c.replace(/%s/i,b)},ordinal:function(a){return this._ordinal.replace("%d",a)},_ordinal:"%d",preparse:function(a){return a},postformat:function(a){return a},week:function(a){return C(a,this._week.dow,this._week.doy).week},_week:{dow:0,doy:6},_invalidDate:"Invalid date",
    invalidDate:function(){return this._invalidDate}});e=function(a,b,c,d){var f;"boolean"===typeof c&&(d=c,c=B);f={_isAMomentObject:!0};f._i=a;f._f=b;f._l=c;f._strict=d;f._isUTC=!1;f._pf=G();return na(f)};e.utc=function(a,b,c,d){var f;"boolean"===typeof c&&(d=c,c=B);f={_isAMomentObject:!0,_useUTC:!0,_isUTC:!0};f._l=c;f._i=a;f._f=b;f._strict=d;f._pf=G();return na(f).utc()};e.unix=function(a){return e(1E3*a)};e.duration=function(a,b){var c=a,d=null,f;if(e.isDuration(a))c={ms:a._milliseconds,d:a._days,
    M:a._months};else if("number"===typeof a)c={},b?c[b]=a:c.milliseconds=a;else if(d=Wa.exec(a))f="-"===d[1]?-1:1,c={y:0,d:h(d[q])*f,h:h(d[p])*f,m:h(d[y])*f,s:h(d[D])*f,ms:h(d[E])*f};else if(d=Xa.exec(a))f="-"===d[1]?-1:1,c=function(a){a=a&&parseFloat(a.replace(",","."));return(isNaN(a)?0:a)*f},c={y:c(d[2]),M:c(d[3]),d:c(d[4]),h:c(d[5]),m:c(d[6]),s:c(d[7]),w:c(d[8])};d=new I(c);e.isDuration(a)&&a.hasOwnProperty("_lang")&&(d._lang=a._lang);return d};e.version="2.5.1";e.defaultFormat="YYYY-MM-DDTHH:mm:ssZ";
    e.updateOffset=function(){};e.lang=function(a,b){if(!a)return e.fn._lang._abbr;if(b){var c=N(a);b.abbr=c;z[c]||(z[c]=new $);z[c].set(b)}else null===b?(delete z[a],a="en"):z[a]||s(a);return(e.duration.fn._lang=e.fn._lang=s(a))._abbr};e.langData=function(a){a&&a._lang&&a._lang._abbr&&(a=a._lang._abbr);return s(a)};e.isMoment=function(a){return a instanceof H||null!=a&&a.hasOwnProperty("_isAMomentObject")};e.isDuration=function(a){return a instanceof I};for(k=sa.length-1;0<=k;--k)wa(sa[k]);e.normalizeUnits=
    function(a){return n(a)};e.invalid=function(a){var b=e.utc(NaN);null!=a?v(b._pf,a):b._pf.userInvalidated=!0;return b};e.parseZone=function(){return e.apply(null,arguments).parseZone()};v(e.fn=H.prototype,{clone:function(){return e(this)},valueOf:function(){return+this._d+6E4*(this._offset||0)},unix:function(){return Math.floor(+this/1E3)},toString:function(){return this.clone().lang("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")},toDate:function(){return this._offset?new Date(+this):this._d},toISOString:function(){var a=
    e(this).utc();return 0<a.year()&&9999>=a.year()?P(a,"YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"):P(a,"YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]")},toArray:function(){return[this.year(),this.month(),this.date(),this.hours(),this.minutes(),this.seconds(),this.milliseconds()]},isValid:function(){return ea(this)},isDSTShifted:function(){return this._a?this.isValid()&&0<ca(this._a,(this._isUTC?e.utc(this._a):e(this._a)).toArray()):!1},parsingFlags:function(){return v({},this._pf)},invalidAt:function(){return this._pf.overflow},
    utc:function(){return this.zone(0)},local:function(){this.zone(0);this._isUTC=!1;return this},format:function(a){a=P(this,a||e.defaultFormat);return this.lang().postformat(a)},add:function(a,b){var c;c="string"===typeof a?e.duration(+b,a):e.duration(a,b);J(this,c,1);return this},subtract:function(a,b){var c;c="string"===typeof a?e.duration(+b,a):e.duration(a,b);J(this,c,-1);return this},diff:function(a,b,c){a=O(a,this);var d=6E4*(this.zone()-a.zone()),f;b=n(b);"year"===b||"month"===b?(f=432E5*(this.daysInMonth()+
    a.daysInMonth()),d=12*(this.year()-a.year())+(this.month()-a.month()),d+=(this-e(this).startOf("month")-(a-e(a).startOf("month")))/f,d-=6E4*(this.zone()-e(this).startOf("month").zone()-(a.zone()-e(a).startOf("month").zone()))/f,"year"===b&&(d/=12)):(f=this-a,d="second"===b?f/1E3:"minute"===b?f/6E4:"hour"===b?f/36E5:"day"===b?(f-d)/864E5:"week"===b?(f-d)/6048E5:f);return c?d:w(d)},from:function(a,b){return e.duration(this.diff(a)).lang(this.lang()._abbr).humanize(!b)},fromNow:function(a){return this.from(e(),
    a)},calendar:function(){var a=O(e(),this).startOf("day"),a=this.diff(a,"days",!0),a=-6>a?"sameElse":-1>a?"lastWeek":0>a?"lastDay":1>a?"sameDay":2>a?"nextDay":7>a?"nextWeek":"sameElse";return this.format(this.lang().calendar(a,this))},isLeapYear:function(){return M(this.year())},isDST:function(){return this.zone()<this.clone().month(0).zone()||this.zone()<this.clone().month(5).zone()},day:function(a){var b=this._isUTC?this._d.getUTCDay():this._d.getDay();return null!=a?(a=ma(a,this.lang()),this.add({d:a-
    b})):b},month:function(a){var b=this._isUTC?"UTC":"",c;if(null!=a){if("string"===typeof a&&(a=this.lang().monthsParse(a),"number"!==typeof a))return this;c=Math.min(this.date(),L(this.year(),a));this._d["set"+b+"Month"](a,c);e.updateOffset(this,!0);return this}return this._d["get"+b+"Month"]()},startOf:function(a){a=n(a);switch(a){case "year":this.month(0);case "month":this.date(1);case "week":case "isoWeek":case "day":this.hours(0);case "hour":this.minutes(0);case "minute":this.seconds(0);case "second":this.milliseconds(0)}"week"===
    a?this.weekday(0):"isoWeek"===a&&this.isoWeekday(1);return this},endOf:function(a){a=n(a);return this.startOf(a).add("isoWeek"===a?"week":a,1).subtract("ms",1)},isAfter:function(a,b){b="undefined"!==typeof b?b:"millisecond";return+this.clone().startOf(b)>+e(a).startOf(b)},isBefore:function(a,b){b="undefined"!==typeof b?b:"millisecond";return+this.clone().startOf(b)<+e(a).startOf(b)},isSame:function(a,b){b=b||"ms";return+this.clone().startOf(b)===+O(a,this).startOf(b)},min:function(a){a=e.apply(null,
    arguments);return a<this?this:a},max:function(a){a=e.apply(null,arguments);return a>this?this:a},zone:function(a,b){b=null==b?!0:!1;var c=this._offset||0;if(null!=a)"string"===typeof a&&(a=ka(a)),16>Math.abs(a)&&(a*=60),this._offset=a,this._isUTC=!0,c!==a&&b&&J(this,e.duration(c-a,"m"),1,!0);else return this._isUTC?c:this._d.getTimezoneOffset();return this},zoneAbbr:function(){return this._isUTC?"UTC":""},zoneName:function(){return this._isUTC?"Coordinated Universal Time":""},parseZone:function(){this._tzm?
    this.zone(this._tzm):"string"===typeof this._i&&this.zone(this._i);return this},hasAlignedHourOffset:function(a){a=a?e(a).zone():0;return 0===(this.zone()-a)%60},daysInMonth:function(){return L(this.year(),this.month())},dayOfYear:function(a){var b=A((e(this).startOf("day")-e(this).startOf("year"))/864E5)+1;return null==a?b:this.add("d",a-b)},quarter:function(){return Math.ceil((this.month()+1)/3)},weekYear:function(a){var b=C(this,this.lang()._week.dow,this.lang()._week.doy).year;return null==a?
    b:this.add("y",a-b)},isoWeekYear:function(a){var b=C(this,1,4).year;return null==a?b:this.add("y",a-b)},week:function(a){var b=this.lang().week(this);return null==a?b:this.add("d",7*(a-b))},isoWeek:function(a){var b=C(this,1,4).week;return null==a?b:this.add("d",7*(a-b))},weekday:function(a){var b=(this.day()+7-this.lang()._week.dow)%7;return null==a?b:this.add("d",a-b)},isoWeekday:function(a){return null==a?this.day()||7:this.day(this.day()%7?a:a-7)},isoWeeksInYear:function(){return da(this.year(),
    1,4)},weeksInYear:function(){var a=this._lang._week;return da(this.year(),a.dow,a.doy)},get:function(a){a=n(a);return this[a]()},set:function(a,b){a=n(a);if("function"===typeof this[a])this[a](b);return this},lang:function(a){if(a===B)return this._lang;this._lang=s(a);return this}});for(k=0;k<X.length;k++)oa(X[k].toLowerCase().replace(/s$/,""),X[k]);oa("year","FullYear");e.fn.days=e.fn.day;e.fn.months=e.fn.month;e.fn.weeks=e.fn.week;e.fn.isoWeeks=e.fn.isoWeek;e.fn.toJSON=e.fn.toISOString;v(e.duration.fn=
    I.prototype,{_bubble:function(){var a=this._milliseconds,b=this._days,c=this._months,d=this._data;d.milliseconds=a%1E3;a=w(a/1E3);d.seconds=a%60;a=w(a/60);d.minutes=a%60;a=w(a/60);d.hours=a%24;b+=w(a/24);d.days=b%30;c+=w(b/30);d.months=c%12;b=w(c/12);d.years=b},weeks:function(){return w(this.days()/7)},valueOf:function(){return this._milliseconds+864E5*this._days+this._months%12*2592E6+31536E6*h(this._months/12)},humanize:function(a){var b=+this,c;c=!a;var d=this.lang(),f=A(Math.abs(b)/1E3),e=A(f/
    60),h=A(e/60),k=A(h/24),l=A(k/365),f=45>f&&["s",f]||1===e&&["m"]||45>e&&["mm",e]||1===h&&["h"]||22>h&&["hh",h]||1===k&&["d"]||25>=k&&["dd",k]||45>=k&&["M"]||345>k&&["MM",A(k/30)]||1===l&&["y"]||["yy",l];f[2]=c;f[3]=0<b;f[4]=d;c=Ra.apply({},f);a&&(c=this.lang().pastFuture(b,c));return this.lang().postformat(c)},add:function(a,b){var c=e.duration(a,b);this._milliseconds+=c._milliseconds;this._days+=c._days;this._months+=c._months;this._bubble();return this},subtract:function(a,b){var c=e.duration(a,
    b);this._milliseconds-=c._milliseconds;this._days-=c._days;this._months-=c._months;this._bubble();return this},get:function(a){a=n(a);return this[a.toLowerCase()+"s"]()},as:function(a){a=n(a);return this["as"+a.charAt(0).toUpperCase()+a.slice(1)+"s"]()},lang:e.fn.lang,toIsoString:function(){var a=Math.abs(this.years()),b=Math.abs(this.months()),c=Math.abs(this.days()),d=Math.abs(this.hours()),e=Math.abs(this.minutes()),g=Math.abs(this.seconds()+this.milliseconds()/1E3);return this.asSeconds()?(0>
    this.asSeconds()?"-":"")+"P"+(a?a+"Y":"")+(b?b+"M":"")+(c?c+"D":"")+(d||e||g?"T":"")+(d?d+"H":"")+(e?e+"M":"")+(g?g+"S":""):"P0D"}});for(k in Y)Y.hasOwnProperty(k)&&(pa(k,Y[k]),Va(k.toLowerCase()));pa("Weeks",6048E5);e.duration.fn.asMonths=function(){return(+this-31536E6*this.years())/2592E6+12*this.years()};e.lang("en",{ordinal:function(a){var b=a%10,b=1===h(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+b}});return e}).call(this);

    UI.datepicker.moment = moment;

    return UI.datepicker;
});