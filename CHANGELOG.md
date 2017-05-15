# Changelog

### 2.27.4

  - Added container option for datepicker dropdown


### 2.27.3

  - Fixed init UIkit twice (using with Webpack)
  - Fixed custom prefix issue with scrollspy component
  - Fixed swipe events on mobile devices
  - Added global object UIkit2, so internal code is not dependent on the UIkit object
  - Updated prefix behaviour to also create a global UIkit2{prefix} object

### 2.27.2 (Oct 24, 2016)

  - Updated datepicker default value when minDate setting is set
  - Updated tooltip word-break behavior
  - Fixed slideshow bug when using slideshow-fx based effects
  - Fixed dropdown error if now offset element exists
  - Fixed dropdowns on windows with touch support
  - Fixed variable reference in nav component when the dom changed.

### 2.27.1 (Aug 30, 2016)

  - Fixed missing variable in nav.js

### 2.27.0 (Aug 29, 2016)

  - Added new animation modes to offcanvas component
  - Added text-transform classes to utility component
  - Added headers option to upload component
  - Added UIkit.Utils.getCssVar utility function
  - Updated modal and dropdown components to get focus when shown
  - Updated dragging behavior on infinite sliders
  - Updated slideshow, slider, slideset and accordion component to update if a new item was added via dom manipulation
  - Updated icon component to FontAwesome 4.6.3
  - Fixed slideset showing horizontal scrollbar on animation
  - Fixed sticky element disappearing on scroll in iOS browsers
  - Fixed maxDate in datepicker component
  - Fixed dynamic grid in rtl mode

### 2.26.4 (Jul 13, 2016)

  - Added Htmleditor enablescripts option
  - Removed marked lib / load from a CDN
  - Fixed slider in rtl mode
  - Fixed jQuery v.3 switcher + slideshow animation compatibility
  - Fixed Htmleditor fullscreen mode in fixed container
  - Fixed prefixer gulp task
  - Fixed stick wrapper margin in IE
  - Fixed for Dynamic Grid ```_getSize``` is not a function
  - Fixed where many requestanimationframes can exist (custom scroll observer)
  - Fixed dragging items over iframes (sortable/nestable component)
  - Fixed sortable for Chrome/Windows mobile

### 2.26.3 (May 12, 2016)

  - Added UIkit.Utils.throttle helper function
  - Updated icon component to FontAwesome 4.6.0
  - Updated list button action in html mode (html editor)
  - Removed default ```transition-property: all``` for all uk-form inputs
  - Fixed fullscreen videos on iOS + lightbox
  - Fixed links in sortables + nestables on iOS/Windows mobile

### 2.26.2 (April 06, 2016)
  - Added iframe support for lightbox component
  - Added observe option to data-uk-grid-margin + data-uk-grid-match
  - Added all data-uk-* js components should now auto initialize after inserted into DOM
  - Updated sortable behavior with handleClass option
  - Updated sortable + nestable serialize
  - Removed data-uk-observe
  - Fixed flip dropdown modifier for autocomplete component
  - Fixed scrollspynav active state (revert)
  - Fixed form-select component with input as target

### 2.26.1 (March 30, 2016)
  - Removed translateZ(0) in sticky component to avoid stacking context
  - Removed clearfix fix in flex component

### 2.26.0 (March 29, 2016)
  - Added uk-grid-large class
  - Added support for CSS filter properties in parallax component
  - Added responsiveness to audio, canvas, svg and video in base component
  - Made flex component more robust when used with clearfix
  - Improved htmleditor `replaceInPreview` function
  - Fixed scrollspynav active state
  - Fixed uk-modal-spinner animation
  - Fixed uk-row-first when using pull/push or flex-order classes
  - Fixed uk-grid-margin when using flex-order classes
  - Fixed uk-overflow-container adjustments on resize
  - Fixed modal listens for `changed.uk.dom` event

### 2.25.0 (February 17, 2016)
  - Added grid parallax component
  - Added new grid-width classes to grid component
  - Added better vertical-align for embedded content to base component
  - Added :before and :after to print component
  - Fixed Animated slideset filter
  - Fixed noDragClass option (sortable)
  - Fixed drop target detection (sortable)
  - Fixed parallax for images with smaller width
  - Fixed parallax for elements with padding
  - Fixed responsiveElement initialization
  - Fixed scrollspy in view check
  - Fixed sticky positioning
  - Fixed dropdown flip positions
  - Fixed margin on wrapper element (sticky)

### 2.24.3 (December 18, 2015)

  - Added support for using data-title attribute as lightbox caption
  - Added mark first item in a row with ```uk-row-first``` when data-uk-grid-margin
  - Added uk-slide-before uk-slide-after classes to slider element after item focus
  - Added oncancel callback to UIkit.modal.confirm
  - Updated allow params in data-uk-* attributes without curly braces
  - Fixed .uk-display-inline-block with responsive child images (firefox)
  - Fixed hash urls in Offcanvas
  - Fixed slideshow scroll, swipe direction

### 2.24.2 (December 01, 2015)

  - Fixed UIkit.Utils.stackMargin apply on container with only one child element
  - Fixed hiding dropdown on click with option `mode:'hover'` for dropdown or items with class `uk-dropdown-close`

### 2.24.1 (November 30, 2015)

  - Added uk-width-xlarge-* classes
  - Updated slideshow direction animation (swipe, scroll)
  - Updated scrollspynav to blur items first before activating
  - Updated uk-overflow-container behaviour in modals
  - Fixed sortable if browser is in strict mode
  - Fixed sticked element width after resize
  - Fixed parallax bg scrolling

### 2.24.0 (November 23, 2015)

  - Added active class to accordion content container
  - Added panel body class to panel component
  - Added modal blank class to modal component
  - Added beforeshow.uk.slideshow event
  - Added preventflip option to dropdown component
  - Added uk-slideshow-fade-in class
  - Added uk-contrast support for tabs component
  - Added new hooks to base component
  - Added base-noconflict
  - Updated icon component to FontAwesome 4.5.0
  - Updated parallax background-image behaviour
  - Updated sticky behaviour on resize
  - Updated default format setting to YYYY-MM-DD (datepicker)
  - Updated scrollspynav to ignore links only with '#' as href
  - Updated sortable js improved to allow nested groups
  - Fixed error in grid filter if type is number
  - Fixed uk-form-icon vertical alignment
  - Fixed hover effects on touch devices
  - Fixed slideset animation on mobile


### 2.23.0 (October 12, 2015)

  - DEPRECATED: uk-dropdown-up, uk-dropdown-flip, uk-dropdown-center (Use ```pos``` property instead)
  - Reworked dropdown component to allow any kind of popovers
  - Added column component
  - Added data-uk-svg helper (UIkit.Utils.inlineSvg)
  - Added ```pos``` option to dropdown component
  - Added .npmignore
  - Updated image background-size calculation in parallax component
  - Updated using requestAnimationFrame for document.scrolling event
  - Updated default pagination component values
  - Fixed overlay transition-properties
  - Fixed scroll jumping for animated switchers on iOS
  - Fixed pass swiping option to switcher component
  - Fixed slider not showing the last element
  - Fixed ensure open transition has happened before listening to closing transition (modal component)
  - Fixed initdate when mindate integer (datepicker component)
  - Fixed error in sticky.js in combination with dynamic grid
  - Fixed touch.js error

  **Docs and Repo**

  - Added docs and tests for column component
  - Added docs and tests for dropdown component

### 2.22.0 (August 24, 2015)

  - Added dropdown overlay mode
  - Added autoplay to slider component
  - Added animation duration variables to sticky
  - Added showup + clsinactive option to sticky component
  - Added swiping option to switcher component
  - Updated icon component to FontAwesome 4.4.0
  - Updated placeholder default variables for all themes
  - Updated position utility classes
  - Updated sortable and nestable empty selectors
  - Updated panel teaser selector
  - Updated top parameter to support vh values + elements in sticky component
  - Updated adjust document scrolling while dragging in sortable component
  - Updated Youtube lighbox plugin to load maxres image
  - Moved block padding adjustment into themes
  - Unified sortable and nestable change event parameters
  - Set Http-Accept-Header if JSON is requested (upload)
  - Fixed element swapping between grouped lists
  - Fixed grid match items to wrap onto multiple lines
  - Fixed dropdown hide behavior
  - Fixed dropdown prevent show() on active element
  - Fixed stack margin with dynamic added children
  - Fixed form icon margin
  - Fixed timpicker flickering on blur after time picking
  - Fixed pagination "currentPage" option
  - Fixed initial focus on confirm dialog
  - Fixed missing debounced redraw in htmleditor
  - Fixed body width calculation on active offcanvas

  **Docs and Repo**

  - Added new video tutorial section
  - Updated some tests and docs

### 2.21.0 (June 01, 2015)

  - IMPORTANT: Reworked nestable component
  - Added uk-active class to form-select component
  - Added uk-flex-nowrap class to flex component
  - Added uk-icon-justify class to icon component
  - Added kenburnsanimations option to slideshow component
  - Added media option to parallax component
  - Added connect multiple sortable lists
  - Added activeClass option to tooltip component
  - Added ignorestacked option to gridMatchHeight component
  - Added UIkit.responsiveElement component (e.g. for iframes)
  - Added UIkit.Utils.isFullscreen helper function
  - Updated UIkit.modal.alert, UIkit.modal.prompt, UIkit.modal.confirm don't close open modals
  - Updated tooltip component to look for an updated title attribute before show
  - Updated timepicker to be initialized on a parent element
  - Updated slideset filter activation
  - Updated changed event from focus.uk.slider to focusitem.uk.slider
  - Removed warp mode from sortable component
  - Fixed tab component having no items
  - Fixed slideset nav
  - Fixed nestable maxdepth check when moving items between lists
  - Fixed gulp css minifier

  **Docs and Repo**

  - Updated dynamic grid test and docs
  - Updated sortable test and docs
  - Updated nestable test and docs
  - Updated icon test and docs

### 2.20.3 (May 04, 2015)
  - Updated jQuery to 2.1.4
  - Updated grid match items to wrap onto multiple lines
  - Fixed Slider animation on iOS
  - Fixed Modal show when no modal container exists
  - Fixed data-uk-grid-match for IE9

### 2.20.2 (April 30, 2015)
  - Updated hover delay for dropdown component
  - Updated requestAnimationFrame polyfill

### 2.20.1 (April 28, 2015)
  - Added active state for table rows
  - Added new hooks to table component
  - Fixed panel title margin

### 2.20.0 (April 24, 2015)
  - Added block component
  - Added contrast component
  - Added alternatives to native dialogs for window.alert, window.confirm, window.prompt
  - Added heading hooks to base component
  - Added support for indeterminate state in form-advanced
  - Added autoplay to slideset component
  - Added position option to datepicker
  - Added start and end option for the timepicker component
  - Updated hover delay for dropdown component
  - Updated event name select.uk.autocomplete to selectitem.uk.autocomplete
  - Fixed slider on touch devices
  - Fixed link reset on focus
  - Fixed overflow hidden on expanded accordion content
  - Fixed smooth scroll options with offcanvas menu links
  - Fixed touch detection (no longer dependent on user agent)
  - Fixed links in slideset component
  - Fixed slider with gutter in center mode
  - Fixed sticky element with animation flickering

  **Docs and Repo**

  - Added docs and tests for block component
  - Added docs and tests for contrast component
  - Updated parallax docs

### 2.19.0 (April 17, 2015)
  - Added parallax component
  - Added slideset component
  - Added slider component
  - Added custom animation duration for kenburns effect (slideshow component)
  - Added support for overlaying an image with a second image to overlay component
  - Added position class to set a z-index
  - Added overflow hidden class to utility component
  - Added trigger 'input' after htmleditor change
  - Added filter option to dynamic grid
  - Added define horizontal and vertical gutter for dynamic grid
  - Added UIkit.init([rootelement]) added to manually init js components
  - Added trigger ```hide.uk.dropdown``` when dropdown is closed
  - Added location reminder to customizer when reloading the page
  - Updated error handling if lightbox resource not found
  - Updated trigger datepicker dropdown on focus
  - Fixed hide opened autocomplete dropdowns on autocomplete show
  - Fixed lightbox extension matcher is now case insensitive
  - Fixed slideshow autoplay
  - Fixed datepicker to use minDate option as initial value if provided
  - Fixed slideshow on message handler
  - Fixed nestable component events + empty lists
  - Fixed nestable list helper function
  - Fixed nestable event arguments
  - Fixed 12hr format for Timepicker
  - Fixed switcher text selection for IE11
  - Fixed slideshow jumping in chrome
  - Fixed scrolling on large modal dialogs

### 2.18.0 (March 11, 2015)

  - Added ARIA support to JavaScript components
  - Added trigger ```scrolling.uk.document``` after update grid layout
  - Fixed sticky wrapper resize on window resize/orientation change
  - Fixed serialize to only include data attributes from HTML in nestable and sortable component
  - Fixed video mute bug in slideshow for vimeo player


### 2.17.0 (February 20, 2015)

  - IMPORTANT: Removed caption component (Use overlay component)
  - IMPORTANT: Removed uk-grid-preserve (Use uk-grid-medium)
  - IMPORTANT: Moved flex and cover component into the core
  - IMPORTANT: Moved tooltip and progress from core to components
  - DEPRECATED: Old overlay component (uk-overlay-area-* uk-overlay-caption uk-overlay-toggle)
  - DEPRECATED: Thumbnail component
  - DEPRECATED: uk-dotnav-vertical class (Use uk-flex-column)
  - Reworked overlay component completely
  - Added thumbnav component
  - Added gutter collapse and medium classes to grid component
  - Added more position classes to utility component
  - Added hover classes to panel component
  - Added icon hover class to icon component
  - Added uk-heading-large default values for small screens in utility component
  - Added serialize method to sortable object
  - Added possibility to enable and disable sticky component objects
  - Added scrollspy group with target selector
  - Added possibility to create dynamic lightboxes
  - Added manualclose.uk.notify and close.uk.notify events
  - Added pauseOnHover option to slideshow component
  - Added toggle uk-active class in sort and filter controls (dynamic grid)
  - Added boundary parameter to sticky addon to bind sticky scrolling to an element
  - Updated dotnav to use flexbox
  - Updated subnav to use flexbox
  - Updated icon component to FontAwesome to 4.3.0
  - Set content wrapper height to auto after accordion animation ends
  - Deactivated browser history navigation in modal for IE11
  - Fixed modal caption text overflow
  - Fixed modal min-height. Now only applies to lightbox modifier
  - Fixed events in grid js component
  - Fixed quick switching between tabs
  - Fixed deep target selector for data-uk-grid-match
  - Fixed goto dom trigger for slideshows
  - Fixed vertical centering for lightboxes

  **Docs and Repo**

  - Updated overlay docs and tests
  - Updated panel docs and tests
  - Updated grid docs and tests
  - Updated icon docs and tests
  - Updated animation docs
  - Updated text tests

### 2.16.2 (January 15, 2015)

  - Updated modal header and footer
  - Fixed ```data-uk-grid-match``` with target option

### 2.16.1 (January 15, 2015)
  - Added mirroring of icons in RTL mode
  - Added destroy lightbox content on hide
  - Added UIkit.Utils.stackMargin + UIkit.Utils.matchHeights helper methods
  - Updated boot code for accordion, grid and lightbox component
  - Fixed form normalization in form component

### 2.16.0 (January 13, 2015)
  - IMPORTANT: Renamed uk-modal-dialog-frameless to uk-modal-dialog-lightbox
  - Added dynamic grid component
  - Added accordion component
  - Added lightbox component
  - Added text left small and medium classes
  - Added timeout before muting media in slideshow
  - Fixed buttons for input elements
  - Fixed uk-hidden-touch and uk-hidden-notouch with !important

  **Docs and Repo**

  - Added docs and tests for new add-ons
  - Updated modal docs and tests
  - Updated form tests

### 2.15.0 (December 22, 2014)
  - IMPORTANT: Renamed uk-slidenav-inverted to uk-slidenav-contrast
  - Added header, footer, caption and spinner to modal component
  - Added dotnav-contrast to dotnav component
  - Added hidden classes for touch devices to utility component
  - Added center option for modals
  - Better dimension recognition in cover component
  - Iframes with the class uk-responsive-width behave like responsive images now (via JavaScript)
  - Fixed Slideshow without a parent container + fold effect
  - Fixed unprefixed autocomplete dropdown flip + search dropdown
  - Fixed switcher with animations for IE < 10
  - Fixed toggler with animations for IE < 10
  - Fixed clearfix method

  **Docs and Repo**

  - Updated slidenav docs and tests
  - Updated dotnav docs and tests
  - Updated modal docs and tests

### 2.14.0 (December 10, 2014)
  - IMPORTANT: Replaced uk-position-absolute with uk-position-top
  - Added uk-panel-hover to panel component
  - Added uk-text-contrast to text component
  - Added uk-position-bottom to utility component
  - Updated panels to work with anchors
  - Fixed fullscreen slideshows for iOS < 8
  - Fixed [data-uk-observe]
  - Fixed tab component with only one tab

  **Docs and Repo**

  - Updated panel docs and tests
  - Updated dotnav tests

### 2.13.1 (December 05, 2014)
  - Fixed clearfix method when used with flex
  - Fixed IE error causing UIkit crash
  - Fixed data-uk-margin in Firefox
  - Fixed slideshow triggers active status
  - Fixed native datepicker recognition in datepicker component
  - Fixed uk-responsive-width when uk-img-preserve is used

### 2.13.0 (December 04, 2014)
  - IMPORTANT: Triggered event names changed
  - DEPRECATED: $.UIkit, UIkit is now globally available
  - Added uk-grid-match class to grid component
  - Added flex order classes for different breakpoints
  - Added slidenav-inverted modifier
  - Added prevent registering a component multiple times with the same name
  - Added direction info to the uk-scroll event
  - Added UIkit.Utils.str2json helper function
  - Added prefix gulp task to build custom prefixed uikit
  - Added no conflict mode $.UIkit.noConflict(prefixname)
  - Added UIkit.$body reference on domready
  - Updated grid to use flex
  - Updated active paremeter for the switcher component to allow false as value
  - Disable pointer events none on iframes in slideshows on touch devices
  - Fixed initial flex-shrink value in IE10
  - Fixed form legend in IE9
  - Fixed automute in slideshow component
  - Fixed hidden text in dotnav
  - Fixed nestable serialize method
  - Fixed prevent editing form fields within a sortable component

  **Docs and Repo**

  - Added triggered event names

### 2.12.0 (November 11, 2014)

  - IMPORTANT: Renamed uk-animation-10 to uk-animation-15
  - DEPRECATED: uk-overlay-caption class
  - Added slideshow component
  - Added caption component
  - Added new classes to flex component
  - Added switcher animations
  - Added toggle animation option
  - Added smooth scroll helper function
  - Added missing sortable theme files
  - Added missing form-advanced theme files
  - Added Less error handler for gulp task
  - Added "use strict" to all JavaScript files
  - Added uk-animation-hover class
  - Better timing-function for reverse animations
  - Trigger uk.check.display on context element if no related children found
  - Updated moment.js in datepicker component
  - Updated and cleanup core.js
  - Updated ```gulp watch``` behaviour
  - Fixed slidenav position class
  - Fixed and replaced $(window).height() with window.innerHeight
  - Fixed datepicker z-index
  - Fixed nestable not triggering change event
  - Fixed anchor links in offcanvas menu
  - Fixed hidden text in dotnav if text is right aligned
  - Fixed Saas port (false math calculation in grid component)
  - Fixed IE11 touch support

**Docs and Repo**

  - Added docs and tests for new add-ons
  - Updated switcher docs and tests
  - Updated flex test
  - Updated sortable test

### 2.11.1 (October 13, 2014)

  - Fixed dropdown z-index
  - Fixed click mode (dropdown component)
  - Trigger change event on timepicker selection

**Docs and Repo**

  - Removed duplicated component Less files in src/less/core
  - Fixed icon font path in customizer generated CSS

### 2.11.0 (October 07, 2014)

  - Added uk.scrollspynav.inview event trigger
  - Fixed sortable on mobile
  - Fixed sortable in warp mode
  - Fixed jumping issue on modal show
  - Fixed triggering more results in search component
  - Fixed short time selection in timepicker component
  - Fixed UIkit functionality when uses with Polymer
  - Fixed hide autocomplete dropdown on scroll
  - Adjusted form danger and success colors
  - Unified triggered event names
  - Adjust document scroll position if dragged nestable or sortable items are out of view

**Docs and Repo**

  - Refactored source and themes directory structure
  - Removed dist folder
  - Replaced Grunt with Gulp
  - Added Browsersync for tests
  - Added Sass files creation to build process
  - Added Less/Sass files docs
  - Added documentation for data-uk-check-display
  - Fixed markup in thumbnail doc

### 2.10.0 (September 15, 2014)

 - Added input types for iOS style reset to form component
 - Updated icon component to FontAwesome to 4.2.0
 - Moved normalization into base, form, button and form component
 - Removed normalize component
 - Fixed upload select works only once if filename is the same

**Docs and Repo**

  - Removed normalize from docs and tests
  - Updated base test

### 2.9.0 (August 18, 2014)

 - IMPORTANT: Renamed keyframe animation uk-spin to uk-rotate
 - IMPORTANT: Removed uk-sticky class, use [data-uk-sticky] instead
 - Added flex add-on
 - Added cover add-on
 - Added new keyframes and classes to animation component
 - Added height viewport to utility component
 - Added position classes to utility component
 - Added treshold parameter to sortable add-on
 - Added reload toggle elements on dom update
 - Added hover color for badges
 - Added animation and negative offset support for sticky add-on
 - Added datepicker animation
 - Added additional class parameter for the tooltip add-on
 - Added iframe option + load custom css in iframe to htmleditor add-on
 - Added more settings options for upload add-on
 - Added trigger uk.dropped event when files were dropped to upload add-on
 - Added trigger uk.offcanvas.hide when offcanvas hides
 - Added allow multiple connect container to switcher component
 - Added switch accross multiple connected switcher containers
 - Added switch active content from within connected switcher containers via `data-uk-switcher-item` attribute
 - Updated active datepicker closes on window resize
 - Refactored sticky add-on and fixed z-index and box sizing
 - Refactored responsive tab behavior
 - Hide tooltip if source element is hidden or removed via JavaScript
 - Fixed using data-uk-margin in dropdowns
 - Fixed target option in tab js component
 - Fixed autocomplete return type on ajax request
 - Fixed autocomplete from overflowing its container
 - Fixed tooltip position calculation when body or html element is fixed
 - Fixed sortable add-on prevents default behaviour of child elements on click
 - Fixed off-canvas in IE 9
 - Fixed animation reverse timing function
 - Removed Google maps automatic URL detection
 - Removed search close button and loading spinner
 - Removed Promise polyfill

### 2.8.0 (June 19, 2014)

 - IMPORTANT: Timepicker add-on is now based on autocomplete
 - Added delay parameter for dropdowns in hover mode
 - Added scrollable dropdown class
 - Added month and year picker for datepicker add-on
 - Added support for a handle class parameter in sortable add-on
 - Added complete callback after smoothscroll animation
 - Fix black background on iOS for form-advanced
 - Fixed modal padding gap
 - Fixed document scrolling when modal is opened (Webkit)
 - Fixed js error causing by the sortable add-on
 - Fixed switcher component: document scrolls to top when clicking on a[href='#']
 - Fixed search add-on missing uk-active class
 - Fixed left position bug in safari for sticky add-on

**Docs and Repo**

  - Updated dropdown, timepicker and sortable doc

### 2.7.1 (June 06, 2014)

  - Reverted hidden and visibility classes for breakpoint mini

### 2.7.0 (June 06, 2014)

  - IMPORTANT: Renamed markdownarea to htmleditor
  - IMPORTANT: Renamed sortable to nestable
  - IMPORTANT: Added uk-dropdown-grid to decouple grids in dropdowns
  - Added $.UIkit.component interface for creating UIkit JS components
  - Added sortable add-on
  - Added form-select add-on
  - Added form-advanced add-on
  - Added pagination JavaScript add-on
  - Added Promise polyfill
  - Added minDate, maxDate options to datepicker add-on
  - Added font-weight variable to text large
  - Added new hooks and variables to form labels
  - Added triggering 'uk.dropdown.show', 'uk.dropdown.stack' events
  - Added hidden and visibility classes for breakpoint mini
  - Added touch support for overlay component
  - Make form element clickable through icon
  - Optimized multipliers for 16px font-size in default themes
  - Optimized offcanvas animation
  - Changed data-uk-grid-match row parameter to true by default
  - Fixed offcanvas scroll to top issue
  - Fixed sticky z-index in themes
  - Fixed wrong scaling calculation for overlay images in Chrome
  - Fixed printing for animations and scrollspy
  - Fixed text-decoration for navbar brand and toggle
  - Fixed overlay if its content has margin bottom
  - Fixed more results in search add-on
  - Fixed size of active item in pagination for almost-flat theme
  - Fixed location.hash usage for tabs
  - Fixed button checkbox initial event triggering
  - Fixed offcanvas removing existing style properties on close
  - Removed unneeded brackets from LESS operations
  - Removed breaking strings on small devices by default from base
  - Prevent search-field uk-active issue
  - Updated dropdown flip and stack behavior
  - Updated icon component to FontAwesome to 4.1

**Docs and Repo**

  - Added showcase
  - Added docs and tests for new add-ons
  - Added missing animations to docs
  - Changed markdownarea docs and tests to htmleditor

### 2.6.0 (April 07, 2014)

  - Added link reset classes to utility component
  - Changed text center medium breakpoints
  - Fixed cursor issue if form file content is too large
  - Fixed modal dialog padding issue, when body and modal have a scrollbar
  - Fixed markdownarea marker replacer
  - Fixed IE 11 crashing (dom observer)
  - Allow HTML markup in titles for search add-on
  - Allow click for dropdowns in hover mode
  - Case insensitive allow param (upload add-on)
  - Added uk-check-display event
  - Prevent vertical scrollbar for centered tabs
  - Less.js updated to 1.7.0

### 2.5.0 (March 25, 2014)

  - IMPORTANT: Moved search component to add-ons
  - IMPORTANT: Removed form-file JavaScript
  - Added placeholder add-on
  - Added dotnav add-on
  - Added slidenav add-on
  - Added upload add-on
  - Added autocomplete add-on
  - Added simple template engine
  - Added large dialog to modal component
  - Added overflow container to utility component
  - Added text vertical alignment modifiers
  - Form-file add-on now works great with text
  - Lists are now more robust
  - Fixed page jumping to top for modal component
  - Fixed timpicker add-on events
  - Fixed markdownarea add-on browser reload issue
  - Fixed fixed breakpoint for grid divider with large gutter

**Docs and Repo**

  - Refactored add-on structure
  - Added docs and tests for new add-ons
  - Fixed form password add-on doc

### 2.4.0 (March 05, 2014)

  - IMPORTANT: Renamed uk-text-info to uk-text-primary including variable names
  - IMPORTANT: Renamed uk-notify-message-info to uk-notify-message-primary including variable names
  - IMPORTANT: Renamed @grid-large-gutter-horizontal to @grid-gutter-large-horizontal
  - IMPORTANT: Renamed @grid-large-gutter-vertical to @grid-gutter-large-vertical
  - IMPORTANT: Renamed @panel-divider-large-gutter to @panel-divider-gutter-large
  - IMPORTANT: Removed uk-modal-dialog-slide
  - Renamed some global variables in themes
  - Refactored grid component
  - Refactored modal component
  - Added grid-match only within rows option
  - Added grid width classes
  - Added grid gutter small classes
  - Added width small classes
  - Added AMD support
  - Added margin classes to utility component
  - Added border rounded to utility component
  - Added resize property to scrollables in utility component
  - Added text center small and medium classes
  - Added markdownarea style for gradient and almost flat theme
  - Added new hooks to comment, form and subnav component
  - Removed box-shadow for invalid controls in Firefox
  - Removed default input style for iOS
  - Fixed z-index issues
  - Fixed double click issue in form-file add-on
  - Fixed textarea height not being resizable
  - Fixed badge border-radius
  - Fixed wrong scaling calculation in overlay component for Chrome
  - Fixed notify padding
  - Fixed body content scrolling if modal is open
  - Fixed gap in navbar gradient and almost flat theme
  - Whitespace hack now uses font-size

**Docs and Repo**

  - Refactored add-on structure
  - Added layout examples
  - Added placeholder images in docs
  - Added holder.js for placeholder images in tests
  - Updated community section on frontpage
  - Renamed uk-width-custom to uk-width in docs and tests
  - Fixed overview test

### 2.3.1 (January 31, 2014)

  - Fixed button text decoration

### 2.3.0 (January 31, 2014)

  - IMPORTANT: Removed uk-button-expand, use uk-width-1-1 instead
  - IMPORTANT: Renamed @form-blank-outline to @form-blank-border
  - Updated to Normalize 3.0.0
  - Added more variables to all components
  - Added panel teaser to panel component
  - Added invisible to utility component
  - Added padding variable for thumbnail caption
  - Updated links in base component
  - Panel component works now with inline elements
  - Background color now set on tr elements in table component
  - Removed vertical align from breadcrumbs
  - Fixed button link in button component
  - Fixed cursor in sortable add-on
  - Fixed links in overlay-area-content
  - Fixed tooltip boundary check

**Docs and Repo**

  - Better comments for compiled CSS
  - Updated panel docs and tests
  - Fixed default theme in tests

### 2.2.0 (January 23, 2014)

  - Added alert, confirm shorcut methods to modal component
  - Added form-file add-on
  - Added primary comment to comment component
  - Added overlay-area-content to overlay component
  - Added margin-small to utility component
  - Added text-nowrap to text component
  - Added data-uk-margin to utility component
  - Switcher now activates first toggler when no uk-active class is set
  - Extended Notify message api wit content+status methods
  - Fixed Offcanvas in RTL mode
  - Fixed Tooltips in Offcanvas
  - Fixed sticky add-on jQuery error where $ is not available
  - Removed hgroup in normalize because it was deprecated in HTML5
  - Fixed data-uk-grid-match

**Docs and Repo**

  - Added form-file docs and tests
  - Updated LESS to 1.6.1
  - Updated overlay docs and tests
  - Updated utility docs and tests
  - Updated comment docs and tests
  - Optimized docs and tests with data-uk-margin

### 2.1.0 (January 07, 2014)
  - Added notify add-on
  - Added border-circle to utility component
  - Added more variables to sortable add-on
  - Added modifier to flip form icons
  - Updated form icons to work with form size modifiers
  - Replace fixed value with variable in nav component
  - Fixed background position in RTL mode
  - Fixed delayed dropdown trigger on touch devices
  - Fixed jumping when dragging sortables
  - Fixed nested comments indention on small screens
  - Fixed style for inputs without type attribute

**Docs and Repo**

  - Added new notify add-on
  - Fixed tooltip component
  - Fixed tests link

### 2.0.0 (December 11, 2013)

  - Added toggle component
  - Added form-icon to form component
  - Added datepicker add-on
  - Added form-password add-on
  - Added markdown area add-on
  - Added sortable add-on
  - Added sticky add-on
  - Added timepicker add-on
  - Added outerclick support for dropdowns in hover mode
  - Added touch events support for Windows 8 phones
  - Added miscellaneous hooks
  - Updated icon component to FontAwesome to 4.0.3
  - Changed comments to compile nicer CSS output

**Docs and Repo**

  - Refactored repository structure
  - Refactored variables
  - Added Grunt task to index new themes ( usage: grunt indexthemes )
  - Added new UIkit add-ons and components
  - UIkit tests moved to /src

### 1.2.1 (December 03, 2013)

  - Fixed off canvas scrolling on windows phones
  - Fixed search more results in search js

**Docs and Repo**

  - Updated LESS to 1.5.1

### 1.2.0 (November 01, 2013)
  - Added shake animation
  - Added boundary check to tooltip component
  - Added delay and animation option to tooltip component
  - Added margin-left and margin-right to utility component
  - Added variables for width sub-modifiers to form component
  - Added size modifier support for textarea and multiple selects
  - Added renderer option for seach component
  - Added scrollspy-nav to scrollspy component
  - Auto-initialize dynamic components using MutationObserver if supported by browser
  - Changed box-sizing for scrollable-box
  - Fixed link-muted
  - Fixed form-controls-condensed margin
  - Fixed rare customizer unknown LESS var error
  - Fixed smooth-scroll offset position

### 1.1.0 (August 21, 2013)

  - Added scrollspy component
  - Added animation component
  - Added link-muted to utility component
  - Added subtitle support for navbar items
  - Off-canvas now uses hardware accelerated translateX for bar animation
  - Added responsive tab dropdown indicator
  - Added show specific tab using id target in the url as hash
  - Added flipDropdown option to search component
  - Added possibility to change modal width via inline-style or custom class
  - Fixed responsive tabs
  - Fixed links within alert components
  - Fixed open modals in a chain
  - Fixed off-canvas scroll position bug

**Docs and Repo**

  - Added scrollspy and animation docs and tests
  - Added bower definition file
  - Automated version and download link
  - Added heading large example

### 1.0.2 (July 31, 2013)

  - Added boundary option for dropdowns
  - Removed Navbar.js
  - Removed auto dropdown flip if navbar is flipped

**Docs and Repo**

  - Updated dropdown and navbar documentation

### 1.0.1 (July 26, 2013)

  - Added focus and blur events to tooltip component
  - Added smoother off-canvas effect
  - Added hook for uk-container
  - Fixed multiple off-canvas trigger
  - Fixed `select` height for multiple and size attributes

**Docs and Repo**

  - Added import LESS functionality to customizer
  - Remove absolute paths from CSS build in customizer
  - Disabled LESS cache in tests
  - Tests initialized on domready instead of on window load
  - Updated grunt script to auto compile themes
  - Fixed several typos and links
  - Updated favicon

### 1.0.0 (July 19, 2013)

  - Initial Release
