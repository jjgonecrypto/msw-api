'use strict';

var chai = require('chai');
var expect = chai.expect;

var mocks = require('./mocks.js');
var Forecast = require('../lib/Forecast.js');

describe('Forecast', function() {
    var forecast, mockData;
    beforeEach(function () {
        mockData = mocks['169'];
        forecast = new Forecast(mocks['169']);
    });

    describe('toString()', function () {
        it('must output data in correct format', function () {
            //count number of output lines
            expect(forecast.toString().split('\n')).to.have.length(mockData.length + 1);
            

            console.log(forecast.toString());
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

    describe('where()', function () {

        //
        //0.0.6 release
        it('must support inclusive querying by MIN & MAX swell height', function () {
            //return all forecasts at or above 6 in height
            expect(forecast.where({ minBreakingHeight: 6 })).to.have.length(28);

            //return all forecasts at or below 10 in height
            expect(forecast.where({ maxBreakingHeight: 10 })).to.have.length(26);

            //return all forecasts between 6 and 10 inclusive
            expect(forecast.where({ minBreakingHeight: 6, maxBreakingHeight: 10 })).to.have.length(14);
        });

        it('must support inclusive querying by MIN & MAX solid stars');
        //eg. forecast.where({ minSolidStars: X })

        it('must suport inclusive querying by MIN & MAX faded stars');
        //eg. forecast.where({ minFadedStars: X })

        it('must support inclusive querying by MIN & MAX period');
        //eg. forecast.where({ minPeriod: X })

        it('must support inclusive querying by MIN & MAX wind speed');
        //eg. forecast.where({ minWindSpeed: X })

        it('must support inclusive querying by MIN & MAX wind direction');
        //eg. forecast.where({ minWindDir: X })
        
        it('must support inclusive querying by MIN & MAX local datetime');
        //eg. forecast.where({ minDatetime: DateTime.now })

        it('must support mixed querying for mulitple selection criteria');
        //eg. forecast.where({ minPeriod: 12, minSolidStars: 2, maxWindDir: 10 })
        
        
        //0.0.7 release
        it('must support inclusive selection by MIN occurence of findings in a sequence');
        //return 3+ successive forecasts where all meet the given criteria
        //eg. forecast.where({ minSolidStars: 4, minSequence: 3 })

        it('must support inclusive selection by MIN day occurence of findings in a sequence');
        //return all forecasts with 2 successive days where each day has at least one forecast meeting the criteria
        //eg. forecast.where({ minSolidStars: 4, minDaySequence: 2 })


        //
        //0.1.0 release
        it('must support chaining of where queries by and()');
        //eg. forecast.where({ minPeriod: X }).and({ minBreakingHeight: 3 })

        it('must support chaining of where queries by or()');
        //eg. forecast.where({ minPeriod: X }).or({ minSolidStars: 2 });
    });
});