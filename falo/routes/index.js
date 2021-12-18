module.exports = app => {
	const { userController, chatController } = require('../controllers')
	const { ensureAuthenticated, forwardAuthenticated } = require('../middlewares/auth')
	const flash = require('connect-flash')
	const session = require('express-session')
	const passport = require('passport')
	require('../config/passport')(passport)

	app.use(session({
		name: 'chat-app-session',
		secret: 'NTA&LTV&LTL_often127',
		resave: true,
		saveUninitialized: true,
	}))
	app.use(passport.initialize())
	app.use(passport.session())
	app.use(flash())

	app.get('/', forwardAuthenticated, (req, res, next) => {
		res.render('index')
	})

	app.get('/signin', forwardAuthenticated, (req, res, next) => {
		res.render('account/signin')
	})

	app.post('/signin', forwardAuthenticated, userController.signIn)

	app.get('/signout', ensureAuthenticated, (req, res, next) => {
		req.logout()
		res.redirect('/')
	})

	app.get('/signup', (req, res, next) => {
		res.render('account/signup')
	})

	app.post('/signup', userController.signUp)

	app.get('/profile', ensureAuthenticated, userController.profile)
	app.post('/profile', ensureAuthenticated, userController.updateProfile)
	app.post('/profile/findname', ensureAuthenticated, userController.findProfileNameById)

	app.get('/home', ensureAuthenticated, userController.home)
	
	app.get('/chatroom', ensureAuthenticated, chatController.getChatRoom)
	app.post('/chatroom/id', ensureAuthenticated, chatController.joinChatRoomById)
	app.post('/chatroom/email', ensureAuthenticated, chatController.joinChatRoom)
	app.post('/chatroom/rename', ensureAuthenticated, chatController.renameChatRoom)
	app.post('/chatroom/send', ensureAuthenticated, chatController.sendMessage)
}