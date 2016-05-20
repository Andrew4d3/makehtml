var gulp = require('gulp');
var gp = require("gulp-load-plugins")({lazy:true});
var browserSync = require('browser-sync').create();
var wiredep = require('wiredep').stream;
var del = require('del');
var path = require('path');
var runSequence = require('run-sequence');
var yargs = require('yargs').argv;

var folders = {
	src : "./src",
	bower: "./bower_components",
	less: "./src/styles/**/*.less",
	html: ["./src/**/*.html", "!./src/+(pages|templates)/**/*.html"]
};

var tasksDefault = [
	"inject",
	"styles",
	"watch"
];

if(yargs.templates){
	tasksDefault.unshift("pages");
	gulp.task("default",function(){
		runSequence.apply({},tasksDefault);
	});
}
else{
	gulp.task("default", tasksDefault);
}

gulp.task('watch', function(){
	browserSync.init({
		server: {
			baseDir: folders.src,
			routes: {
        		"/bower_components": folders.bower
    		}
		}
	});

	var reload = browserSync.reload;
	var stream = browserSync.stream;

	gulp.watch("src/css/*.css",function(){
		gulp.src(folders.src + "/css/*.css")
			.pipe(browserSync.stream());
	});

	gulp.watch("src/**/*.+(png|jpg|jpeg|svg|gif|bmp)",reload);

	gulp.watch("src/js/**/*.js", function(ev){
		if(ev.type === "changed"){
			reload();
		}
		else if (ev.type === "added" || ev.type === "deleted") {
			return gulp.start("inject");
		}
	});

	if(yargs.templates){
		gulp.watch("src/+(pages|templates)/**/*.html").on("change",function(ev){
			if(ev.type !== "deleted"){
				runSequence('pages','inject',reload);
			}
			else{
				var pathFromPages = path.relative(path.resolve('src/pages'), ev.path);
				var srcPath = path.resolve('src');
				var deletePath = path.join(srcPath,pathFromPages);
				return del([deletePath],reload);
			}
		});
	}
	else{
		gulp.watch(["src/**/*.html", "!src/+(pages|templates)/**/*.html"], reload);
	}

	gulp.watch(folders.less,['styles']);

});

gulp.task('bower',function(){
	return gulp.src(folders.html)
		.pipe(wiredep())
		.pipe(gulp.dest(folders.src));
});

gulp.task('inject', ["bower"], function(){
	return gulp.src(["src/**/*.html", "!src/+(pages|templates)/**/*.html"])
		.pipe(gp.inject(gulp.src([folders.src + "/**/*.+(js|css)"],{read: false}),{relative: true}))
		.pipe(gulp.dest(folders.src));
});

gulp.task('styles',function(){
	return gulp.src(folders.src + "/styles/less/styles.less")
	.pipe(gp.plumber())
	.pipe(gp.less({
		paths: [folders.less]
	}))
	.pipe(gulp.dest(folders.src+"/css/"));
});

gulp.task('pages',function(){
	return gulp.src(folders.src + "/pages/**/*.html")
		.pipe(gp.nunjucksRender({path: [folders.src + '/templates']}))
		.pipe(gulp.dest(folders.src));
});

gulp.task('clean-dist', function(){
	return gulp.src("./dist")
		.pipe(gp.clean());
});

gulp.task('move-html', ['clean-dist'], function(){
	return gulp.src(["./src/**/*.html", "!./src/+(pages|templates)/**/*.html"])
		.pipe(gulp.dest("./dist/"));
});

gulp.task('move-js', ['move-html'], function(){
	return gulp.src("./src/js/**/*.js")
		.pipe(gp.concat("scripts.js"))
		.pipe(gp.uglify())
		.pipe(gulp.dest("./dist/js"));
});

gulp.task('move-css', ['move-js'], function(){
	return gulp.src("./src/css/**/*.css")
		.pipe(gp.concat("styles.css"))
		.pipe(gp.cssmin())
		.pipe(gulp.dest("./dist/css"));
});

gulp.task('move-vendors', ['move-css'], function(){
	var jsFilter = gp.filter('**/*.js', {restore: true});
	var cssFilter = gp.filter('**/*.css', {restore: true});
	var fontsFilter = gp.filter('**/fonts/*', {restore: true});
	return gulp.src('bower.json')
		.pipe(gp.mainBowerFiles())
		.pipe(jsFilter)
		.pipe(gp.concat('vendors.js'))
		.pipe(gp.uglify({preserveComments: "all"}))
		.pipe(gulp.dest("./dist/js"))
		.pipe(jsFilter.restore)
		.pipe(cssFilter)
		.pipe(gp.concat('vendors.css'))
		.pipe(gp.cssmin())
		.pipe(gulp.dest("./dist/css"))
		.pipe(cssFilter.restore)
		.pipe(fontsFilter)
		.pipe(gp.flatten())
		.pipe(gulp.dest("./dist/fonts"));
});

gulp.task('move-img', ['move-vendors'], function(){
	return gulp.src(['./src/img/*'])
		.pipe(gulp.dest('./dist/img'));
});

gulp.task('move-fonts', ['move-img'], function(){
	return gulp.src(['./src/fonts/*'])
		.pipe(gulp.dest('./dist/fonts'));
});

gulp.task('replace-bower', ['move-fonts'], function(){
	return gulp.src("./dist/**/*.html")
		.pipe(gp.replace(/(<!-- bower:js -->)([\s\S]*)(<!-- endBowerJs -->)/,""))
		.pipe(gp.replace(/(<!-- bower:css -->)([\s\S]*)(<!-- endBowerCss -->)/,""))
		.pipe(gulp.dest("./dist"));
});

gulp.task('build',['replace-bower'], function(){
	return gulp.src("./dist/**/*.html")
		.pipe(gp.inject(gulp.src(["./dist/**/vendors.+(js|css)", "./dist/**/*.+(js|css)"],{read: false}),{relative: true}))
		.pipe(gulp.dest("./dist"));
});
