import $ from 'jquery';
import {langDirection} from '../util/index';

export default {

    methods: {

        justifyElement(el, justify, boundaryWidth, offset) {

            el = $(el);
            justify = $(justify);

            if (!justify.length) {
                return;
            }

            var width = justify.outerWidth();

            el.css('min-width', width);

            if (langDirection === 'right') {

                boundaryWidth = boundaryWidth || window.innerWidth;

                el.css('margin-right', (boundaryWidth - (justify.offset().left + width)) - (boundaryWidth - (el.offset().left + el.outerWidth())));

            } else {

                offset = offset || el.offset();

                el.css('margin-left', justify.offset().left - offset.left);

            }
        }

    }

};
