const User = require('../models/user');

module.exports.reg = (req, res) => {
    res.render('users/register');
}

module.exports.regPost = async (req, res, next) => {
    try {
        const { username, nickname, password } = req.body;
        const user = new User({ username, nickname });
        const newUser = await User.register(user, password);
        req.login(newUser, err => {
            if (err) return next(err);
            req.flash('success', "註冊成功，歡迎加入!");
            res.redirect('/animals');
        });
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/animals');
    }

}

module.exports.login = (req, res) => {
    res.render('users/login');
}

module.exports.loginPost = async (req, res) => {
    req.flash('success', "成功登錄!");
    const redirectUrl = req.session.targetUrl || '/animals';
    delete req.session.targetUrl;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', "成功登出!");
        res.redirect('/animals');
    });
}