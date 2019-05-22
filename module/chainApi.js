'use strict'

var request = require('request');



var ChainAPI = function (host) {
    this.host = host;
};

function statusCodeErrorHandler(statusCode, callback, result) {
    switch (statusCode) {
        case 200:
            callback(null, JSON.parse(result));
            break;
        default:
            callback('error', JSON.parse(result));
            break;
    }
}

ChainAPI.prototype.getMemberAddr = function (clientAccessToken, callback) {
    var OPTIONS = {
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Bearer ' + clientAccessToken,
        },
    };

    OPTIONS.url = 'https://' + this.host + '/chain/v1.2/services/members';
    console.log('options - ' + JSON.stringify(OPTIONS));
    
    request.get(OPTIONS, function (err, res, result) {
        if (err) {
            console.log(err);
        }
        statusCodeErrorHandler(res.statusCode, callback, result);
    });
};

ChainAPI.prototype.saveScore = function (clientAccessToken, toAddr, amount, callback) {
    var OPTIONS = {
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Bearer ' + clientAccessToken,
        },
    };

    OPTIONS.url = 'https://' + this.host + '/chain/v1.2/services/deposit';
    
    OPTIONS.form =  {
        tokenAddr: toAddr, 
        amount: amount, 
    };
    console.log(JSON.stringify(OPTIONS));
    request.post(OPTIONS, function (err, res, result) {
        if (err) {
            console.log(err);
        }
        statusCodeErrorHandler(res.statusCode, callback, result);
    });
};

exports.ChainAPI = ChainAPI;
