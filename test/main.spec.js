'use strict';

var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var expect = chai.expect;

var nock = require('nock');

var msw = require('../lib/main.js');
var mocks = require('./mocks.js');

var Forecast = require('../lib/Forecast.js');

describe('MSW API', function () {
    var apiKey = '*';

    beforeEach(function () { 
        //prepare mock responses
        Object.keys(mocks).forEach(function (spotId) {
            nock('http://magicseaweed.com').get('/api/' + apiKey + '/forecast/?spot_id=' + spotId).reply(200, mocks[spotId]);
        });
    });

    describe('forecast()', function () {
        beforeEach(function () {
            msw.set({ apiKey: apiKey });
        });

        it('must support basic operation', function () { 
            expect(typeof msw.forecast === 'function').to.be.true;
        });

        it('must return a promise', function (done) {
            expect(msw.forecast(2544)).to.eventually.be.fulfilled.with.property('prototype', Forecast).and.notify(done);
         
        });

        it('must fail the promise when http result is not 200', function (done) {
            nock('http://magicseaweed.com').get('/api/' + apiKey + '/forecast/?spot_id=123').reply(404);
            expect(msw.forecast(123)).to.eventually.be.rejected.and.notify(done);    
        }); 
    });

    describe('set()', function () {
        it('must support setting the apiKey', function () {
            expect(msw.set({apiKey: "123"}).apiKey).to.equal("123"); 
        });
    });
});
