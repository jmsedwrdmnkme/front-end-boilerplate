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
* $ pnpm start
* Start building!

## Features

### Javascript
* Latest Boostrap
* esbuild for fast bundling of modular imports, minification and sourcemaps
* ESLint linting (runs within the build/watch tasks, or standalone via `pnpm lint`)

### CSS
* Latest Boostrap
* Sourcemaps
* CSS styling process (Dart SASS via sass-embedded, compressed output)
* PurgeCSS to rid of bloat, unused styles and unused CSS variables
* Critical for inlining of critical styles and deferred loading of non-critical styles (no headless browser required)

### Assets
* Handlebars HTML templating process (featuring partials) with HTML minification
* Sharp image process (WebP conversion for optimised file size output)
* SVGO SVG optimisation
* Sitemap.xml auto generated (using file creation/update date and time)
* BrowserSync process (auto reload on file save/update)
* Modern, minimal favicon set and web app manifest
