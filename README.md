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
* Javascript scripts process (uglify, compression, concat)
* Native deferred loading of JS

### CSS
* Bootstrap v5
* SASS styles process (compression, concat)
* PurgeCSS to rid of bloat and unused styles

### Assets
* Handlebars HTML templating process (featuring partials)
* Imagemin IMG process (image optimisation and SVG minification)
* SVG icon sprite (generated inline from SVG assets)
* Favicon creation from supplied PNG, base64 encoded inline to remove additional HTTP request
* BrowserSync process (auto reload on file save/update)

## To do
* Critical inline CSS and lazyloading of non-critical styles (although PurgeCSS alleviates a lot of requirement here). Current options do not play nice with ES6 module loading in Gulp.
