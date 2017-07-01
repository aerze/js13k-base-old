const gulp = require('gulp')
const zip = require('gulp-zip')

const FILES = [
  'dist/index.html',
  'dist/main.bundle.js.gz'
]

const RELEASE_DIR = 'release'

gulp.task('package', () => gulp
  .src(FILES)
  .pipe(zip('js13k.zip'))
  .pipe(gulp.dest(RELEASE_DIR))
)

gulp.task('default', () => {
  console.log('\nPlease use npm run package, don\'t use gulp directly.\n')
})
