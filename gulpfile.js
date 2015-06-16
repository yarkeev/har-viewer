var gulp   = require('gulp');
	stylus = require('gulp-stylus'),
	nib = require('nib'),
	concat = require('gulp-concat'),
	Filter = require('gulp-filter'),
	handlebars = require('gulp-handlebars'),
	defineModule = require('gulp-define-module');

gulp.task('templates', function(){
	gulp.src(['templates/**/*.hbs'])
		.pipe(handlebars())
		.pipe(defineModule('amd'))
		.pipe(gulp.dest('./public/js/templates/'));
});

gulp.task('css', function () {

	var filter = Filter('**/*.styl');

	return gulp.src([
		'./stylus/**/*.styl'
	])
		.pipe(filter)
		.pipe(stylus({
			use: nib()
		}))
		.pipe(filter.restore())
		.pipe(concat('out.css'))
		.pipe(gulp.dest('./public/css'));
});