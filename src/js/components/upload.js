import I18n from '../mixin/i18n';
import { addClass, assign, matches, noop, on, removeClass, toArray, trigger } from 'uikit-util';

export default {
    mixins: [I18n],

    i18n: {
        invalidMime: 'Invalid File Type: %s',
        invalidName: 'Invalid File Name: %s',
        invalidSize: 'Invalid File Size: %s Kilobytes Max',
    },

    props: {
        allow: String,
        clsDragover: String,
        concurrent: Number,
        maxSize: Number,
        method: String,
        mime: String,
        multiple: Boolean,
        name: String,
        params: Object,
        type: String,
        url: String,
    },

    data: {
        allow: false,
        clsDragover: 'uk-dragover',
        concurrent: 1,
        maxSize: 0,
        method: 'POST',
        mime: false,
        multiple: false,
        name: 'files[]',
        params: {},
        type: '',
        url: '',
        abort: noop,
        beforeAll: noop,
        beforeSend: noop,
        complete: noop,
        completeAll: noop,
        error: noop,
        fail: noop,
        load: noop,
        loadEnd: noop,
        loadStart: noop,
        progress: noop,
    },

    events: {
        change(e) {
            if (!matches(e.target, 'input[type="file"]')) {
                return;
            }

            e.preventDefault();

            if (e.target.files) {
                this.upload(e.target.files);
            }

            e.target.value = '';
        },

        drop(e) {
            stop(e);

            const transfer = e.dataTransfer;

            if (!transfer?.files) {
                return;
            }

            removeClass(this.$el, this.clsDragover);

            this.upload(transfer.files);
        },

        dragenter(e) {
            stop(e);
        },

        dragover(e) {
            stop(e);
            addClass(this.$el, this.clsDragover);
        },

        dragleave(e) {
            stop(e);
            removeClass(this.$el, this.clsDragover);
        },
    },

    methods: {
        async upload(files) {
            files = toArray(files);

            if (!files.length) {
                return;
            }

            trigger(this.$el, 'upload', [files]);

            for (const file of files) {
                if (this.maxSize && this.maxSize * 1000 < file.size) {
                    this.fail(this.t('invalidSize', this.maxSize));
                    return;
                }

                if (this.allow && !match(this.allow, file.name)) {
                    this.fail(this.t('invalidName', this.allow));
                    return;
                }

                if (this.mime && !match(this.mime, file.type)) {
                    this.fail(this.t('invalidMime', this.mime));
                    return;
                }
            }

            if (!this.multiple) {
                files = files.slice(0, 1);
            }

            this.beforeAll(this, files);

            const chunks = chunk(files, this.concurrent);
            const upload = async (files) => {
                const data = new FormData();

                files.forEach((file) => data.append(this.name, file));

                for (const key in this.params) {
                    data.append(key, this.params[key]);
                }

                try {
                    const xhr = await ajax(this.url, {
                        data,
                        method: this.method,
                        responseType: this.type,
                        beforeSend: (env) => {
                            const { xhr } = env;
                            on(xhr.upload, 'progress', this.progress);
                            for (const type of ['loadStart', 'load', 'loadEnd', 'abort']) {
                                on(xhr, type.toLowerCase(), this[type]);
                            }

                            return this.beforeSend(env);
                        },
                    });

                    this.complete(xhr);

                    if (chunks.length) {
                        await upload(chunks.shift());
                    } else {
                        this.completeAll(xhr);
                    }
                } catch (e) {
                    this.error(e);
                }
            };

            await upload(chunks.shift());
        },
    },
};

function match(pattern, path) {
    return path.match(
        new RegExp(
            `^${pattern
                .replace(/\//g, '\\/')
                .replace(/\*\*/g, '(\\/[^\\/]+)*')
                .replace(/\*/g, '[^\\/]+')
                .replace(/((?!\\))\?/g, '$1.')}$`,
            'i'
        )
    );
}

function chunk(files, size) {
    const chunks = [];
    for (let i = 0; i < files.length; i += size) {
        chunks.push(files.slice(i, i + size));
    }
    return chunks;
}

function stop(e) {
    e.preventDefault();
    e.stopPropagation();
}

export function ajax(url, options) {
    const env = {
        data: null,
        method: 'GET',
        headers: {},
        xhr: new XMLHttpRequest(),
        beforeSend: noop,
        responseType: '',
        ...options,
    };
    return Promise.resolve()
        .then(() => env.beforeSend(env))
        .then(() => send(url, env));
}

function send(url, env) {
    return new Promise((resolve, reject) => {
        const { xhr } = env;

        for (const prop in env) {
            if (prop in xhr) {
                try {
                    xhr[prop] = env[prop];
                } catch (e) {
                    // noop
                }
            }
        }

        xhr.open(env.method.toUpperCase(), url);

        for (const header in env.headers) {
            xhr.setRequestHeader(header, env.headers[header]);
        }

        on(xhr, 'load', () => {
            if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                resolve(xhr);
            } else {
                reject(
                    assign(Error(xhr.statusText), {
                        xhr,
                        status: xhr.status,
                    })
                );
            }
        });

        on(xhr, 'error', () => reject(assign(Error('Network Error'), { xhr })));
        on(xhr, 'timeout', () => reject(assign(Error('Network Timeout'), { xhr })));

        xhr.send(env.data);
    });
}
