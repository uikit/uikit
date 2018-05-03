# Marker

<p id="toptext" class="uk-text-lead">Create a marker icon that can be displayed on top of images.</p>

## Usage

To apply this component, add the `uk-marker` attribute to any element. You can use the [Position component](position.md) to place the marker on top of an image. Also add the `.uk-transform-center` classes from the [Utility component](utility.md#transform) to center the marker itself to its upper left corner.

```html
<a href="" uk-marker></a>
```

**Note** Add the `.uk-light` or `.uk-dark` class, so that elements will be optimized for better visibility on dark or light images.

```example
<div class="uk-child-width-1-2" uk-grid>
    <div>
        <div class="uk-inline uk-dark">
            <img src="images/light.jpg" alt="">
            <a class="uk-position-absolute uk-transform-center" style="left: 20%; top: 30%" href="#" uk-marker></a>
            <a class="uk-position-absolute uk-transform-center" style="left: 60%; top: 40%" href="#" uk-marker></a>
            <a class="uk-position-absolute uk-transform-center" style="left: 80%; top: 70%" href="#" uk-marker></a>
        </div>
    </div>
    <div>
        <div class="uk-inline uk-light">
            <img src="images/dark.jpg" alt="">
            <a class="uk-position-absolute uk-transform-center" style="left: 20%; top: 30%" href="#" uk-marker></a>
            <a class="uk-position-absolute uk-transform-center" style="left: 60%; top: 40%" href="#" uk-marker></a>
            <a class="uk-position-absolute uk-transform-center" style="left: 80%; top: 70%" href="#" uk-marker></a>
        </div>
    </div>
</div>
```