module.exports =  app => {

	app.get('/', (req, res, next) => {
		res.render('index');
	}); 


	app.get('/signin', (req, res, next) => {
		res.render('account/signin', { error: 'None' });
	});

	app.post('/signin', (req, res, next) => {

		// you might like to do a database look-up or something more scalable here
		if (req.body.user_email === 'email' && req.body.password === 'password') {
			req.session.authenticated = true;
			res.redirect('chat/home');
		} else {
			res.render('account/signin', { error: 'Username and password are incorrect' });
		}
	});

	app.get('/signout', (req, res, next) => {
		delete req.session.authenticated;
		res.redirect('/');
	});

};