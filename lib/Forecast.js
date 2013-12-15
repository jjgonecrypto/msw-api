'use strict';

var moment = require('moment');
var _ = require('underscore');

var Forecast = function () { };

Forecast.init = function (data) { 
    var forecast = _.extend(data, new Forecast);
    forecast.forEach(function (entry, i) {
        forecast[i] = ForecastEntry.init(entry);
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

ForecastEntry.init = function (data) {
    var entry = _.extend(data, new ForecastEntry);
    entry.swell = _.extend(data.swell, new ForecastSwellEntry);
    entry.wind = _.extend(data.wind, new ForecastWindEntry);
    entry.condition = _.extend(data.condition, new ForecastConditionEntry);
    //entry.charts = ...
    return entry;
};

ForecastEntry.prototype.toString = function () {
    var output = moment.unix(this.localTimestamp).format('MMM D HH:mm  ');
    for (var i = 0; i < this.solidRating; i++) output += "★ "; 
    for (var i = 0; i < this.fadedRating; i++) output += "☆ ";
    for (var i = this.solidRating + this.fadedRating; i > 0; i--) output += ' '; 
    output += '\t' + this.swell.toString() + '\t' + this.wind.toString() + '  \t' + this.condition.toString();
    return output;
};

var ForecastSwellEntry = function () { };
ForecastSwellEntry.prototype.toString = function () {
    var summary;
    if (this.maxBreakingHeight < 1) summary = 'Flat';
    else if (this.minBreakingHeight === this.maxBreakingHeight) summary = this.minBreakingHeight + this.unit;
    else summary = this.minBreakingHeight + '-' + this.maxBreakingHeight + this.unit;
    
    summary += ' (' + this.components.primary.height + this.unit;
    summary += ' ' + this.components.primary.period + 's ';
    summary +=  this.components.primary.compassDirection + ')'; 
    return summary;
};

var ForecastWindEntry = function () { };
ForecastWindEntry.prototype.toString = function () {
    return this.speed + this.unit + ' ' + this.compassDirection;
};

var ForecastConditionEntry = function () { };
ForecastConditionEntry.prototype.toString = function () {
    var output = this.weather + this.unit.toUpperCase();
    return output;
};

module.exports = Forecast;
