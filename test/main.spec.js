'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

var nock = require('nock');

var msw = require('../lib/main.js');
var mocks = require('./mocks.js');

var Forecast = require('../lib/Forecast.js');

describe('MSW API', function () {
    var apiKey = '*';

    function mockSpot(spotId, units, response) {
        var mocked = nock('http://magicseaweed.com').get('/api/' + apiKey + '/forecast/?spot_id=' + spotId + '&units=' + units);
        mocked.reply(response, (response === 200) ? mocks[spotId] : undefined);
    }

    beforeEach(function () {
        //prepare mock responses
        Object.keys(mocks).forEach(function (spotId) {
            mockSpot(spotId, 'us', 200);
        });
    });

    describe('forecast()', function () {
        beforeEach(function () {
            msw.set({ apiKey: apiKey, units: 'us' });
        });

        it('must support basic operation', function () {
            expect(typeof msw.forecast === 'function').to.be.true;
        });

        it('must return a promise', function (done) {
            expect(msw.forecast(2544)).to.eventually.be.instanceof(Forecast).and.notify(done);
        });

        it('must fail the promise when http result is not 200', function (done) {
            mockSpot(123, 'us', 404);
            expect(msw.forecast(123)).to.eventually.be.rejected.and.notify(done);
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
    });
});
