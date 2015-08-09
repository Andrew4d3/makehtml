var gulp = require('gulp');
var fileinclude = require('gulp-file-include');
var less = require('gulp-less');
var webserver = require('gulp-webserver');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require("browser-sync").create();
var clean = require('gulp-clean');
var plumber = require('gulp-plumber');

gulp.task('default', ['js','images','fonts','css','less','pages','watch']);

var paths = {
	js: 'src/js/**/*.js',
	assets: ['src/img/**/*','src/css/**/*','src/fonts/**/*'],
	pages: 'src/*.html',
	less: 'src/styles/less/**/*.less'
}

// Moving al your JS files to your server folder
gulp.task('js', function(){

	del('dist/js/**/*',function(){
		gulp.src('src/js/**/*.js')
		.pipe(plumber())
		.pipe(gulp.dest('dist/js/'));

		// Jquery Library
		gulp.src('bower_components/jquery/dist/*.min.js')
		.pipe(plumber())
		.pipe(gulp.dest('dist/js/vendor/'));

		//Bootstrap Library
		gulp.src('bower_components/bootstrap/dist/js/bootstrap.min.js')
		.pipe(plumber())
		.pipe(gulp.dest('dist/js/vendor/'));
	});

});

// Moving your images to your server folder
gulp.task('images', function(){

	del('dist/img/**/*',function(){
		gulp.src('src/img/**/*')
		.pipe(plumber())
		.pipe(gulp.dest('dist/img/'));
	});

});

gulp.task('fonts', function(){

	del('dist/fonts/**/*',function(){

		gulp.src('src/fonts/**/*')
		.pipe(plumber())
		.pipe(gulp.dest('dist/fonts/'));

		//FontAwesome Fonts
		gulp.src('bower_components/components-font-awesome/fonts/*')
		.pipe(plumber())
		.pipe(gulp.dest('dist/fonts/'));

		//Bootstrap Fonts
		gulp.src('bower_components/bootstrap/dist/fonts/*')
		.pipe(plumber())
		.pipe(gulp.dest('dist/fonts/'));

	});

});

//Moving your css files to your server folder
gulp.task('css', function(){

	del('dist/css/**/*',function(){

		gulp.src('src/css/**/*')
		.pipe(gulp.dest('dist/css/'));

		//Bootstrap Stylesheets
		gulp.src('bower_components/bootstrap/dist/css/*.min.css')
		.pipe(gulp.dest('dist/css/'));

		//FontAwesome Stylesheets
		gulp.src('bower_components/components-font-awesome/css/*.min.css')
		.pipe(gulp.dest('dist/css/'));

	});

});

// Building your HTML pages using fileInclude package
gulp.task('pages', function(){

	//del('dist/**/*.html',function(){
		gulp.src(['src/**/*.html','!src/snippets/*.html'])
		.pipe(plumber())
		.pipe(fileinclude({
	      prefix: '@@',
	      basepath: '@file'
	    }))
		.pipe(gulp.dest('./dist/'));
	//});

});

// Proccessing your LESS stylesheets
gulp.task('less',function(){

	gulp.src('src/styles/less/*.less')
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(less({
		paths: ['src/styles/less/theme']
	}))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('dist/css'));

});

//Reloading Server
gulp.task('reload',function(){
	browserSync.reload();
});

//Watching for changes
gulp.task('watch',function(){

	browserSync.init({
		 server: "./dist"
	});

	gulp.watch(paths.js, ['js','reload']);
	gulp.watch('src/img/**/*', ['images','reload']);
	gulp.watch('src/fonts/**/*', ['fonts','reload']);
	gulp.watch('src/css/**/*.css', ['css','less','reload']);
	gulp.watch('src/**/*.html', ['pages','reload']);
	gulp.watch(paths.less,['less','reload']);


});
