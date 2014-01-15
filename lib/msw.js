'use strict';

var http = require('http');
var Q = require('q');

//msw api spot response
var Forecast = require('./Forecast');

var unitOptions = ['us', 'uk', 'eu'];

var msw = {
    apiKey: undefined,
    units: 'us',
    set: function (hash) {
        if ('apiKey' in hash) msw.apiKey = hash.apiKey;
        if ('units' in hash && unitOptions.indexOf(hash.units.toLowerCase()) >= 0) msw.units = hash.units.toLowerCase();
        return msw;
    },
    forecast: function (options) {
        var uri;
        var deferred = Q.defer();

        if (typeof options === 'number') options = { spotId: options };
        else if (typeof options === 'undefined') throw new Error('No spotID defined');

        if (('units' in options && unitOptions.indexOf(options.units.toLowerCase()) < 0) || !('units' in options)) {
            options.units = msw.units;
        }
        uri = msw.url({ 'spot_id': options.spotId , 'units': options.units.toLowerCase() });

        http.get(uri, function (res) {
            var body = '', data;
            if (res.statusCode !== 200) return deferred.reject('Invalid status code: received ' + res.statusCode);
           
            res.on('data', function (chunk) {
                body += chunk;
            }).on('end', function () {
                data = JSON.parse(body);
                if ('error_response' in data) deferred.reject(data.error_response.error_msg);
                else deferred.resolve(new Forecast(data));
            }).on('error', function (err) {
                deferred.reject(err);
            });
        });

        return deferred.promise;
    },
    url: function (hash) {
        var baseUri = 'http://magicseaweed.com/api/' + msw.apiKey + '/forecast/?';
        Object.keys(hash).forEach(function (key) {
            baseUri += key + '=' + hash[key] + '&';
        });
        return baseUri.slice(0, -1);
    }
};

module.exports = msw;