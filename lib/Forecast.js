'use strict';

var moment = require('moment');
var _ = require('underscore');

var Forecast = function (data) { 
    this._data = [];
    data.forEach(function (entry, i) {
        this._data.push(new ForecastEntry(entry));
    }, this);
};

Forecast.prototype.size = function () {
    return this._data.length;
};

Forecast.prototype.toString = function () {
    var output = '';
    this._data.forEach(function (entry) {
        output += entry.toString() + '\n';
    });
    return output;
};

var ForecastEntry = function (entry) { 
    _.extend(this, entry);
    this.swell = new ForecastSwellEntry(entry.swell);
    this.wind = new ForecastWindEntry(entry.wind);
    this.condition = new ForecastConditionEntry(entry.condition);
};

ForecastEntry.prototype.toString = function () {
    var output = moment.unix(this.localTimestamp).format('MMM D HH:mm  ');
    for (var i = 0; i < this.solidRating; i++) output += "★ "; 
    for (var i = 0; i < this.fadedRating; i++) output += "☆ ";
    for (var i = this.solidRating + this.fadedRating; i > 0; i--) output += ' '; 
    output += '\t' + this.swell.toString() + '\t' + this.wind.toString() + '  \t' + this.condition.toString();
    return output;
};

var ForecastSwellEntry = function (swellData) { 
    _.extend(this, swellData);
};

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

var ForecastWindEntry = function (windData) { 
    _.extend(this, windData);
};

ForecastWindEntry.prototype.toString = function () {
    return this.speed + this.unit + ' ' + this.compassDirection;
};

var ForecastConditionEntry = function (conditionData) { 
    _.extend(this, conditionData);
};
ForecastConditionEntry.prototype.toString = function () {
    var output = this.weather + this.unit.toUpperCase();
    return output;
};

module.exports = Forecast;
