var express = require('express');
var service = require('./user.service');
var middleware = require('../../../middleware');

var router = express.Router();
module.exports = router;

router.post('/user-signup', service.signup);
router.post('/verify-otp', service.verifyOtp)
router.post('/user-signin', service.signin);
router.post('/user-signin-with-otp', service.signinWithOtp);
router.put('/user-signout', middleware.checkAccessToken, service.signOut);