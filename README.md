# front-end-boilerplate
Front end boilerplate using Bootstrap, brought in and kept up to date via Node package manager.

## Get started
* git clone https://git.jamesmonk.me/James/front-end-boilerplate.git
* cd front-end-boilerplate
* npm install --save-dev
* gulp
* Select initial Bootstrap modules for use (may be tweaked during build, read below).
* Start building using the Bootstrap docs and delivered design visuals!

### Building
Refer to (https://getbootstrap.com/docs/) plus further left-hand nav items found at this link.

Bootstrap modules are controlled via [gulpfile.js for lazyloaded javascript modules](https://git.jamesmonk.me/James/front-end-boilerplate/src/branch/master/gulpfile.babel.js), [critical.scss inline styles](https://git.jamesmonk.me/James/front-end-boilerplate/src/branch/master/src/scss/critical.scss) and [main.scss for lazyloaded styles](https://git.jamesmonk.me/James/front-end-boilerplate/src/branch/master/src/scss/main.scss), for scripts and styles, respectively. Try to minimise dependencies, if not used, to keep the project clean, mean and lean.

Updates/Customisations to default Bootstrap styling to be appended within [variables.scss](https://git.jamesmonk.me/James/front-end-boilerplate/src/branch/master/src/scss/variables.scss) this removes any overwrites to existing Bootstrap styles by replacing the default variables BEFORE Bootstrap compiles its output

## Features
* ES6 Javascript scripts process (linting, uglify, compression, concat)
* SASS styles process (linting, compression, autoprefixing, concat, loading of Bootstrap modules)
* Mustache HTML templating process (featuring partials)
* Imagemin IMG process (image optimisation and SVG minification)
* ES6 Gulp process (parallel and series processing of files, loading of Bootstrap modules, build and watch processes for speed/time saving)
* BrowserSync process (auto reload on file save/update)
* Node package manager (for both install and updating of dependencies - JQuery, Popper, Bootstrap)
* Single JS and CSS file outputs for minimal HTTP requests
* SVG icon sprite (generated inline from SVG assets)
* Localstorage storage of supplied webfonts in base64 - both WOFF and WOFF2 (cross browser decrease in load times and page load)
* Lazyloading of non-critical JS files (loadJS, loads after initial paint)
* Critical path CSS inline in document head (increased load speed, less http round trips)
* Lazyloading of non-critical CSS files (loadCSS, loads after initial paint)
* Critical path JS inline in document footer (increased load speed, less http round trips)
* Favicon creation from supplied PNG (64x64, 32x32, 24x24 and 16x16 for cross device/browser output support)

## In progress
* Creating a Bootstrap-(and thus Popper)-less build by making a minimalist base CSS framework

## To do
* Look into automatically generating critical path/page CSS solution
* Update README with full process(es) and URLs etc, etc...
