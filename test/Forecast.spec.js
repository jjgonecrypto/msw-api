'use strict';

var chai = require('chai');
var expect = chai.expect;
var moment = require('moment');

var Forecast = require('../lib/Forecast.js');
var mockCallsUsing = require('./mocks.js');

describe('Forecast', function() {
    var forecast, mockData;
    beforeEach(function () {
        var mocks = mockCallsUsing('');
        mockData = mocks.data['169'];
        forecast = new Forecast(mockData);
    });

    describe('toString()', function () {
        it('must output data in correct format', function () {
            //count number of output lines
            expect(forecast.toString().split('\n')).to.have.length(mockData.length + 1);
            console.log(forecast.toString({ utc: true }));

        });
        it('must support html output', function () {
            expect(forecast.toString({html: true}).split('<tr>')).to.have.length(mockData.length + 2);
        });
    });

    describe('toArray()', function () {
        it('must return all forecast entries', function () {
            expect(forecast.toArray()).to.have.length(mockData.length);
            expect(forecast.toArray()).to.be.instanceof(Array);
        });
        it('must return a copy of the forecast entries', function () {
            var all = forecast.toArray();
            all.pop();
            expect(forecast.toArray()).to.have.length(mockData.length);
        });
    });

    describe('filter()', function () {
        it('must create a new instance of Forecast', function () {
            var result = forecast.filter(function (entry, i) {
                return i % 2 === 0;
            });
            expect(result).to.be.instanceof(Forecast);
            expect(result.size()).to.equal(20);
            expect(forecast.size()).to.equal(40);
        });
    });

    describe('where()', function () {

        it('must throw errors for undefined parameters', function () {
            expect(function () { forecast.where({ something: 123 }); }).to.throw(Error);
        });

        it('must return Forecast instance', function () {
            expect(forecast.where({ minBreakingHeight: 0 })).to.be.instanceof(Forecast);
        });

        it('must allow empty queries', function () {
            expect(forecast.where()).to.be.instanceof(Forecast);
            expect(forecast.where({})).to.be.instanceof(Forecast);
        });

        it('must support inclusive querying by MIN & MAX swell height', function () {
            //return all forecasts at or above 6 in height
            expect(forecast.where({ minBreakingHeight: 6 }).size()).to.equal(28);

            //return all forecasts at or below 10 in height
            expect(forecast.where({ maxBreakingHeight: 10 }).size()).to.equal(26);

            //return all forecasts between 6 and 10 inclusive
            expect(forecast.where({ minBreakingHeight: 6, maxBreakingHeight: 10 }).size()).to.equal(14);

            //return all forecasts between 7 and 7
            expect(forecast.where({ minBreakingHeight: 7, maxBreakingHeight: 7 }).size()).to.equal(0);
        });

        it('must support inclusive querying by MIN & MAX solid stars', function () {
            //return all forecasts with 4 or more solid stars
            expect(forecast.where({ minSolidStars: 4 }).size()).to.equal(33);
            
            //return all forecasts with 3 or less solid stars
            expect(forecast.where({ maxSolidStars: 3 }).size()).to.equal(7);

            //return all forecasts between 0 and 3 stars
            expect(forecast.where({ minSolidStars: 0, maxSolidStars: 3 }).size()).to.equal(7);

            //return all 5 star forecasts
            expect(forecast.where({ minSolidStars: 5, maxSolidStars: 5 }).size()).to.equal(24);
        });


        it('must suport inclusive querying by MIN & MAX faded stars', function () {
            //return all forecasts with 1 or more faded stars
            expect(forecast.where({ minFadedStars: 1 }).size()).to.equal(16);
            
            //return all forecasts with 3 or less faded stars
            expect(forecast.where({ maxFadedStars: 3 }).size()).to.equal(37);

            //return all forecasts between 1 and 3 faded stars
            expect(forecast.where({ minFadedStars: 1, maxFadedStars: 3 }).size()).to.equal(13);
        });
        

        it('must support inclusive querying by MIN & MAX period', function () {
            //return all forecasts with swell period 16s or more 
            expect(forecast.where({ minPeriod: 16 }).size()).to.equal(16);
            
            //return all forecasts with swell period 16s or less
            expect(forecast.where({ maxPeriod: 16 }).size()).to.equal(33);

            //return all forecasts with swell period between 15-20s inclusively
            expect(forecast.where({ minPeriod: 15, maxPeriod: 20 }).size()).to.equal(29);
        });

        it('must support inclusive querying by MIN & MAX wind speed', function () {
            //return all forecasts with wind speed greater than 10 
            expect(forecast.where({ minWindSpeed: 10 }).size()).to.equal(30);
            
            //return all forecasts with wind speed less than 10
            expect(forecast.where({ maxWindSpeed: 10 }).size()).to.equal(12);

            //return all forecasts with wind speed between 0-5
            expect(forecast.where({ minWindSpeed: 0, maxWindSpeed: 5 }).size()).to.equal(5);
        });

        it('must support inclusive querying by LOWER & UPPER wind direction', function () {
            //return all forecasts with wind direction greater than
            expect(function () { forecast.where({ lowerWindDirection: 10 }); }).to.throw(Error);
            
            //return all forecasts with wind direction less than 10
            expect(function () { forecast.where({ upperWindDirection: 10 }); }).to.throw(Error);

            //return all forecasts with wind direction between 355° and 5°
            expect(forecast.where({ lowerWindDirection: 12, upperWindDirection: 70 }).size()).to.equal(18);

            //return all forecasts with wind direction between 355° and 5°
            expect(forecast.where({ lowerWindDirection: 355, upperWindDirection: 10 }).size()).to.equal(6);
        });
        
        it('must support mixed querying for mulitple selection criteria', function () {
            expect(forecast.where
                ({
                    lowerWindDirection: 355,
                    upperWindDirection: 10,
                    maxWindSpeed: 10
                }).size()).to.equal(1);

            expect(forecast.where
                ({
                    minSolidStars: 5,
                    minBreakingHeight: 6,
                    minPeriod: 16
                }).size()).to.equal(15);
        });

        it('must support inclusive querying by MIN & MAX local datetime', function () {
            //return all forecasts on or after a given date
            expect(forecast.where({ minDateTime: moment.utc([2013, 11, 20]).toDate() }).size()).to.equal(24);

            //return all forecasts on or before a given date
            expect(forecast.where({ maxDateTime: moment.utc([2013, 11, 18, 23, 59]) }).size()).to.equal(8);
           
            //respects the time as well as date
            expect(forecast.where({ maxDateTime: moment.utc([2013, 11, 18, 20, 59]) }).size()).to.equal(7);
            
            //return all forecasts between dates
            expect(forecast.where
                ({
                    minDateTime: moment.utc([2013, 11, 22, 9]),
                    maxDateTime: moment.utc([2013, 11, 22, 16])
                }).size()).to.equal(3);
            
        });
        
        //0.0.9 release
        it('must support inclusive selection by MIN occurence of findings in a sequence', function () {
            //return 3+ successive forecasts where all meet the given criteria
            expect(forecast.where({ maxSolidStars: 3, minSequence: 3 }).size()).to.equal(5);
            expect(forecast.where({ minPeriod: 17, maxWindSpeed: 10, minSequence: 3 }).size()).to.equal(3);
        });

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