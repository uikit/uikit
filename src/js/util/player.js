import { assign, attr, includes, isString, once, Promise, toNode, win } from './index';

var id = 0;

export class Player {

    constructor(el) {
        this.id = ++id;
        this.el = toNode(el);
    }

    isVideo() {
        return this.isYoutube() || this.isVimeo() || this.isHTML5();
    }

    isHTML5() {
        return this.el.tagName === 'VIDEO';
    }

    isIFrame() {
        return this.el.tagName === 'IFRAME';
    }

    isYoutube() {
        return this.isIFrame() && !!this.el.src.match(/\/\/.*?youtube\.[a-z]+\/(watch\?v=[^&\s]+|embed)|youtu\.be\/.*/);
    }

    isVimeo() {
        return this.isIFrame() && !!this.el.src.match(/vimeo\.com\/video\/.*/);
    }

    enableApi() {

        if (this.ready) {
            return this.ready;
        }

        var youtube = this.isYoutube(), vimeo = this.isVimeo(), poller;

        if (youtube || vimeo) {

            return this.ready = new Promise(resolve => {

                once(this.el, 'load', () => {
                    if (youtube) {
                        var listener = () => post(this.el, {event: 'listening', id: this.id});
                        poller = setInterval(listener, 100);
                        listener();
                    }
                });

                listen(data => youtube && data.id === this.id && data.event === 'onReady' || vimeo && Number(data.player_id) === this.id)
                    .then(() => {
                        resolve();
                        poller && clearInterval(poller);
                    });

                attr(this.el, 'src', `${this.el.src}${includes(this.el.src, '?') ? '&' : '?'}${youtube ? 'enablejsapi=1' : `api=1&player_id=${id}`}`);

            });

        }

        return Promise.resolve();

    }

    play() {

        if (!this.isVideo()) {
            return;
        }

        if (this.isIFrame()) {
            this.enableApi().then(() => post(this.el, {func: 'playVideo', method: 'play'}))
        } else if (this.isHTML5()) {
            this.el.play();
        }
    }

    pause() {

        if (!this.isVideo()) {
            return;
        }

        if (this.isIFrame()) {
            this.enableApi().then(() => post(this.el, {func: 'pauseVideo', method: 'pause'}))
        } else if (this.isHTML5()) {
            this.el.pause();
        }
    }

    mute() {

        if (!this.isVideo()) {
            return;
        }

        if (this.isIFrame()) {
            this.enableApi().then(() => post(this.el, {func: 'mute', method: 'setVolume', value: 0}))
        } else if (this.isHTML5()) {
            this.el.muted = true;
            attr(this.el, 'muted', '');
        }

    }

}

function post(el, cmd) {
    try {
        el.contentWindow.postMessage(JSON.stringify(assign({event: 'command'}, cmd)), '*');
    } catch (e) {}
}

function listen(cb) {

    return new Promise(resolve => {

        once(win, 'message', (_, data) => resolve(data), false, ({data}) => {

            if (!data || !isString(data)) {
                return;
            }

            try {
                data = JSON.parse(data);
            } catch (e) {
                return;
            }

            return data && cb(data);

        });

    });

}
