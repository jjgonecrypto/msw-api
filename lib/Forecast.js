'use strict';

var moment = require('moment');
var _ = require('underscore');

var Forecast = function (data) {
    this._data = [];
    data.forEach(function (entry) {
        this._data.push(new ForecastEntry(entry));
    }, this);
};

Forecast.prototype.all = function () {
    return [].concat(this._data);
};

Forecast.prototype.toString = function () {
    var output = '';
    this._data.forEach(function (entry) {
        output += entry.toString() + '\n';
    });
    return output;
};

//map from query named variables to corresponding MSW API key names 
var queryToEntryMap = {
    'minBreakingHeight': 'swell.minBreakingHeight',
    'maxBreakingHeight': 'swell.maxBreakingHeight',
    'minSolidStars': 'solidRating',
    'maxSolidStars': 'solidRating',
    'minFadedStars': 'fadedRating',
    'maxFadedStars': 'fadedRating',
    'minPeriod': 'swell.components.primary.period',
    'maxPeriod': 'swell.components.primary.period',
    'minWindSpeed': 'wind.speed',
    'maxWindSpeed': 'wind.speed',
    'lowerWindDirection': 'wind.direction',
    'upperWindDirection': 'wind.direction',
    'minDateTime': 'localDatetime',
    'maxDateTime': 'localDatetime'
};

function and(bool1, bool2) {
    return bool1 && bool2;
}

function or(bool1, bool2) {
    return bool1 || bool2;
}

function xor(key1, key2, obj) {
    return (key1 in obj && !(key2 in obj)) || (key2 in obj && !(key1 in obj));
}

function compare(value1, value2, operatorFnc) {
    return operatorFnc(value1, value2);
}

Forecast.prototype.where = function (query) {
    //check all query params are valid
    Object.keys(query).forEach(function (key) {
        if (!(key in queryToEntryMap)) throw new Error('where() parameter ' + key + ' not recognized');
    });

    //wind direction must have both lower and upper bounds
    if (xor('lowerWindDirection', 'upperWindDirection', query)) {
        throw new Error('Wind direction query requires both min and max elements');
    }

    return _.filter(this._data, function (entry) {
        var condition = true;
        if ('lowerWindDirection' in query && 'upperWindDirection' in query) {
            //special case for wind direction when upper < lower bounds. need to use OR operator instead of AND.
            var comparisonOperator = (query.lowerWindDirection <= query.upperWindDirection) ? and : or;
            var isGreaterThanEqToLower = entry.retrieveValue(queryToEntryMap.lowerWindDirection) >= query.lowerWindDirection;
            var isLessThanEqToUpper = entry.retrieveValue(queryToEntryMap.upperWindDirection) <= query.upperWindDirection;
            condition = compare(isGreaterThanEqToLower, isLessThanEqToUpper, comparisonOperator);
        }
        Object.keys(queryToEntryMap).forEach(function (key) {
            if (!(key in query)) return;
            if (key.indexOf('min') === 0) condition &= entry.retrieveValue(queryToEntryMap[key]) >= query[key];
            else if (key.indexOf('max') === 0) condition &= entry.retrieveValue(queryToEntryMap[key]) <= query[key];
        });

        return condition;
    });
};

var ForecastEntry = function (entry) {
    _.extend(this, entry);
    this.swell = new ForecastSwellEntry(entry.swell);
    this.wind = new ForecastWindEntry(entry.wind);
    this.condition = new ForecastConditionEntry(entry.condition);
    this.localDatetime = moment.unix(this.localTimestamp);
};

ForecastEntry.prototype.toString = function () {
    var i;
    var output = this.localDatetime.format('MMM D HH:mm  ');
    for (i = 0; i < this.solidRating; i++) output += '★ ';
    for (i = 0; i < this.fadedRating; i++) output += '☆ ';
    for (i = this.solidRating + this.fadedRating; i > 0; i--) output += ' ';
    output += '\t' + this.swell.toString() + '\t' + this.wind.toString() + '  \t' + this.condition.toString();
    return output;
};

//allows . split entries to retrieve
ForecastEntry.prototype.retrieveValue = function (keyChain) {
    function deepFindValueInObject(key, object) {
        var items = key.split('.');
        if (items.length === 1) return object[key];
        else return deepFindValueInObject(items.slice(1).join('.'), object[items[0]]);
    }
    return deepFindValueInObject(keyChain, this);
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
    return this.speed + this.unit + ' ' + this.compassDirection + ' (' +  this.direction + '°)';
};

var ForecastConditionEntry = function (conditionData) {
    _.extend(this, conditionData);
};

ForecastConditionEntry.prototype.toString = function () {
    var output = this.weather + '°' + this.unit.toUpperCase();
    return output;
};

module.exports = Forecast;