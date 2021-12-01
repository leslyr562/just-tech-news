const withAuth = (req, res, next) => {
    if(!req.session.user_id) {
        res.redirect('login');
    } else{
        next()
    }
}
module.exports = withAuth;
//authentication of the page to see if the user is logged in