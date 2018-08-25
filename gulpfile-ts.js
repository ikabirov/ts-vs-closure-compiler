const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const tsify = require('tsify');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const buffer = require('vinyl-buffer');

const distFolder = 'dist/ts';

gulp.task('copyHtml', function () {
	return gulp.src('src/*.html')
		.pipe(gulp.dest(distFolder));
});

gulp.task('default', ['copyHtml'], function () {
	return browserify({
		basedir: '.',
		debug: true,
		entries: ['src/main.ts'],
		cache: {},
		packageCache: {}
	})
		.plugin(tsify)
		.transform('babelify', {
			presets: ['es2015'],
			extensions: ['.ts']
		})
		.bundle()
		.pipe(source('bundle.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(distFolder));
});