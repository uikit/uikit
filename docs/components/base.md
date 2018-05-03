# Base

<p class="uk-text-lead">This component provides the default style for all HTML elements.</p>

## Normalize.css

The Base component utilizes styling of the famous [Normalize.css](http://necolas.github.io/normalize.css/) to render elements consistently across all browsers and applies its default styling like colors, margins, font-sizes and more.

**Note** [Form](form.md), [Button](button.md) and [Table](table.md) elements are not normalized or styled by default. This happens in their specific component class. UIkit tries to apply as little styling as possible to plain HTML elements in order to remain robust and conflict free with 3rd party CSS.

***

## Links

Turn text into hypertext using the `<a>` element. You can also add the `.uk-link` class to a `<span>` or similar element to apply the default link styling. For additional styling options, take a look at the [Link component](link.md).

***

## Text-level semantics

The following list gives you a short overview of the most commonly used text-level semantics and how to utilize them.

| Element    | Description                                                                                               |
|:-----------|:----------------------------------------------------------------------------------------------------------|
| `<abbr>`   | Define an abbreviation using the <abbr title="Title Text">abbr element with a title</abbr>.               |
| `<b>`      | Create bold text with the <b>b element</b>.                                                               |
| `<cite>`   | Define the title of a work with the <cite>cite element</cite>.                                            |
| `<code>`   | Define inline code snippets using the <code>code element</code>.                                          |
| `<del>`    | Mark document changes as deleted text using the <del>del element</del>.                                   |
| `<dfn>`    | Create a definition term using the <dfn title="Defines a definition term">dfn element with a title</dfn>. |
| `<em>`     | Emphasize text using the <em>em element</em>.                                                             |
| `<i>`      | Set off part of a text by using the <i>i element</i>.                                                     |
| `<ins>`    | Mark document changes as inserted text using the <ins>ins element</ins>.                                  |
| `<kbd>`    | Use a <kbd>keybord input element</kbd> to display input in the browser's default monospace font.          |
| `<mark>`   | Highlight text with no semantic meaning using the <mark>mark element</mark>.                              |
| `<q>`      | Define inline quotations using a <q>q element <q>inside</q> a q element</q>.                              |
| `<s>`      | Define text with a strikethrough using the <s>s element</s>.                                              |
| `<samp>`   | Define sample output with a <samp>samp element</samp>.                                                    |
| `<small>`  | De-emphasize text for small print using the <small>small element</small>.                                 |
| `<span>`   | Define an inline-container using the <span>span element</span>.                                           |
| `<strong>` | Imply extra importance using the <strong>strong element</strong>.                                         |
| `<sub>`    | Define subscript text using the <sub>sub element.</sub>.                                                  |
| `<sup>`    | Define superscript text using the <sup>sup element.</sup>                                                 |
| `<u>`      | Define underlined text using the <u>u element</u>.                                                        |
| `<var>`    | Define a variable using the <var>var element</var>.                                                       |

***

## Embedded content

Images and other elements like `<audio>`, `<canvas>`, `<img>`, `<svg>` and `<video>` are responsive by default in UIkit. If the layout is narrowed, they adjust their size and keep their proportions. To prevent this behavior, add the `.uk-preserve-width` class from the [Utility component](utility.md) to the element or any container.

Resize the browser window to see the responsive behavior of the image.

```example
<div class="uk-width-large">
    <img src="images/photo.jpg" alt="Image">
</div>
```

***

## Paragraphs

Create a paragraph by using the `<p>` element.

```example
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
```

***

## Headings

Use the `<h1>` to `<h6>` elements to define your headings.

Add the `.uk-h1`, `.uk-h2`, `.uk-h3`, `.uk-h4`, `.uk-h5` or `.uk-h6` class to alter the size of your headings, for example have a h1 look like a h3. For additional styling options, take a look at the [Heading component](heading.md).

```example
<h1>h1 Heading 1</h1>
<h2>h2 Heading 2</h2>
<h3>h3 Heading 3</h3>
<h4>h4 Heading 4</h4>
<h5>h5 Heading 5</h5>
<h6>h6 Heading 6</h6>
```

***

## Lists

Create an unordered list using the `<ul>` element and the `<ol>` element for ordered lists. The `<li>` element defines the list item. For additional styling options, take a look at the [List component](list.md).

```example
<ul>
    <li>Item 1</li>
    <li>Item 2
        <ul>
            <li>Item 1</li>
            <li>Item 2
                <ul>
                    <li>Item 1</li>
                    <li>Item 2</li>
                </ul>
            </li>
        </ul>
    </li>
    <li>Item 3</li>
    <li>Item 4</li>
</ul>
```

***

## Description list

Create a description list using the `<dl>` element. Use `<dt>` to define the term and `<dd>` for the description. For additional styling options, take a look at the [Description List component](description-list.md).

```example
<dl>
    <dt>Description lists</dt>
    <dd>A description list defines terms and their corresponding descriptions.</dd>
    <dt>This is a term</dt>
    <dd>This is a description.</dd>
    <dt>This is a term</dt>
    <dd>This is a description.</dd>
</dl>
```

***

## Horizontal rule

Create a horizontal rule by using the `<hr>` element. For additional styling options, take a look at the [Divider component](divider.md).

```example

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

<hr>

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

```

***

## Blockquote

To quote multiple lines of content from another source within your document, use the `<blockquote>` element.

```example
<blockquote cite="#">
    <p class="uk-margin-small-bottom">The blockquote element represents content that is quoted from another source, optionally with a citation which must be within a footer or cite element.</p>
    <footer>Someone famous in <cite><a href="#">Source Title</a></cite></footer>
</blockquote>
```

***

## Preformatted text

For multiple lines of code, use the `<pre>` element. It creates a new text block that preserves spaces, tabs and line breaks. Nest a `<code>` element inside to define the code block.

**Note** Be sure to escape any angle brackets to make sure enclosed code is not interpreted as markup.

```example
<pre><code>// Code example
&lt;div id="myid" class="myclass" hidden&gt;
    Lorem ipsum &lt;strong&gt;dolor&lt;/strong&gt; sit amet, consectetur adipiscing elit.
&lt;/div&gt;</code></pre>
```
