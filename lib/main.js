'use strict';

var http = require('http');
var _ = require('underscore');

//msw api spot response
var Forecast = require('./Forecast');


var msw = {
    apiKey: null,
    set: function (hash) { 
        if ('apiKey' in hash) msw.apiKey = hash.apiKey; 
        return msw;
    },
    forecast: function (options) { 
        var uri, promise; 

        if (typeof options === 'number') options = { spotId: options };
        else if (typeof options === 'undefined') throw new Error('No spotID defined');

        if (!('units' in options)) options.units = 'us';
        uri = msw.url({ 'spot_id': options.spotId });

        http.get(uri, function (res) {
            var body = '', data;
            res.on('data', function (chunk) {
                body += chunk;
            }).on('end', function () {
                data = JSON.parse(body);
                console.log(_.extend(data, new Forecast).dataPoints());
            });
        });

        return promise;        
    },
    url: function (hash) { 
        var baseUri = 'http://magicseaweed.com/api/' + msw.apiKey + '/forecast/?';
        Object.keys(hash).forEach(function (key) {
            baseUri += key + '=' + hash[key];
        });
        return baseUri;        
    },
}; 

module.exports = msw;
