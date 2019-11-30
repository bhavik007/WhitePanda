var applicationConfiguration = {
  "MAX_OTP_SEND_LIMIT": 3,
  "MAX_OTP_EXPIRY_SECONDS": 300,
  "OTP_SETTINGS": {
    "length": 5,
    "charset": 'numeric'
  },
  "APPLICATION_API_KEY": "1",
  "MAX_ACCESS_TOKEN_EXPIRY_HOURS": 720, // 30 days
  "API_START_PATH": '/api/',
  "API_VERSION": 'v1',
  "DB_DATE_FORMAT": '%Y-%m-%d %H:%M:%S',
};

var requestMessages = {
  'ERR_API_KEY_NOT_FOUND': {
    code: 1001,
    message: 'api-key not found'
  },
  'ERR_INVALID_API_KEY': {
    code: 1002,
    message: 'Invalid api-key'
  },
  'ERR_UDID_NOT_FOUND': {
    code: 1003,
    message: 'UDID not found'
  },
  'ERR_DEVICE_TYPE_NOT_FOUND': {
    code: 1004,
    message: 'device-type not found'
  }
};

let userMessage = {
  ERR_INVALID_SIGNUP_REQUEST: {
    code: 2001,
    message: 'Invalid Sign Up Request.'
  },
  ERR_USER_IS_NOT_ACTIVE: {
    code: 2002,
    message: 'User is not active.'
  },
  ERR_USER_IS_ALREADY_EXIST: {
    code: 2003,
    message: 'User is already exist.'
  },
  ERR_WHILE_ADD_USER: {
    code: 2004,
    message: 'Error while add user.'
  },
  ERR_OTP_LIMIT_EXCEEDED: {
    code: 2005,
    message: 'Otp limit is exceede.'
  },
  ERR_OTP_IS_EXPIRED: {
    code: 2006,
    message: 'Otp is expired.'
  },
  ERR_INVALID_VERIFY_OTP_REQUEST: {
    code: 2007,
    message: 'Invalid verify otp request.'
  },
  ERR_OTP_INVALID: {
    code: 2008,
    message: 'Invalid otp.'
  },
  OTP_VERIFIED_SUCCESSFULLY: {
    code: 2009,
    message: 'User verified successfully.'
  },
  ERR_WHILE_SIGN_IN: {
    code: 2010,
    message: 'Error while sign in.'
  },
  ERR_USER_NAME_OR_PASSWORD_INCORRECT: {
    code: 2011,
    message: 'User name or password incorrect.'
  },
  MSG_SUCCESSFULLY_LOGGED_IN: {
    code: 2012,
    message: 'User logged in successfully.'
  },
  ERR_USER_IS_BLOCKED: {
    code: 2013,
    message: 'User is blocked.'
  },
  USER_DOSE_NOT_EXIST: {
    code: 2014,
    message: 'User is not exist.'
  },
  MSG_PASSWORD_CHANGES_SUCCESSFULLY: {
    code: 2015,
    message: 'Password changed successfully.'
  },
  ERR_PASSWORD_CHANGE: {
    code: 2016,
    message: 'Error while change password.'
  },
  ERR_WHILE_SIGN_IN_WITH_OTP: {
    code: 2017,
    message: 'Error while sign in with OTP.'
  },
  MSG_OTP_SENT_SUCCEFULLY: {
    code: 2018,
    message: 'Otp sent successfully.'
  },
};

module.exports = {
  appConfig: applicationConfiguration,
  userMessage: userMessage,
  requestMessages: requestMessages
}