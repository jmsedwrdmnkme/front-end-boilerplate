# front-end-boilerplate
Modern, optimised, minimal front end boilerplate; installed and kept up to date via PNPM.

Will play nice(st) with the latest versions of modern browsers:-
* Edge
* Firefox
* Chromium
* Safari

## Get started
* git clone https://github.com/jmsedwrdmnkme/front-end-boilerplate.git
* cd front-end-boilerplate
* pnpm install
* gulp
* Start building!

## Features

### Javascript
* Vanilla JS, no frameworks here!
* Javascript scripts process (uglify, compression, concat)
* Webpack via Gulp watch task runner for modular imports
* Native deferred loading of JS

### CSS
* Vanilla CSS, no frameworks here!
* PostCSS, featuring nesting plugin for your native styling needs
* PurgeCSS to rid of bloat and unused styles
* Critical for inlining of critical styles and deferred loading of non-critical styles

### Assets
* Handlebars HTML templating process (featuring partials)
* Imagemin IMG process (image optimisation and SVG minification)
* WebP conversion for imagery (optimised file size output)
* SVG icon sprite (generated inline from SVG assets)
* Sitemap.xml auto generated (using file creation/update date and time)
* BrowserSync process (auto reload on file save/update)
