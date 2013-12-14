'use strict';

var moment = require('moment');
var _ = require('underscore');

var Forecast = function () { };

Forecast.init = function (data) { 
    var forecast = _.extend(data, new Forecast);
    forecast.forEach(function (entry, i) {
        forecast[i] = _.extend(entry, new ForecastEntry);
    });
    return forecast;
};

Forecast.prototype.dataPoints = function () {
    return this.length;
};

Forecast.prototype.toString = function () {
    var output = '';
    this.forEach(function (entry) {
        output += entry.toString() + '\n';
    });
    return output;
};

var ForecastEntry = function () { };

ForecastEntry.prototype.toString = function () {
    var output = moment.unix(this.localTimestamp).format('MMM D HH:mm ');
    for (var i = 0; i < this.solidRating; i++) output += "★ "; 
    return output;
};

module.exports = Forecast;
