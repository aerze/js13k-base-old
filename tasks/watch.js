const gulp = require('gulp')

const js = './src/*.js'
const css = './src/css/*.css'
const html = './src/index.html'
const images = './assets/*.png'

gulp.task('watch:build', () =>
  gulp.watch([js, css, html, images], ['build:html'])
)

gulp.task('watch:compile', () =>
  gulp.watch([js, css, html, images], ['compile:html'])
)
