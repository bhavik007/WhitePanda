const debug = require('debug')('server:api:v1:user:controller');
const userService = require('./user.service');
const constant = require('../constant');
const common = require('../common');

/**
 * Created By: BM
 * Updated By: BM
 * [signup description]
 * @param  {Object} request  [description]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
var signup = async function (request, response) {
    debug("user.controller -> singup");
    try {
        var isValidObject = common.validateObject([request.body]);
        var isValid = common.validateParams([request.body.first_name, request.body.last_name, request.body.email, request.body.mobile, request.body.password, request.body.gender]);
        if (!isValidObject) {
            return await common.sendResponse(response, constant.userMessage.ERR_INVALID_SIGNUP_REQUEST, false);
        }
        else if (!isValid) {
            return await common.sendResponse(response, constant.userMessage.ERR_INVALID_SIGNUP_REQUEST, false);
        }

        let result = await userService.signupService(request);

    } catch (ex) {
        debug(ex);
        return await common.sendResponse(response, constant.userMessages.MSG_ERROR_IN_QUERY, false);
    }
};