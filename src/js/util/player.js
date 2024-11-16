import { isTag } from './dom';
import { once } from './event';
import { includes, noop } from './lang';

export function play(el) {
    if (isIFrame(el)) {
        call(el, { func: 'playVideo', method: 'play' });
    }

    if (isHTML5(el)) {
        el.play().catch(noop);
    }
}

export function pause(el) {
    if (isIFrame(el)) {
        call(el, { func: 'pauseVideo', method: 'pause' });
    }

    if (isHTML5(el)) {
        el.pause();
    }
}

export function mute(el) {
    if (isIFrame(el)) {
        call(el, { func: 'mute', method: 'setVolume', value: 0 });
    }

    if (isHTML5(el)) {
        el.muted = true;
    }
}

function isHTML5(el) {
    return isTag(el, 'video');
}

function isIFrame(el) {
    return isTag(el, 'iframe') && (isYoutube(el) || isVimeo(el));
}

function isYoutube(el) {
    return !!el.src.match(
        /\/\/.*?youtube(-nocookie)?\.[a-z]+\/(watch\?v=[^&\s]+|embed)|youtu\.be\/.*/,
    );
}

function isVimeo(el) {
    return !!el.src.match(/vimeo\.com\/video\/.*/);
}

async function call(el, cmd) {
    await enableApi(el);
    post(el, cmd);
}

function post(el, cmd) {
    el.contentWindow.postMessage(JSON.stringify({ event: 'command', ...cmd }), '*');
}

const stateKey = '_ukPlayer';
let counter = 0;
function enableApi(el) {
    if (el[stateKey]) {
        return el[stateKey];
    }

    const youtube = isYoutube(el);
    const vimeo = isVimeo(el);

    const id = ++counter;
    let poller;

    return (el[stateKey] = new Promise((resolve) => {
        youtube &&
            once(el, 'load', () => {
                const listener = () => post(el, { event: 'listening', id });
                poller = setInterval(listener, 100);
                listener();
            });

        once(window, 'message', resolve, false, ({ data }) => {
            try {
                data = JSON.parse(data);
                return (
                    (youtube && data?.id === id && data.event === 'onReady') ||
                    (vimeo && Number(data?.player_id) === id)
                );
            } catch (e) {
                // noop
            }
        });

        el.src = `${el.src}${includes(el.src, '?') ? '&' : '?'}${
            youtube ? 'enablejsapi=1' : `api=1&player_id=${id}`
        }`;
    }).then(() => clearInterval(poller)));
}
