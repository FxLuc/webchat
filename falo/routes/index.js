module.exports =  app => {
	const { userController } = require('../controllers');

	app.get('/', (req, res, next) => {
		res.render('index');
	}); 

	app.get('/signin', (req, res, next) => {
		res.render('account/signin', { error: 'None' });
	});

	app.post('/signin', userController.signIn)

	app.get('/signout', (req, res, next) => {
		delete req.session.authenticated;
		res.redirect('/');
	});

};