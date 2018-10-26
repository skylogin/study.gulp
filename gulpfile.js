var gulp = require("gulp");
var server = require("gulp-webserver");
var jshint = require("gulp-jshint");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var filesize = require("gulp-filesize");
var clean = require("gulp-clean");
var watch = require("gulp-watch");
var minify = require("gulp-minify-html");
var stripDebug = require("gulp-strip-debug");
var livereload = require("gulp-livereload");

var src = "public/src";
var dist = "public/dist";

var paths = {
	js: src + "/js/*.js",
	html: src + "/*.html"
}


gulp.task("default", ["build"], function(){
	console.log("gulp job finish...");
});


gulp.task("build", ["server", "concat", "uglify", "minify", "watch"], function(){
	console.log("All build job finish...");
});
	
gulp.task("htmlBuild", ["minify"], function(){
	console.log("html build job finish...");
});
gulp.task("jsBuild", ["concat", "uglify"], function(){
	console.log("js build job finish...");
});


//server 수행
gulp.task("server", function(){
	gulp.src(dist + "/")
			.pipe(server({
							livereload: true,
							directoryListing: false,
							open: false 
					})
			);
});

//js hint로 js파일 문법 검사
gulp.task("jshint", function(){
	gulp.src(src + "/js/*.js")
			.pipe(jshint())
			.pipe(jshint.reporter("jshint-stylish"));
});

//개발과정의 log, alert등을 제거
gulp.task("stripDebug", function(){
	gulp.src(src + "/js/*.js")
			.pipe(stripDebug());
});

//js파일들을 이어 붙인다.
gulp.task("concat", ["jshint", "stripDebug"], function(){
	gulp.src(dist + "/js/*.js")
			.pipe(concat("combined.js"))
			.pipe(gulp.dest("public/dist/js"));
});

//js 압축
gulp.task("uglify", function(){
	gulp.src(dist + "/js/combined.js")
			.pipe(uglify())
			.pipe(rename("combined.min.js"))
			.pipe(gulp.dest(dist + "/js"));
});


//html 압축
gulp.task("minify", function(){
	gulp.src(paths.html)
			.pipe(minify())
			.pipe(gulp.dest(dist + "/"));
});


//watch
gulp.task("watch", function(){
	livereload.listen();
	gulp.watch(paths.js, ["jsBuild"]);
	gulp.watch(paths.html, ["htmlBuild"]);
});

