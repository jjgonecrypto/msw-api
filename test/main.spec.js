'use strict';

var chai = require('chai');
var expect = chai.expect;
var nock = require('nock');
var fs = require('fs');

var msw = require('../lib/main.js');
var mocks = require('./mocks.js');

var Forecast = require('../lib/Forecast.js');

describe('MSW API', function() {
    
    //prepare mock responses
    Object.keys(mocks).forEach(function (spotId) {
        nock('http://magicseaweed.com').get('/api/*/forecast/?spot_id=' + spotId).reply(200, mocks[spotId]);
    });

    describe('forecast()', function () {
        beforeEach(function () {
            msw.set({apiKey: '*'});
        });

        it('must support basic operation', function () { 
            expect(typeof msw.forecast === 'function').to.be.true;
            msw.forecast(2544);
        });

        it('must return a promise');

        it('must deliver on the promise when http result is 200');

        it('must fail the promise when http result is not 200');    
    });

    describe('set()', function () {
        it('must support setting the apiKey', function () {
            expect(msw.set({apiKey: "123"}).apiKey).to.equal("123"); 
        });
    });
});
