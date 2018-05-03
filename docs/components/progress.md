# Progress

<p class="uk-text-lead">Defines progress bars that indicate how far along a process is.</p>

## Usage

To apply this component, add the `.uk-progress` class to a `<progress>` element.

```html
<progress class="uk-progress" value="" max=""></progress>
```

```example
<progress id="js-progressbar" class="uk-progress" value="10" max="100"></progress>

<script>
    
    UIkit.util.ready(function () {
        
        var bar = document.getElementById('js-progressbar');

        var animate = setInterval(function () {

            bar.value += 10;

            if (bar.value >= bar.max) {
                clearInterval(animate);
            }

        }, 1000);

    });

</script>

```
