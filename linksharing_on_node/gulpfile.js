/* jshint node:true */
'use strict';

var gulp = require('gulp');
var karma = require('karma').server;
var argv = require('yargs').argv;
var $ = require('gulp-load-plugins')();
// app.js
var express = require('express');
var app = module.exports.app = exports.app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing 6//CORS middleware

const cors = require('cors');
app.use(cors());
app.options('*', cors());

const MongoClient = require('mongodb').MongoClient;

var db = null;

MongoClient.connect('mongodb://localhost:27017/my-test', function (err, database) {
    if (err) return console.log(err)
    db = database;

    var server = app.listen(9090, function () {
        var host = server.address().address
        var port = server.address().port

        console.log("Linksharing app listening at http://%s:%s", host, port)
    })
});


app.post('/user/login', function (req, res) {
    db.collection("user").find(req.body).toArray(function (err, result) {
        if (result.length ==0) {
            res.send({status: 'failed', message: 'something wrong with your username password'})
        }
        else{
            res.send({message: 'login successfully', status: 'ok'});

        }
    });
});

app.get('/user/profile', function (req, res) {
    db.collection("user").find(req.body).toArray(function (err, result) {
        if (result.length ==0) {
            res.send({status: 'failed', message: 'something wrong with your username password'})
        }
        else{
            res.send(result[0]);

        }
    });
});
app.get('/user/topicList', function (req, res) {
    db.collection("topic").find(req.body).toArray(function (err, result) {
        if (result.length ==0) {
            res.send({status: 'failed', message: 'no data'})
        }
        else{
            res.send(result);

        }
    });
});

app.post('/user/topicCreate', function (req, res) {
    db.collection("topic").save(req.body ,function (err, result) {
        if (result.length ==0) {
            res.send({status: 'failed', message: 'no data'})
        }
        else{
            db.collection("topic").find(req.body).toArray(function (err, result) {
                if (result.length ==0) {
                    res.send({status: 'failed', message: 'no data'})
                }
                else{
                    res.send(req.body);

                }
            });

        }
    });
});

app.post('/user/topicDelete', function (req, res) {
    db.collection("topic").delete(req.body ,function (err, result) {
        if (result.length ==0) {
            res.send({status: 'failed', message: 'error occured while delete topic'})
        }
        else{
            db.collection("topic").find(req.body).toArray(function (err, result) {
                if (result.length ==0) {
                    res.send({status: 'failed', message: 'no data'})
                }
                else{
                    res.send(req.body);

                }
            })

        }
    });
});



app.post('/user/register', function (req, res) {
    db.collection('user').save(req.body, function (err, result) {
        if (err) {
            res.send({status: 'failed', massage: 'error occured while saving the user'})
        }
        else {
            res.send({status: 'ok', massage: 'you are registered successfully'})
        }
    });
});


gulp.task('styles', function () {
    return gulp.src('app/styles/main.less')
        .pipe($.plumber())
        .pipe($.less())
        .pipe($.autoprefixer({browsers: ['last 1 version']}))
        .pipe(gulp.dest('.tmp/styles'));
});

gulp.task('jshint', function () {
    return gulp.src('app/scripts/**/*.js')
        .pipe($.jshint())
    //.pipe($.jshint.reporter('jshint-stylish'))
    //.pipe($.jshint.reporter('fail'));
});

gulp.task('jscs', function () {
    return gulp.src('app/scripts/**/*.js')
        .pipe($.jscs());
});

gulp.task('html', ['styles'], function () {
    var lazypipe = require('lazypipe');
    var cssChannel = lazypipe()
        .pipe($.csso)
        .pipe($.replace, 'bower_components/bootstrap/fonts', 'fonts');

    var assets = $.useref.assets({searchPath: '{.tmp,app}'});

    return gulp.src('app/**/*.html')
        .pipe(assets)
        .pipe($.if('*.js', $.ngAnnotate()))
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', cssChannel()))
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
        .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
    return gulp.src('app/images/**/*')
        // .pipe($.cache($.imagemin({
        //   progressive: true,
        //   interlaced: true
        // })))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function () {
    return gulp.src(require('main-bower-files')().concat('app/fonts/**/*')
        .concat('bower_components/bootstrap/fonts/*'))
        .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
        .pipe($.flatten())
        .pipe(gulp.dest('dist/fonts'))
        .pipe(gulp.dest('.tmp/fonts'));
});

gulp.task('extras', function () {
    return gulp.src([
        'app/*.*',
        '!app/*.html',
        'node_modules/apache-server-configs/dist/.htaccess'
    ], {
        dot: true
    }).pipe(gulp.dest('dist'));
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

gulp.task('connect', ['styles'], function () {
    var serveStatic = require('serve-static');
    var serveIndex = require('serve-index');
    var app = require('connect')()
        .use(require('connect-livereload')({port: 35729}))
        .use(serveStatic('.tmp'))
        .use(serveStatic('app'))
        // paths to bower_components should be relative to the current file
        // e.g. in app/index.html you should use ../bower_components
        .use('/bower_components', serveStatic('bower_components'))
        .use(serveIndex('app'));

    require('http').createServer(app)
        .listen(9000)
        .on('listening', function () {
            console.log('Started connect web server on http://localhost:9000');
        });
});

gulp.task('serve', ['wiredep', 'connect', 'fonts', 'watch'], function () {
    if (argv.open) {
        require('opn')('http://localhost:9000');
    }
});

gulp.task('test', function (done) {
    karma.start({
        configFile: __dirname + '/test/karma.conf.js',
        singleRun: true
    }, done);
});

// inject bower components
gulp.task('wiredep', function () {
    var wiredep = require('wiredep').stream;
    var exclude = [
        'bootstrap',
        'jquery',
        'es5-shim',
        'json3',
        'angular-scenario'
    ];

    gulp.src('app/styles/*.less')
        .pipe(wiredep())
        .pipe(gulp.dest('app/styles'));

    gulp.src('app/*.html')
        .pipe(wiredep({exclude: exclude}))
        .pipe(gulp.dest('app'));

    gulp.src('test/*.js')
        .pipe(wiredep({exclude: exclude, devDependencies: true}))
        .pipe(gulp.dest('test'));
});

gulp.task('watch', ['connect'], function () {
    $.livereload.listen();

    // watch for changes
    gulp.watch([
        'app/**/*.html',
        '.tmp/styles/**/*.css',
        'app/scripts/**/*.js',
        'app/images/**/*'
    ]).on('change', $.livereload.changed);

    gulp.watch('app/styles/**/*.less', ['styles']);
    gulp.watch('bower.json', ['wiredep']);
});

gulp.task('builddist', ['jshint', 'jscs', 'html', 'images', 'fonts', 'extras'],
    function () {
        return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
    });

gulp.task('build', ['clean'], function () {
    gulp.start('builddist');
});

gulp.task('docs', [], function () {
    return gulp.src('app/scripts/**/**')
        .pipe($.ngdocs.process())
        .pipe(gulp.dest('./docs'));
});
