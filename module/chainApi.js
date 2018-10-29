var request = require('request');

module.exports = function (data) {
    function chainApi(data) {
        var OPTIONS = {
            headers: { 'Content-Type': 'application/json' },
            url: null,
            body: null
        };

        return {
            saveScore: function (host, clientAccessToken, toAddr, amount, callback) {
                OPTIONS.url = 'https://' + host + '/chain/v1/services/deposit/' + toAddr + '/' + amount;
                OPTIONS.body = '';
                OPTIONS.headers = { Authorization: 'Bearer ' + clientAccessToken };
                request.get(OPTIONS, function (err, res, result) {
                    statusCodeErrorHandler(res.statusCode, callback, result);
                });
            }
        };
    }

    function statusCodeErrorHandler(statusCode, callback, data) {
        switch (statusCode) {
            case 200:
                callback(null, JSON.parse(data));
                break;
            default:
                callback('error', JSON.parse(data));
                break;
        }
    }

    var INSTANCE;
    if (INSTANCE === undefined) {
        INSTANCE = new chainApi(data);
    }
    return INSTANCE;
};