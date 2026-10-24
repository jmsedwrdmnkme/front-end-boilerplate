/*
 * Imports
 */

// Gulp
import { src, dest, watch, series, parallel } from 'gulp';

// File system
import { glob, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

// Streams
import { Transform } from 'node:stream';

// Handlebars 
import Handlebars from 'handlebars';

// HTML Minifier 
import { minify as htmlmin } from 'html-minifier-terser';

// SASS
import * as sass from 'sass-embedded';

// PostCSS
import postcss from 'postcss';

// PurgeCSS 
import purgecss from '@fullhuman/postcss-purgecss';

// Critical
import { critical } from 'critical';

// ESLint
import { ESLint } from 'eslint';

// ESBuild
import * as esbuild from 'esbuild';

// Sharp
import sharp from 'sharp';

// SVGO
import { optimize as svgo } from 'svgo';

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
    watch: ['src/img/**/*.{jpg,jpeg,gif,png,svg}', '!src/img/favicon.png'],
    src: ['src/img/**/*.{jpg,jpeg,gif,png,svg}', '!src/img/favicon.png'],
    dest: 'dist/img/',
  },
  favicon: {
    watch: 'src/img/favicon.png',
    src: 'src/img/favicon.png',
    dest: 'dist/favicons/',
  },
};


/*
 * Helpers
 */

// Async per-file transform
const transform = fn => new Transform({
  objectMode: true,
  async transform(file, _encoding, done) {
    try {
      done(null, await fn(file));
    } catch (error) {
      done(error);
    }
  }
});


/*
 * Tasks
 */

// Clean
const clean = () => rm('dist', { recursive: true, force: true });

// HTML
const handlebars = Handlebars.create();

async function partials() {
  const dir = `${paths.html.src}partials/`;
  for await (const partial of glob(`${dir}**/*.hbs`)) {
    handlebars.registerPartial(relative(dir, partial).replace(/\.hbs$/, ''), await readFile(partial, 'utf8'));
  }
}

function templates() {
  return src(`${paths.html.src}*.hbs`)
    .pipe(transform(async file => {
      const html = handlebars.compile(file.contents.toString())({});
      file.contents = Buffer.from(await htmlmin(html, {
        collapseWhitespace: true,
        removeComments: true
      }));
      file.extname = '.html';
      return file;
    }))
    .pipe(dest(paths.html.dest));
}

function robots() {
  return src(`${paths.html.src}robots.txt`)
    .pipe(dest(paths.html.dest));
}

// Styles
async function styles() {
  const css = `${paths.styles.dest}main.css`;
  const compiled = await sass.compileAsync(paths.styles.src, {
    silenceDeprecations: ['color-functions', 'global-builtin', 'import', 'if-function'],
    style: 'compressed',
    sourceMap: true
  });
  compiled.sourceMap.sources = compiled.sourceMap.sources.map(source =>
    relative(dirname(paths.styles.src), fileURLToPath(source))
  );
  const result = await postcss([
    purgecss({
      content: [`${paths.html.dest}*.html`],
      safelist: {
        standard: [/:/]
      },
      variables: true
    })
  ]).process(compiled.css, {
    from: paths.styles.src,
    to: css,
    map: { prev: compiled.sourceMap, inline: false, annotation: true, sourcesContent: false }
  });
  await mkdir(paths.styles.dest, { recursive: true });
  await Promise.all([
    writeFile(css, result.css),
    writeFile(`${css}.map`, result.map.toString())
  ]);
}

async function criticalStyles() {
  for await (const file of glob(`${paths.html.dest}*.html`)) {
    const { html } = await critical({
      src: file,
      base: paths.html.dest,
      engine: 'render',
      // Bootstrap breakpoints (xs, sm, md, lg, xl, xxl)
      dimensions: [
        { width: 375, height: 812 },
        { width: 576, height: 900 },
        { width: 768, height: 1024 },
        { width: 992, height: 900 },
        { width: 1200, height: 900 },
        { width: 1400, height: 900 }
      ],
      inline: true
    });
    await writeFile(file, html);
  }
}

// Javascript
async function lint() {
  const eslint = new ESLint();
  const results = await eslint.lintFiles(paths.scripts.watch);
  const formatter = await eslint.loadFormatter('stylish');
  const output = await formatter.format(results);
  if (output) {
    console.log(output);
  }
  if (ESLint.getErrorResults(results).length) {
    throw new Error('ESLint found errors');
  }
}

function scripts() {
  return esbuild.build({
    entryPoints: [paths.scripts.src],
    outdir: paths.scripts.dest,
    bundle: true,
    minify: true,
    sourcemap: true
  });
}

// Images
function images() {
  return src(paths.images.src, { encoding: false })
    .pipe(transform(async file => {
      if (file.extname === '.svg') {
        file.contents = Buffer.from(svgo(file.contents.toString(), {
          path: file.path,
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  removeDoctype: false,
                },
              },
            },
          ],
        }).data);
      } else {
        file.contents = await sharp(file.contents, { animated: true })
          .webp({ quality: 75 })
          .toBuffer();
        file.extname = '.webp';
      }
      return file;
    }))
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
        theme_color: '#020307',
        path: 'favicons/',
        url: 'http://localhost:3000',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        version: 1.0,
        icons: {
          android: ['android-chrome-192x192.png', 'android-chrome-512x512.png'],
          appleIcon: ['apple-touch-icon-180x180.png'],
          appleStartup: false,
          favicons: ['favicon.ico', 'favicon-16x16.png', 'favicon-32x32.png'],
          windows: false,
          yandex: false
        },
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
      siteUrl: 'http://localhost:3000',
      fileName: 'sitemap.xml',
      changefreq: 'weekly',
      priority: function(siteUrl, loc) {
        return loc === siteUrl ? 1 : 0.5;
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
  watch([paths.html.watch, paths.styles.watch], series(html, styles, criticalStyles, sitemaps, browserSyncReload));
  watch(paths.scripts.watch, series(lint, scripts, browserSyncReload));
  watch(paths.images.watch, series(images, browserSyncReload));
  watch(paths.favicon.watch, series(favicon, html, criticalStyles, browserSyncReload));
}


/*
 * Processes
 */
const html = parallel(series(partials, templates), robots);
export const build = series(clean, favicon, html, styles, criticalStyles, lint, scripts, images, sitemaps);
const watchSrc = series(build, browserSync, watchFiles);

export default watchSrc;
