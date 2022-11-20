const express = require('express');
const passport = require('passport');
const router = express.Router();
const catchAsync = require('../utils/catchAsync.js');
const usersCtr = require('../controllers/users.js');

router.route('/register')
    .get(usersCtr.reg)
    .post(catchAsync(usersCtr.regPost));

router.route('/login')
    .get(usersCtr.login)
    .post(
        passport.authenticate(
            'local', 
            { failureFlash: '登錄失敗', 
              failureRedirect: '/login', 
              keepSessionInfo: true }), 
        catchAsync(usersCtr.loginPost));

router.get('/logout', usersCtr.logout);


module.exports = router;