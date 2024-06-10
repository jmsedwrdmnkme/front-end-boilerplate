import { createRequire } from "module";
const require = createRequire(import.meta.url);

import gulp from 'gulp';
import del from 'del';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass( dartSass );
import cleanCSS from 'gulp-clean-css';
import purgecss from 'gulp-purgecss';
import {stream as critical} from 'critical';
import compiler from 'webpack';
import webpack from 'webpack-stream';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import svgsprite from 'gulp-svg-sprite';
import imagemin, {gifsicle, mozjpeg, optipng, svgo} from 'gulp-imagemin';
import webp from 'gulp-webp';
import hb from 'gulp-hb';
import ext from 'gulp-ext-replace'
import sitemap from 'gulp-sitemap';
import browsersync from 'browser-sync';

export const clean = () => del([ 'dist/' ]);

export function root() {
  return gulp.src(['src/root/*', 'src/root/.*'])
    .pipe(gulp.dest('dist/'))
    .pipe(browsersync.stream());
}

export function fonts() {
  return gulp.src('src/fonts/*')
    .pipe(gulp.dest('dist/fonts/'))
    .pipe(browsersync.stream());
}

export function videos() {
  return gulp.src('src/videos/*')
    .pipe(gulp.dest('dist/videos/'))
    .pipe(browsersync.stream());
}

export function scripts() {
  return gulp.src('src/js/main.js')
    .pipe(webpack({}, compiler, function(err, stats) {}))
    .pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js/'))
    .pipe(browsersync.stream());
}

export function styles() {
  return gulp.src('src/scss/main.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(purgecss({
      content: ['dist/*.html'],
      safelist: [/carousel*/]
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/css/'))
    .pipe(browsersync.stream());
}

export function criticalStyles() {
  return gulp.src('dist/**/*.html')
    .pipe(
      critical({
        base: 'dist/',
        inline: true,
        css: 'dist/css/main.css'
      })
    )
    .pipe(gulp.dest('dist/'))
    .pipe(browsersync.stream());
}

export function sprite() {
  return gulp.src('src/sprite/**/**/*.svg')
    .pipe(svgsprite({
      shape: { spacing: { padding: 5 } },
      mode: { symbol: true },
      svg: { xmlDeclaration: false, doctypeDeclaration: false, namespaceIDs: false, namespaceClassnames: false }
    }))
    .pipe(concat('sprite.hbs'))
    .pipe(gulp.dest('src/html/partials/global/'))
    .pipe(browsersync.stream());
}

export function images() {
  return gulp.src('src/img/**/**/*')
    .pipe(imagemin([
      gifsicle({interlaced: true}),
      mozjpeg({quality: 75, progressive: true}),
      optipng({optimizationLevel: 5}),
      svgo({
        plugins: [
          {
            name: 'removeViewBox',
            active: true
          },
          {
            name: 'cleanupIDs',
            active: true
          },
          {
            name: 'collapseGroups',
            active: true
          }
        ]
      })
    ]))
    .pipe(webp())
    .pipe(gulp.dest('dist/img/'))
    .pipe(browsersync.stream());
}

export function html() {
  return gulp.src('src/html/*.hbs')
    .pipe(hb().partials('src/html/partials/**/*.hbs'))
    .pipe(ext('.html'))
    .pipe(gulp.dest('dist/'))
    .pipe(browsersync.stream());
}

export function sitemaps() {
  return gulp.src('dist/*.html', {
    read: false
  })
    .pipe(sitemap({
      siteUrl: 'localhost',
      fileName: 'sitemap.xml',
      changefreq: 'weekly',
      priority: function(siteUrl, loc, entry) {
        return loc.split('/').length === 0 ? 1 : 0.5;
      }
    }))
    .pipe(gulp.dest('dist/'))
    .pipe(browsersync.stream());
}

export function browserSync(done) {
  browsersync.init({server: {baseDir: "dist"}, port: 3000, open: false});
  done();
}

export function browserSyncReload(done) {
  browsersync.reload();
  done();
}

function watchFiles() {
  gulp.watch('src/js/**/*.js', scripts);
  gulp.watch('src/sprite/**/*.svg', sprite);
  gulp.watch(['src/html/**/*.hbs', 'src/scss/**/*.scss'], htmlBuild);
  gulp.watch('src/img/**/*', images);
  gulp.watch('src/root/**/*', root);
}

const htmlBuild = gulp.series(html, styles, criticalStyles, sitemaps);
export const build = gulp.series(clean, gulp.parallel(root, fonts, sprite, images, videos, scripts), htmlBuild);
const watch = gulp.series(build, browserSync, watchFiles);

export default watch;
