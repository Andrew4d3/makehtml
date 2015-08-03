var gulp = require('gulp');
var fileinclude = require('gulp-file-include');
var less = require('gulp-less');
var webserver = require('gulp-webserver');
var del = require('del');

gulp.task('default', ['js','images','fonts','css','bootstrap','bower','less','pages','watch','webserver']);

// Moving al your JS files to your running folder

var paths = {
	js: 'src/js/**/*.js',
	assets: ['src/img/**/*','src/css/**/*','src/fonts/**/*'],
	pages: 'src/*.html',
	less: 'src/styles/less/**/*.less'
}


gulp.task('js', function(){
	gulp.src('src/js/**/*.js')
	.pipe(gulp.dest('dist/js/'));

});

// Moving your assets to your running folder

gulp.task('images', function(){

	del('dist/img/**/*',function(){
		gulp.src('src/img/**/*')
		.pipe(gulp.dest('dist/img/'));
	});

});

gulp.task('fonts', function(){

	del('dist/fonts/**/*',function(){

		gulp.src('src/fonts/**/*')
		.pipe(gulp.dest('dist/fonts/'));

	});

});

gulp.task('css', function(){

	del('dist/css/**/*',function(){

		gulp.src('src/css/**/*')
		.pipe(gulp.dest('dist/css/'));

	});

});

// Building your HTML pages using fileInclude package
gulp.task('pages', function(){
	gulp.src(['src/**/*.html','!src/snippets/*.html'])
	.pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
	.pipe(gulp.dest('./dist/'));

});

// Proccessing your LESS stylesheets
gulp.task('less',function(){

	gulp.src('src/styles/less/*.less')
	.pipe(less({
		paths: ['src/styles/less/theme']
	}))
	.pipe(gulp.dest('dist/css'));

});


//Setting up your bootsrap libraries ande dependecies from their bower folders
gulp.task('bootstrap', function(){

	gulp.src('bower_components/jquery/dist/*.min.js')
	.pipe(gulp.dest('dist/js/vendor/'));

	gulp.src('bower_components/bootstrap/dist/fonts/*')
	.pipe(gulp.dest('dist/fonts/'));

	gulp.src('bower_components/bootstrap/dist/js/bootstrap.min.js')
	.pipe(gulp.dest('dist/js/vendor/'));

	gulp.src('bower_components/bootstrap/dist/css/*.min.css')
	.pipe(gulp.dest('dist/css/'));

});

// Preparing other bower dependecies
gulp.task('bower', function(){

// JS Files

// CSS files
	gulp.src('bower_components/components-font-awesome/css/*.min.css')
	.pipe(gulp.dest('dist/css/'));
// Fonts
	gulp.src('bower_components/components-font-awesome/fonts/*')
	.pipe(gulp.dest('dist/fonts/'));


});

gulp.task('watch',function(){

	gulp.watch(paths.js, ['js']);
	gulp.watch('src/img/**/*', ['images']);
	gulp.watch('src/fonts/**/*', ['fonts','bootstrap','bower']);
	gulp.watch('src/css/**/*', ['css','bootstrap','bower','less']);
	gulp.watch('src/**/*.html', ['pages']);
	gulp.watch(paths.less, ['less']);

});

gulp.task('webserver', function() {
  gulp.src('./src')
    .pipe(webserver({
      open: true,
		livereload: true
    }));
});
