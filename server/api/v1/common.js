var debug = require('debug')('server:api:v1:common');
var constant = require('./constant');
var queryExecutor = require('../../helper/mySql');
var dbDateFormat = constant.appConfig.DB_DATE_FORMAT;
var pageSize = constant.appConfig.PAGE_SIZE;
var d3 = require("d3");
let url = require('url');
let querystring = require('querystring');

module.exports.cloneObject = function (obejct) {
  return JSON.parse(JSON.stringify(obejct));
};

module.exports.executeQuery = async function (jsonQuery, cb) {

  if (cb) {
    await queryExecutor.executeQuery(jsonQuery, cb);
  } else {
    return await queryExecutor.executeQuery(jsonQuery);
  }
};

module.exports.sendResponse = function (response, obj, isSuccess) {
  if (isSuccess != undefined) {
    if (isSuccess == true) {
      response.send({
        status: true,
        data: obj
      });
    } else {
      response.send({
        status: false,
        error: obj
      });
    }
  } else {
    response.send(obj);
  }
}

module.exports.validateObject = function (arrParam) {
  arrParam.forEach(function (param) {
    if (param == undefined && typeof param != "object") {
      return false;
    }
  });
  return true;
}

module.exports.validateParams = function (arrParam) {
  let totalParams = arrParam.length;
  let index = 0;
  arrParam.forEach(function (param) {
    if (param != undefined && param != "") {
      index++;
    }
  });
  if (index === totalParams) {
    return true;
  } else {
    return false;
  }
}

module.exports.prepareFieldValue = (userinfo) => {
  let userKeys = Object.keys(userinfo);
  let userfieldValueInsert = [];
  userKeys.forEach(function (userKeys) {
    if (userinfo[userKeys] !== undefined) {
      let fieldValueObj = {};
      fieldValueObj = {
        field: userKeys,
        fValue: userinfo[userKeys]
      }
      userfieldValueInsert.push(fieldValueObj);
    }
  });
  return userfieldValueInsert;
}

module.exports.executeRawQuery = async function (jsonQuery, cb) {
  if (cb) {
    await queryExecutor.executeRawQuery(jsonQuery, cb);
  } else {
    return await queryExecutor.executeRawQuery(jsonQuery);
  }
};