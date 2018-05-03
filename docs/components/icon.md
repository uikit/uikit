# Icon

<p class="uk-text-lead">Place scalable vector icons anywhere in your content.</p>

UIkit comes with its own SVG icon system and a comprehensive library, which comprises a growing number of elegant outline icons. This component injects SVGs into the site, so that they adopt color and can be styled with CSS.

***

## Usage

Make sure to include the icon library script, for more details see the [installation instructions](installation.md).

```html
<script src="uikit/dist/js/uikit-icons.min.js"></script>
```

To apply this component, add the `uk-icon` attribute to a `<span>` or `<a>` element. To display the actual icon, you need to append the `icon: NAME` parameter to the attribute. Et voilà, you have a vector icon which inherits color just like your text does.

```html
<span uk-icon="icon: check"></span>

<a href="" uk-icon="icon: heart"></a>
```

If `icon` is the only option in the attribute value, you can also use `uk-icon="NAME"`

```html
<span uk-icon="heart"></span>
```

```example
<span class="uk-margin-small-right" uk-icon="check"></span>

<a href="" uk-icon="heart"></a>
```

***

## Library

Here is an overview of all currently available icons. Over time, we will keep adding new icons to the list.

<h4 class="uk-heading-line"><span>App</span></h4>

<div class="uk-child-width-1-3@s" uk-grid>
    <div>

        <ul class="uk-list">
            <li><span class="uk-margin-small-right" uk-icon="home"></span> home</li>
            <li><span class="uk-margin-small-right" uk-icon="sign-in"></span> sign-in</li>
            <li><span class="uk-margin-small-right" uk-icon="sign-out"></span> sign-out</li>
            <li><span class="uk-margin-small-right" uk-icon="user"></span> user</li>
            <li><span class="uk-margin-small-right" uk-icon="users"></span> users</li>
            <li><span class="uk-margin-small-right" uk-icon="lock"></span> lock</li>
            <li><span class="uk-margin-small-right" uk-icon="unlock"></span> unlock</li>
            <li><span class="uk-margin-small-right" uk-icon="settings"></span> settings</li>
            <li><span class="uk-margin-small-right" uk-icon="cog"></span> cog</li>
            <li><span class="uk-margin-small-right" uk-icon="nut"></span> nut</li>
            <li><span class="uk-margin-small-right" uk-icon="comment"></span> comment</li>
            <li><span class="uk-margin-small-right" uk-icon="commenting"></span> commenting</li>
            <li><span class="uk-margin-small-right" uk-icon="comments"></span> comments</li>
            <li><span class="uk-margin-small-right" uk-icon="hashtag"></span> hashtag</li>
            <li><span class="uk-margin-small-right" uk-icon="tag"></span> tag</li>
            <li><span class="uk-margin-small-right" uk-icon="cart"></span> cart</li>
            <li><span class="uk-margin-small-right" uk-icon="credit-card"></span> credit-card</li>
            <li><span class="uk-margin-small-right" uk-icon="mail"></span> mail</li>
            <li><span class="uk-margin-small-right" uk-icon="receiver"></span> receiver</li>
            <li><span class="uk-margin-small-right" uk-icon="search"></span> search</li>
            <li><span class="uk-margin-small-right" uk-icon="location"></span> location</li>
            <li><span class="uk-margin-small-right" uk-icon="bookmark"></span> bookmark</li>
        </ul>

    </div>
    <div>

        <ul class="uk-list">
            <li><span class="uk-margin-small-right" uk-icon="code"></span> code</li>
            <li><span class="uk-margin-small-right" uk-icon="paint-bucket"></span> paint-bucket</li>
            <li><span class="uk-margin-small-right" uk-icon="camera"></span> camera</li>
            <li><span class="uk-margin-small-right" uk-icon="bell"></span> bell</li>
            <li><span class="uk-margin-small-right" uk-icon="bolt"></span> bolt</li>
            <li><span class="uk-margin-small-right" uk-icon="star"></span> star</li>
            <li><span class="uk-margin-small-right" uk-icon="heart"></span> heart</li>
            <li><span class="uk-margin-small-right" uk-icon="happy"></span> happy</li>
            <li><span class="uk-margin-small-right" uk-icon="lifesaver"></span> lifesaver</li>
            <li><span class="uk-margin-small-right" uk-icon="rss"></span> rss</li>
            <li><span class="uk-margin-small-right" uk-icon="social"></span> social</li>
            <li><span class="uk-margin-small-right" uk-icon="git-branch"></span> git-branch</li>
            <li><span class="uk-margin-small-right" uk-icon="git-fork"></span> git-fork</li>
            <li><span class="uk-margin-small-right" uk-icon="world"></span> world</li>
            <li><span class="uk-margin-small-right" uk-icon="calendar"></span> calendar</li>
            <li><span class="uk-margin-small-right" uk-icon="clock"></span> clock</li>
            <li><span class="uk-margin-small-right" uk-icon="history"></span> history</li>
            <li><span class="uk-margin-small-right" uk-icon="future"></span> future</li>
            <li><span class="uk-margin-small-right" uk-icon="pencil"></span> pencil</li>
            <li><span class="uk-margin-small-right" uk-icon="trash"></span> trash</li>
            <li><span class="uk-margin-small-right" uk-icon="move"></span> move</li>
            <li><span class="uk-margin-small-right" uk-icon="link"></span> link</li>

        </ul>

    </div>
    <div>

        <ul class="uk-list">
            <li><span class="uk-margin-small-right" uk-icon="question"></span> question</li>
            <li><span class="uk-margin-small-right" uk-icon="info"></span> info</li>
            <li><span class="uk-margin-small-right" uk-icon="warning"></span> warning</li>
            <li><span class="uk-margin-small-right" uk-icon="image"></span> image</li>
            <li><span class="uk-margin-small-right" uk-icon="thumbnails"></span> thumbnails</li>
            <li><span class="uk-margin-small-right" uk-icon="table"></span> table</li>
            <li><span class="uk-margin-small-right" uk-icon="list"></span> list</li>
            <li><span class="uk-margin-small-right" uk-icon="menu"></span> menu</li>
            <li><span class="uk-margin-small-right" uk-icon="grid"></span> grid</li>
            <li><span class="uk-margin-small-right" uk-icon="more"></span> more</li>
            <li><span class="uk-margin-small-right" uk-icon="more-vertical"></span> more-vertical</li>
            <li><span class="uk-margin-small-right" uk-icon="plus"></span> plus</li>
            <li><span class="uk-margin-small-right" uk-icon="plus-circle"></span> plus-circle</li>
            <li><span class="uk-margin-small-right" uk-icon="minus"></span> minus</li>
            <li><span class="uk-margin-small-right" uk-icon="minus-circle"></span> minus-circle</li>
            <li><span class="uk-margin-small-right" uk-icon="close"></span> close</li>
            <li><span class="uk-margin-small-right" uk-icon="check"></span> check</li>
            <li><span class="uk-margin-small-right" uk-icon="ban"></span> ban</li>
            <li><span class="uk-margin-small-right" uk-icon="refresh"></span> refresh</li>
            <li><span class="uk-margin-small-right" uk-icon="play"></span> play</li>
            <li><span class="uk-margin-small-right" uk-icon="play-circle"></span> play-circle</li>
        </ul>

    </div>
</div>

<h4 class="uk-heading-line"><span>Devices</span></h4>

<div class="uk-child-width-1-3@s" uk-grid>
    <div>

        <ul class="uk-list">
            <li><span class="uk-margin-small-right" uk-icon="tv"></span> tv</li>
            <li><span class="uk-margin-small-right" uk-icon="desktop"></span> desktop</li>
            <li><span class="uk-margin-small-right" uk-icon="laptop"></span> laptop</li>
        </ul>

    </div>
    <div>

        <ul class="uk-list">
            <li><span class="uk-margin-small-right" uk-icon="tablet"></span> tablet</li>
            <li><span class="uk-margin-small-right" uk-icon="phone"></span> phone</li>
        </ul>

    </div>
    <div>

        <ul class="uk-list">
            <li><span class="uk-margin-small-right" uk-icon="tablet-landscape"></span> tablet-landscape</li>
            <li><span class="uk-margin-small-right" uk-icon="phone-landscape"></span> phone-landscape</li>
        </ul>

    </div>
</div>

<h4 class="uk-heading-line"><span>Storage</span></h4>

<div class="uk-child-width-1-3@s" uk-grid>
    <div>

        <ul class="uk-list">
            <li><span class="uk-margin-small-right" uk-icon="file"></span> file</li>
            <li><span class="uk-margin-small-right" uk-icon="copy"></span> copy</li>
            <li><span class="uk-margin-small-right" uk-icon="file-edit"></span> file-edit</li>
            <li><span class="uk-margin-small-right" uk-icon="folder"></span> folder</li>
            <li><span class="uk-margin-small-right" uk-icon="album"></span> album</li>
        </ul>

    </div>
    <div>

        <ul class="uk-list">
            <li><span class="uk-margin-small-right" uk-icon="push"></span> push</li>
            <li><span class="uk-margin-small-right" uk-icon="pull"></span> pull</li>
            <li><span class="uk-margin-small-right" uk-icon="server"></span> server</li>
            <li><span class="uk-margin-small-right" uk-icon="database"></span> database</li>
        </ul>

    </div>
    <div>

        <ul class="uk-list">
            <li><span class="uk-margin-small-right" uk-icon="cloud-upload"></span> cloud-upload</li>
            <li><span class="uk-margin-small-right" uk-icon="cloud-download"></span> cloud-download</li>
            <li><span class="uk-margin-small-right" uk-icon="download"></span> download</li>
            <li><span class="uk-margin-small-right" uk-icon="upload"></span> upload</li>
        </ul>

    </div>
</div>

<h4 class="uk-heading-line"><span>Direction</span></h4>

<div class="uk-child-width-1-3@s" uk-grid>
    <div>

        <ul class="uk-list">
            <li><span class="uk-margin-small-right" uk-icon="reply"></span> reply</li>
            <li><span class="uk-margin-small-right" uk-icon="forward"></span> forward</li>
            <li><span class="uk-margin-small-right" uk-icon="expand"></span> expand</li>
            <li><span class="uk-margin-small-right" uk-icon="shrink"></span> shrink</li>
            <li><span class="uk-margin-small-right" uk-icon="arrow-up"></span> arrow-up</li>
            <li><span class="uk-margin-small-right" uk-icon="arrow-down"></span> arrow-down</li>
        </ul>

    </div>
    <div>

        <ul class="uk-list">
            <li><span class="uk-margin-small-right" uk-icon="arrow-left"></span> arrow-left</li>
            <li><span class="uk-margin-small-right" uk-icon="arrow-right"></span> arrow-right</li>
            <li><span class="uk-margin-small-right" uk-icon="chevron-up"></span> chevron-up</li>
            <li><span class="uk-margin-small-right" uk-icon="chevron-down"></span> chevron-down</li>
            <li><span class="uk-margin-small-right" uk-icon="chevron-left"></span> chevron-left</li>
        </ul>

    </div>
    <div>

        <ul class="uk-list">
            <li><span class="uk-margin-small-right" uk-icon="chevron-right"></span> chevron-right</li>
            <li><span class="uk-margin-small-right" uk-icon="triangle-up"></span> triangle-up</li>
            <li><span class="uk-margin-small-right" uk-icon="triangle-down"></span> triangle-down</li>
            <li><span class="uk-margin-small-right" uk-icon="triangle-left"></span> triangle-left</li>
            <li><span class="uk-margin-small-right" uk-icon="triangle-right"></span> triangle-right</li>
        </ul>

    </div>
</div>

<h4 class="uk-heading-line"><span>Editor</span></h4>

<div class="uk-child-width-1-3@s" uk-grid>
    <div>

        <ul class="uk-list">
            <li><span class="uk-margin-small-right" uk-icon="bold"></span> bold</li>
            <li><span class="uk-margin-small-right" uk-icon="italic"></span> italic</li>
        </ul>

    </div>
    <div>

        <ul class="uk-list">
            <li><span class="uk-margin-small-right" uk-icon="strikethrough"></span> strikethrough</li>
            <li><span class="uk-margin-small-right" uk-icon="video-camera"></span> video-camera</li>
        </ul>

    </div>
    <div>

        <ul class="uk-list">
            <li><span class="uk-margin-small-right" uk-icon="quote-right"></span> quote-right</li>
        </ul>

    </div>
</div>

<h4 class="uk-heading-line"><span>Brands</span></h4>

<div class="uk-child-width-1-3@s" uk-grid>
    <div>

        <ul class="uk-list">
            <li><span class="uk-margin-small-right" uk-icon="500px"></span> 500px</li>
            <li><span class="uk-margin-small-right" uk-icon="behance"></span> behance</li>
            <li><span class="uk-margin-small-right" uk-icon="dribbble"></span> dribbble</li>
            <li><span class="uk-margin-small-right" uk-icon="facebook"></span> facebook</li>
            <li><span class="uk-margin-small-right" uk-icon="flickr"></span> flickr</li>
            <li><span class="uk-margin-small-right" uk-icon="foursquare"></span> foursquare</li>
            <li><span class="uk-margin-small-right" uk-icon="github"></span> github</li>
            <li><span class="uk-margin-small-right" uk-icon="github-alt"></span> github-alt</li>
            <li><span class="uk-margin-small-right" uk-icon="gitter"></span> gitter</li>
        </ul>

    </div>
    <div>

        <ul class="uk-list">
            <li><span class="uk-margin-small-right" uk-icon="google"></span> google</li>
            <li><span class="uk-margin-small-right" uk-icon="google-plus"></span> google-plus</li>
            <li><span class="uk-margin-small-right" uk-icon="instagram"></span> instagram</li>
            <li><span class="uk-margin-small-right" uk-icon="joomla"></span> joomla</li>
            <li><span class="uk-margin-small-right" uk-icon="linkedin"></span> linkedin</li>
            <li><span class="uk-margin-small-right" uk-icon="pagekit"></span> pagekit</li>
            <li><span class="uk-margin-small-right" uk-icon="pinterest"></span> pinterest</li>
            <li><span class="uk-margin-small-right" uk-icon="soundcloud"></span> soundcloud</li>
            <li><span class="uk-margin-small-right" uk-icon="tripadvisor"></span> tripadvisor</li>
        </ul>

    </div>
    <div>

        <ul class="uk-list">
            <li><span class="uk-margin-small-right" uk-icon="tumblr"></span> tumblr</li>
            <li><span class="uk-margin-small-right" uk-icon="twitter"></span> twitter</li>
            <li><span class="uk-margin-small-right" uk-icon="uikit"></span> uikit</li>
            <li><span class="uk-margin-small-right" uk-icon="vimeo"></span> vimeo</li>
            <li><span class="uk-margin-small-right" uk-icon="whatsapp"></span> whatsapp</li>
            <li><span class="uk-margin-small-right" uk-icon="wordpress"></span> wordpress</li>
            <li><span class="uk-margin-small-right" uk-icon="xing"></span> xing</li>
            <li><span class="uk-margin-small-right" uk-icon="yelp"></span> yelp</li>
            <li><span class="uk-margin-small-right" uk-icon="youtube"></span> youtube</li>
        </ul>

    </div>
</div>

***

## Ratio

Add the `ratio: 2` parameter to the `uk-icon` attribute to double its size – or any other number, depending on how big you want you icon to be.

```html
<span uk-icon="icon: check; ratio: 2"></span>
```

```example
<span class="uk-margin-small-right" uk-icon="icon: check; ratio: 2"></span>
<span uk-icon="icon: check; ratio: 3.5"></span>
```

***

## Link modifier

To reset the default link styling to a more muted color when using an icon inside an anchor, add the `.uk-icon-link` class.

```html
<a href="" class="uk-icon-link" uk-icon="heart"></a>
```

```example
<a href="#" class="uk-icon-link uk-margin-small-right" uk-icon="copy"></a>
<a href="#" class="uk-icon-link uk-margin-small-right" uk-icon="file-edit"></a>
<a href="#" class="uk-icon-link" uk-icon="trash"></a>
```

***

## Button modifier

Use the modifier `.uk-icon-button` class on an `<a>` element to create an icon button, which can be used for social icons.

```html
<a href="" class="uk-icon-button" uk-icon="twitter"></a>
```

```example
<a href="" class="uk-icon-button uk-margin-small-right" uk-icon="twitter"></a>
<a href="" class="uk-icon-button  uk-margin-small-right" uk-icon="facebook"></a>
<a href="" class="uk-icon-button" uk-icon="google-plus"></a>
```

***

## Image modifier

You can also make any background image scale to the size of an icon. Just add the `.uk-icon-image` class and a background image path.

```example
<span class="uk-icon uk-icon-image" style="background-image: url(../docs/images/dark.jpg);"></span>
```

***

## Component options

Any of these options can be applied to the component attribute. Separate multiple options with a semicolon. [Learn more](javascript.md#component-configuration)

| Option  | Value  | Default | Description          |
|:--------|:-------|:--------|:---------------------|
| `icon`  | String | `''`    | The icon to display. |
| `ratio` | Number | `1`     | The icon size ratio. |

`icon` is the _Primary_ option and its key may be omitted, if it's the only option in the attribute value.

```html
<span uk-icon="heart"></span>
```

***

## JavaScript

Learn more about [JavaScript components](javascript.md#programmatic-use).

### Initialization

```js
UIkit.icon(element, options);
```
### Properties

#### svg

A JavaScript Promise that will resolve with the added SVG Node.

```js
UIkit.icon(element).svg.then(function(svg) { svg.querySelector('path').style.stroke = 'red'; })
```
