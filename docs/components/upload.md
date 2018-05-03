# Upload

<p class="uk-text-lead">Upload files through a file input form element or a placeholder area.</p>

## Usage

This JavaScript component utilizes the latest XMLHttpRequest Level 2 specification and provides the ability of uploading files via Ajax including tracking of the upload progress. The component provides two ways of uploading files: `select` and `drop`. While the `select` request can only be applied to `<input type="file">` elements, you can basically use any element with `drop`, which enables you to simply drag and drop files from your desktop into the specified element to upload them. Note that this component does not handle your file uploads on the server.

***

## Select

In this example we are using a simple button which opens up the file select window.

```example
<div class="js-upload" uk-form-custom>
    <input type="file" multiple>
    <button class="uk-button uk-button-default" type="button" tabindex="-1">Select</button>
</div>
```

***

## Drop area

This example shows how to realize a drop area with the option to select the file from a file window.

```example
<div class="js-upload uk-placeholder uk-text-center">
    <span uk-icon="icon: cloud-upload"></span>
    <span class="uk-text-middle">Attach binaries by dropping them here or</span>
    <div uk-form-custom>
        <input type="file" multiple>
        <span class="uk-link">selecting one</span>
    </div>
</div>

<progress id="js-progressbar" class="uk-progress" value="0" max="100" hidden></progress>

<script>

    var bar = document.getElementById('js-progressbar');

    UIkit.upload('.js-upload', {

        url: '',
        multiple: true,

        beforeSend: function () {
            console.log('beforeSend', arguments);
        },
        beforeAll: function () {
            console.log('beforeAll', arguments);
        },
        load: function () {
            console.log('load', arguments);
        },
        error: function () {
            console.log('error', arguments);
        },
        complete: function () {
            console.log('complete', arguments);
        },

        loadStart: function (e) {
            console.log('loadStart', arguments);

            bar.removeAttribute('hidden');
            bar.max = e.total;
            bar.value = e.loaded;
        },

        progress: function (e) {
            console.log('progress', arguments);

            bar.max = e.total;
            bar.value = e.loaded;
        },

        loadEnd: function (e) {
            console.log('loadEnd', arguments);

            bar.max = e.total;
            bar.value = e.loaded;
        },

        completeAll: function () {
            console.log('completeAll', arguments);

            setTimeout(function () {
                bar.setAttribute('hidden', 'hidden');
            }, 1000);

            alert('Upload Completed');
        }

    });

</script>

```

***

## JavaScript

To create `select` and `drop` upload listeners, you need to instantiate each upload class with the target element and options, which define callbacks and useful settings.

```html
<script>

    var bar = document.getElementById('js-progressbar');

    UIkit.upload('.js-upload', {

        url: '',
        multiple: true,

        beforeSend: function (environment) {
            console.log('beforeSend', arguments);
            
            // The environment object can still be modified here. 
            // var {data, method, headers, xhr, responseType} = environment;
            
        },
        beforeAll: function () {
            console.log('beforeAll', arguments);
        },
        load: function () {
            console.log('load', arguments);
        },
        error: function () {
            console.log('error', arguments);
        },
        complete: function () {
            console.log('complete', arguments);
        },

        loadStart: function (e) {
            console.log('loadStart', arguments);

            bar.removeAttribute('hidden');
            bar.max = e.total;
            bar.value = e.loaded;
        },

        progress: function (e) {
            console.log('progress', arguments);

            bar.max = e.total;
            bar.value = e.loaded;
        },

        loadEnd: function (e) {
            console.log('loadEnd', arguments);

            bar.max = e.total;
            bar.value = e.loaded;
        },

        completeAll: function () {
            console.log('completeAll', arguments);

            setTimeout(function () {
                bar.setAttribute('hidden', 'hidden');
            }, 1000);

            alert('Upload Completed');
        }

    });

</script>
```

***

## Component options

Any of these options can be applied to the component attribute. Separate multiple options with a semicolon. [Learn more](javascript.md#component-configuration)

| Option             | Value    | Default                 | Description                                                 |
|:-------------------|:---------|:------------------------|:------------------------------------------------------------|
| `url`              | String   | `''`                    | The request url.                                            |
| `multiple`         | Boolean  | `false`                 | Allow multiple files to be uploaded.                        |
| `name`             | String   | `files[]`               | The name parameter.                                         |
| `type`             | String   | `POST`                  | The request type.                                           |
| `params`           | Object   | `{}`                    | Additional parameters.                                      |
| `allow`            | String   | `false`                 | File name filter. (eg. *.png)                               |
| `mime`             | String   | `false`                 | File MIME type filter. (eg. image/*)                        |
| `concurrent`       | Number   | `1`                     | Number of files that will be uploaded simultaneously.       |
| `type`             | String   | ``                      | The expected [response type](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType) |
| `method`           | String   | `POST`                  | The request method |
| `msg-invalid-mime` | String   | `Invalid File Type: %s` | Invalid MIME type message.                                  |
| `msg-invalid-name` | String   | `Invalid File Name: %s` | Invalid name message.                                       |
| `cls-dragover`     | String   | `uk-dragover`           | File name filter.                                           |
| `abort`            | Function | `null`                  | The abort callback.                                         |
| `before-all`       | Function | `null`                  | The beforeAll callback.                                     |
| `before-send`      | Function | `null`                  | The beforeSend callback.                                    |
| `complete`         | Function | `null`                  | The complete callback.                                      |
| `complete-all`     | Function | `null`                  | The completeAll callback.                                   |
| `error`            | Function | `null`                  | The error callback.                                         |
| `load`             | Function | `null`                  | The load callback.                                          |
| `load-end`         | Function | `null`                  | The loadEnd callback.                                       |
| `load-start`       | Function | `null`                  | The loadStart callback.                                     |
| `progress`         | Function | `null`                  | The progress callback.                                      |
| `fail`             | Function | `alert`                 | The fail callback. If name or MIME type are invalid.        |

***

## JavaScript

Learn more about [JavaScript components](javascript.md#programmatic-use).

### Initialization

```js
UIkit.upload(element, options);
```

### Events

The following events will be triggered on elements with this component attached:

| Name | Description |
| --- | --- |
| `upload` | Fires before files are being uploaded. |
