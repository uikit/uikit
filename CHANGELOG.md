# Changelog

## 3.24.2 (October 13, 2025)

### Added

- Add fit content width to Width component

### Fixed

- Fix overwriting default icons
- Fix scrollbar gutter stays visible in Modal component even though page is not scrollable
- Fix lazy loading YouTube/Vimeo videos in Video component in Safari
- Fix scoping css to handle `attr()` with `type()` function

## 3.24.1 (October 6, 2025)

### Fixed

- Fix icon overlay inverse selector in Icon component
- Fix Sass sources

## 3.24.0 (October 2, 2025)

### Added

- Add Overflow Fade component
- Add card overlay style modifier to Card component
- Add form size modifier for radio and checkbox to Form component
- Add icon overlay modifier to Icon component
- Add highest z-index utility class to Position component
- Add size modifier for top and bottom paddings to Section component
- Add `restart` option to Video component
- Add `hover-target` option to Video component

### Changed

- Remove font variables in favor of using heading classes in Countdown component
- Stretch the entire navbar height if an item's height is expanded by its content
- Scale height of responsive images and videos based on extrinsic aspect ratio and fill content box (Chrome only yet)
- Videos set to `preload: none` will lazy load by default now
- Dropnav component will flip vertically, when overflowing its scroll container

### Deprecated

- Deprecate `automute` option in Video and Cover component, use `muted` attribute for videos, `mute=1` for YouTube and `muted=1` for Vimeo instead

### Removed

- Remove deprecated flag in Less variables

### Fixed

- Fix disable color for span elements in Subnav component
- Fix text underline offset if text is vertical aligned to the middle in Link component
- Fix border color if visible toggle class is applied in Visibility component
- Fix text from wrapping onto multiple lines if elements should look like `input` or `select`

## 3.23.13 (September 11, 2025)

### Fixed

- Fix setting focus to Modal/Offcanvas Toggle component after close scrolls page
- Fix Slideshow/Slider components no longer autoplay if hidden
- Fix Drop component no longer delays showing if previous active Drop component is found
- Fix Scrollspy Nav component not detecting covering element correctly 

## 3.23.12 (August 18, 2025)

### Fixed

- Fix Scrollspy Nav ignores links

## 3.23.11 (June 25, 2025)

### Fixed

- Fix setting `aria-expanded` on the closest button of the Navbar Toggle Icon
- Fix SVG component handles base64 encoded data URIs correctly

## 3.23.10 (June 12, 2025)

### Fixed

- Fix Toggle component does not toggle if element is a link without `href` attribute
- Fix closing modal prevents page from being scrollable in Firefox

## 3.23.9 (June 3, 2025)

### Changed

- Add missing `aria-hidden` attribute in Icon component

## 3.23.8 (June 2, 2025)

### Changed

- Delay showing dropdowns in Dropnav and Navbar components to allow passing with the pointer over the element

### Fixed

- Fix setting focus to Modal/Offcanvas Toggle component after close
- Fix Dropnav component no longer opens its Drop components upon initial hover during page load (in Safari and Firefox)
- Fix Scrollspy Nav component no longer highlights items whose targets do not exist

## 3.23.7 (May 9, 2025)

### Fixed

- Fix Inverse component not being responsive for multiple target elements
- Fix tabindex not being set for Video component in `autoplay: hover` mode
- Fix browser lock up because of infinite component update loop

## 3.23.6 (April 10, 2025)

### Fixed

- Revert: Fix performance when transitioning element properties in Chrome (causes regression in Safari and Firefox)

## 3.23.5 (April 7, 2025)

### Fixed

- Fix regression with transitioning element properties not being applied

## 3.23.4 (March 26, 2025)

### Fixed

- Fix performance when transitioning element properties in Chrome

## 3.23.3 (March 17, 2025)

### Fixed

- Fix Grid component performance regression

## 3.23.2 (March 4, 2025)

### Fixed

- Fix min option in Height Viewport component

## 3.23.1 (February 19, 2025)

### Fixed

- Fix Safari 18.3 `:not(:has(...)) invalidation` issue causing hidden class not showing in Visibility component

## 3.23.0 (February 4, 2025)

### Added

- Add `property` option to Height Viewport component

### Changed

- IMPORTANT: Rename `minHeight` option to `min` in Height Viewport component

### Fixed

- Fix Toggle component does not toggle if element is a link without `href` attribute

## 3.22.4 (January 30, 2025)

### Added

- Add dropbar margin variable to Dropdown component

### Fixed

- Fix pressing arrow down key on nav item in Dropbar component opens Dropdown component 

## 3.22.3 (January 24, 2025)

### Fixed

- Fix vertical alignment for input of type date, time and datetime-local in Safari

## 3.22.2 (January 16, 2025)

### Fixed

- Fix missing list markers in Chrome in List component

## 3.22.1 (January 16, 2025)

### Changed

- Apply accordion item hook also to the first item

## 3.22.0 (January 9, 2025)

### Added

- Add `slidnav` option to disable slidenav to Lightbox component
- Add `nav` option to show a vertical thumbnav or dotnav to Lightbox component
- Add `counter` option to show counter with current item number and total number of items to Lightbox component
- Add `video-autoplay: inline` option to autoplay video without controls and muted to Lightbox component
- Add zoom behavior to images and inline videos if they are higher than the viewport to Lightbox component
- Allow `template` option to reference a `template` element in the DOM for the lightbox layout in Lightbox component
- Add hidden class to hide empty elements to Visibility component
- Add inverse style for form rang to Form component
- Add margin xsmall classes to Margin component
- Add horizontal margin variable to subnav pill in Subnav component
- Add text stroke class to Text component
- Add close-circle and arrow-down-arrow-up icons
- Add `reload` option to Countdown component
- Add `offset-end` option to Sticky component

### Changed

- IMPORTANT: Remove `@lightbox-toolbar-icon-*` and `@lightbox-button-*`from Lightbox component
- IMPORTANT: Rename `@lightbox-toolbar-*` to `@lightbox-caption-*` in Lightbox component
- IMPORTANT: Rename `@lightbox-item-color` to `@lightbox-color` in Lightbox component
- Set `delay-controls: 0` prevents hiding controls in Lightbox component
- Update default lightbox template in Lightbox component
- Change padding calculation of search box and search icon in Search component
- Change search style medium and large to look the same as default in Search component

### Fixed

- Fix spaces in the markup affecting the horizontal divider margin in Breadcrumb component

## 3.21.17 (January 7, 2025)

### Fixed

- Fix Navbar component not re-applying transparency after closing Drop component

## 3.21.16 (November 22, 2024)

### Fixed

- Fix regression in Scroll component

## 3.21.15 (November 22, 2024)

### Fixed

- Fix regression in SVG parsing

## 3.21.14 (November 21, 2024)

### Fixed

- Fix child components in Dropdown components toggling transparency in Navbar component
- Fix Navbar toggles Dropdown component when hovering with mouse on initial page load
- Fix Scrollspy Nav component checks if targets exists before activating state
- Fix Slideshow component list does not fill available space in Safari
- Fix hidden class keep showing elements on hover if a link is clicked in Visibility component
- Fix showing elements if an element has focus within in Transition component

## 3.21.13 (September 26, 2024)

### Fixed

- Fix `scrollIntoView()` for elements with `scroll-behavior: smooth`
- Fix Offcanvas in reveal mode unwraps itself

## 3.21.12 (September 9, 2024)

### Fixed

- Fix Sticky component not using `position: sticky` if parent has `overflow: clip`
- Fix Sticky component is now inactive if page can't be scrolled
- Fix using comma separated selectors in filter controls in Filter component
- Fix Video component does not autopause videos with autoplay set to false

## 3.21.11 (August 22, 2024)

### Fixed

- Fix regression in updating computed values (again)

## 3.21.10 (August 22, 2024)

### Fixed

- Fix regression in updating computed values

## 3.21.9 (August 1, 2024)

### Fixed

- Fix Sticky component calculates wrong top offset, when animation is in progress
- Fix rounding issue in Slider component in Firefox
- Fix calling `query()` and `queryAll()` with empty string throws exception

## 3.21.8 (July 25, 2024)

### Fixed

- Fix toggled hidden hover class to display elements on hover for touch devices using `tabindex` in  Visibility component
- Fix offsetViewport calculation if window is passed as scrollElement

## 3.21.7 (July 17, 2024)

### Fixed

- Fix offsetViewport calculation for browsers in quirks mode
- Fix selector engine to handle spaces within parentheses correctly
- Fix BC to component initialization not accepting plain html markup

## 3.21.6 (July 1, 2024)

### Fixed

- Fix Sticky component not resizing correctly if parent element has `display: contents`
- Fix Scrollspy Nav component to ignore anchor elements with `role="button"`
- Fix Drop component causes scroll position to jump when overflowing its scroll container

## 3.21.5 (June 3, 2024)

### Fixed

- Fix auto generating navigation in Slider and Slideshow component
- Fix Height Viewport component offset top option
- Fix keyboard navigation within input elements in Dropnav component dropdowns

## 3.21.4 (May 24, 2024)

### Added

- Add `target` option to Scrollspy Nav component

### Changed

- Scrollspy Nav component defaults to a 10vh active top offset

### Removed

- Remove `overflow` option from Scrollspy Nav component

### Fixed

- Fix Drop component does not immediately show if current active Drop is delaying
- Fix Scrollspy Nav falls back to document if target is not found

## 3.21.3 (May 22, 2024)

### Fixed

- Fix regression in Slideshow component

## 3.21.2 (May 22, 2024)

### Fixed

- Fix Slider component shows wrong slide after resizing
- Fix regression in Slideshow component not transitioning first slide

## 3.21.1 (May 21, 2024)

### Fixed

- Fix regression in observer handling

## 3.21.0 (May 17, 2024)

### Added

- Add new search navbar modifier to Search component

### Changed

- IMPORTANT: Rename `uk-search-navbar` class to `uk-search-medium`
- IMPORTANT: Rename `@search-navbar-*` variables to `@search-medium-*`
- IMPORTANT: Rename `@inverse-search-navbar-*` variables to `@inverse-search-medium-*`
- Rename old search navbar modifier to search medium in Search component

### Fixed

- Fix clickable search icon not being in natural ordering for sequential focus navigation

## 3.20.11 (May 17, 2024)

### Fixed

- Fix regression in Sortable component

## 3.20.10 (May 13, 2024)

### Removed

- Remove `removeClasses()` util function

### Fixed

- Fix slide transition in Slider component in Safari

## 3.20.9 (May 8, 2024)

### Added

- Add color mode `--uk-inverse` property in all components

### Fixed

- Fix race condition in Slider/Slideshow component
- Fix prompts with double quotes in Modal component
- Fix infinite loop in Slider component

## 3.20.8 (April 26, 2024)

### Fixed

- Fix check for `Elemenent.prototype.checkVisibility` function
- Fix filter animations in Safari

## 3.20.7 (April 24, 2024)

### Fixed

- fix: revert adding esm build for now (breaks resolving logic)

## 3.20.6 (April 24, 2024)

### Fixed

- Fix missing esm dist files in package

## 3.20.5 (April 24, 2024)

### Fixed

- Fix missing esm export for icons

## 3.20.4 (April 24, 2024)

### Fixed

- Fix missing esm export

## 3.20.3 (April 24, 2024)

### Fixed

- Fix regression in none browser environment

## 3.20.2 (April 24, 2024)

### Changed

- Make gutter overridable through grid classes in Iconnav and Thumbnav components

### Fixed

- Fix Switcher component may show multiple items if toggled while previous animation in progress
- Fix regression in selector engine

## 3.20.1 (April 23, 2024)

### Fixed

- Fix regression in Inverse component

## 3.20.0 (April 23, 2024)

### Changed

- Improve query selector performance 🏎
- Queue updates on microtask instead of animation frame to ensure more immediate updates

### Removed

- Remove deprecated `closest()` and `within()` functions

### Fixed

- Fix lazy loading on target in Toggle component

## 3.19.4 (April 9, 2024)

### Added

- Add `hover` mode to `autoplay` option in Video component

## 3.19.2 (March 12, 2024)

### Added

- Add center vertical and horizontal classes to Position component

### Fixed

- Fix `scrollIntoView()` when target is covered by another element

## 3.19.1 (March 1, 2024)

### Added

- Add Bluesky icon

### Fixed

- Fix Video component handles fullscreen mode correctly

## 3.19.0 (February 29, 2024)

### Added

- Add breakpoint classes for flex direction, dimension and alignment
- Add `active` option to Slider component

### Changed

- Remove obsolete fix for rounding issues in Width component in IE11/Edge

### Fixed

- Fix width expand classes mixed with other width classes of higher breakpoints in Width component
- Fix combination of width auto and expand breakpoint classes
- Fix logo inverse selector to work with different types of images
- Fix Tooltips not showing in iOS
- Fix parallax scrolling for Slideshow/Slider component with finite mode
- Fix Slider component disables infinite scrolling prematurely
- Fix Sass sources by renaming spin() (LESS) to adjust-hue() (Sass)
- Fix Height Match component recalculates its heights, when a font has loaded

## 3.18.3 (February 13, 2024)

### Fixed

- Fix dropbar offset in Navbar component
- Fix autoplay option in Lightbox component
- Fix height in Height Placeholder component
- Fix Height Match component to use viewport dimensions as base again

## 3.18.2 (February 9, 2024)

### Fixed

- Fix wrong dropbar offset in Navbar component
- Fix conflict if multiple Dropnav components share the same container

## 3.18.1 (February 7, 2024)

### Changed

- Close modal if contained video leaves fullscreen mode

### Fixed

- Fix Video component does not pause video if it enters fullscreen mode
- Fix page scrolls while sorting in Sortable component
- Fix horizontally overflowing elements are not scrollable in Modal component
- Fix Height Match component applied to SVG elements

### Removed

- Remove Pagekit CMS icon

## 3.18.0 (January 30, 2024)

### Added

- Add parallax options to Slider and Slideshow components
- Add Inverse component to color content with no background depending on intersecting elements beneath
- Add color mode for default and muted style modifiers in Section, Tile, Card and Overlay components
- Add Height Placeholder component
- Add size modifier to Nav component
- Add link external and arrow up right icons
- Add X, Mastodon, Telegram, Threads, Signal and YOOtheme icons

### Changed

- Replace `none` with `dark` as default for navbar, dropdown and dropbar color modes
- Twitter icon will show X icon
- Responsive component uses `aspect-ratio` if available

### Fixed

- Fix icons task on Windows
- Fix Height Match component uses offsetHeight as base

## 3.17.11 (November 21, 2023)

### Fixed

- Fix Tooltip component not hiding when used with delay

## 3.17.10 (November 17, 2023)

### Fixed

- Fix Tooltip component initialized programmatically
- Fix Tooltip component not hiding on blur

## 3.17.9 (November 16, 2023)

### Changed

- Improve Tooltip performance

### Deprecated

- Deprecate `closest()` and `within()` functions

### Fixed

- Fix `scrollIntoView()` function scrolls to wrong position
- Fix Drop and Modal based components remain open when anchor click targets element within

## 3.17.8 (November 2, 2023)

### Fixed

- Fix build

## 3.17.7 (November 2, 2023)

### Added

- Add `uk-transition-disable` utility class to Transition component

### Fixed

- Fix disabling transition during Sticky component size recalculation

## 3.17.6 (October 25, 2023)

### Fixed

- Fix regression in Video component causing videos to autoplay with `autoplay` set to `false`

## 3.17.5 (October 24, 2023)

### Deprecated

- Deprecate `isInView()` and `intersectRect()` functions
- Deprecate `target-offset` option in Sticky component

### Changed

- Video component uses IntersectionObserver only

### Fixed

- Fix Scroll component not detecting covering element correctly

## 3.17.4 (October 18, 2023)

### Fixed

- Fix filter animation fade

## 3.17.3 (October 17, 2023)

### Fixed

- Fix Grid component applies `uk-grid-stack` class wrongly

## 3.17.2 (October 16, 2023)

### Fixed

- Fix `scrollIntoView()` function uses offset left to detect elements that would cover target
- Fix Height Match component recalculates its heights, when a font has loaded

## 3.17.1 (October 5, 2023)

### Fixed

- Fix icon alignment in Pagination component
- Fix Sticky component overflow scrolling position on resize
- Fix Cover component no longer uses inline style

## 3.17.0 (September 28, 2023)

### Added

- Add modes `pack` (default) and `next` to Grid component's `masonry` option
- Add `parallax-start`, `parallax-end`, `parallax-justify` option to Grid component
- Add `close-on-scroll` option to Drop and Dropdown component
- Add transparent Navbar gets its color modifier from underlying section
- Add support for `<td>` and `<tr>` elements to `fragment()` function
- Add 3XL size modifier to Heading component
- Add support for a CSS Selector in `offsetTop` option in Height Viewport component

### Change

- Scroll component scrolls beneath elements covering its target
- The `closest()` function no longer accepts an array of elements
- Reset fieldset min-width

## 3.16.27 (September 28, 2023)

### Fixed

- Fix Height Viewport component not observing viewport changes with `expand: true`
- Fix passing a `vh` unit to option `scale` relates to element's height in Parallax component

## 3.16.26 (August 28, 2023)

### Fixed

- Fix minified build to use template-strings too

## 3.16.25 (August 28, 2023)

### Added

- Add `-source` argument to `prefix` command

### Fixed

- Fix Toggle in hover mode does not trigger when scrolling in Firefox
- Fix Parallax component stop parsing

## 3.16.24 (August 1, 2023)

### Fixed

- Fix delayed show in Drop component shows drop, although toggle is no longer hovered
- Fix regression in Slider component
- Fix disconnecting Sticky component

## 3.16.23 (July 26, 2023)

### Fixed

- Fix potential rounding issues in `offset()` function, when used as setter
- Fix to ensure Slider items have `max-width: 100%`
- Fix Dropdowns in Dropnav and Navbar components are initialized too late causing CLS

## 3.16.22 (June 22, 2023)

### Fixed

- Fix existing notification container has to be visible before appending notification

## 3.16.21 (June 13, 2023)

### Fixed

- Fix release changelog

## 3.16.20 (June 13, 2023)

### Fixed

- Fix Toggle component with `cls` option in hover mode
- Fix `aria-roledescription` attribute in Slider nav component

## 3.16.19 (May 24, 2023)

### Fixed

- Fix Parallax component responsiveness on resize of scroll container

## 3.16.18 (May 22, 2023)

### Changed

- Modal prompt dialog selects text in input
- Sticky component sets position context with `!important` modifier

### Fixed

- Fix keyboard navigation in Navbar component

## 3.16.17 (May 9, 2023)

### Added

- Add i18n labels for Search Icons

### Fixed

- Fix Toggle component uses anchor element's hash as target fallback

## 3.16.16 (May 8, 2023)

### Removed

- Remove `Deferred` util class

### Fixed

- Fix auto pausing videos in Video component
- Fix Tooltips are not removed from Dom if showing is prevented
- Fix Switcher component not initializing properly
- Fix Tooltip generates duplicate id
- Fix calculating sets in Slider component with `center` option enabled
- Fix JavaScript error in Parallax component

## 3.16.15 (April 14, 2023)

### Fixed

- Fix Drop component height if `inset: true` and `stretch: true`
- Fix Drop component `maxWidth` property with fractional viewport view
- Fix Sticky component listens for resize of itself as long as no transition is in Progress

## 3.16.14 (April 6, 2023)

### Changed

- Make Navbar/Dropnav items tabbable again

### Fixed

- Fix using `rgb` and `rgba` values in color stops in Parallax component
- Fix setting `will-change` css property in Parallax component for camelCased props
- Fix Slider removes `tabindex` from focusable elements in slides
- Fix class `uk-svg` gets added to `<svg>` element only in Svg component

## 3.16.13 (March 28, 2023)

### Fixed

- Fix Sass sources
- Fix Scrollspy Nav component updates state once shown

## 3.16.12 (March 27, 2023)

### Fixed

- Fix push history state in Scroll component if href differs from current url only

## 3.16.11 (March 24, 2023)

### Changed

- Remove roles `menubar` and `menuitem` from Navbar component
- Add `watch` to component options API

## 3.16.10 (March 20, 2023)

### Fixed

- Fix including UIkit scripts at the end of `body` element

## 3.16.9 (March 18, 2023)

### Fixed

- Fix reactivity in Toggle component
- Fix regression in Scrollspy component

## 3.16.8 (March 17, 2023)

### Fixed

- Fix focus style for dropdowns when used with Inverse component
- Fix regression in Lightbox component

## 3.16.7 (March 16, 2023)

### Added

- Add hidden visually class for assistive technologies to Visibility component
- Make toggle classes to display elements on hover or focus accessible to screen readers in Visibility component

### Changed

- Change boot behavior: if script is loaded synchronous, UIkit boots as soon as body element is available

### Fixed

- Fix component distributions
- Fix Slider/Slideshow component autoplay in Firefox
- Fix using input of type range in Modal component on touch devices
- Fix accessibility in Slideshow/Slider and Nav component
- Fix prevent initial transition in Sticky component
- Fix keyboard navigation in Navbar component
- Fix importing UIkit in Next.js

## 3.16.6 (March 10, 2023)

### Fixed

- Fix Sass sources
- Fix `createComponent` call without `element` parameter

## 3.16.5 (March 10, 2023)

### Fixed

- Fix functional component initialization
- Fix `pause-on-hover` option in Slider/Slideshow component

## 3.16.4 (March 8, 2023)

### Added

- Add `observe` to component options API

### Fixed

- Fix default i18n option for Modal dialogs
- Fix Slideshow initially shows last slide first
- Fix Height Match component does not change height while updating
- Fix Slider reactivity when a slide is hidden/shown
- Fix Scroll component correctly changes history state

## 3.16.3 (February 27, 2023)

### Fixed

- Fix object type coercion

## 3.16.2 (February 27, 2023)

### Fixed

- Fix event delegation did not delete `current` property causing parent event handler to trigger
- Fix focusable elements within none visible slides are no longer focusable in Slider component
- Fix opened Drop component prevents smooth scrolling of document on iOS

## 3.16.1 (February 23, 2023)

### Fixed

- Fix missing dropnav.scss file from dist

## 3.16.0 (February 23, 2023)

### Added

- Add WAI-ARIA roles, states and properties to interactive JavaScript components
- Add WAI-ARIA keyboard interaction pattern to interactive JavaScript components
- Add language internationalization (i18n) for interactive JavaScript components
- Add `i18n` option to corresponding JavaScript components
- Add Dropnav component
- Add parent icon to Drop component
- Add support for YouTube Shorts URLs in Lightbox component
- Add Android, Android Robot, Apple and Microsoft icons
- Add `uikit:init` event triggered on document before components initialize
- Add `countdownstart`, `countdownstop` and `countdownend` events to Countdown component

### Changed

- IMPORTANT: Remove `.uk-dropdown-close` from Dropdown component. Use `uk-drop-close` instead
- IMPORTANT: Remove `.uk-dropdown-grid` from Dropdown component. Use `uk-drop-grid` instead
- IMPORTANT: Remove `.uk-navbar-dropdown-close` from Navbar component. Use `uk-drop-close` instead
- IMPORTANT: Remove `.uk-navbar-dropdown-grid` from Navbar component. Use `uk-drop-grid` instead
- IMPORTANT: Remove error message options in Upload component, use `i18n` option
- IMPORTANT: Rename `labels` default property and option on `UIkit.modal` to `i18n`
- Move functional CSS from Dropdown, Dropbar and Navbar component to Drop component

### Removed

- Remove `ajax()` util function, use native `fetch` instead
- Remove `getImage()` util function

## 3.15.25 (February 23, 2023)

### Fixed

- Fix Dropbar partially closing before opening when switching between Navbar items
- Fix Parallax component updating too late during slide animation in Filter component

## 3.15.24 (February 9, 2023)

### Fixed

- Fix Tooltip component appends to `container` option, prevents margins in scroll container
- Fix regression in `scrollParents` function

## 3.15.23 (February 1, 2023)

### Fixed

- Fix prevent background scrolling in Safari

## 3.15.22 (January 19, 2023)

### Added

- Add Eye and Eye Slash icons

### Changed

- Update Lifesaver, Paint Bucket and Video Camera icons to fit outline style

### Fixed

- Fix Scroll component scrolls to elements by name
- Fix Tooltip appends itself to the closest scroll container if within element referenced by `container` option

## 3.15.21 (January 12, 2023)

### Added

- Add larger gap on larger viewports to Navbar component in UIkit theme
- Add gradient for text background to Text component in UIkit theme
- Add gradient for thumbnav item to Thumbnav component in UIkit theme

## 3.15.20 (January 5, 2023)

### Changed

- Improve close icon not overlaying content in Modal component in UIkit theme

### Fixed

- Fix nav in Dropdown component not overriding properties of Nav component
- Fix disable native position sticky in Sticky component if parents `overflow` is not set to visible
- Fix Drop positioning

## 3.15.19 (December 20, 2022)

### Changed

- `removeAttr` no longer accepts a space separated list of attribute names

### Fixed

- Fix stacking context if using `position: sticky` in Sticky component
- Fix height calculation for `box-sizing: border-box` on Accordion content
- Fix error in console if image can't be loaded in Svg component with `stroke-animation: true`
- Fix `scrollIntoView()` no longer considers elements with `position: clip` as scrollable parents
- Fix Slider shows not centered initially with `center: true`

## 3.15.18 (December 13, 2022)

### Fixed

- Fix positioning of Tooltip and Drop components if target is inline element
- Fix Sticky component resizing on `clsBelow` class causes stutter
- Fix Sticky component correctly resets on becoming inactive
- Fix detection of finite mode in Slider component with `center` option enabled

## 3.15.17 (December 6, 2022)

### Fixed

- Fix detecting unit in Parallax component stops

## 3.15.16 (December 5, 2022)

### Changed

- Add `will-change` css property to Parallax elements

### Fixed

- Fix for elements with `position: sticky` to keep their position when Offcanvas is opened
- Fix regression in clicking hash links in Modal component that match `sel-close` option
- Fix jump after animation if Accordion content has `padding-bottom`
- Fix Sticky listens for resize of itself while not positioned `fixed`
- Fix Sticky positioning on mobile devices

## 3.15.15 (December 1, 2022)

### Changed

- Remove `offsetTop` and `offsetLeft` options from Image and Scrollspy component. Use `margin` instead.
- Sticky component uses native `position: sticky` if possible

### Fixed

- Fix Scroll and Scrollspy Nav components handle same site links only
- Fix Drop positioning within not scrollable viewport
- Fix overscroll behavior in Dropbar
- Fix conversion of viewport height units with `toPx()` on mobile devices

## 3.15.14 (November 21, 2022)

### Fixed

- Fix error thrown when keyboard navigating Navbar component

## 3.15.13 (November 17, 2022)

### Fixed

- Fix Sticky component does not reset width on resize

## 3.15.12 (November 4, 2022)

### Added

- Add `uikit:init` event triggered on document before components initialize

### Fixed

- Fix placeholder has no width if Sticky element's width depends on its content
- Fix Slider/Slideshow Parallax respect `media` option
- Fix Video component with `autoplay: true` no longer resumes autoplay on scroll after being paused
- Fix width/height passed through `attrs` to video item in Lightbox component
- Fix regression in Sortable component (elements are hidden after sorting)

## 3.15.11 (October 25, 2022)

### Added

- Add Crosshairs icon

### Removed

- Remove `focusable` option from Icon and SVG component

### Fixed

- Fix content not focusable with keyboard in Scrollspy component
- Fix removing Lightbox causes JavaScript error
- Fix cases where Switcher component wouldn't correctly initialize in Chrome
- Fix Drop component positioning if target and element are not within same scroll parent

## 3.15.10 (September 21, 2022)

### Fixed

- Fix regression in Filter component animation
- Fix case where UIkit breaks if a form with an input named `attributes` exits

## 3.15.9 (September 19, 2022)

### Fixed

- Fix WAI-ARIA rules for Tooltip component
- Fix slide animation in Sortable component
- Fix input fields reverting to previous value while sorting in Sortable component

## 3.15.8 (September 14, 2022)

### Fixed

- Fix column break within the list item in List component
- Fix Toggle component when using mouse and keyboard simultaneously
- Fix register passive event handler in Slider component

## 3.15.7 (September 13, 2022)

### Changed

- Improve Accordion component keeps toggle in view when toggling

### Fixed

- Fix Slider drag stops on scroll now

## 3.15.6 (August 31, 2022)

### Changed

- Modal closes on click on hash links

### Fixed

- Fix check for selectable Text in Slider drag
- Fix reactivity in Switcher component

## 3.15.5 (August 24, 2022)

### Fixed

- Fix accordion items wrap themselves during transition
- Fix regression in Video component (no autoplay if within a Scrollspy)

## 3.15.4 (August 23, 2022)

### Fixed

- Fix detecting unit in Parallax component stops
- Fix regression in transition animations in Drop component
- Fix regression in Filter component

## 3.15.3 (August 12, 2022)

### Changed

- Remove divider from nav header for divider modifier in Nav component

### Fixed

- Fix Slideshow no longer completely resets upon adding slides

## 3.15.2 (August 8, 2022)

### Added

- Add `boundary-x` and `boundary-y` options to Drop component

### Fixed

- Remove click event listener in Scroll component correctly

## 3.15.1 (July 15, 2022)

### Changed

- Video component will set `allow="autoplay"` on iframe elements
- Allow additional props to be set on Navbar component to initialize its Drops with

### Fixed

- Fix Navbar component resize does not trigger reposition of dropbar
- Fix register scroll listener as passive

## 3.15.0 (July 11, 2022)

### Added

- Add Dropbar component
- Add `target`, `target-x`, `target-y` and `inset` options to Drop component
- Add `stretch` and `bg-scroll` options to Drop component
- Add `shift` option to Drop component
- Add `slide` and `reveal` animations to Drop component
- Add `animate-out` option to Drop component
- Add open and close animation to toggle icon in Navbar component
- Add dropdown large modifier to Dropdown and Navbar component
- Add gap variables to navbar items in Navbar component
- Add color mode variables for dropdowns in Dropdown and Navbar component
- Add navbar parent icon to Navbar component
- Add secondary style modifier to Nav component
- Add font size variables to nav and sublist in Nav component
- Add padding variables for small breakpoint to Modal component
- Add zero z-index utility class to Position component
- Add support for `picture` element to logo in Utility component
- Add box sizing classes to Utility component
- Support scroll parent as viewport in Height Viewport component
- Add ARIA `role="alert"` to Notification component

### Changed

- IMPORTANT: Remove `.uk-nav-parent-icon` from Nav component. Use `uk-nav-parent-icon` attribute on items instead
- IMPORTANT: Remove `*-justify` in `pos` option from Drop and Dropdown components. Use new `stretch` option instead
- IMPORTANT: Remove `boundary-align` option from Drop and Dropdown components. Use new `target` option instead
- IMPORTANT: Change `flip` option values in Drop and Dropdown components. Use new `shift` option too
- IMPORTANT: Remove `display` option in Drop and Dropdown components. Use new `auto-update` option instead.
- IMPORTANT: Rename `@offcanvas-bar-width-m` to `@offcanvas-bar-width-s`
- IMPORTANT: Rename `@offcanvas-bar-padding-vertical-m` to `@offcanvas-bar-padding-vertical-s`
- IMPORTANT: Rename `@offcanvas-bar-padding-horizontal-m` to `@offcanvas-bar-padding-horizontal-s`
- IMPORTANT: Rename `@nav-primary-item-font-size` to `@nav-primary-font-size`
- IMPORTANT: Rename `@nav-primary-item-line-height` to `@nav-primary-line-height`
- IMPORTANT: Rename `@navbar-dropdown-dropbar-margin-top` to `@navbar-dropdown-dropbar-padding-top`
- IMPORTANT: Rename `@navbar-dropdown-dropbar-margin-bottom` to `@navbar-dropdown-dropbar-padding-bottom`
- IMPORTANT: Remove style from `.uk-navbar-dropbar`. Now uses `uk-dropbar`

### Removed

- Remove `getCssVar()` utility function

### Fixed

- Fix body is no longer scrollable in Modal component with overlay
- Fix `offsetPosition()` adds `border-top` of offsetParents
- Fix dragging in Slider component on iOS
- Fix Drop component no longer flips, if it does not fit into scroll area
- Fix Drop component alignment within Dropbar
- Fix ensure write updates aren't called if component is already disconnected
- Fix Offcanvas component no longer overflows document if isn't wide enough
- Remove margin from the last-child within dropdowns in Dropdown and Navbar components

## 3.14.3 (May 27, 2022)

### Fixed

- Fix compatibility with iOS < 14
- Fix regression in Parallax component

## 3.14.2 (May 27, 2022)

### Fixed

- Fix logo image not working with text align in Utility component
- Fix Scroll component on iOS 12
- Fix offset calculation in Drop component
- Fix `-justify` positioning in Drop component
- Fix Dropbar handles resizing Drop components
- Fix Toggle component in `mode:media` default prevents click event
- Fix Toggle component not default preventing touch click on anchor with closed target
- Fix Parallax component background image positioning
- Make content clickable for sticky cover and reveal effects
- Revert: Height Viewport component sets `uk-height-viewport` class to reduce initial layout shifts

## 3.14.1 (May 3, 2022)

### Added

- Add `box-shadow` to `toggleHeight()` hide properties
- Add adaptive velocity to Alert and Accordion components

### Changed

- Set `transition` option to `ease` by default in Togglable mixin

### Fixed

- Fix toggling accordion item while transition is in progress
- Fix Drop positioning with `boundaryAlign: true`
- Fix Scrollspy component not triggering in some cases
- Fix Slider component showing wrong initial index

## 3.14.0 (April 27, 2022)

### Added

- Add position shifting to Drop and Dropdown components
- Add axis flipping if overflowing on both sides to Drop and Dropdown components
- Add `max-width` to prevent overflowing the viewport to Drop and Dropdown components
- Add `display` option to Drop and Dropdown components
- Add support for negative `start` value in Sticky component
- Add `overflow-flip` option to Sticky component
- Add navbar justify to Navbar component
- Add subtitle classes to Nav, Dropdown and Navbar components
- Add support for `vw`,`vh`,`%` and `px` units to scale property in Parallax component
- Add resize horizontal class to Utility component

### Changed

- Rename `top` and `bottom` options to `start` and `end` in Sticky component
- Allow text to wrap into the next line for navs in Dropdown component

### Removed

- Remove `position: auto` option in Sticky component, use `overflow-flip` option instead
- Remove `overflow-x: hidden` on html element, while horizontal animation is active

### Fixed

- Fix dropbar dropdown alignment if boundary-align is true
- Fix viewport helper functions take border into account
- Fix Sticky component responsiveness on window resize
- Fix Cover component correctly applies ratio if only one of width/height is provided
- Fix responsiveness in Grid, Margin and Height Match component

## 3.13.10 (April 20, 2022)

### Fixed

- Revert: Fix reposition Drop on scroll
- Fix Toggle component does not `defaultPrevent()` click on anchor with touch gesture
- Fix Sticky component uses wrong offsetParent while it's positioned fixed

## 3.13.9 (April 20, 2022)

### Fixed

- Fix release

## 3.13.8 (April 20, 2022)

### Changed

- Scrollspy component uses IntersectionObserver instead of scroll/resize events

### Fixed

- Fix Drop/Dropdowns component does not close on clicked `.uk-(drop|dropdown)-close` selector
- Fix Accordion initially not closed
- Fix Height Match component not matching correctly
- Fix Margin component does not correctly listen for resize
- Fix regression in Sticky component affecting height of placeholder
- Fix Toggle not toggling after re-entering button with mouse before drop has closed itself
- Fix reposition Drop on scroll

## 3.13.7 (April 1, 2022)

### Fixed

- Fix regression in Drop component not updating its width if alignment is set to `justify`
- Fix regression in Height Match component not updating its height when resized

## 3.13.6 (April 1, 2022)

### Removed

- Image component no longer sets a `background-size` for elements with `background-size` set to `auto`

### Fixed

- Fix Position component
- Fix regression in Upload component with `multiple` option disabled
- Fix regression in Height Viewport component with `expand` option enabled
- Fix regression in Slider/Slideshow Parallax

## 3.13.5 (March 28, 2022)

### Fixed

- Fix regression in Drop component's `offset` option
- Fix initial values for `@navbar-dropdown-margin` and `@navbar-dropdown-dropbar-margin-top`

## 3.13.4 (March 25, 2022)

### Fixed

- Fix Tooltip margin

## 3.13.3 (March 25, 2022)

### Fixed

- Fix importing UIkit in Next.js

## 3.13.2 (March 25, 2022)

### Changed

- Use custom property for direction offset in components based on Position mixin
- Add max-width to drops in Drop, Dropdown and Navbar components

### Removed

- Remove dropbar push mode from Navbar component

### Fixed

- Fix dropbar dropdown alignment
- Fix dropbar dropdown top margin flickering
- Fix Switcher component with disabled toggles
- Fix responsiveness in Responsive component
- Fix video autoplay
- Fix importing UIkit in Next.js

## 3.13.1 (March 18, 2022)

### Fixed

- Fix Switcher component with disabled toggles
- Fix regression in Cover component

## 3.13.0 (March 18, 2022)

### Added

- Add support for `<img>` element to icon image class in Icon component

### Changed

- Improve performance for large sites
- Custom components have to listen for `resize` and `scroll` updates manually

### Removed

- Remove Edge Legacy (EdgeHTML) support
- Remove Safari fallback for `focus-visible`
- Remove deprecated Gif component
- Remove option `width-element` in Sticky component

### Fixed

- Fix list bullet regression in List component
- Fix regression in Modal component with `uk-modal-dialog` class
- Fix Sticky component notices change in its offset parent's position
- Fix Scrollspy component does not apply animation classes on hide

## 3.12.2 (March 14, 2022)

### Fixed

- Fix regression in Slider/Slideshow touch gestures

## 3.12.1 (March 14, 2022)

### Fixed

- Fix List component used with flex utility classes

## 3.12.0 (March 14, 2022)

### Added

- Add support for `<picture>` element to Image component
- Add `sources` option to emulate `<picture>` element for background images to Image component
- Add `loading` option to avoid lazy loading background images in first visible viewport to Image component
- Add support for `loading="lazy"` attribute to SVG component
- Add `position` option with `top`, `bottom` and `auto` values to Sticky component
- Add support for basic math operands in `offset` option of Sticky component
- Add animation stop positions to Parallax component
- Add object fit and position classes to Utility component
- Add height viewport classes to Height component

### Changed

- Image elements need `width` and `height` attributes to prevent layout shifts
- Image component no longer relies on session storage to check for cached images to immediately show an image
- Slider and Switcher remove native `loading="lazy"` attribute from adjacent slides
- Accordion, Drop, Switcher and Toggle remove native `loading="lazy"` attribute from their children when entering the viewport
- Improve sticky behavior if sticky content is larger than the viewport
- Sticky component's `bottom` option checks for bottom padding if sticky element is within referenced element
- Height Viewport component sets `uk-height-viewport` class to reduce initial layout shifts

### Deprecated

- Deprecate `uk-img` for `<img>` element: Use native `loading="lazy"` attribute instead

### Removed

- Remove IE11 support
- Remove `data-width` and `data-height` for `<img>` element from Image component. Use native attributes instead.

### Fixed

- Fix infinite sliding in Slider component with equally sized slides
- Fix Slider component sets calculation
- Fix dropdowns not closing in Navbar component when hovering dropbar and navigation with keyboard
- Fix dropdown no longer closes if pointer is still moving towards it
- Fix `fadein` not transformed correctly to `fade-in` in scss build
- Fix Sticky component setting wrong margin for placeholder
- Fix Sticky placeholder sets height with fraction
- Fix Sticky component does not animate in if scroll position equals top offset
- Fix Sticky component prevents transition on `selTarget` if forced to hide for recalculation
- Fix Parallax component initial jump in background image

## 3.11.1 (February 7, 2022)

### Fixed

- Fix scoping css to exclude `:root` selector
- Fix `toPx()` correctly uses offsetHeight/Width

## 3.11.0 (February 7, 2022)

### Added

- Add `start` and `end` options to Parallax component
- Add negative z-index utility class to Position component
- Add Sticky Parallax test

### Deprecated

- Deprecate `viewport` option in Parallax component: Use `end` option instead

### Fixed

- Use same position context when uk-sticky sticks or not
- Fix interdependent computed properties being evaluated too often
- Fix `getIndex()` returns `-1` instead of `NaN` if called with empty elements parameter
- Fix Scrollspy component no longer sets class `false`
- Fix Parallax component no longer rounds values to two digits after comma
- Fix Parallax component running backwards with 'viewport' option set to a value < 1
- Fix Parallax component easing option for values < -1 || > 1

## 3.10.1 (January 19, 2022)

### Fixed

- Fix vertical divider width in Divider component
- Fix usage of `data-` prefix for Cover and Responsive component
- Fix pointer events for iframes in Cover component
- Fix Slideshow component no longer throws if items list does not exist
- Fix space key no longer triggers Toggle on `<input>` element

## 3.10.0 (January 12, 2022)

### Added

- Add intrinsic widths to Width component
- Add 'aria-haspopup' attribute to Drop component's toggle
- Add padding variable to search icon in Search component
- Add position bottom variable to box-shadow bottom in Utility component

### Changed

- Disable Sticky component if it's element is higher than viewport

### Fixed

- Fix initial iframe width for `uk-responsive` which caused an expanded viewport on iOS devices
- Fix link toggle style if not hovered
- Fix compiling Slideshow css in rtl mode
- Fix Sortable component no longer scrolls `overflow: hidden` containers
- Fix 'yarn watch' not watching changes in less files
- Fix `domPath()` for elements within forms that include inputs with name 'id'

## 3.9.4 (November 25, 2021)

### Fixed

- Fix Sticky position when bottom option is used

## 3.9.3 (November 18, 2021)

### Fixed

- Fix logo image alignment if logo line-height is larger than the image

## 3.9.2 (November 11, 2021)

### Fixed

- Fix build scripts for Windows users
- Fix css in Leader component
- Fix division deprecation warnings in Sass source

## 3.9.1 (November 10, 2021)

### Changed

- Update Less mixin calls to use parentheses

## 3.9.0 (November 10, 2021)

### Changed

- Upgrade Less to version 4

## 3.8.1 (November 5, 2021)

### Added

- Add Less variables for outline style

### Changed

- Make padding large a little bigger on small devices
- Change logo color to 'emphasis'

### Fixed

- Fix scrollIntoView function with offset argument provided

## 3.8.0 (October 28, 2021)

### Changed

- Refactor focus styles to use `focus-visible` in all components
- Use custom properties in Position component
- Make transition classes work with position or cover classes on the same element
- Refactor animation component

### Changed

- Improve sticky performance when bottom option is used

### Fixed

- Revert setting focus to modal/offcanvas toggle after close

## 3.7.6 (October 8, 2021)

### Fixed

- Fix Drop closing if clicked within through touch event
- Fix Slider not animating slides if slide wider than slide container

## 3.7.5 (October 5, 2021)

### Change

- Improve Cover component performance if applied to none video

### Fixed

- Fix toggle behavior in Toggle component
- Fix Toggle component no longer sets tabindex in media mode

## 3.7.4 (September 23, 2021)

### Added

- Add itemNav option to Switcher component

### Changed

- Focus modal/offcanvas upon opening

### Fixed

- Fix regression in Toggle component
- Fix keyboard navigation in Navbar component
- Fix navbar toggle style and navbar item inverse style if dropdown is open

## 3.7.3 (September 9, 2021)

### Added

- Add tile hover hooks

### Fixed

- Fix toggle behavior in Toggle component
- Fix navbar item style if dropdown is open and container option is used

## 3.7.2 (August 6, 2021)

### Fixed

- Fix text alignment if tabs are left or right aligned in Tab component

## 3.7.1 (July 15, 2021)

### Fixed

- Fix animation classes only partially being removed in Scrollspy component
- Fix scrollIntoView did not return Promise if element is hidden

## 3.7.0 (June 29, 2021)

### Added

- Add text decoration modifier to Text component
- Add width variable to range thumb in to Form Range component
- Add Bag icon

### Changed

- Change default search width and horizontal padding in Search component
- Change badge width and font size in Badge component
- Change button link color and text decoration in Button component
- Change card badge height in Card component
- Remove margin from the navbar item last-child in Navbar component
- Add white space gap for navbar item in Navbar component
- Allow text after icon in Iconnav component

### Removed

- Remove badge hover color variable in Badge component

### Fixed

- Fix input type list showing picker indicator in Chrome
- Fix focus background in Form and Search component
- Fix form size modifier for textarea in Form component
- Fix icon alignment in Nav, Subnav and Tab components
- Fix default dropdown selector in Navbar component
- Fix show behavior in Drop component for multiple toggles
- Fix ScrollspyNav component triggering 'active' event on every scroll
- Fix prevent updates on disconnected components

## 3.6.22 (May 18, 2021)

### Added

- Add animation set to `false` in Filter component

### Changed

- Animation classes toggled by Scrollspy component are removed after animation finishes

### Fixed

- Fix box-shadow bottom being clipped in Safari if container is animated

## 3.6.21 (May 4, 2021)

### Added

- Add divider modifier to Nav component

### Fixed

- Fix passing an array of classes to class utility functions
- Fix boundary option in Drop component

## 3.6.20 (April 22, 2021)

### Changed

- Toggle component in hover mode toggles on focus and blur

### Fixed

- Fix inverse colors for link toggle in Base component

## 3.6.19 (April 7, 2021)

### Changed

- Update card badge style

### Fixed

- Fix animation set to `false` in Sortable component
- Fix Tooltip on elements with class `uk-active` applied
- Fix Slider parallax states

## 3.6.18 (March 12, 2021)

### Added

- Add Discord, Twitch and TikTok icons

### Removed

- Remove Google Plus icon

### Fixed

- Fix filter initial state

## 3.6.17 (February 25, 2021)

### Added

- Add background-size modifier for width and height to Background component

### Fixed

- Fix dragging time control starts dragging slide in Safari

## 3.6.16 (February 5, 2021)

### Changed

- Make multiple select resizable

### Fixed

- Fix dragging slide correctly prevents click event

## 3.6.15 (January 29, 2021)

### Added

- beforeSend in 'ajax' function may return Promise
- Add 'container' option to Notification component

### Fixed

- Fix showing/hiding Modal/Offcanvas programmatically

## 3.6.14 (January 26, 2021)

### Fixed

- Fix 'scrolledOver' function uses closest scrollable parent
- Fix Lightbox closes on drag if slide background is dragged
- Fix Drop component applies stack class wrongly

## 3.6.13 (January 20, 2021)

### Fixed

- Fix slidenav icons

## 3.6.12 (January 20, 2021)

### Fixed

- Fix IE11 compatibility
- Fix changing ratio does not correctly apply width and height in SVG component
- Fix issues from hiding an already hidden Modal

## 3.6.11 (January 14, 2021)

### Fixed

- Fix regression in SVG component

## 3.6.10 (January 11, 2021)

### Changed

- Refactor Sortable behavior

### Fixed

- Fix regression in sticky component
- Fix calculating max scroll height
- Fix regression with calling watchers

## 3.6.9 (January 7, 2021)

### Fixed

- Fix component update handling
- Fix Tooltip position
- Fix Tooltip component applied to `<button>` element in iOS
- Fix regression in Switcher component

## 3.6.8 (January 5, 2021)

### Fixed

- Fix regression in class util

## 3.6.7 (January 4, 2021)

### Fixed

- Fix regression in class util

## 3.6.6 (January 4, 2021)

### Added

- Add filter animation delayed-fade

### Changed

- Filter animation fade does not stagger

### Fixed

- Fix filter animations
- Fix slider drag behavior on iOS
- Fix Scroll component now supports hash starting with any character

## 3.6.5 (December 21, 2020)

### Fixed

- Fix missing imports

## 3.6.4 (December 21, 2020)

### Changed

- Improve context selectors to use a dom path selector

### Fixed

- Fix IE11 compatibility
- Fix Accordion component toggles
- Fix regression in Toggle component

## 3.6.3 (December 18, 2020)

### Fixed

- Fix filter tests

## 3.6.2 (December 18, 2020)

### Changed

- IMPORTANT: Change options `animationMode` to `animation` and `animation` to `duration`
- IMPORTANT: Rename `shift` animation to `slide`

## 3.6.1 (December 17, 2020)

### Fixed

- Fix regression in Toggle component

## 3.6.0 (December 17, 2020)

### Added

- Add fade animation to Filter component
- Add 'priority' param to 'css' function

### Fixed

- Fix 'aria-expanded' value on toggles
- Fix responsiveness in Switcher component

## 3.5.17 (December 16, 2020)

### Added

- Offcanvas component hides if invisible

### Changed

- Image component will load images eagerly in IE11
- Improved Tooltip accessibility
- Set 'aria-expanded' on toggles

### Fixed

- Fix regression in Slider component
- Fix do not set 'aria-hidden' if element has already been removed from the accessibility tree
- Fix Switcher component does not ignore disabled toggles
- Fix Toggle component in queued mode

## 3.5.16 (December 11, 2020)

### Fixed

- Fix Sortable lets sort items between lists if no 'group' is set
- Fix 'scrollParents' checks for `position: fixed`

## 3.5.15 (December 10, 2020)

### Fixed

- Fix regression in Scrollspy Nav

## 3.5.14 (December 9, 2020)

### Fixed

- Fix Scrollspy Nav using wrong viewport as reference
- Fix Slider component skipping animation if slide item wider than its list

## 3.5.13 (December 8, 2020)

### Changed

- Sorting starts after traversing half the item's height/width in Sortable component

## 3.5.12 (December 7, 2020)

### Fixed

- Fix 'isInView' function

## 3.5.11 (December 7, 2020)

### Fixed

- Fix 'positionAt' function did not flip within its targets scroll container
- Fix drag gets 'overflow: hidden' in Sortable component

## 3.5.10 (November 27, 2020)

### Added

- Add container offset to prevent box-shadow clipping to Slider component

### Changed

- Add '50vw' default horizontal root margin to Image component

### Fixed

- Remove space between inline block elements in Breadcrumb component

## 3.5.9 (October 20, 2020)

### Changed

- Improve breadcrumbs wrapping into the next line
- Sortable drag is no longer clamped to viewport

### Fixed

- Prevent content overflow in Breadcrumb component
- Fix prefix script
- Fix 'scrollIntoView' does not align to top

## 3.5.8 (September 25, 2020)

### Added

- Add lightbox button active hook

### Changed

- IMPORTANT: Set `@pagination-margin-horizontal` to `0` and use new `@pagination-item-padding-vertical` and `@pagination-item-padding-horizontal`

### Fixed

- Fix lightbox button focus state
- Fix Slider component transition bug in iOS 14.0

## 3.5.7 (August 27, 2020)

### Fixed

- Fix Switcher component no longer toggles an already active item
- Fix 'positionAt' function not detecting flip state correctly
- Fix 'z-index' for stacked Modals

## 3.5.6 (August 13, 2020)

### Changed

- Sticky component uses 'window.Date' instead of 'window.performance'
- Sticky component with sticky-on-up no longer hides when Dropdown shows

### Fixed

- Fix slidenav color in Lightbox component
- Fix inverse colors for link toggle in Link component
- Sticky component remains inactive if hidden
- Revert dropbar mode `push` is only applied if Navbar is positioned static
- Fix animations not resolving if user canceled

## 3.5.5 (July 14, 2020)

### Added

- Add list marker utility support for WebKit
- Add `uk-text-default` to Text component
- Add multiple targets to Filter component

### Fixed

- Updates no longer throw error after too many recursions, but delay into next frame
- Fix empty slider throws exception
- Fix pointer events ignored on SVGs in Sortable component
- Fix Grid component divider rendering
- Fix `<select>` closes Drop component in hover mode in Firefox

## 3.5.4 (June 12, 2020)

### Added

- Image component triggers 'error' event on failing to load image

### Fixed

- Fix prop observer for dataSrc option in Image component
- Fix ajax function supports responseType 'json' in IE11
- Fix Accordion component with `multiple: true` and `collapsible: false`

## 3.5.3 (May 29, 2020)

### Fixed

- Fix regression in Grid component with parallax option

## 3.5.2 (May 29, 2020)

### Fixed

- Fix uglifyjs removes self-assignments

## 3.5.1 (May 29, 2020)

### Fixed

- Fix regression in Animation API
- Fix regression Drop component
- Fix regression in Sass source

## 3.5.0 (May 28, 2020)

### Added

- Add type, color and size modifiers to List component

### Changed

- IMPORTANT: Rename Less variable parts `xxlarge` to `2xlarge`
- Replace clearfix by creating a block formatting context with display flow-root

### Deprecated

- Width XXLarge: Use `uk-width-2xlarge` instead of `uk-width-xxlarge`

### Fixed

- Fix positioning issue with Drop components in Firefox
- Fix Dropbar causing endless loop in Firefox

## 3.4.6 (May 11, 2020)

### Fixed

- Fix regression in Switcher component

## 3.4.5 (May 11, 2020)

### Added

- Add inBrowser check to enable server-side rendering

### Fixed

- Fix Switcher responsiveness
- Fix `isInView()` no longer returns true for adjacent rectangles
- Fix compatibility with browsers that support `Object.prototype.watch()`

## 3.4.4 (May 7, 2020)

### Fixed

- Fix Scrollspy component stuck in wrong state
- Fix regression in Grid component with masonry

## 3.4.3 (May 5, 2020)

### Changed

- Improve attribute state observer performance

### Fixed

- Fix Search Icon with large modifier
- Fix Grid divider in RTL mode
- Fix Slider component responsiveness

## 3.4.2 (April 20, 2020)

### Added

- Hide Drop components on `Esc` keypress

### Fixed

- Fix `quote-right` icon empty in RTL mode
- Revert: Fix Sticky component correctly updates on `update`

## 3.4.1 (April 16, 2020)

### Fixed

- Fix `bottom` if offset is `0` in Sticky component
- Fix dropbar mode `push` is only applied if Navbar is positioned static
- Fix Sticky component correctly updates on `update`
- Fix Sticky component handles `vh` values for `top`and `bottom` options
- Fix Sticky component sets its width with fraction
- Fix Sticky component with `show-on-up` and `bottom` option updates correctly
- Fix Tooltip component no longer disappears on SVG shape elements
- Fix regression with Modal/Offcanvas component not opening in IE11

## 3.4.0 (April 9, 2020)

### Added

- Add `attrs` option to Lightbox items
- Add additional url parameters to YouTube/Vimeo embed URLs in Lightbox component

### Changed

- Change default dimensions to 1920x1080 for YouTube in Lightbox component

### Fixed

- Fix subnav not wrapping into the next line correctly when using `uk-margin` attribute
- Fix selected `uk-text-background` text being visible in Firefox
- Fix Scrollspy Nav component activating previous item in Firefox
- Fix toggling Offcanvas component
- Fix Sortable component unable to sort table rows
- Fix autoplay for YouTube and Vimeo videos in Lightbox component
- Fix dragging slides in Lightbox component in Chrome mobile

## 3.3.7 (March 19, 2020)

### Fixed

- Fix Height Match component not matching empty elements
- Fix Scrollspy Nav component activating wrong elements
- Fix Modal/Drop close on bgClick behaviour
- Fix `z-index` on Modal stacked dialogs

## 3.3.6 (March 12, 2020)

### Added

- Add `offset` option to Accordion component

### Changed

- Remove `duration` option from Scroll component

### Fixed

- Fix regression in Accordion component

## 3.3.5 (March 12, 2020)

### Fixed

- Fix regression in Sortable component

## 3.3.4 (March 12, 2020)

### Changed

- `getEventPos` returns client coordinates only

### Fixed

- Fix Drop component does not close on pointerleave in Firefox
- Fix Switcher component sets active state on ignored item
- Fix Accordion component triggers events on elements only
- Fix Accordion component no longer wraps its content without transition
- Fix missing `$emit` function
- Fix Sortable component performance
- Fix prevent showing/hiding of Tooltip component

## 3.3.3 (February 25, 2020)

### Changed

- Improve Tooltip component performance
- Notifications remove their container if it's empty
- The promise object returned by Modal Dialogs holds a reference to the Modal component itself.

### Fixed

- Fix style for breadcrumbs without last active item
- Fix infinite loop in Slider component
- Fix IE11 compatibility
- Fix Spinner component in RTL mode
- Fix animating `stroke` in Parallax component when element is hidden

## 3.3.2 (February 17, 2020)

### Fixed

- Fix accessing computed properties after component has been disconnected
- Fix Modal dialogs not being removed from DOM after close
- Fix Lightbox opening only once
- Fix updates having wrong type

## 3.3.1 (February 4, 2020)

### Changed

- Improve update performance

### Fixed

- Fix countdown separator line-height
- Fix Cover component covers positioned parent element

## 3.3.0 (January 23, 2020)

### Added

- Add container xlarge modifier

### Changed

- IMPORTANT: Change `uk-container-large` width. Use `uk-container-xlarge`

### Fixed

- Fix `position` takes offsetParent's border width into account

## 3.2.7 (January 13, 2020)

### Fixed

- Fix Drop component has wrong state after disconnect
- Fix `repeat` option in Scrollspy component in Firefox

## 3.2.6 (December 17, 2019)

### Fixed

- Fix regression with custom icons build task

## 3.2.5 (December 17, 2019)

### Added

- Prevent content overflow if `max-width: 100%` is used inside Position component
- Add `parent` util function
- Add `children` util function
- Add `isElement` util function

### Fixed

- Accordion component triggers scroll on page load
- Fix regression in Scroll component in Edge and IE

## 3.2.4 (December 3, 2019)

### Added

- Parallax, Scroll, Scrollspy Nav components work inside scrollable container
- Expose `scrollIntoView` utility function

### Fixed

- Fix scrolling containers while dragging in Sortable component
- Fix show/hide behaviour in Drop component
- Fix Accordion component will scroll title into view if needed
- Fix component initialization without element

## 3.2.3 (November 6, 2019)

### Fixed

- Fix initializing components with jQuery elements

## 3.2.2 (October 23, 2019)

### Added

- Prevent endless update loops

### Changed

- Improve event.preventDefault behaviour in Toggle component
- Improve initial boot

### Fixed

- Fix event delegation with `self` filter

## 3.2.1 (October 1, 2019)

### Added

- Add support for `input type="submit"` to Button component
- Add `selSlides` option to Slider/Slideshow component

### Fixed

- Fix Slider throws error if initialized with no slides
- Fix Slider/Slideshow crash in IE
- Fix Slider/Slideshow drag no longer starts on input elements
- Fix Slider/Slideshow Parallax shows wrong initial state
- Fix `isPlainObject` to work across iframes
- Fix Scrollspy causes endless update loop

## 3.2.0 (September 5, 2019)

### Added

- Add column and row gutter to Grid component

### Removed

- Remove `@text-bold-font-weight` variable

### Fixed

- Fix countdown line-height on small devices

## 3.1.9 (September 2, 2019)

### Added

- Add `last` utility function

### Fixed

- Fix Slideshow invisible after switching tabs in Switcher
- Fix lazy loading images in Image component in UC Browser
- Fix opening Offcanvas/Modal through buttons

## 3.1.8 (August 29, 2019)

### Added

- Add font weight and style modifier
- Add `self` option to `on` function

### Changed

- Improve `padding-bottom` calculation for Grid with `parallax: true`
- Make `selMinHeight` in the Flex Bug mixin a prop

### Fixed

- Fix Modal close on bgClick behaviour
- Fix spreading event args on delegated event listeners
- Fix clicking an empty link within itself no longer closes the Drop
- Fix IE11 compatibility
- Fix empty tooltips will no longer show

## 3.1.7 (July 31, 2019)

### Changed

- By default, the Offcanvas `container` option is `false` now
- The `focusable` attribute on SVG/Icon component makes SVG focusable in IE

### Fixed

- Fix Slideshow/Slider triggering show events to often initially
- Fix swipe gestures in Switcher component (Android)
- Ensure at most one Height Viewport component set to `expand` is active
- Height Viewport component no longer calculates its height if invisible
- Fix using Sortable in scrolling container
- Fix lazy loading images if parent element is fully clipped
- Fix clicking Slideshow with `draggable: false` no longer pauses autoplay
- Fix toggling modal while transition is in progress
- Fix Height Viewport component growing indefinitely if positioned above document
- Fix Height Viewport component uses height with fractions
- Fix Margin component for rows 1 pixel in height

## 3.1.6 (June 19, 2019)

### Added

- Add style for input with datalist

### Fixed

- Fix image shrinking in centered and absolutely positioned navbars
- Fix Custom Form not resetting on form `reset` event
- Fix leader inverse hook
- Fix divider vertical inverse hook

## 3.1.5 (May 17, 2019)

### Added

- Add link toggle to Link component
- Add breakpoint classes for margin auto and remove
- Add Etsy icon

### Fixed

- Fix Dropbar closing unexpectedly
- Fix Sortable `click` event prevention in Firefox
- Fix JS error in Offcanvas component on touch devices
- Icon components no longer have a primary option
- Icon/Svg components no longer reset initially

## 3.1.4 (April 24, 2019)

### Fixed

- Fix selector engine
- Fix CSS selector in Lightbox component
- Fix Drop not closing when Toggle component is clicked

## 3.1.3 (April 23, 2019)

### Fixed

- Fix Scrollspy Nav component
- Fix closing Lightbox causes text selection in Firefox

## 3.1.2 (April 18, 2019)

### Changed

- IMPORTANT: Change `@deprecated` variable to `false`

### Fixed

- Fix filter controls active state in Filter component

## 3.1.1 (April 18, 2019)

### Fixed

- Fix Sass distribution
- Fix Lightbox opens with wrong index

## 3.1.0 (April 17, 2019)

### Added

- Add deprecated flag to Less variables
- Add size modifiers to Heading component
- Add SVG stroke animation to Animation component
- Add option to animate SVG strokes to SVG component
- Add option to animate SVG strokes to Parallax component
- Add support for more units to Parallax component
- Add lazy loading support if Image component is used with SVG component
- Add text secondary to Text component
- Add `dataSrc` as primary option to Image component
- Add `webp` as image type to Lightbox Panel component

### Changed

- Refactor divider, bullet and line modifiers in Heading component
- Improve dimension handling in SVG component
- Improve performance of Image, Leader and Toggle component
- Autoplay is halted while Slideshow/Slider are active
- Lightbox filters duplicate items by `source`
- Rename `getPos` to `getEventPos`
- Move code with side effects to `core.js`

### Deprecated

- Primary Heading: Use `uk-heading-medium` instead of `uk-heading-primary`
- Hero Heading: Use `uk-heading-xlarge` instead of `uk-heading-hero`

### Removed

- `cls` option no longer accepts a list of classNames in Scrollspy component

### Fixed

- Fix rendering issue for scale in Transition component
- Fix Filter component's initial active state
- Fix translating `x` and `y` properties simultaneously in Parallax component
- Fix drag closes Lightbox
- Fix Tooltip component (touch device)
- Fix `hover` mode for Toggle component (touch device)
- Fix Slideshow not setting `min-height` if ratio is set to `false`
- Default prevent `click` event in Slider/Slideshow component after drag
- Fix images being selected while dragging in Slider/Slideshow component

## 3.0.3 (January 29, 2019)

### Added

- Computeds can be watched now
- Parallax supports `<SVG>` and its child elements now

### Changed

- Image Component uses IntersectionObserver now

### Removed

- Remove `isReady` function
- Form Custom component no longer sets `uk-hover` and `uk-focus` classes

### Fixed

- Fix touch event detection
- Fix background images are shown too large on retina displays in Image component
- Fix correctly calculate offsetLeft in Image component
- Fix autofocus elements not blurring within Toggable on hide

## 3.0.2 (January 15, 2019)

### Fixed

- Fix offcanvas overlay transition
- Fix active state in Switcher component
- Fix background images on displays with higher devicePixelRatio in Image component

## 3.0.1 (January 14, 2019)

### Fixed

- Fix Sass distribution

## 3.0.0 (January 14, 2019)

### Added

- Add active states for sub nav items in Nav, Navbar and Dropdown component
- Add emoji default fonts to the system font stack

### Changed

- Improve offcanvas reveal and push animations
- Improve animation, transition and visibility toggles for touch devices
- Improve update performance
- `css` function: Setting a CSS property to `NaN` no longer removes the property
- Slide/Slideshow navs and Drops no longer blur after hiding
- Changed the default `toggle` option for Switcher component to `> * > :first-child`
- SVG component no longer moves `id` from element to svg

### Removed

- Remove `uk-hover` class
- Remove artificial `click` event on mobile devices

### Fixed

- Fix visible toggle and its child elements not being focusable through keyboard navigation
- Fix Image component correctly escapes urls on background images

## 3.0.0 rc 26 (January 3, 2019)

### Added

- Add expand classes to Container component

### Changed

- @notification-message-margin-bottom to top in Notification component
- Improve swipe gesture detection
- `isInView` checks relative to viewport only

### Fixed

- Fix `flex bug` mixin (IE11)
- Fix properly resolving css custom properties in scss
- Fix order of variable assignments in scss
- Fix background images are shown too large on retina displays in Image component
- Fix lazy loading images in Image component in Safari
- Limit positioned element to container width and margin in Position component

## 3.0.0 rc 25 (November 30, 2018)

### Fixed

- Fix `hasClass` in IE11 again
- Fix workaround to mitigate the duplicating icons issue

## 3.0.0 rc 24 (November 23, 2018)

### Changed

- Drop positioning uses window as secondary boundary

### Fixed

- Fix modal not opening on first click in Angular apps
- Fix filter controls active state in Filter component
- Fix Masonry Grid in RTL mode
- Make sure autoplay does not resume after user interaction in slider-autoplay mixin
- Fix `hasClass` in IE11

## 3.0.0 rc 23 (November 16, 2018)

### Changed

- Destroy Lightbox Panel upon closing

### Fixed

- Fix sticky not recalculating after update
- Fix clicking on items not triggering `click` event in Sortable component
- Fix Offcanvas changing viewport upon opening

## 3.0.0 rc 22 (November 9, 2018)

### Fixed

- Fix regressions in Modal component

## 3.0.0 rc 21 (November 7, 2018)

### Added

- Add threshold before Sticky with `Show On Up` changes state
- Add `draggable` option to Slider and Slideshow component

### Fixed

- Fix toggling Offcanvas component while transition in progress
- Fix Offcanvas height on mobile devices

## 3.0.0 rc 20 (October 24, 2018)

### Added

- Add print, reddit, microphone, file-text, file-pdf, chevron-double left and right icons
- Add text emphasis to Text component
- Add `src` as primary option to SVG component

### Changed

- Offcanvas no longer requires a wrapping content div
- Change video-camera icon style to outline

### Fixed

- Fix sorting in Sortable component on touch devices with page scrolled down
- Fix height of Masonry Grid
- Fix Sticky hiding with Offcanvas in overlay mode
- Fix Parallax in combination with Offcanvas in overlay mode

## 3.0.0 rc 19 (October 11, 2018)

### Fixed

- Fix regression in Icon component

## 3.0.0 rc 18 (October 11, 2018)

### Added

- Add divider vertical modifier to Divider component

### Fixed

- Fix preserve color not working if class is set on `<svg>` element in Icon component
- Fix inverse hover color for accordion title
- Fix close color being overwritten from toolbar in Lightbox component
- Fix Modal not hiding upon being destroyed
- Fix using node as offset in position mixin
- Fix using Height Match component on elements with different offsetParents
- Fix rounding error in Height Match component
- Fix `scope` command for already scoped css, comments are removed from generated css files
- Fix Sticky placeholder height on resize
- Fix starting/stopping of autoplay in Lightbox
- Fix initially wrong position of background image in Parallax component
- Fix calling `isActive` on `undefined` in Navbar component

## 3.0.0 rc 17 (September 27, 2018)

### Added

- Dom functions support selectors

### Changed

- Viewport Height component no longer sets a `height` except for IE
- Viewport Height component no longer forces `box-sizing: border-box`
- Improve Tooltip performance
- Improve Parallax performance
- Improve Sticky performance

### Removed

- Remove `::-moz-selection` which is not needed anymore
- Remove component `init` hook
- Remove component `ready` hook

### Fixed

- Fix `UIkit.mixin()`
- Fix issue with list bullet in combination with multi-column layouts
- Allow for special characters in URI hash in Scroll Component
- Height Match also sets a `height` in IE
- Slideshow sets `min-height` instead of `height`

## 3.0.0 rc 16 (September 12, 2018)

### Fixed

- Fix regression in Overflow Auto component

## 3.0.0 rc 15 (September 11, 2018)

### Changed

- Rename `selModal` to `selContainer` and `selPanel` to `selContent` in Overflow Auto component

### Fixed

- Fix `isInView` function for elements with zero width and height

## 3.0.0 rc 14 (September 4, 2018)

### Fixed

- Fix regression in `removeClasses` function

## 3.0.0 rc 13 (September 4, 2018)

### Added

- Add border pill to Utility component

### Changed

- Use `min-height` instead of `height` for navbar nav items

### Removed

- Remove `filterAttr` function

### Fixed

- Fix SVGs not preserving their aspect ratio in IE11
- Fix lazy loading images in Edge

## 3.0.0 rc 12 (August 27, 2018)

### Added

- Add responsiveness to SVGs in Base component
- Make remaining components reactive
- Boolean attributes coerce to `true` if the prop is defined as Boolean

### Changed

- Allow icons to shrink in Iconnav
- Add more margin between accordion title and icon
- `UIkit.mixin` can now be used to extend existing components

### Removed

- Remove fix for uppercase SVGs attributes in Edge on Windows 10 older than build 16251

### Fixed

- Fix form placeholder color in Edge
- Fix accordion icon position if title is wrapping into the next line
- Fix Slider incorrectly showing navigation
- Fix element queuing in Scrollspy component
- Fix parallax translating to subpixels
- Fix issue with scrolling on mobile devices in Sortable component

## 3.0.0 rc 11 (August 8, 2018)

### Changed

- Pass error object to callback function instead of message only in Upload component

### Removed

- Remove deprecated prevention of the 300ms delay for touch devices

### Fixed

- Fix bug in `pointInRect` function

## 3.0.0 rc 10 (July 25, 2018)

### Added

- Add container xsmall modifier

### Changed

- Improve Height Viewport component performance

### Fixed

- Fix performance regression in Grid component
- Fix Height Viewport jumping in size on mobile devices if BottomOffset was set
- Fix offsetParent detection

## 3.0.0 rc 9 (July 13, 2018)

### Changed

- Allow thumbnav items to shrink if `flex-wrap: nowrap` is set

### Fixed

- Fix Filter component height during transition
- Fix Filter/Sortable component in IE11
- Fix Overflow Auto component triggering `resize` event indefinitely
- Fix Slider/Slideshow capture slide during transition in Safari 11
- Fix Slider/Slideshow drag behavior in iOS 11.3+ (https://bugs.webkit.org/show_bug.cgi?id=184250)
- Fix `toEventTargets` in IE11

## 3.0.0 rc 8 (July 5, 2018)

### Fixed

- Fix regression in dev dependencies

## 3.0.0 rc 7 (July 5, 2018)

### Added

- Allow `data-` prefixed attributes as component options

### Changed

- Improve Image component performance
- Improve Cover component performance
- Improve resize reactivity on Image/Video load

### Fixed

- Fix Dropbar in Navbar in IE11
- Fix single components did not get exported from their modules
- Fix Lightbox reactivity

## 3.0.0 rc 6 (June 15, 2018)

### Added

- Add development builds to npm registry (`npm i uikit@dev` / `yarn add uikit@dev`)

### Fixed

- Fix single components to auto-install only when UIkit is attached to window object
- Fix component naming (camelCase) in single component auto-install wrapper
- Fix active row style for striped table
- Fix height of Masonry Grid
- Fix attribute change listener
- Cover component updates on image load
- Fix Lightbox options handling

## 3.0.0 rc 5 (June 4, 2018)

### Fixed

- Fix missing standalone component installment
- Fix passing Lightbox options to Lightbox Panel
- Fix not appearing fixed background images for Chrome 67
- Fix having a Slider within a Slideshow element
- Fix filter animation in Edge
- Fix accessing sessionStorage if that's prevented
- Fix lazy loading images if no width and height are provided

## 3.0.0 rc 4 (May 30, 2018)

### Changed

- Delay loading images by one frame in Image Component

### Fixed

- Fix clipping of dropdowns in Dropbar

## 3.0.0 rc 3 (May 28, 2018)

### Changed

- Improve Lightbox type detection
- UIkit.icon.add supports resetting component icons now

### Fixed

- Fix lazy loading of images with same source
- Fix lazy loading of background images on elements with no height and width attributes
- Fix late component registration
- Fix resizing behavior of Sticky component
- Fix media mode in Toggle default preventing click events on touch devices

## 3.0.0 rc 2 (May 16, 2018)

### Fixed

- Fix regression in Scrollspy in IE11
- Fix Sass distribution
- Fix large close icon

## 3.0.0 rc 1 (May 15, 2018)

### Added

- Add Image component to lazy load images
- Add Filter component to filter and sort any kind of layout
- Add `masonry` option to Grid component
- Add inverse style for form icon
- Add smaller font-sizes on mobile for h1, h2, primary and hero heading and article title

### Changed

- Break long words into the next line for comment body
- Move grid `parallax` option to Grid component and remove Grid Parallax component
- Move Height, Leader, SVG and Video from Utility component into their own components
- Allow left and right icons at the same time in form and search component
- Rename `target` to `target-offset` in Sticky component
- Remove hyphenating for text break

### Fixed

- Fix option color in select dropdowns for Inverse component
- Fix dropcap font size in Edge
- Fix dropcap line height in Firefox
- Fix Scrollspy being stuck in endless update loop
- Fix Slideshow combined with Height Viewport component
- Fix Height Match component's `row` matching
- Fix height calculation in Height Match component
- Fix regression with Video component not autoplay/pause

## 3.0.0 beta 42 (April 5, 2018)

### Fixed

- Fix regression in Offcanvas

## 3.0.0 beta 41 (April 4, 2018)

### Added

- Add table large modifier
- Add `Autoplay` as primary option for Video component
- Add core and component dist files to NPM package

### Changed

- Make `uk-form-icon` padding work with size modifier
- Make heading line position top a variable
- Allow dropdowns in Iconnav component
- Allow any property in `svg-fill` mixin
- Move progress normalization to progress component
- Video component sets `preload="false"` if `autoplay` is set to `inview`
- Global `update` method now updates element itself as well as its parents and children

### Removed

- Remove the instance method `$update`

### Fixed

- Fix browser compatibility in Navbar component
- Fix preventClick function on touch devices
- Fix LightboxPanel props
- Fix Player ids in Vimeo videos
- Dropbar opens on bottom positioned drops only
- Fix setting height of drag in Sortable component
- `isInView` checks for element visibility now
- Fix check for backgroundSize: cover resetting backgroundSize in Parallax
- Fix "Uncaught (in promise) DOMException" in Player
- Fix Slideshow `fade` effect
- Fix `type` option in Upload component
- Fix misplaced Drop on fast toggling
- Fix Modal close on bgClick behaviour
- Fix Sets calculation in Slider on iOS

## 3.0.0 beta 40 (February 8, 2018)

### Changed

- Improve Form Custom reactivity
- Improve Scrollspy component reactivity

### Fixed

- Fix using Scrollspy component with default values
- Fix Scrollspy if UIkit is loaded async
- Fix YouTube short urls in Lightbox component
- Fix empty select in Form Custom component
- Fix Slider reactivity

## 3.0.0 beta 39 (January 31, 2018)

### Added

- Add link heading to Link component
- Add Slider Parallax component
- Add support for privacy enhanced mode in YouTube urls

### Changed

- _Active_ classes are applied to all fully visible slides in Slider component
- Allow all Lightbox Panel options to be set through Lightbox component

### Fixed

- Fix Slider Nav initially has no state
- Fix Esc closing on Confirm and Prompt dialogs
- Fix using Grids in Slider component in Safari
- Fix edge scrolling in Sortable component in IE11
- Fix touch scrolling in Slideshow/Slider in Edge
- Fix tap event on touch devices
- Fix initial Drop positioning

## 3.0.0 beta 38 (January 18, 2018)

### Added

- Add support to center elements outside a container to Position component

### Changed

- Add `uk-slider-container` class to clip the Slider component
- Remove auto-clipping from Slider items. Use `uk-cover-container` instead

### Fixed

- Fix Tooltip in Accordion loosing title
- Fix Inverse mode (Light and Dark) in tests
- Fix component getter

## 3.0.0 beta 37 (January 16, 2018)

### Added

- Add `beforeConnect` and `beforeDisconnect` component hooks

### Fixed

- Fix origin modifier for programmatically triggered animations
- Dialogs correctly cleanup after closing
- Fix missing container option on Tooltip component
- Fix positioning of Dropdowns in Dropbar
- Fix browser freezing on Slider resize
- Fix Custom Form initial value
- Fix Tooltip removing title attribute

## 3.0.0 beta 36 (January 11, 2018)

### Added

- Add Slider component
- Add RTL support to Slideshow component
- Add reactive navigation to Slideshow component
- Hide slideshow navigation if slideshow contains single slide only
- Add support to play/pause Video component as it enters/leaves the viewport
- Add file size restriction `maxSize` to Upload component
- Add option to pass `data-alt=""` to images in Lightbox component
- Component DOM attributes like `uk-grid` are being observed for changes
- Improve `UIkit.container` setter (allows for assigning selector strings)
- Make some util methods more error resilient
- Add config options to build scripts, type `./build/build.js -h` for options
- Add UIkit version banner to generated CSS files
- Add option to skip minification during Less compiling (`./build/less.js -d`)
- Add parametrization for prefix and scope scripts. Use `scope/prefix -h` (e.g. `npm run prefix -- -h`) to list the available options.

### Changed

- IMPORTANT: Use `<a>` element instead of headings for the accordion title
- Calling a component constructor with data on an already initialized component will reset the component
- Dropbar no longer repositions Dropdowns in DOM upon opening

### Deprecated

- Deprecate `uk-gif`

### Removed

- Remove support for IE 10
- Remove support for iOS < 9.1
- Remove most -webkit and -moz vendor prefixes
- Remove named component Constructors

### Fixed

- Make Accordion component accessible through keyboard
- Make `uk-visible-toggle` accessible through keyboard
- Make `uk-transition-toggle` accessible through keyboard
- Fix scrolling with scrollbar on Modal closes Modal
- Fix `container` options
- Fix initializing Icon components programmatically
- Fix accordion initial active option
- Fix webpack builds (npm run test)
- 'uk-scrollspy-class' attr may now be `data-` prefixed too
- Fix dialogs not being removed from DOM after closing

## 3.0.0 beta 35 (November 13, 2017)

### Added

- Parallax supports RGB and RGBA now

### Fixed

- Fix Modal toggling if Tab components media setting is active
- Fix Tab component regression
- Fix context selectors that are applied to elements with ids containing special characters
- Fix reactivity in Leader component
- Fix events triggered by Accordion component
- Fix text wrapping for Firefox in Position component
- Fix Scrollspy triggering before other components have been applied at least once
- Fix Accordion title click behavior
- Fix Sortable on iOS
- Fix Sticky Navbar (IE11)

## 3.0.0 beta 34 (November 7, 2017)

### Fixed

- Fix "Illegal invocation" error in Slideshow component
- Fix Offcanvas animations
- Fix Tab component if no lists are connected

## 3.0.0 beta 33 (November 3, 2017)

### Added

- Add Thumbnav component
- Add large margin modifier to Position component

### Changed

- IMPORTANT: Remove `@slidenav-padding`. Use new `@slidenav-padding-vertical` and `@slidenav-padding-horizontal`
- IMPORTANT: Sortable component now triggers `moved`, `added` and `removed` events instead of `change`
- Update Dotnav and Slidenav style
- Lightbox navigation no longer stacks on keyboard input
- Allow text selection within the Slideshow component
- Prevent vertical scrolling while swiping the Slideshow
- Remove tap highlighting when swiping the Slideshow in iOS

### Fixed

- Prevent Modal from toggling if event was defaultPrevented
- Fix using Scrollspy Nav within Sticky component
- Hide Slidenav in Lightbox if single item only
- Fix Parallax background image positioning
- Fix setting headers in AJAX request
- Fix dotnav box-sizing
- Fix Slideshow animations
- Fix Sortable component sorting animation when sorting between lists
- Fix event registration if `el` option is array
- Slideshow navigation items may now be `data-` prefixed too

## 3.0.0 beta 32 (October 27, 2017)

### Added

- Add `min-height` option to Height Viewport component

### Changed

- Improve accelerated slide animations in Slideshow component
- Improve slide dragging behaviour in Slideshow component

### Fixed

- Fix slide animations stacking when tab is not focused in Slideshow component
- Fix overlay not showing in Offcanvas component
- Fix Slideshow Parallax in Slideshow component for IE11
- Fix default border-radius for `<button>` element in Chrome 62.

## 3.0.0 beta 31 (October 20, 2017)

### Added

- Add Slideshow component
- Add style support for radio and checkbox in Firefox
- Add `autoplay` setting to Lightbox
- Add `poster` setting to Lightbox items

### Changed

- IMPORTANT: Remove jQuery dependency
- Remove `uk-section-media` from Section component
- Change `uk-tab-left` text alignment to left
- Update Overview in tests
- Rename `isWithin` to `within`
- Allow fullscreen mode for YouTube and Vimeo videos in Lightbox
- Video component now stops playing the video regardless of the `autoplay` setting

### Fixed

- Fix responsive images in modal for IE11
- Fix close button outside causing a scrollbar on small devices
- Fix inverse style for `uk-hr`
- Fix video size of Vimeo videos in Lightbox component
- Fix closing stacked modals

## 3.0.0 beta 30 (August 18, 2017)

### Fixed

- Fix regression for IE11

## 3.0.0 beta 29 (August 18, 2017)

### Changed

- Media options now support any valid media query syntax

### Fixed

- Fix whitespace trimming in dist
- Fix active drop in `click` mode close on `hover` in Navbar component
- Fix `selTarget` option in Sticky component
- Fix icons not displaying if connected/disconnected in rapid succession
- Ensure Navbar component does not initialize Drop components if Dropdown is already present
- Fix scrollbar jumping in Switcher
- Fix usage of Scroll component in Drop, Dropdown, Navbar and Offcanvas in `overlay` mode
- Fix cursor set to pointer for icons
- Fix Scrollspy Nav not working correctly when zoomed in
- Fix animations for Firefox
- Fix icons not displaying if lazy loaded

## 3.0.0 beta 28 (August 01, 2017)

### Added

- Add Sticky Navbar test
- Add inverse style for button link

### Changed

- IMPORTANT: Rename `closeAlert` method to `close` in Alert component
- IMPORTANT: Rename `close` param to `selClose` in Alert component
- IMPORTANT: Rename `scrollToElement` method to `scrollTo` in Scroll component
- Add box-shadow to dropbar slide

### Fixed

- Fix icon color for Edge
- Add workaround to mitigate the duplicating icons issue
- Fix issue with multilevel dropdown
- Fix compatibility issue with Prototype and MooTools
- Fix Sticky Navbar behaviour
- Fix Parallax for IE11
- Fix swiping in Lightbox
- Fix alert close animation

## 3.0.0 beta 27 (July 20, 2017)

### Fixed

- Remove stacking context for `uk-inline`
- Prevent scrolling in Lightbox with one slide only

## 3.0.0 beta 26 (July 20, 2017)

### Added

- Add Lightbox component
- Add Video component

### Changed

- IMPORTANT: Remove caption from Modal component. Use Lightbox component instead
- IMPORTANT: Remove lightbox modifier from Modal component. Use Lightbox component instead
- IMPORTANT: Remove center option from Modal component. Use `uk-margin-auto-vertical` modifier
- IMPORTANT: Renamed `@modal-dialog-margin-vertical` to `@modal-padding-vertical-s`
- IMPORTANT: Renamed `@modal-dialog-margin-vertical-xs` to `@modal-padding-vertical`
- Refactored Modal component
- `offsetTop` in Height Viewport component only applies if its element's top position is smaller than half the viewport
- Larger width for form width x-small

### Fixed

- Offcanvas will keep scroll position if anchor link was clicked
- Fix margin modifier in Position component for IE11
- Fix divider-small text alignment for `<hr>` element Edge and IE
- Fix setting the ratio of Spinner component
- Fix event handling in Sortable component
- Fix grid calculation (Firefox)
- Fix dropdown margins in the dropbar
- Fix opening Modals from Offcanvas

## 3.0.0 beta 25 (June 9, 2017)

### Added

- Add size modifier to Tile component
- Add link text to Link component
- Add 500px icon

### Changed

- Larger horizontal padding for form input, select and textarea
- Improve Parallax Background Position behaviour

### Removed

- Remove padding xlarge from Padding component

### Fixed

- Fix touch event handling
- Fix cursor height for active forms in Safari
- Fix Grid and Margin component for cells with no height
- Fix Parallax if element is translated vertical
- Fix Grid divider in RTL mode

## 3.0.0 beta 24 (May 22, 2017)

### Changed

- Make Icon component work with `<button>` element

### Fixed

- Fix margin bottom behaviour in Grid Parallax
- Fix error thrown by Notification component
- Fix `expand` mode in Height Viewport component
- Fix background position behaviour in Parallax component
- Fix removal of classes after sorting in Sortable component

## 3.0.0 beta 23 (May 18, 2017)

### Added

- Add Parallax component
- Add Grid Parallax component
- Add Form Range component
- Add Marker component
- Add hidden classes for touch devices to Visibility component
- Add padding xlarge to Padding component
- Add transform center to Utility component
- Add `clsBelow` option for Sticky component (uk-sticky-below)

### Changed

- IMPORTANT: Move Less/Sass imports into one file. Use `components/_import.less`
- IMPORTANT: Renamed `transition` option to `easing` in Scroll component
- Improve flip behaviour in Drop component
- Improve `class` handling

### Fixed

- Fix support for more than two digits in Countdown component
- Fix typo in Togglable mixin name
- Fix form select image for RTL
- Fix Scrollspy `cls` option
- Fix HeightMatch not working on initial page load
- Fix touch events
- Fix click event firing twice (iOS <= 9.2)
- Fix missing table hook
- Prevent initial page jump (Safari)
- Fix document height calculation (IE 10)
- Fix Tooltip recreates on hovering the already focused input

## 3.0.0 beta 22 (April 24, 2017)

### Added

- Add Countdown component
- Add divider, justify and responsive modifier to Table component
- Add inverse support for Table component
- Add box-shadow bottom to Utility component

### Changed

- IMPORTANT: Remove style from default Table component. Use `uk-table-divider` modifier
- Move border style to table row instead of table cell
- Remove margin from the last-child in Table component cell

### Fixed

- Fix swiping in Switcher
- Fix scrolling in Scrollspy Nav (Firefox)
- Fix Navbar Dropbar
- Fix Tooltip with different animations
- Fix Sass showing error when using different color mode in certain components

## 3.0.0 beta 21 (April 11, 2017)

### Added

- Add Gitter icon
- Attribute observer listens for changes to `component` attribute too

### Fixed

- Fix Instagram, Tumblr and Vimeo icons
- Fix unexpected closing of Modal Dialog
- Fix `click` default behaviour prevention in Toggle
- Fix memory leak in Icons

## 3.0.0 beta 20 (April 5, 2017)

### Added

- Add breakpoint classes for flex alignment

### Fixed

- Fix Drop positioning
- Fix imports in Modal
- Fix `click` default behaviour prevention in Toggle
- Fix queued Toggle
- Fix closing Offcanvas with swipe gesture (Android)
- Fix Toggle icons preventing Drops from opening
- Fix loading UIkit deferred

## 3.0.0 beta 19 (March 31, 2017)

### Added

- Add Sass support
- Add Leader to Utility component
- Add Offcanvas close button
- Add margin auto vertical classes
- Add padding left/right remove classes
- Add Tripadvisor and Yelp icons
- Add computed properties

### Changed

- IMPORTANT: Offcanvas requires wrapping page in extra div
- Refactored Offcanvas component
- Update Instagram, Tumblr and Vimeo icons
- Component Constructor initializes multiple components at once

### Fixed

- Fix Offcanvas scrolling on touch devices
- Fix Scrollspy in view check
- Fix text wrapping for Firefox in Position component
- Fix closing Accordion without animation

## 3.0.0 beta 18 (March 10, 2017)

### Fixed

- Fix regression with positioning

## 3.0.0 beta 17 (March 10, 2017)

### Added

- Add Tile component
- Add grid item match modifier to Grid component
- Tooltip is now attribute reactive

### Changed

- Rename `uk-background` to `uk-background-default`
- Drop, Dropdown, Toggle component's mode is a comma separated list now (to support hover only mode)

### Fixed

- Fix deferred UIKit loading
- Fix Dropdowns not closing immediately upon hovering other navbar item in Navbar component
- Fix navbar groups center left/right (IE11)
- Fix "sticky on up" behaviour in Sticky component
- Fix Offcanvas closing without animation
- Fix links in Notification message clickable
- Fix overriding default icons
- Fix Scrollspy nav when scrolling beyond last item

## 3.0.0 beta 16 (March 01, 2017)

### Fixed

- Fix Notification component

## 3.0.0 beta 15 (March 01, 2017)

### Fixed

- Fix dist

## 3.0.0 beta 14 (March 01, 2017)

### Changed

- Rename `.rtl` dist files to `-rtl`
- Include none minified JS files in dist

### Fixed

- Fix UMD/AMD dist

## 3.0.0 beta 13 (March 01, 2017)

### Added

- Add Receiver icon
- Add Hero heading modifier
- Add text background
- Add ID for AMD bundles

### Changed

- Move Icons into JavaScript
- Component Constructor initializes and returns single component only
- Rename function `show` to `toggle` in Accordion component
- Switcher no longer "swipes" with mouse
- Sticky component applies active class after scrolling below top

### Removed

- Remove text primary hook

### Fixed

- Fix npm not watching Less files
- Modal no longer closes immediately when toggled from custom `click` handler
- Fix Accordion component
- Fix container for Tooltip component
- Fix Dropdowns closing in Navbar component
- Fix Drops closing on click on hash links
- Fix Tab component not initializing
- Fix icon duplication

## 3.0.0 beta 12 (February 17, 2017)

### Added

- Add nested Drops
- Add text primary hook

### Changed

- Make Accordion selectors more specific
- Optimized margin modifier in Position component
- Drop component no longer forces `click` on touch devices

### Removed

- Remove obsolete webkitFontSmoothing workaround

### Fixed

- Fix text wrapping in Position component
- Fix icons in Safari's private browsing mode
- Fix right click triggers click event
- Fix empty targets in HeightMatch component
- Fix Tooltip component on touch devices

## 3.0.0 beta 11 (February 13, 2017)

### Fixed

- Fix icons not showing

## 3.0.0 beta 10 (February 13, 2017)

### Added

- Height Viewport component supports selector for Offset Bottom option
- Allow to preserve all color with one class when using `uk-svg`
- Add RTL support (RTL first)

### Changed

- Percentage value for Offset Bottom in Height Viewport component is calculated against the whole viewport

### Fixed

- Fix Notification component initialization
- Fix beta 8 regression with missing class in Navbar component
- Fix context selectors
- Sticky components sets inactive class initially
- Fix path to icons.svg in /custom folder
- Fix wrapping grid columns (IE + Edge)

## 3.0.0 beta 9 (February 3, 2017)

### Fixed

- Fix prefixed JavaScript not working
- Fix beta 8 regression with Scrollspy targets
- Fix width-expand not wrapping into next row in rare cases (Safari)

## 3.0.0 beta 8 (February 2, 2017)

### Added

- Apply class `uk-svg` to SVG component

### Changed

- Update event registration
- Use native Promises instead of jQuery Deferred

### Fixed

- Fix Cover component if the container has padding
- Fix Scrollspy component targeting wrong elements
- Switcher supports `data-` prefixed items now
- Fix beta 7 regression (IE <= 11)

## 3.0.0 beta 7 (February 1, 2017)

### Added

- Add sub groups center left/right to Navbar component
- Add box-shadow-hover to Utility component
- Height Viewport component supports pixel / percentage values for Offset Bottom option

### Changed

- Less no longer uses component attribute selectors
- Accordion close and open icons using variables

### Removed

- Remove `uk-cover` CSS only solution

### Fixed

- Fix icon `play-circle`
- Fix Spinner when `stroke-width` cannot be read
- Fix memory leak in SVG component
- Prevent transition-toggle from setting a transition
- Fix width-expand not wrapping into next row in rare cases
- Allow a fixed width on nested grids with grid-match
- Fix Height Viewport offset calculation
- Fix Sticky (Chrome > 55)

## 3.0.0 beta 6 (January 24, 2017)

### Added

- Togglable triggers `shown`/`hidden` events, when animations complete

### Fixed

- Fix component initialization
- Fix Card component extending inverse
- Fix background-fixed (Firefox + IE)

## 3.0.0 beta 5 (January 18, 2017)

### Changed

- UIkit observes `<body>` element too now
- Performance improvements

### Fixed

- Fix regression with initialization (IE + Edge)
- Fix beta 2 regression for SVG’s (Safari)
- Fix Sticky width after resize
- Fix page width on resizing Offcanvas
- Fix props initialization for `data-uk-` components
- Fix sortable children loosing event bindings after sort

## 3.0.0 beta 4 (January 18, 2017)

### Fixed

- Fix Scrollspy Nav within Sticky (Safari)
- Fix beta 3 regression for Accordion
- Fix lazy initialized components

## 3.0.0 beta 3 (January 17, 2017)

### Added

- Add support for `data-uk-` prefixed component attributes
- Add support for Primary Arguments in components
- Add support for Functional Components
- Components reinitialize on added/removed children

### Fixed

- Fix sortable behaviour
- Fix link muted and link reset

## 3.0.0 beta 2 (January 11, 2017)

### Added

- Enable deferred loading of UIkit

### Changed

- Improve relative path to icons.svg

### Fixed

- Fix Icon component on `<canvas>` elements (Safari)

## 3.0.0 beta 1 (January 09, 2017)

### Added

- Initial release
