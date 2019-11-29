const debug = require('debug')('server:api:v1:user:DAL');
const d3 = require("d3");
const DateLibrary = require('date-management');
const common = require('../common');
const constant = require('../constant');
const query = require('./user.query');
const dbDateFormat = constant.appConfig.DB_DATE_FORMAT;

/**
 * Created By: BM
 * Updated By: BM
 * [checkUserIsExist description]
 * @param  {int}   countryCode [description]
 * @param  {string}   mobile      [description]
 * @param  {string}   email      [description]
 * @param  {Function} cb          [description]
 * @return {[type]}               [description]
 */
let checkUserIsExist = async function (countryCode, mobile, email) {
    debug("user.DAL -> checkUserIsExist");
    let checkUserIsExistQuery = common.cloneObject(query.checkUserIsExistQuery);
    checkUserIsExistQuery.filter.and[0].value = countryCode;
    checkUserIsExistQuery.filter.and[1].value = mobile;
    checkUserIsExistQuery.filter.and[2].value = email;
    if (email == -1) {
        checkUserIsExistQuery.filter.and.splice(2, 1);
    }
    return await common.executeQuery(checkUserIsExistQuery);
};

let createUser = async (fieldValue) => {
    let createUserQuery = common.cloneObject(query.createUserQuery);
    createUserQuery.insert = fieldValue;
    return await common.executeQuery(createUserQuery);
}

let checkOTPLimit = async function (countryCode, mobile) {
    debug("user.DAL -> checkOTPLimit");
    let checkOTPLimitQuery = common.cloneObject(query.checkOTPLimitQuery);
    let currDate = new Date();
    let startDate = d3.timeFormat(dbDateFormat)(DateLibrary.getRelativeDate(currDate, {
        operationType: "First_Date",
        granularityType: "Days"
    }));
    let endDate = d3.timeFormat(dbDateFormat)(DateLibrary.getRelativeDate(currDate, {
        operationType: "Last_Date",
        granularityType: "Days"
    }));
    checkOTPLimitQuery.filter.and[0].value = countryCode;
    checkOTPLimitQuery.filter.and[1].value = mobile;
    checkOTPLimitQuery.filter.and[2].value = startDate;
    checkOTPLimitQuery.filter.and[3].value = endDate;
    return await common.executeQuery(checkOTPLimitQuery);
};

let exprieOTP = async function (countryCode, mobile) {
    debug("user.DAL -> exprieOTP");
    let updateOTPQuery = common.cloneObject(query.updateOTPQuery);
    updateOTPQuery.filter.and[0].value = countryCode;
    updateOTPQuery.filter.and[1].value = mobile;
    return await common.executeQuery(updateOTPQuery);
};

let saveOTP = async function (countryCode, mobile, OTP, expiryDateTime) {
    debug("user.DAL -> saveOTP");
    let saveOTPQuery = common.cloneObject(query.saveOTPQuery);
    let dbExpiryDateTime = d3.timeFormat(dbDateFormat)(new Date(expiryDateTime));
    saveOTPQuery.insert.fValue = [countryCode, mobile, OTP, dbExpiryDateTime];
    return await common.executeQuery(saveOTPQuery);
};

let validOTP = async function (countryCode, mobile, currDateTime) {
    debug("user.DAL -> validOTP");
    let verifyOTPQuery = common.cloneObject(query.verifyOTPQuery);
    verifyOTPQuery.filter.and[0].value = countryCode;
    verifyOTPQuery.filter.and[1].value = mobile;
    verifyOTPQuery.filter.and[2].value = d3.timeFormat(dbDateFormat)(currDateTime);
    return await common.executeQuery(verifyOTPQuery);
};

let updateUserInfoByCountryCodeAndMobile = async function (countryCode, mobile, fieldValue) {
    debug("user.DAL -> updateUserInfoByCountryCodeAndMobile");
    var updateUserQuery = common.cloneObject(query.updateUserQuery);
    updateUserQuery.filter.or[0].and[0].value = countryCode;
    updateUserQuery.filter.or[0].and[1].value = mobile;
    updateUserQuery.update = fieldValue;
    return await common.executeQuery(updateUserQuery);
};

let checkUserEmailAndPassword = async function (countryCode, email, password) {
    debug("user.DAL -> checkUserEmailAndPassword");
    var checkUserEmailAndPasswordQuery = common.cloneObject(query.checkUserEmailAndPasswordQuery);
    checkUserEmailAndPasswordQuery.filter.and[0].value = password;
    checkUserEmailAndPasswordQuery.filter.and[1].or[0].value = email;
    checkUserEmailAndPasswordQuery.filter.and[1].or[1].and[0].value = email;
    checkUserEmailAndPasswordQuery.filter.and[1].or[1].and[1].value = countryCode;
    return await common.executeQuery(checkUserEmailAndPasswordQuery);
};

let updateUserByUserId = async function (userId, filedValueUpdate) {
    debug("user.DAL -> updateUserByUserIdQuery");
    var updateUserByUserIdQuery = common.cloneObject(query.updateUserByUserIdQuery);
    updateUserByUserIdQuery.filter.value = userId;
    updateUserByUserIdQuery.update = filedValueUpdate;
    return await common.executeQuery(updateUserByUserIdQuery);
};

let exprieAccessToken = async (userId, deviceId) => {
    debug("user.DAL -> exprieAccessToken");
    let exprieAccessTokenQuery = common.cloneObject(query.exprieAccessTokenQuery);
    exprieAccessTokenQuery.filter.and[0].value = userId;
    exprieAccessTokenQuery.filter.and[1].value = deviceId;
    return common.executeQuery(exprieAccessTokenQuery);
}

let createAccessToken = async (userId, deviceType, deviceId, token, expiryDateTime) => {
    debug("user.DAL -> createAccessToken");
    let createAccessTokenQuery = common.cloneObject(query.createAccessTokenQuery);
    createAccessTokenQuery.insert.fValue = [userId, deviceType, deviceId, token, expiryDateTime, 1];
    return common.executeQuery(createAccessTokenQuery);
}

module.exports = {
    checkUserIsExist: checkUserIsExist,
    createUser: createUser,
    checkOTPLimit: checkOTPLimit,
    exprieOTP: exprieOTP,
    saveOTP: saveOTP,
    validOTP: validOTP,
    updateUserInfoByCountryCodeAndMobile: updateUserInfoByCountryCodeAndMobile,
    checkUserEmailAndPassword: checkUserEmailAndPassword,
    updateUserByUserId: updateUserByUserId,
    exprieAccessToken: exprieAccessToken,
    createAccessToken: createAccessToken,
    getUserInfo: checkUserIsExist,
}