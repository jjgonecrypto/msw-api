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

        it('must throw errors for undefined parameters', function () {
            expect(function () { forecast.where({ something: 123 }); }).to.throw(Error);
        });

        it('must support inclusive querying by MIN & MAX swell height', function () {
            //return all forecasts at or above 6 in height
            expect(forecast.where({ minBreakingHeight: 6 })).to.have.length(28);

            //return all forecasts at or below 10 in height
            expect(forecast.where({ maxBreakingHeight: 10 })).to.have.length(26);

            //return all forecasts between 6 and 10 inclusive
            expect(forecast.where({ minBreakingHeight: 6, maxBreakingHeight: 10 })).to.have.length(14);

            //return all forecasts between 7 and 7
            expect(forecast.where({ minBreakingHeight: 7, maxBreakingHeight: 7 })).to.have.length(0);
        });

        it('must support inclusive querying by MIN & MAX solid stars', function () {
            //return all forecasts with 4 or more solid stars
            expect(forecast.where({ minSolidStars: 4 })).to.have.length(33);
            
            //return all forecasts with 3 or less solid stars
            expect(forecast.where({ maxSolidStars: 3 })).to.have.length(7);

            //return all forecasts between 0 and 3 stars
            expect(forecast.where({ minSolidStars: 0, maxSolidStars: 3 })).to.have.length(7);

            //return all 5 star forecasts
            expect(forecast.where({ minSolidStars: 5, maxSolidStars: 5 })).to.have.length(24);
        });


        it('must suport inclusive querying by MIN & MAX faded stars', function () {
            //return all forecasts with 1 or more faded stars
            expect(forecast.where({ minFadedStars: 1 })).to.have.length(16);
            
            //return all forecasts with 3 or less faded stars
            expect(forecast.where({ maxFadedStars: 3 })).to.have.length(37);

            //return all forecasts between 1 and 3 faded stars
            expect(forecast.where({ minFadedStars: 1, maxFadedStars: 3 })).to.have.length(13);
        });
        

        it('must support inclusive querying by MIN & MAX period', function () {
            //return all forecasts with swell period 16s or more 
            expect(forecast.where({ minPeriod: 16 })).to.have.length(16);
            
            //return all forecasts with swell period 16s or less
            expect(forecast.where({ maxPeriod: 16 })).to.have.length(33);

            //return all forecasts with swell period between 15-20s inclusively
            expect(forecast.where({ minPeriod: 15, maxPeriod: 20 })).to.have.length(29);
        });

        it('must support inclusive querying by MIN & MAX wind speed', function () {
            //return all forecasts with wind speed greater than 10 
            expect(forecast.where({ minWindSpeed: 10 })).to.have.length(30);
            
            //return all forecasts with wind speed less than 10
            expect(forecast.where({ maxWindSpeed: 10 })).to.have.length(12);

            //return all forecasts with wind speed between 0-5
            expect(forecast.where({ minWindSpeed: 0, maxWindSpeed: 5 })).to.have.length(5);
        });

        it('must support inclusive querying by LOWER & UPPER wind direction', function () {
            //return all forecasts with wind direction greater than
            expect(function () { forecast.where({ lowerWindDirection: 10 }); }).to.throw(Error);
            
            //return all forecasts with wind direction less than 10
            expect(function () { forecast.where({ upperWindDirection: 10 }); }).to.throw(Error);

            //return all forecasts with wind direction between 355° and 5°
            expect(forecast.where({ lowerWindDirection: 12, upperWindDirection: 70 })).to.have.length(18);

            //return all forecasts with wind direction between 355° and 5°
            expect(forecast.where({ lowerWindDirection: 355, upperWindDirection: 10 })).to.have.length(6);
        });
        
        it('must support mixed querying for mulitple selection criteria', function () {
            expect(forecast.where
                ({
                    lowerWindDirection: 355,
                    upperWindDirection: 10,
                    maxWindSpeed: 10
                })).to.have.length(1);

            expect(forecast.where
                ({
                    minSolidStars: 5,
                    minBreakingHeight: 6,
                    minPeriod: 16
                })).to.have.length(15);
        });

        it('must support inclusive querying by MIN & MAX local datetime', function () {
            //return all forecasts on or after a given date
            expect(forecast.where({ minDateTime: new Date(2013, 11, 20) })).to.have.length(22);

            //return all forecasts on or before a given date
            expect(forecast.where({ maxDateTime: new Date(2013, 11, 18, 23, 59) })).to.have.length(10);
           
            //respects the time as well as date
            expect(forecast.where({ maxDateTime: new Date(2013, 11, 18, 21, 59) })).to.have.length(9);
            
            //return all forecasts between dates
            expect(forecast.where
                ({
                    minDateTime: new Date(2013, 11, 22, 9),
                    maxDateTime: new Date(2013, 11, 22, 16)
                })).to.have.length(3);
        });
        
        
        
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