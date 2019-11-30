const debug = require('debug')('server:api:v1:common');
const constant = require('./constant');
const queryExecutor = require('../../helper/mySql');

cloneObject = (obejct) => {
  return JSON.parse(JSON.stringify(obejct));
};

executeQuery = async (jsonQuery, cb) => {

  if (cb) {
    await queryExecutor.executeQuery(jsonQuery, cb);
  } else {
    return await queryExecutor.executeQuery(jsonQuery);
  }
};

sendResponse = (response, obj, isSuccess) => {
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

validateObject = (arrParam) => {
  arrParam.forEach((param) => {
    if (param == undefined && typeof param != "object") {
      return false;
    }
  });
  return true;
}

validateParams = (arrParam) => {
  let totalParams = arrParam.length;
  let index = 0;
  arrParam.forEach((param) => {
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

prepareFieldValue = (userinfo) => {
  let userKeys = Object.keys(userinfo);
  let userfieldValueInsert = [];
  userKeys.forEach((userKeys) => {
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

executeRawQuery = async (jsonQuery, cb) => {
  if (cb) {
    await queryExecutor.executeRawQuery(jsonQuery, cb);
  } else {
    return await queryExecutor.executeRawQuery(jsonQuery);
  }
};

module.exports = {
  cloneObject: cloneObject,
  executeRawQuery: executeRawQuery,
  prepareFieldValue: prepareFieldValue,
  validateParams: validateParams,
  validateObject: validateObject,
  sendResponse: sendResponse,
  executeQuery: executeQuery
}