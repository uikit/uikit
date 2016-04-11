import $ from 'jquery';
import {extend, getIndex, Transition} from '../util/index';

export default function (UIkit) {

    var active;

    $(document).on({
        keydown: e => {
            if (active) {
                switch (e.keyCode) {
                    case 37:
                        active.show('previous');
                        break;
                    case 39:
                        active.show('next');
                        break;
                }
            }
        }
    });

    UIkit.component('lightbox', {

        name: 'lightbox',

        props: {
            toggle: String,
            duration: Number
        },

        defaults: {
            toggle: 'a',
            duration: 400,
            attrItem: 'uk-lightbox-item',
            slides: [],
            index: 0
        },

        ready() {

            this.toggles = $(this.toggle, this.$el);

            this.toggles.each((i, el) => {
                el = $(el);
                this.slides.push({
                    source: el.attr('href'),
                    title: el.attr('title'),
                    type: el.attr('type')
                })
            });

            this.$el.on('click', this.toggle + ':not(.uk-disabled)', e => {
                e.preventDefault();
                this.show(this.toggles.index(e.currentTarget));
            });


            //
            // if (this.swiping) {
            //     this.connect.on('swipeRight swipeLeft', e => {
            //         e.preventDefault();
            //         if (!window.getSelection().toString()) {
            //             this.show(e.type == 'swipeLeft' ? 'next' : 'previous');
            //         }
            //     });
            // }

        },

        update: {

            handler() {

                if (!this.modal) {
                    return;
                }

                var maxWidth = window.innerWidth - (this.modal.panel.outerWidth(true) - this.modal.panel.width()) - this.modal.getScrollbarWidth(),
                    maxHeight = window.innerHeight - (this.modal.panel.outerHeight(true) - this.modal.panel.height()),
                    width = this.modal.panel.width(),
                    height = this.modal.panel.height();

                if (maxHeight < this.height) {
                    this.width = Math.floor(this.width * (maxHeight / this.height));
                    this.height = maxHeight;
                }

                if (maxWidth < this.width) {
                    this.height = Math.floor(this.height * (maxWidth / this.width));
                    this.width = maxWidth;
                }

                Transition.stop(this.modal.panel);
                Transition.stop(this.modal.content);

                this.modal.panel.css({width, height});
                this.modal.content.css('opacity', 0);

                Transition.start(this.modal.panel, {width: this.width, height: this.height}, this.duration).then(() => {
                    Transition.start(this.modal.content, {opacity: 1}, 200);
                });

            },

            events: ['resize', 'orientationchange']

        },

        methods: {

            show(index) {

                this.index = getIndex(index, this.slides, this.index);

                if (!this.modal) {
                    this.modal = UIkit.modal.dialog(`
                        <button class="uk-close uk-modal-close-outside uk-transition-hide" type="button" uk-close></button>
                        <span class="uk-modal-spinner uk-transition-show" uk-icon="icon: trash"></span>
                        `, {center: true});
                    this.modal.$el.css('overflow', 'hidden');
                    this.modal.panel.css({width: 200, height: 200});
                    this.modal.content = $('<div class="uk-lightbox-content"></div>').appendTo(this.modal.panel);
                    this.modal.caption = $('<div class="uk-modal-caption uk-transition-hide"></div>').appendTo(this.modal.panel);

                    if (this.slides.length > 1) {
                        this.modal.panel.append(`
                            <a href="#" class="uk-slidenav uk-slidenav-contrast uk-slidenav-previous uk-hidden-touch uk-transition-hide" uk-lightbox-item="previous"></a>
                            <a href="#" class="uk-slidenav uk-slidenav-contrast uk-slidenav-next uk-hidden-touch uk-transition-hide" uk-lightbox-item="next"></a>
                        `);
                    }

                    this.modal.$el
                        .on('hide', this.hide)
                        .on('click', `[${this.attrItem}]`, e => {
                            e.preventDefault();
                            this.show($(e.currentTarget).attr(this.attrItem));
                        });
                }

                active = this;

                this.modal.panel.addClass('uk-transition');
                this.modal.content.empty();
                this.modal.caption.text(this.getItem().title);

                this.$el.trigger('showitem');
            },

            hide() {

                active = active && active !== this && active;

                this.modal.hide().then(() => {
                    this.modal.$destroy();
                    this.modal = null;
                });
            },

            getItem() {
                return extend({source: '', title: '', type: 'auto'}, this.slides[this.index]);
            },

            setContent(content) {

                if (!this.modal) {
                    return;
                }

                this.modal.content.html(content);
                this.$update();
            }

        }

    });

    UIkit.mixin({

        events: {

            showitem(e) {

                var item = this.getItem();

                if (item.type !== 'image' && item.source && !item.source.match(/\.(jp(e)?g|png|gif|svg)$/i)) {
                    return;
                }

                var img = new Image();

                img.onerror = function () {
                    // data.promise.reject('Loading image failed');
                };

                img.onload = () => {
                    this.width = img.width;
                    this.height = img.height;
                    this.setContent(`<img class="uk-responsive-width" width="${img.width}" height="${img.height}" src ="${item.source}">`);
                };

                img.src = item.source;

                e.stopImmediatePropagation();
            }

        }

    }, UIkit.components.lightbox);

}
