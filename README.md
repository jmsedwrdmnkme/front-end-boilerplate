# front-end-boilerplate
Minimal front end boilerplate, kept up to date via Node package manager.

Will play nice(st) with the latest versions of modern browsers:-
* Edge
* Firefox
* Chromium
* Safari

## Get started
* git clone https://git.jamesmonk.me/James/front-end-boilerplate.git
* cd front-end-boilerplate
* npm install --save-dev
* gulp
* Start building!

## Features

### Javascript
* Bootstrap v5
* Fully vanilla, no frameworks here!
* Javascript scripts process (linting, uglify, compression, concat)
* Deferred loading of JS

### CSS
* Bootstrap V5 Beta
* SASS styles process (linting, compression, autoprefixing, concat, loading of modules)
* PurgeCSS to rid of bloat and unused styles
* Critical path CSS inline in document head (increased load speed, less http round trips)
* Lazyloading of non-critical CSS files (browser supported tag)

### Assets
* Handlebars HTML templating process (featuring partials)
* Imagemin IMG process (image optimisation and SVG minification)
* SVG icon sprite (generated inline from SVG assets)
* Favicon creation from supplied PNG, base64 encoded inline to remove additional HTTP request
* BrowserSync process (auto reload on file save/update)

## To do
* Revisit the gulp processing, needs reordering and tidying up to fully incorporate the Critical package browsersync and compilation.
