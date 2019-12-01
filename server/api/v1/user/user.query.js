const tbl_UserMaster = "tbl_UserMaster";
const tbl_OTP = "tbl_OtpMaster";
const tbl_AccessToken = "tbl_AccessToken";

const query = {
    checkUserIsExistQuery: {
        table: tbl_UserMaster,
        select: [{
            field: 'pk_userID',
            encloseField: false,
            alias: 'user_id'
        }, {
            field: 'CONCAT(firstName, " ", lastName)',
            encloseField: false,
            alias: 'name'
        }, {
            field: 'CONCAT(countryCode, " ", mobile)',
            encloseField: false,
            alias: 'mobile'
        }, {
            field: 'email',
            alias: 'email'
        }],
        filter: {
            and: [{
                field: 'countryCode',
                operator: 'EQ',
                value: ''
            }, {
                field: 'mobile',
                operator: 'EQ',
                value: ''
            }, {
                field: 'email',
                operator: 'EQ',
                value: ''
            }]
        }
    },
    createUserQuery: {
        table: tbl_UserMaster,
        insert: []
    },
    checkOTPLimitQuery: {
        table: tbl_OTP,
        select: [{
            field: 'pk_otpID',
            aggregation: 'count',
            alias: 'totalCount'
        }],
        filter: {
            and: [{
                field: 'countryCode',
                operator: 'EQ',
                value: ''
            }, {
                field: 'mobile',
                operator: 'EQ',
                value: ''
            }, {
                field: 'expiryDate',
                operator: 'GTEQ',
                value: ''
            }, {
                field: 'expiryDate',
                operator: 'LTEQ',
                value: ''
            }]
        }
    },
    updateOTPQuery: {
        table: tbl_OTP,
        update: [{
            field: 'isExpired',
            fValue: 1
        }],
        filter: {
            and: [{
                field: 'countryCode',
                operator: 'EQ',
                value: ''
            }, {
                field: 'mobile',
                operator: 'EQ',
                value: ''
            }, {
                field: 'isExpired',
                operator: 'EQ',
                value: 0
            }]
        }
    },
    saveOTPQuery: {
        table: tbl_OTP,
        insert: {
            field: ["countryCode", "mobile", "otp", "expiryDate"],
            fValue: []
        }
    },
    verifyOTPQuery: {
        table: tbl_OTP,
        select: [{
            field: 'expiryDate',
            alias: 'expiry_datetime'
        }, {
            field: 'otp',
            alias: 'otp'
        }],
        filter: {
            and: [{
                field: 'countryCode',
                operator: 'EQ',
                value: ''
            }, {
                field: 'mobile',
                operator: 'EQ',
                value: ''
            }, {
                field: 'expiryDate',
                operator: 'GTEQ',
                value: ''
            }, {
                field: 'isExpired',
                operator: 'EQ',
                value: 0
            }]
        }
    },
    updateUserQuery: {
        table: tbl_UserMaster,
        update: [],
        filter: {
            or: [{
                and: [{
                    field: 'countryCode',
                    operator: 'EQ',
                    value: ''
                }, {
                    field: 'mobile',
                    operator: 'EQ',
                    value: ''
                }]
            }, {
                field: 'pk_userID',
                operator: 'EQ',
                value: ''
            }]
        }
    },
    checkUserEmailAndPasswordQuery: {
        table: tbl_UserMaster,
        select: [{
            field: 'pk_userID',
            alias: 'user_id'
        }, {
            field: 'email',
            alias: 'email'
        }, {
            field: 'password',
            alias: 'password'
        }, {
            field: 'isActive',
            alias: 'is_active'
        }, {
            field: 'mobile',
            alias: 'mobile'
        }],
        filter: {
            and: [{
                field: 'password',
                operator: 'EQ',
                value: ''
            }, {
                or: [{
                    field: 'email',
                    operator: 'EQ',
                    value: ''
                }, {
                    and: [{
                        field: 'mobile',
                        operator: 'EQ',
                        value: ''
                    }, {
                        field: 'countryCode',
                        operator: 'EQ',
                        value: ''
                    }]
                }]
            }]
        }
    },
    updateUserByUserIdQuery: {
        table: tbl_UserMaster,
        update: [],
        filter: {
            field: 'pk_userID',
            operator: 'EQ',
            value: ''
        }
    },
    exprieAccessTokenQuery: {
        table: tbl_AccessToken,
        update: [{
            field: 'isActive',
            fValue: 0
        }],
        filter: {
            and: [{
                field: 'fk_userID',
                operator: 'EQ',
                value: ''
            }, {
                field: 'deviceId',
                operator: 'EQ',
                value: ''
            }]
        }
    },
    createAccessTokenQuery: {
        table: tbl_AccessToken,
        insert: {
            field: ['fk_userID', 'deviceType', 'deviceId', 'accessToken', 'expiryDate', 'isActive'],
            fValue: []
        }
    },
    expireAccessTokenByAccessTokenQuery: {
        table: tbl_AccessToken,
        update: [{
            field: 'isActive',
            fValue: 0
        }],
        filter: {
            field: 'accessToken',
            operator: 'EQ',
            value: ''
        }
    }
}

module.exports = query;