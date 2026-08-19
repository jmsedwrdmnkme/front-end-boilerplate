# front-end-boilerplate
Modern, optimised, minimal front end boilerplate; installed and kept up to date via PNPM.

Will play nice(st) with the latest versions of modern browsers:-
* Edge
* Firefox
* Chromium
* Safari

## Get started
* $ git clone https://github.com/jmsedwrdmnkme/front-end-boilerplate.git
* $ cd front-end-boilerplate
* $ pnpm install
* $ gulp
* Start building!

## Features

### Javascript
* Latest Boostrap
* Webpack via Gulp watch task runner for modular imports
* Javascript scripts process (linting, uglify, compression, concat)

### CSS
* Latest Boostrap
* Sourcemaps
* CSS styling process (SASS with concat, minification, compression)
* PurgeCSS to rid of bloat and unused styles
* Critical for inlining of critical styles and deferred loading of non-critical styles

### Assets
* Handlebars HTML templating process (featuring partials)
* Imagemin IMG process (image optimisation)
* WebP conversion for imagery (optimised file size output)
* Sitemap.xml auto generated (using file creation/update date and time)
* BrowserSync process (auto reload on file save/update)
* Full range of favicon creation and support
