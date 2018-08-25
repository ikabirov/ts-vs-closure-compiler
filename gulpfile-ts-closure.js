const gulp = require('gulp');
const path = require('path');
const exec = require('child_process').exec;
const replace = require('gulp-string-replace');
const closureCompiler = require('google-closure-compiler').gulp();

const srcFolder = 'src-js-tsc';
const distFolder = 'dist/closure-tsc';

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
		process_common_js_modules: true,
	};
}

gulp.task('copyHtml', function () {
	return gulp.src('src/*.html')
		.pipe(gulp.dest(distFolder));
});

gulp.task('generate-js', function (cb) {
	exec(`tsc --outDir ${srcFolder}`, cb);
});

gulp.task('fix-modules', ['generate-js'], function () {
	gulp.src(`${srcFolder}/*.js`) // Any file globs are supported
		.pipe(replace(
			/require\("(.*)"\)/g, (_, module) => `require("${module}.js")`
		))
		.pipe(replace(
			/from\s*"(.*)"/g, (_, module) => `from "${module}.js"`
		))
		.pipe(gulp.dest(srcFolder))
});

gulp.task('default', ['copyHtml', 'fix-modules'], () => {
	return closureCompiler(
			getCompilerSettings('main.js')
		)
		.src() // needed to force the plugin to run without gulp.src
		.pipe(gulp.dest(distFolder));
});