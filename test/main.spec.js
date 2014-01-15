'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

var msw = require('../lib/main.js');

var Forecast = require('../lib/Forecast.js');

describe('MSW API', function () {
    var apiKey = '*';
    var mocks = msw.mockCallsUsing(apiKey);

    beforeEach(function () {
        //prepare mock responses
        Object.keys(mocks.data).forEach(function (spotId) {
            mocks.mockSpot(spotId, 'us', 200);
        });
    });

    describe('forecast()', function () {
        it('must throw Error if apiKey not set', function () {
            expect(function () { msw.forecast(1234); }).to.throw(Error);
        });

        describe('with apiKey previously set', function () {
            beforeEach(function () {
                msw.set({ apiKey: apiKey, units: 'us' });
            });

            it('must throw if no spotId given', function () {
                expect(function () { msw.forecast(); }).to.throw(Error);
            });

            describe('options param', function () {
                it('must contain spotId', function () {
                    expect(function () { msw.forecast({}); }).to.throw(Error);
                    expect(msw.forecast({ spotId: 2544 })).to.not.throw;
                });
                it('may override the existing units', function () {
                    //as URI with 'units=us' query param set, an invalid units will simply be ignore
                    expect(function () { msw.forecast({ spotId: 2544, units: 'xx' }); }).to.not.throw;
                    //as URI with 'units=eu' is not mocked, then an error should occur here
                    expect(function () { msw.forecast({ spotId: 2544, units: 'EU' }); }).to.throw(Error);
                    //mock the spot with EU units
                    mocks.mockSpot(2544, 'eu', 200);
                    //expect the units endpoint to pass
                    expect(function () { msw.forecast({ spotId: 2544, units: 'EU' }); }).to.not.throw(Error);
                });
            });

            it('must return a promise', function (done) {
                expect(msw.forecast(2544)).to.eventually.be.instanceof(Forecast).and.notify(done);
            });

            it('must fail the promise when http result is not 200', function (done) {
                mocks.mockSpot(123, 'us', 404);
                expect(msw.forecast(123)).to.eventually.be.rejected.and.notify(done);
            });
        });
    });

    describe('set()', function () {
        it('must support setting the apiKey', function () {
            expect(msw.set({apiKey: '123'}).apiKey).to.equal('123');
        });

        it('must support setting the units', function () {
            expect(msw.units).to.equal('us'); //default
            expect(msw.set({units: 'eu'}).units).to.equal('eu');
            expect(msw.set({units: 'UK'}).units).to.equal('uk');
            expect(msw.set({units: ''}).units).to.equal('uk'); //no change
            expect(msw.set({units: 'Un'}).units).to.equal('uk'); //no change
        });

        it('must support setting apiKey and units together', function () {
            var config = msw.set({apiKey: '123', units: 'EU' });
            expect(config.apiKey).to.equal('123');
            expect(config.units).to.equal('eu');
        });
    });
});
