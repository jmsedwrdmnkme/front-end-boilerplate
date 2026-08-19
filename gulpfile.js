/*
 * Imports
 */

// Gulp
import { src, dest, watch, series, parallel } from 'gulp';

// Del
import { deleteAsync } from 'del';

// Concat 
import concat from 'gulp-concat';

// Replace extension 
import ext from 'gulp-ext-replace';

// Handlebars 
import hb from 'gulp-hb';

// HTML Minifier 
import htmlmin from 'gulp-htmlmin';

// SASS
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);

// PurgeCSS 
import purgecss from 'gulp-purgecss';

// Critical
import { stream as critical } from 'critical'; // Critical

// Webpack 
import compiler from 'webpack';
import webpack from 'webpack-stream';

// JSHint
import jshint from 'gulp-jshint';

// Uglify 
import uglify from 'gulp-uglify';

// ImageMin
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin';

// WebP
import webp from 'gulp-webp';

// Favicon
import favicons from 'gulp-favicons';

// Sitemap
import sitemap from 'gulp-sitemap';

// Browser Sync
import browsersync from 'browser-sync';


/*
 * Paths
 */
const paths = {
  html: {
    watch: 'src/html/**/*.hbs',
    src: 'src/html/',
    dest: 'dist/',
  },
  styles: {
    watch: 'src/css/**/*.scss',
    src: 'src/css/main.scss',
    dest: 'dist/css/',
  },
  scripts: {
    watch: 'src/js/**/*.js',
    src: 'src/js/main.js',
    dest: 'dist/js/',
  },
  images: {
    watch: 'src/img/**/*.{jpg,gif,png}',
    src: ['src/img/**/*.{jpg,gif,png}', '!src/img/favicon.png'],
    dest: 'dist/img/',
  },
  favicon: {
    watch: 'src/img/favicon.png',
    src: 'src/img/favicon.png',
    dest: 'dist/favicons/',
  },
};


/*
 * Tasks
 */

// Clean
const clean = () => deleteAsync('dist/');

// HTMTL
function html() {
  src(`${paths.html.src}*.hbs`)
    .pipe(hb().partials(`${paths.html.src}partials/**/*.hbs`))
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(ext('.html'))
    .pipe(dest(paths.html.dest));

  return src(`${paths.html.src}robots.txt`)
    .pipe(dest(paths.html.dest));
}

// Styles
function styles() {
  return src(paths.styles.src, { sourcemaps: true })
    .pipe(sass({
      silenceDeprecations: ['legacy-js-api', 'color-functions', 'global-builtin', 'import', 'if-function'],
      style: 'compressed'
    }).on('error', sass.logError))
    .pipe(dest(paths.styles.dest, { sourcemaps: '.' }));
}

function purgeStyles() {
  return src(`${paths.styles.dest}main.css`)
    .pipe(purgecss({
      content: [`${paths.html.dest}*.html`],
      safelist: {
        standard: [/:/]
      }
    }))
    .pipe(dest(paths.styles.dest));
}

function criticalStyles() {
  return src([`${paths.html.dest}*.html`])
    .pipe(critical({
      inline: true,
      base: paths.html.dest,
      css: 'css/main.css',
      width: 1300,
      height: 900
    }))
    .pipe(dest(paths.html.dest));
}

// Javascript
function scripts() {
  return src(paths.scripts.src, { sourcemaps: true })
    .pipe(webpack({}, compiler, function() {}))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(dest(paths.scripts.dest, { sourcemaps: '.' }));
}

// Images
function images() {
  return src(paths.images.src, { encoding: false })
    .pipe(imagemin([
      gifsicle({
        interlaced: true
      }),
      mozjpeg({ 
        quality: 75,
        progressive: true
      }),
      optipng({
        optimizationLevel: 5
      }),
    ]))
    .pipe(webp())
    .pipe(dest(paths.images.dest));
}

// Favicon
function favicon() {
  return src(paths.favicon.src, {encoding: false})
    .pipe(
      favicons({
        appName: 'Front End Boilerplate',
        appShortName: 'FEB',
        appDescription: 'Modern, optimised, minimal front end boilerplate; installed and kept up to date via PNPM.',
        developerName: 'James Monk',
        developerURL: 'https://github.com/jmsedwrdmnkme/front-end-boilerplate',
        background: '#020307',
        path: 'favicons/',
        url: 'localhost:3000',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        version: 1.0,
        html: `../../${paths.html.src}partials/favicon.hbs`,
        pipeHTML: true,
      })
    )
    .pipe(dest(paths.favicon.dest));
}

// Sitemap
function sitemaps() {
  return src([`${paths.html.dest}*.html`], { read: false })
    .pipe(sitemap({
      siteUrl: 'localhost:3000',
      fileName: 'sitemap.xml',
      changefreq: 'weekly',
      priority: function(siteUrl, loc, entry) {
        return loc.split('/').length === 0 ? 1 : 0.5;
      }
    }))
    .pipe(dest(paths.html.dest));
}

// Browser Sync
function browserSync(done) {
  browsersync.init({ 
    server: { 
      baseDir: paths.html.dest
    },
    port: 3000,
    open: false
  });

  done();
}

function browserSyncReload(done) {
  browsersync.reload();
  done();
}


/*
 * Watch
 */
function watchFiles() {
  watch([paths.html.watch, paths.styles.watch], series(html, styles, purgeStyles, criticalStyles, sitemaps, browserSyncReload));
  watch(paths.scripts.watch, series(scripts, browserSyncReload));
  watch(paths.images.watch, series(favicon, images, browserSyncReload));
}


/*
 * Processes
 */
export const build = series(clean, html, styles, purgeStyles, criticalStyles, scripts, favicon, images, sitemaps);
const watchSrc = series(build, browserSync, watchFiles);

export default watchSrc;
