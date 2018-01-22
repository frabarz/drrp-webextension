var SELF_INFO = require('./package.json'),
	ENV_INFO = require('./env.json');

var fs = require('fs'),
	del = require('del'),
	gulp = require('gulp');

var stripDebug = require('gulp-strip-debug');

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
	return del(['./build/**/*', './dist/*']);
});

/*
 * Compress images
 */
gulp.task('common:images', ['clean'], function () {
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
gulp.task('common:static', ['clean'], function() {
	return gulp.src('./src/static/*')
		.pipe(gulp.dest('./build/common'));
});

/*
 * Clean scripts
 */
gulp.task('common:scripts', ['clean'], function () {
	return gulp.src('./src/scripts/*')
		.pipe(stripDebug())
		.pipe(gulp.dest('./build/common'));
});

/*
 * Manifest files
 */
gulp.task('manifest', ['common:images', 'common:static', 'common:scripts'], function () {
	var MANIFEST = require('./src/manifest.json');

	MANIFEST.name = SELF_INFO.title;
	MANIFEST.description = SELF_INFO.description;
	MANIFEST.version = SELF_INFO.version;

	var chrome = Object.assign({}, MANIFEST, {
		background: Object.assign({}, MANIFEST.background, {
			persistent: false,
		}),
	});

	var firefox = Object.assign({}, MANIFEST, {
		applications: {
			gecko: {
				id: ENV_INFO.mozilla_id,
				strict_min_version: "42.0",
			},
		},
	});

	fs.writeFileSync('./build/chrome/manifest.json', JSON.stringify(chrome, null, 4));
	fs.writeFileSync('./build/firefox/manifest.json', JSON.stringify(firefox, null, 4));
});

/*
 * Pack the common tasks
 */
gulp.task('commons', ['manifest'], function() {
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
 * Minify styles
 */
gulp.task('styles:chrome', function () {
	return gulp.src('./src/styles/*')
		.pipe(sass({ outputStyle: 'compressed' })
			.on('error', sass.logError))
		.pipe(cssprefix('> 2%'))
		.pipe(gulp.dest('./build/chrome'));
});
gulp.task('styles:firefox', function () {
	return gulp.src('./src/styles/*')
		.pipe(sass({ outputStyle: 'compressed' })
			.on('error', sass.logError))
		.pipe(cssprefix('> 2%'))
		.pipe(gulp.dest('./build/firefox'));
});

/*
 * Build extensions
 */
gulp.task('build:chrome', ['commons', 'styles:chrome'], function () {
	return gulp.src(['./build/common/*', '!*.map'])
		.pipe(gulp.dest('./build/chrome'));
});

gulp.task('build:firefox', ['commons', 'styles:firefox'], function () {
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

	return del(['./build/common/*']);
});

gulp.task('build', ['extension:build']);