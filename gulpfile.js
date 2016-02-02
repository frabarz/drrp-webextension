var del = require('del'),
	gulp = require('gulp');

var uglify = require('gulp-uglify');

var sass = require('gulp-sass'),
	cssprefix = require('gulp-autoprefixer');

var imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant');

var zip = require('gulp-zip'),
	through = require('through-gulp');

var SELF_INFO = require('./package.json');

/*
 * Clean the /dist folder
 */
gulp.task('clean', function () {
	return del(['/build/**/*']);
});

/*
 * Minify styles
 */
gulp.task('styles', function () {
	return gulp.src('./src/styles/*')
		.pipe(sass({ outputStyle: 'compressed' })
			.on('error', sass.logError))
		.pipe(cssprefix('> 2%'))
		.pipe(gulp.dest('./build/common'));
});

/*
 * Minify scripts
 */
gulp.task('scripts', function () {
	return gulp.src('./src/scripts/*')
		.pipe(uglify({ outSourceMap: true }))
		.pipe(gulp.dest('./build/common'));
});

/*
 * Compress images
 */
gulp.task('images', function () {
	return gulp.src('./src/images/*')
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{ removeViewBox: false }],
			use: [pngquant()]
		}))
		.pipe(gulp.dest('./build/common'));
});

/*
 * Pack the common tasks
 */
gulp.task('commons', ['styles', 'scripts', 'images'], function() {
	return gulp.src('./src/sprites.json')
		.pipe(gulp.dest('./build/common'));
});

/*
 * Manifest files
 */
gulp.task('manifest:chrome', function () {
	return gulp.src('src/manifest.json')
		.pipe(through(function (file, encoding, callback) {
			var manifest = JSON.parse(file.contents.toString());

			manifest.name = SELF_INFO.title;
			manifest.description = SELF_INFO.description;
			manifest.version = SELF_INFO.version;

			file.contents = new Buffer(JSON.stringify(manifest));

			this.push(file);
			callback();
		}, function (callback) {
			callback();
		}))
		.pipe(gulp.dest('./build/chrome'));
});

/*
 * Build extensions
 */
gulp.task('build:chrome', ['clean', 'commons', 'manifest:chrome'], function () {
	return gulp.src(['./build/common/*', '!*.map'])
		.pipe(gulp.dest('./build/chrome'));
});

gulp.task('build:firefox', ['clean', 'commons', 'manifest:firefox'], function () {
	return gulp.src(['./build/common/*', '!*.map'])
		.pipe(gulp.dest('./build/firefox'));
});

gulp.task('build', ['build:chrome'], function() {
	gulp.src(['./build/chrome/*'])
		.pipe(zip('chrome.zip'))
		.pipe(gulp.dest('./dist'));

	return del(['./build/common']);
});
