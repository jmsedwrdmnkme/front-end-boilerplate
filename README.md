# front-end-boilerplate
Front end boilerplate using Bootstrap, brought in and kept up to date via Node package manager.

## Get started
* git clone https://github.com/jmsedwrdmnk/front-end-boilerplate.git
* cd front-end-boilerplate
* npm install --save-dev
* gulp
* gulp watch

### Building
Refer to (https://getbootstrap.com/docs/) plus further left-hand nav items found at this link.

Bootstrap modules are controlled via [gulpfile.js](https://github.com/jmsedwrdmnk/front-end-boilerplate/blob/master/gulpfile.js) and [main.scss](https://github.com/jmsedwrdmnk/front-end-boilerplate/blob/master/src/scss/main.scss), for scripts and styles, respectively. Try to minimise dependencies, if not used, to keep the project clean, mean and lean.

## Features
* ES6 Javascript scripts process (linting, uglify, compression, concat)
* SASS styles process (linting, compression, autoprefixing, concat, loading of Bootstrap modules)
* Handlebars HTML templating process (partials)
* Imagemin IMG process (image optimisation and SVG minification)
* ES6 Gulp process (parallel and series processing of files, loading of Bootstrap modules, build and watch processes for speed/time saving)
* BrowserSync process (auto reload on file save/update)
* Node package manager (for both install and updating of dependencies - JQuery, Popper, Bootstrap)
* Single JS and CSS file outputs for minimal HTTP requests

## To do
* ~~Update README.md with details about boilerplate~~
* ~~Integrate browserSync into gulpfile process (already in package.json)~~
* ~~Integrate hbs partials, previously implementation causes gulp process issues~~
* Integrate Bootstrap components into hbs/partials (possible, big time sink when examples docs can be used)
* Integrate critical path process for above the fold scripts/styles on load
* Integrate non-critical path process for below the fold lazy-loading of scripts/styles after initial load
* Integrate SVG icon sprite process
* Integrate localstorage custom fonts on load for load speed benefits
* Replace of gulp-compile-handlebars due to depreciation of gulp-util of which, this package uses
