var SELF_INFO = require('./package.json'),
	ENV_INFO = require('./env.json');

var del = require('del'),
	gulp = require('gulp');

var uglify = require('gulp-uglify');

var sass = require('gulp-sass'),
	cssprefix = require('gulp-autoprefixer');

var imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant');

var zip = require('gulp-zip'),
	through = require('through-gulp');

/*
 * Clean the /build folder
 */
gulp.task('clean', function () {
	return del.sync(['./build/**/*', './dist/*']);
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
 * Static resources
 */
gulp.task('static', function() {
	return gulp.src('./src/*.html')
		.pipe(gulp.dest('./build/common'));
});

/*
 * Pack the common tasks
 */
gulp.task('commons', ['styles', 'images', 'static'], function() {
	return gulp.src('./src/busts.json')
		.pipe(through(function (file, encoding, callback) {
			var list = JSON.parse(file.contents.toString());

			Object.keys(list).forEach(function(name) {
				list[name] = list[name].map(function(src) {
					return src.replace(/revision\/latest.+$/, '').replace(/\/$/, '') + '#sprite';
				});
			});

			file.contents = new Buffer(JSON.stringify(list));
			this.push(file);
			callback();
		}, function (callback) {
			callback();
		}))
		.pipe(gulp.dest('./build/common'));
});

/*
 * Minify scripts
 * Apparently Mozilla doesn't like uglified code
 */
gulp.task('scripts:chrome', function () {
	return gulp.src('./src/scripts/*')
		// .pipe(uglify({ outSourceMap: true }))
		.pipe(gulp.dest('./build/chrome'));
});

gulp.task('scripts:firefox', function () {
	return gulp.src('./src/scripts/*')
		.pipe(gulp.dest('./build/firefox'));
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

			manifest.background.persistent = false;

			manifest.options_ui = {
				"page": "options.html",
				"chrome_style": true
			};

			file.contents = new Buffer(JSON.stringify(manifest));

			this.push(file);
			callback();
		}, function (callback) {
			callback();
		}))
		.pipe(gulp.dest('./build/chrome'));
});

gulp.task('manifest:firefox', function () {
	return gulp.src('src/manifest.json')
		.pipe(through(function (file, encoding, callback) {
			var manifest = JSON.parse(file.contents.toString());

			manifest.name = SELF_INFO.title;
			manifest.description = SELF_INFO.description;
			manifest.version = SELF_INFO.version;

			manifest.applications = {
				gecko: {
					id: ENV_INFO.mozilla_id
				}
			};

			file.contents = new Buffer(JSON.stringify(manifest));

			this.push(file);
			callback();
		}, function (callback) {
			callback();
		}))
		.pipe(gulp.dest('./build/firefox'));
});

/*
 * Build extensions
 */
gulp.task('build:chrome', ['commons', 'scripts:chrome', 'manifest:chrome'], function () {
	return gulp.src(['./build/common/*', '!*.map'])
		.pipe(gulp.dest('./build/chrome'));
});

gulp.task('build:firefox', ['commons', 'scripts:firefox', 'manifest:firefox'], function () {
	return gulp.src(['./build/common/*', '!*.map'])
		.pipe(gulp.dest('./build/firefox'));
});

gulp.task('extension:build', ['clean', 'build:chrome', 'build:firefox'], function() {
	gulp.src(['./build/chrome/*'])
		.pipe(zip('chrome.zip'))
		.pipe(gulp.dest('./dist'));

	gulp.src(['./build/firefox/*'])
		.pipe(zip('firefox.xpi'))
		.pipe(gulp.dest('./dist'));

	return del(['./build/common']);
});

gulp.task('build', ['extension:build']);