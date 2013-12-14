'use strict';

var chai = require('chai');
var expect = chai.expect;
var _ = require('underscore');

var mocks = require('./mocks.js');
var Forecast = require('../lib/Forecast.js');

describe('Forecast', function() {
    var forecast;
    beforeEach(function () {
        forecast = Forecast.init(mocks["2544"]);
    });

    describe('toString()', function () {
        it('must output data in correct format', function () {
            console.log(forecast.toString());
    
        });
    });
});
