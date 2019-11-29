const debug = require('debug')('server:middleware');
const constant = require('../server/api/v1/constant');
const queryExecutor = require('./helper/mySql');

var checkRequestHeader = function (request, response, next) {
  debug("middleware -> checkRequestHeader");
  var api_key = request.headers["api-key"];
  var udid = request.headers["udid"];
  var device_type = request.headers["device-type"];
  if (api_key === undefined) {
    return response.send({
      status: false,
      error: constant.requestMessages.ERR_API_KEY_NOT_FOUND
    });

  } else if (api_key != constant.appConfig.APPLICATION_API_KEY) {
    return response.send({
      status: false,
      error: constant.requestMessages.ERR_INVALID_API_KEY
    });
  } else if (udid === undefined) {
    return response.send({
      status: false,
      error: constant.requestMessages.ERR_UDID_NOT_FOUND
    });
  } else if (device_type === undefined) {
    return response.send({
      status: false,
      error: constant.requestMessages.ERR_DEVICE_TYPE_NOT_FOUND
    });
  }

  next();
};

var checkAccessToken = function (request, response, next) {
  debug("middleware -> checkAccessToken");
  try {
    var accessToken = request.headers["authorization"];
    var udid = request.headers["udid"];
    if (accessToken === undefined) {
      response.statusCode = 401;
      return response.send({
        status: false,
        error: {
          code: 401,
          message: "Unauthorized access"
        }
      });
    } else {
      var jsonQuery = {
        join: {
          table: 'tbl_UserMaster',
          alias: 'UM',
          joinwith: [{
            table: "tbl_AccessToken",
            alias: 'AT',
            joincondition: {
              and: [{
                table: 'UM',
                field: 'pk_userID',
                operator: 'EQ',
                value: {
                  table: 'AT',
                  field: 'fk_userID'
                }
              }, {
                field: 'UM.isActive',
                encloseField: false,
                value: 1
              }]
            }
          }]
        },
        select: [{
          field: 'pk_userID',
          alias: 'user_id'
        }, {
          field: 'CONCAT(firstName, " ", lastName)',
          encloseField: false,
          alias: 'name'
        }, {
          field: 'mobile',
          alias: 'mobile'
        }],
        filter: {
          and: [{
            field: 'deviceId',
            operator: 'EQ',
            value: udid
          }, {
            field: 'accessToken',
            operator: 'EQ',
            value: accessToken
          }]
        }
      };
      queryExecutor.executeQuery(jsonQuery, function (result) {
        debug('view_AccessToken Result');
        if (result.status === false) {
          return response.send({
            status: false,
            error: {
              code: 9000,
              message: "Error in executeQuery"
            }
          });
        } else if (result.content.length === 0) {
          response.statusCode = 401;
          return response.send({
            status: false,
            error: {
              code: 401,
              message: "Unauthorized access"
            }
          });
        }
        if (request.session.userInfo === undefined) {
          request.session.userInfo = {
            accessToken: accessToken,
            userId: result.content[0].user_id,
            name: result.content[0].name,
            mobile: result.content[0].mobile
          };
        }
        debug("Session: ", request.session.userInfo);
        next();
      });
    }
  } catch (ex) {
    debug(ex);
  }
};

module.exports = {
  checkRequestHeader: checkRequestHeader,
  checkAccessToken: checkAccessToken,
};