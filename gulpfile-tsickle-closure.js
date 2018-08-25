const gulp = require('gulp');
const path = require('path');
const exec = require('child_process').exec;
const closureCompiler = require('google-closure-compiler').gulp();

const srcFolder = 'src-js-tsickle';
const distFolder = 'dist/closure-tsickle';

/**
 * @param {string} entryPoint
 * @return {Object}
 */
function getCompilerSettings(entryPoint) {
	return {
		entry_point: path.join(__dirname, `${srcFolder}/${entryPoint}`),
		js: path.join(__dirname, `${srcFolder}/**.js`),
		compilation_level: 'ADVANCED',
		warning_level: 'VERBOSE',
		language_in: 'ECMASCRIPT_NEXT',
		language_out: 'ECMASCRIPT5_STRICT',
		// dependency_mode: 'STRICT',
		output_wrapper: '(function(){\n%output%\n}).call(this)',
		js_output_file: 'bundle.js',
	};
}

gulp.task('copyHtml', function () {
	return gulp.src('src/*.html')
		.pipe(gulp.dest(distFolder));
});

gulp.task('generate-js', function (cb) {
	exec(`tsickle -- --outDir ${srcFolder}`, cb);
});

gulp.task('default', ['copyHtml', 'generate-js'], () => {
	return closureCompiler(
			getCompilerSettings('main.js')
		)
		.src() // needed to force the plugin to run without gulp.src
		.pipe(gulp.dest(distFolder));
});