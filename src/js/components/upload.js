import { addClass, ajax, matches, noop, on, removeClass, toArray, trigger } from 'uikit-util';

export default {
    props: {
        allow: String,
        clsDragover: String,
        concurrent: Number,
        maxSize: Number,
        method: String,
        mime: String,
        msgInvalidMime: String,
        msgInvalidName: String,
        msgInvalidSize: String,
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
        msgInvalidMime: 'Invalid File Type: %s',
        msgInvalidName: 'Invalid File Name: %s',
        msgInvalidSize: 'Invalid File Size: %s Kilobytes Max',
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
                    this.fail(this.msgInvalidSize.replace('%s', this.maxSize));
                    return;
                }

                if (this.allow && !match(this.allow, file.name)) {
                    this.fail(this.msgInvalidName.replace('%s', this.allow));
                    return;
                }

                if (this.mime && !match(this.mime, file.type)) {
                    this.fail(this.msgInvalidMime.replace('%s', this.mime));
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
                            xhr.upload && on(xhr.upload, 'progress', this.progress);
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
