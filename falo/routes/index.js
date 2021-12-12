module.exports = app => {
	const { userController } = require('../controllers')
	const { ensureAuthenticated, forwardAuthenticated } = require('../middlewares/auth');
	const flash = require('connect-flash');
	const session = require('express-session');
	const passport = require('passport');
	require('../config/passport')(passport)

	app.use(session({
		secret: 'NTA&LTV&LTL_often127',
		resave: true,
		saveUninitialized: true,
	}))
	app.use(passport.initialize())
	app.use(passport.session())

	app.use(flash());

	app.get('/', forwardAuthenticated, (req, res, next) => {
		res.render('index');
	});

	app.get('/signin', forwardAuthenticated, (req, res, next) => {
		res.render('account/signin');
	});

	app.post('/signin', forwardAuthenticated, userController.signIn)

	app.get('/signout', ensureAuthenticated, (req, res, next) => {
		req.logout()
		req.flash('success_msg', 'Bạn đã đăng xuất')
		res.redirect('/');
	});

	app.get('/signup', (req, res, next) => {
		res.render('account/signup');
	});

	app.post('/signup', userController.signUp)

	app.get('/home', ensureAuthenticated, (req, res, next) =>
		res.render('chat/home', { user: req.user })
	)
	
};