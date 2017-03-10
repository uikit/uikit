function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    var {$, ajax, on} = UIkit.util;

    UIkit.component('upload', {

        props: {
            allow: String,
            clsDragover: String,
            concurrent: Number,
            dataType: String,
            mime: String,
            msgInvalidMime: String,
            msgInvalidName: String,
            multiple: Boolean,
            name: String,
            params: Object,
            type: String,
            url: String
        },

        defaults: {
            allow: false,
            clsDragover: 'uk-dragover',
            concurrent: 1,
            dataType: undefined,
            mime: false,
            msgInvalidMime: 'Invalid File Type: %s',
            msgInvalidName: 'Invalid File Name: %s',
            multiple: false,
            name: 'files[]',
            params: {},
            type: 'POST',
            url: '',
            abort: null,
            beforeAll: null,
            beforeSend: null,
            complete: null,
            completeAll: null,
            error: null,
            fail(msg) {
                alert(msg);
            },
            load: null,
            loadEnd: null,
            loadStart: null,
            progress: null
        },

        events: {

            change(e) {

                if (!$(e.target).is('input[type="file"]')) {
                    return;
                }

                e.preventDefault();

                if (e.target.files) {
                    this.upload(e.target.files);
                }

                e.target.value = '';
            },

            drop(e) {
                e.preventDefault();
                e.stopPropagation();

                var transfer = e.originalEvent.dataTransfer;

                if (!transfer || !transfer.files) {
                    return;
                }

                this.$el.removeClass(this.clsDragover);

                this.upload(transfer.files);
            },

            dragenter(e) {
                e.preventDefault();
                e.stopPropagation();
            },

            dragover(e) {
                e.preventDefault();
                e.stopPropagation();
                this.$el.addClass(this.clsDragover);
            },

            dragleave(e) {
                e.preventDefault();
                e.stopPropagation();
                this.$el.removeClass(this.clsDragover);
            }

        },

        methods: {

            upload(files) {

                if (!files.length) {
                    return;
                }

                this.$el.trigger('upload', [files]);

                for (var i = 0; i < files.length; i++) {

                    if (this.allow) {
                        if (!match(this.allow, files[i].name)) {
                            this.fail(this.msgInvalidName.replace(/%s/, this.allow));
                            return;
                        }
                    }

                    if (this.mime) {
                        if (!match(this.mime, files[i].type)) {
                            this.fail(this.msgInvalidMime.replace(/%s/, this.mime));
                            return;
                        }
                    }

                }

                if (!this.multiple) {
                    files = [files[0]];
                }

                this.beforeAll && this.beforeAll(this, files);

                var chunks = chunk(files, this.concurrent),
                    upload = files => {

                        var data = new FormData();

                        files.forEach(file => data.append(this.name, file));

                        for (var key in this.params) {
                            data.append(key, this.params[key]);
                        }

                        ajax({
                            data,
                            url: this.url,
                            type: this.type,
                            dataType: this.dataType,
                            beforeSend: this.beforeSend,
                            complete: [this.complete, (xhr, status) => {
                                if (chunks.length) {
                                    upload(chunks.shift());
                                } else {
                                    this.completeAll && this.completeAll(xhr);
                                }

                                if (status === 'abort') {
                                    this.abort && this.abort(xhr);
                                }
                            }],
                            cache: false,
                            contentType: false,
                            processData: false,
                            xhr: () => {
                                var xhr = $.ajaxSettings.xhr();
                                xhr.upload && this.progress && on(xhr.upload, 'progress', this.progress);
                                ['loadStart', 'load', 'loadEnd', 'error', 'abort'].forEach(type => this[type] && on(xhr, type.toLowerCase(), this[type]));
                                return xhr;
                            }
                        })

                    };

                upload(chunks.shift());

            }

        }

    });

    function match(pattern, path) {
        return path.match(new RegExp(`^${pattern.replace(/\//g, '\\/').replace(/\*\*/g, '(\\/[^\\/]+)*').replace(/\*/g, '[^\\/]+').replace(/((?!\\))\?/g, '$1.')}$`, 'i'));
    }

    function chunk(files, size) {
        var chunks = [];
        for (var i = 0; i < files.length; i += size) {
            var chunk = [];
            for (var j = 0; j < size; j++) {
                chunk.push(files[i+j]);
            }
            chunks.push(chunk);
        }
        return chunks;
    }

}

if (!BUNDLED && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

export default plugin;
