var _ = require('underscore')
	, passport = require('passport')
	, scrunch = require('scrunch');

exports.apply = function(app) {
	app.get('/', function(req, res){
		res.render('index', fluff(req, {
			title: 'Home'
		}));
	});

	app.get('/account', ensureAuthenticated, function(req, res){
		res.render('account', fluff(req, {
			title: 'My account'
		}));
	});

	app.get('/login', function(req, res){
		res.render('login', fluff(req, {
			title: 'Log in'
		}));
	});



	//authentication
	app.get('/auth/google',
		passport.authenticate('google', { scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email'] }),
		function(req, res){}
	);
	app.get('/auth/google/callback', 
		passport.authenticate('google', { failureRedirect: '/login' }),
		function(req, res) {
			res.redirect('/');
		}
	);
	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});


	//bundles
	app.get('/js/layout.js', scrunch.combine([
		__dirname+'/public/js/bootstrap/bootstrap-affix.js',
		__dirname+'/public/js/bootstrap/bootstrap-alert.js',
		__dirname+'/public/js/bootstrap/bootstrap-button.js',
		__dirname+'/public/js/bootstrap/bootstrap-carousel.js',
		__dirname+'/public/js/bootstrap/bootstrap-collapse.js',
		__dirname+'/public/js/bootstrap/bootstrap-dropdown.js',
		__dirname+'/public/js/bootstrap/bootstrap-modal.js',
		__dirname+'/public/js/bootstrap/bootstrap-popover.js',
		__dirname+'/public/js/bootstrap/bootstrap-scrollspy.js',
		__dirname+'/public/js/bootstrap/bootstrap-tab.js',
		__dirname+'/public/js/bootstrap/bootstrap-tooltip.js',
		__dirname+'/public/js/bootstrap/bootstrap-transition.js',
		__dirname+'/public/js/bootstrap/bootstrap-typeahead.js',
	], {
		minifyJS: false,
		compress: false, 
	}));
	console.log(__dirname+'/public/js/utils.js')
	app.get('/js/index.js', scrunch.combine([
		__dirname+'/public/js/utils.js',
		__dirname+'/public/js/tft.dnd.js',
		__dirname+'/public/js/tft.dnd.data.js',
	], {
		minifyJS: false,
		compress: false, 
	}));
};

function fluff(req, _model) {
	var model = _model || {};
	return _.extend(model, {
		user: req.user
	})
}

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/login');
}