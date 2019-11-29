var express = require('express');
var middleware = require('../../middleware');
var router = express.Router();
module.exports = router;

router.use('/user', middleware.checkRequestHeader, require('./user'));