const gulp = require('gulp')
const zip = require('gulp-zip')
const size = require('gulp-size')
const packageJson = require('../package.json')
const name = packageJson.project || 'game'

gulp.task('compile:zip', [ 'compile:html' ], () =>
  gulp.src('./compile/**/*')
    .pipe(zip(`${name}.zip`))
    .pipe(size())
    .pipe(gulp.dest('./releases'))
)
