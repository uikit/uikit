# Changelog

## 3.0.0 beta 12 (February 17, 2017)

### Added

- Add nested Drops
- Add text primary hook

### Changed

- Make Accordion selectors more specific
- Optimized margin modifier in Position component
- Drop component no longer forces 'click' on touch devices

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
- Allow to preserve all color with one class when using uk-svg
- Add RTL support (RTL first)

### Changed

- Percentage value for Offset Bottom in Height Viewport component is calculated against the whole viewport

### Fixed

- Fix Notification component initialization
- Fix beta 8 regression with missing class in Navbar component
- Fix context selectors
- Sticky components sets inactive class initially
- Fix path to icons.svg in /custom folder
- Fix wrapping grid columns in IE and Edge

## 3.0.0 beta 9 (February 3, 2017)

### Fixed

- Fix prefixed Javascript not working
- Fix beta 8 regression with Scrollspy targets
- Fix width-expand not wrapping into next row in rare cases in Safari

## 3.0.0 beta 8 (February 2, 2017)

### Added

- Apply class 'uk-svg' to Svg component

### Changed

- Update event registration
- Use native Promises instead of jQuery Deferred

### Fixed

- Fix Cover component if the container has padding
- Fix Scrollspy component targeting wrong elements
- Switcher supports 'data-' prefixed items now
- Fix beta 7 regression (IE 10 + 11)

## 3.0.0 beta 7 (February 1, 2017)

### Added

- Add sub groups center left/right to Navbar component
- Add box-shadow-hover to Utility component
- Height Viewport component supports pixel / percentage values for Offset Bottom option

### Changed

- Less no longer uses component attribute selectors
- Accordion close and open icons using variables

### Removed

- Removed uk-cover CSS only solution

### Fixed

- Fix icon 'play-circle'
- Fix Spinner when 'stroke-width' cannot be read
- Fix memory leak in SVG component
- Prevent transition-toggle from setting a transition
- Fix width-expand not wrapping into next row in rare cases
- Allow a fixed width on nested grids with grid-match
- Fix Height Viewport offset calculation
- Fix Sticky (Chrome > 55)

## 3.0.0 beta 6 (January 24, 2017)

### Added

- Toggable triggers 'shown'/'hidden' events, when animations complete

### Fixed

- Fix component initialization
- Fix card component extending inverse
- Fix background-fixed for Firefox and IE

## 3.0.0 beta 5 (January 18, 2017)

### Changed

- UIkit observes body tag too now
- Performance improvements

### Fixed

- Fix regression with initialization (IE + Edge)
- Fix beta 2 regression for Svg’s (Safari)
- Fix Sticky width after resize
- Fix page width on resizing Offcanvas
- Fix props initialization for data-uk- components
- Fix sortable children loosing event bindings after sort

## 3.0.0 beta 4 (January 18, 2017)

### Fixed

- Fix Scrollspy Nav within Sticky (Safari)
- Fix beta 3 regression for Accordion
- Fix lazy initialized components

## 3.0.0 beta 3 (January 17, 2017)

### Added

- Add support for 'data-uk-' prefixed component attributes
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
