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

    describe('get forecast', function () {
        beforeEach(function () {
            msw.set({apiKey: '*'});
        });

        it('must support basic operation', function () { 
            expect(typeof msw.forecast === 'function').to.be.true;
            msw.forecast(2544);
        });    

    });

    describe('set', function () {
        it('must support setting the apiKey', function () {
            expect(msw.set({apiKey: "123"}).apiKey).to.equal("123"); 
        });
    });
});
