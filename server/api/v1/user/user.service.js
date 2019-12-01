const debug = require('debug')('server:api:v1:user:service');
const md5 = require('md5');
const uuid = require('uuid');
const DateLibrary = require('date-management');
const randomstring = require("randomstring");
const common = require('../common');
const constant = require('../constant');
const userDAL = require('./user.DAL');
const dbDateFormat = constant.appConfig.DB_DATE_FORMAT;
const sendSMSObj = require('../../../helper/sendsms');
const config = require('../../../../config');
const smsConfig = config.smsConfig;

/**
 * Created By: BM
 * Updated By: BM
 * [signup description]
 * @param  {Object} request  [description]
 * @param  {Object} response [description]
 * @return {[type]}          [description]
 */
let signupService = async function (request, response) {
    debug("user.service -> signupService");
    try {
        let isValidObject = common.validateObject([request.body]);
        let isValid = common.validateParams([request.body.first_name, request.body.last_name, request.body.email, request.body.mobile, request.body.password]);
        if (!isValidObject) {
            return await common.sendResponse(response, constant.userMessage.ERR_INVALID_SIGNUP_REQUEST, false);
        } else if (!isValid) {
            return await common.sendResponse(response, constant.userMessage.ERR_INVALID_SIGNUP_REQUEST, false);
        }
        var userinfo = {};

        userinfo.firstName = request.body.first_name;
        userinfo.lastName = request.body.last_name;
        userinfo.email = request.body.email;
        userinfo.countryCode = request.body.country_code !== undefined ? request.body.country_code : "+91";
        userinfo.mobile = request.body.mobile;
        // userinfo.gender = request.body.gender;
        userinfo.password = md5(request.body.password);

        let userExist = await userDAL.checkUserIsExist(userinfo.countryCode, userinfo.mobile, userinfo.email);
        if (userExist.status === false) {
            return await common.sendResponse(response, userExist, false);
        } else {
            let userInfo = userExist.content[0];
            if (userExist.content.length > 0 && userInfo.is_active == 0) {
                return await common.sendResponse(response, constant.userMessage.ERR_USER_IS_NOT_ACTIVE, false);
            } else if (userExist.content.length > 0) {
                return await common.sendResponse(response, constant.userMessage.ERR_USER_IS_ALREADY_EXIST, false);
            } else {
                let fieldValue = common.prepareFieldValue(userinfo);
                let userResult = await userDAL.createUser(fieldValue);
                if (userResult.status === false) {
                    return await common.sendResponse(response, userExist, false);
                } else {
                    let result = await sendOTP(userinfo.countryCode, userinfo.mobile);
                    if (result.status === true) {
                        return common.sendResponse(response, result.data, true);
                    } else {
                        return common.sendResponse(response, result.error, false);
                    }
                }
            }
        }
    } catch (ex) {
        debug(ex);
        return await common.sendResponse(response, constant.userMessage.ERR_WHILE_ADD_USER, false);
    }
};

async function sendOTP(countryCode, mobile) {
    debug("user.service -> sendOTP");
    let checkOtpLength = await userDAL.checkOTPLimit(countryCode, mobile);
    if (checkOtpLength.status === false) {
        return checkOtpLength;
    } else if (checkOtpLength.status === true && checkOtpLength.content.length > 0 && checkOtpLength.content[0].totalCount >= constant.appConfig.MAX_OTP_SEND_LIMIT) {
        return {
            status: false,
            error: constant.userMessage.ERR_OTP_LIMIT_EXCEEDED
        };
    } else {
        let expireOtp = await userDAL.exprieOTP(countryCode, mobile);
        if (expireOtp.status === false) {
            return expireOtp;
        } else {
            let OTP = randomstring.generate(constant.appConfig.OTP_SETTINGS);
            let expiryDateTime = DateLibrary.getRelativeDate(new Date(), {
                operationType: "Absolute_DateTime",
                granularityType: "Seconds",
                value: constant.appConfig.MAX_OTP_EXPIRY_SECONDS
            });
            let saveOtp = await userDAL.saveOTP(countryCode, mobile, OTP, expiryDateTime);
            if (saveOtp.status === false) {
                return saveOtp;
            } else {
                saveOtp.data = common.cloneObject(constant.userMessage.MSG_OTP_SENT_SUCCEFULLY);
                saveOtp.data.message = saveOtp.data.message.replace("{{mobile}}", mobile.replace(/\d(?=\d{4})/g, "*"));
                // HACK remove below line when SMS flow implement
                if (smsConfig.test === true) {
                    saveOtp.data.otp = OTP;
                } else {
                    let countryCodeMobile = countryCode + mobile;
                    let data = {
                        otp: OTP
                    }
                }
                return saveOtp;
            }
        }
    }
}

let verifyOTPService = async function (request, response) {
    debug("user.service -> verifyOTPService");
    try {
        let isValidObject = common.validateObject([request.body]);
        let isValid = common.validateParams([request.body.mobile, request.body.otp]);
        if (!isValidObject) {
            return await common.sendResponse(response, constant.userMessage.ERR_INVALID_VERIFY_OTP_REQUEST, false);
        } else if (!isValid) {
            return await common.sendResponse(response, constant.userMessage.ERR_INVALID_VERIFY_OTP_REQUEST, false);
        }
        let mobile = request.body.mobile;
        let countryCode = request.body.country_code != undefined ? request.body.country_code : "+91";
        let OTP = request.body.otp;
        let verifiedOtp = await verifyOTP(countryCode, mobile, OTP);
        if (verifiedOtp.status === false) {
            return await common.sendResponse(response, verifiedOtp.error, false);
        } else {
            let userInfo = await userDAL.getUserInfo(countryCode, mobile, -1);
            let result = await createAccessToken(request, userInfo.content[0].user_id);
            userInfo.content[0].access_token = result.data.access_token;
            return await common.sendResponse(response, userInfo.content[0], true);
        }
    } catch (ex) {
        debug(ex);
        return await common.sendResponse(response, ex, false);
    }
};

let signinService = async (request, response) => {
    debug("user.service -> signinService");
    try {
        let isValidObject = common.validateObject([request.body]);
        let isValid = common.validateParams([request.body.user_name, request.body.password]);
        if (!isValidObject) {
            return await common.sendResponse(response, constant.userMessage.ERR_INVALID_SIGNUP_REQUEST, false);
        } else if (!isValid) {
            return await common.sendResponse(response, constant.userMessage.ERR_INVALID_SIGNUP_REQUEST, false);
        }
        let countryCode = "+91";
        let userName = request.body.user_name;
        let password = md5(request.body.password);
        let checkUserEmailPassword = await userDAL.checkUserEmailAndPassword(countryCode, userName, password);
        if (checkUserEmailPassword.status === true && checkUserEmailPassword.content.length > 0) {
            if ((checkUserEmailPassword.content[0].email == userName || checkUserEmailPassword.content[0].mobile == userName) && checkUserEmailPassword.content[0].password == password && checkUserEmailPassword.content[0].is_active == 1) {
                let userInfo = await userDAL.getUserInfo(countryCode, checkUserEmailPassword.content[0].mobile, -1);
                let result = await createAccessToken(request, checkUserEmailPassword.content[0].user_id);
                userInfo.content[0].access_token = result.data.access_token;
                return await common.sendResponse(response, userInfo.content[0], true);
            } else if (checkUserEmailPassword.content[0].email == email && checkUserEmailPassword.content[0].password == password && checkUserEmailPassword.content[0].is_active == 0) {
                return await common.sendResponse(response, constant.userMessage.ERR_USER_IS_BLOCKED, false);
            } else {
                return await common.sendResponse(response, constant.userMessage.USER_DOSE_NOT_EXIST, false);
            }
        } else if (checkUserEmailPassword.status === true && checkUserEmailPassword.content.length === 0) {
            return await common.sendResponse(response, constant.userMessage.USER_DOSE_NOT_EXIST, false);
        } else {
            return await common.sendResponse(response, constant.userMessage.ERR_WHILE_SIGN_IN, false);
        }
    } catch (ex) {
        debug(ex);
        return await common.sendResponse(response, constant.userMessage.ERR_WHILE_SIGN_IN, false);
    }
}

async function verifyOTP(countryCode, mobile, OTP) {
    debug("user.service -> verifyOTP");
    let currDateTime = new Date();
    let validateOtp = await userDAL.validOTP(countryCode, mobile, currDateTime);
    if (validateOtp.status === false) {
        return validateOtp;
    } else if (validateOtp.content.length === 0) {
        return {
            status: false,
            error: constant.userMessage.ERR_OTP_IS_EXPIRED
        }
    } else if (validateOtp.content.length > 0) {
        if (validateOtp.content[0].otp != OTP) {
            return {
                status: false,
                error: constant.userMessage.ERR_OTP_INVALID
            }
        } else if (validateOtp.content[0].otp == OTP && new Date(validateOtp.content[0].expiry_datetime).getTime() < currDateTime.getTime()) {
            return {
                status: false,
                error: constant.userMessage.ERR_OTP_IS_EXPIRED
            }
        } else {
            var filedValueUpdate = [{
                field: 'isVerified',
                fValue: 1
            }];
            // let result = promises.all([
            let result1 = await userDAL.updateUserInfoByCountryCodeAndMobile(countryCode, mobile, filedValueUpdate);
            let result2 = await userDAL.exprieOTP(countryCode, mobile);
            // ]);
            if (result1.status === false || result2.status === false) {
                return {
                    status: false,
                    error: constant.userMessage.ERR_OTP_INVALID
                }
            } else {
                return {
                    status: true,
                    data: constant.userMessage.OTP_VERIFIED_SUCCESSFULLY
                }
            }
        }
    }
}

let forgotPasswordService = async (request, response) => {
    debug("user.service -> forgotPasswordService");
    try {
        let mobile = request.body.mobile;
        let countryCode = request.body.country_code !== undefined ? request.body.country_code : "+91";
        let result = await sendOTP(countryCode, mobile);
        if (result.status === true) {
            return common.sendResponse(response, result.data, true);
        } else {
            return common.sendResponse(response, result.error, false);
        }
    } catch (ex) {
        debug(ex);
        return common.sendResponse(response, ex, false);
    }
}

async function createAccessToken(request, userId) {
    let token = uuid.v1();
    let deviceId = request.headers["udid"];
    let deviceType = (request.headers["device-type"]).toLowerCase();
    let expiryDateTime = DateLibrary.getRelativeDate(new Date(), {
        operationType: "Absolute_DateTime",
        granularityType: "hours",
        value: constant.appConfig.MAX_ACCESS_TOKEN_EXPIRY_HOURS
    });
    let expireAccessToken = await userDAL.exprieAccessToken(userId, deviceId);
    if (expireAccessToken.status === false) {
        return newAccessToken;
    } else {
        let newAccessToken = await userDAL.createAccessToken(userId, deviceType, deviceId, token, expiryDateTime);
        if (newAccessToken.status === false) {
            return newAccessToken;
        } else {
            return {
                status: true,
                data: {
                    "access_token": token
                }
            }
        }
    }
};

let updatePasswordService = async (request, response) => {
    debug("user.service -> updatePasswordService");
    try {
        let userId = request.session.userInfo.userId;
        let password = md5(request.body.password);
        let filedValueUpdate = [{
            field: 'password',
            fValue: password
        }];
        let result = await userDAL.updateUserByUserId(userId, filedValueUpdate);
        if (result.status === true) {
            return common.sendResponse(response, constant.userMessage.MSG_PASSWORD_CHANGES_SUCCESSFULLY, false);
        } else {
            return common.sendResponse(response, constant.userMessage.ERR_PASSWORD_CHANGE, false);
        }

    } catch (ex) {
        debug(ex);
        return common.sendResponse(response, constant.userMessage.ERR_PASSWORD_CHANGE, false);
    }
};

let signinWithOtpService = async (request, response) => {
    debug("user.service -> updatePasswordService");
    try {
        let mobile = request.body.mobile;
        let countryCode = '+91';
        let userExist = userDAL.checkUserIsExist(countryCode, mobile, -1);
        if (userExist.status === false) {
            return await common.sendResponse(response, userExist, false);
        } else {
            let result = await sendOTP(countryCode, mobile);
            if (result.status === true) {
                return common.sendResponse(response, result.data, true);
            } else {
                return common.sendResponse(response, result.error, false);
            }
        }
    } catch (ex) {
        debug(ex);
        return common.sendResponse(response, constant.userMessage.ERR_WHILE_SIGN_IN_WITH_OTP, false);
    }
}

let signOutService = async (request, response) => {
    debug("user.service -> signOutService");
    try {
        let accessToken = request.body.access_token;
        let expireAccessToken = userDAL.expireAccessTokenByAccessToken(accessToken);
        if (expireAccessToken.status === false) {
            return await common.sendResponse(response, constant.userMessage.ERR_WHILE_SIGN_OUT, false);
        } else {
            return common.sendResponse(response, constant.userMessage.SIGN_OUT_SUCCESSFUL, true);
        }
    } catch (ex) {
        debug(ex);
        return common.sendResponse(response, constant.userMessage.ERR_WHILE_SIGN_OUT, false);
    }
}

module.exports = {
    signup: signupService,
    verifyOtp: verifyOTPService,
    signin: signinService,
    forgotPassword: forgotPasswordService,
    updatePassword: updatePasswordService,
    signinWithOtp: signinWithOtpService,
    signOut: signOutService
}