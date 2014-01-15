'use strict';

var moment = require('moment');
var _ = require('underscore');

var sequencer = require('./util/sequencer.js');

var Forecast = function (data) {
    this._data = [];
    data.forEach(function (entry) {
        this._data.push((entry instanceof ForecastEntry) ? entry : new ForecastEntry(entry));
    }, this);
};

Forecast.prototype.toArray = function () {
    return [].concat(this._data);
};

Forecast.prototype.filter = function () {
    var newData = this._data.filter.apply(this._data, arguments);
    return new Forecast(newData);
};

Forecast.prototype.size = function () {
    return this._data.length;
};

Forecast.prototype.toString = function (options) {
    options = options || {};
    var isHtml = ('html' in options && options.html === true);
    var output = (isHtml) ?
        '<table><thead><tr><th>' +
        ['Time', 'Rating', 'Swell', 'Wind', 'Temp'].join('</th><th>') +
        '</th></tr></thead><tbody>'
        : '';
    this._data.forEach(function (entry) {
        output += entry.toString(options || {}) + '\n';
    });
    if (isHtml) output += '</tbody></table>';
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
    'maxDateTime': 'localDatetime',
    'minSequence': ''
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

function movePropertiesToAnotherObject(source, destination) {
    var props = [].slice.call(arguments, 2);
    props.forEach(function (property) {
        if (source.hasOwnProperty(property)) destination[property] = source[property];
        delete source[property];
    });
    return destination;
}

Forecast.prototype.where = function (query) {
    query = query || {}; //allow empty query

    //handle limits separately
    var limits = movePropertiesToAnotherObject(query, {}, 'minSequence', 'maxSequence');
    var trackPositions = [];

    //wind direction must have both lower and upper bounds
    if (xor('lowerWindDirection', 'upperWindDirection', query)) {
        throw new Error('Wind direction query requires both min and max elements');
    }

    var results = this.filter(function (entry, i) {
        var condition = true;
        if ('lowerWindDirection' in query && 'upperWindDirection' in query) {
            //special case for wind direction when upper < lower bounds. need to use OR operator instead of AND.
            var comparisonOperator = (query.lowerWindDirection <= query.upperWindDirection) ? and : or;
            var isGreaterThanEqToLower = entry.retrieveValue(queryToEntryMap.lowerWindDirection) >= query.lowerWindDirection;
            var isLessThanEqToUpper = entry.retrieveValue(queryToEntryMap.upperWindDirection) <= query.upperWindDirection;
            condition = compare(isGreaterThanEqToLower, isLessThanEqToUpper, comparisonOperator);
        }
        Object.keys(query).forEach(function (key) {
            //check all query params are valid
            if (!(key in queryToEntryMap)) throw new Error('where() parameter ' + key + ' not recognized');
            if (key.indexOf('min') === 0) condition &= entry.retrieveValue(queryToEntryMap[key]) >= query[key];
            else if (key.indexOf('max') === 0) condition &= entry.retrieveValue(queryToEntryMap[key]) <= query[key];
        });

        trackPositions[i] = {
            entry: entry,
            included: condition,
            date: entry.localDatetime
        };

        return condition;
    });
    
    //only continue if sequence limits exist in request
    if (Object.keys(limits).length < 1) return results;

    var originalArray = this._data;
    var sequence = sequencer.create(trackPositions, function (entry) { return entry. included; });
    
    //apply sequence limits
    Object.keys(limits).forEach(function (key) {
        if (key !== 'minSequence') return; //only supported sequence
        results = results.filter(function (entry) {
            return sequencer.getSequenceValueAtIndex(sequence, originalArray.indexOf(entry)) >= limits[key];
        });
    });
    return results;
};

var ForecastEntry = function (entry) {
    _.extend(this, entry);
    this.swell = new ForecastSwellEntry(entry.swell);
    this.wind = new ForecastWindEntry(entry.wind);
    this.condition = new ForecastConditionEntry(entry.condition);
    this.localDatetime = moment.unix(this.localTimestamp);
};

ForecastEntry.prototype.toString = function (options) {
    options = options || {};
    var i;
    var dateFormat = (options.dateFormat || 'MMM D HH:mm') + '  ';
    var isHtml = options.html === true;
    var output = [];
    var rating = '';
    output.push((options.utc === true) ?
        this.localDatetime.utc().format(dateFormat) : this.localDatetime.format(dateFormat));
    
    for (i = 0; i < this.solidRating; i++) rating += '★ ';
    for (i = 0; i < this.fadedRating; i++) rating += '☆ ';
    for (i = this.solidRating + this.fadedRating; i > 0; i--) rating += ' ';
    output.push(rating);

    output.push(this.swell.toString());
    output.push(this.wind.toString());
    output.push(this.condition.toString());

    if (isHtml) return '<tr><td>' + output.join('</td><td>') + '</td></tr>';
    else return output.join('\t');
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