const ensureAuthenticated = (req, res, next) => {
    req.isAuthenticated() ? next() : res.redirect('/signin');
}
const forwardAuthenticated = (req, res, next) => {
    !req.isAuthenticated() ? next() : res.redirect('/home')
}

module.exports = {
    ensureAuthenticated,
    forwardAuthenticated
}