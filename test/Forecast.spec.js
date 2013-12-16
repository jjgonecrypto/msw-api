'use strict';

var chai = require('chai');
var expect = chai.expect;

var mocks = require('./mocks.js');
var Forecast = require('../lib/Forecast.js');

describe('Forecast', function() {
    var forecast;
    beforeEach(function () {
        forecast = new Forecast(mocks['2544']);
    });

    describe('toString()', function () {
        it('must output data in correct format', function () {
            //count number of output lines
            expect(forecast.toString().split('\n')).to.have.length(mocks['2544'].length + 1);
        });
    });
});
