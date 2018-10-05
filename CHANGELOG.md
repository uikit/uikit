# Changelog

## WIP

### Added

- Add divider vertical modifier to Divider component

### Fixed

- Fix inverse hover color for accordion title
- Fix close color being overwritten from toolbar in Lightbox component
- Fix Modal not hiding upon being destroyed
- Fix using node as offset in position mixin
- Fix using Height Match component on elements with different offsetParents
- Fix `scope` command for already scoped css, comments are removed from generated css files
- Fix Sticky placeholder height on resize
- Fix starting/stopping of autoplay in Lightbox

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
- Fix issue with list bullet in combination with multi column layouts
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
- Fix Filter/Sortable component in IE 11
- Fix Overflow Auto component triggering `resize` event indefinitely
- Fix Slider/Slideshow capture slide during transition in Safari 11
- Fix Slider/Slideshow drag behavior in iOS 11.3+ (https://bugs.webkit.org/show_bug.cgi?id=184250)
- Fix `toEventTargets` in IE 11

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

- Fix Dropbar in Navbar in IE 11
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

- Fix regression in Scrollspy in IE 11
- Fix Sass distribution
- Fix large close icon

## 3.0.0 rc 1 (May 15, 2018)

### Added

- Add Img component to lazy load images
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
- Fix regression with Video component not auto play/pause

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
- Fix edge scrolling in Sortable component in IE 11
- Fix touch scrolling in Slideshow/Slider in Edge
- Fix tap event on touch devices
- Fix initial Drop positioning

## 3.0.0 beta 38 (January 18, 2018)

### Added

- Add support to center elements outside of a container to Position component

### Changed

- Add `uk-slider-container` class to clip the Slider component
- Remove auto-clipping from Slider items. Use `uk-cover-container` instead.

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

- IMPORTANT: Use `a` element instead of headings for the accordion title
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
- Fix Sticky Navbar (IE 11)

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
- Fix default border-radius for button elements in Chrome 62.

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
- Prevent scrolling in Lightboxes with one slide only

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
- Fix divider-small text alignment for `hr` elements Edge and IE
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

- Make Icon component work with button elements

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

- IMPORTANT: Move LESS/Sass imports into one file. Use `components/_import.less`
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

- IMPORTANT: Offcanvas requires to wrap page in extra div
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
- Fix navbar groups center left/right (IE 11)
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

- Fix npm not watching LESS
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

- LESS no longer uses component attribute selectors
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

- UIkit observes `body` element too now
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

- Fix Icon component on canvas elements (Safari)

## 3.0.0 beta 1 (January 09, 2017)

### Added

- Initial release
