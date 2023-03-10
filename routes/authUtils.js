function requireUserIsAuth(request, response, next) {
    if (request.isAuthenticated()) {
        return next();
    }
    response.sendStatus(403);
}

module.exports = {
    requireUserIsAuth,
};
