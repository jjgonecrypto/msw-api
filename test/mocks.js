'use strict';

var fs = require('fs');
var nock = require('nock');

var mockData = {};
var path = __dirname + '/samples';

fs.readdirSync(path).forEach(function (file) {
    var spotId = file.split('_')[1];
    var raw = fs.readFileSync(path + '/' + file);
    mockData[spotId] = JSON.parse(raw);
});

module.exports = function mockCallsUsing(apiKey) {
    return {
        mockSpot: function (spotId, units, response) {
            var mocked = nock('http://magicseaweed.com').get('/api/' + apiKey + '/forecast/?spot_id=' + spotId + '&units=' + units);
            mocked.reply(response, (response === 200) ? mockData[spotId] : undefined);
        },
        data: mockData
    };
};