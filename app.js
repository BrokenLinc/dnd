var express = require('express')
	, http = require('http')
	, passport = require('passport')
	, GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
	, lessCSS = require('less-middleware')
	, settings = require('./settings.js')
	, routes = require('./routes.js');

//configure passport
passport.serializeUser(function(user, done) {
	done(null, user);
});
passport.deserializeUser(function(obj, done) {
	done(null, obj);
});
passport.use(new GoogleStrategy({
		clientID: settings.GOOGLE_CLIENT_ID,
		clientSecret: settings.GOOGLE_CLIENT_SECRET,
		callbackURL: settings.GOOGLE_CALLBACK_URL
	},
	function(accessToken, refreshToken, profile, done) {
		process.nextTick(function () {
			return done(null, profile);
		});
	}
));


//create and configure app
var app = express();

// all environments
app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser(settings.COOKIE_SECRET));
	app.use(express.session({ secret: settings.SESSION_SECRET }));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
	app.use(lessCSS({
		src: __dirname + '/public',
		compress: true
	}));
	app.use(express.static(__dirname + '/public'));
})

// development only
app.configure('development', function(){
	app.use(express.errorHandler());
});

//add routes
routes.apply(app);

var server = http.createServer(app);
server.listen(settings.PORT);