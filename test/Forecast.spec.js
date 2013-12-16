'use strict';

var chai = require('chai');
var expect = chai.expect;

var mocks = require('./mocks.js');
var Forecast = require('../lib/Forecast.js');

describe('Forecast', function() {
    var forecast, mockData;
    beforeEach(function () {
        mockData = mocks['2544'];
        forecast = new Forecast(mocks['2544']);
    });

    describe('toString()', function () {
        it('must output data in correct format', function () {
            //count number of output lines
            expect(forecast.toString().split('\n')).to.have.length(mockData.length + 1);
        });
    });

    describe('all()', function () {
        it('must return all forecast entries', function () {
            expect(forecast.all()).to.have.length(mockData.length);
            expect(forecast.all()).to.be.instanceof(Array);
        });
        it('must return a copy of the forecast entries', function () {
            var all = forecast.all();
            all.pop();
            expect(forecast.all()).to.have.length(mockData.length);
        });
    });
});