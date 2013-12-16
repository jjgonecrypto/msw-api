'use strict';

var fs = require('fs');

var mocks = {};
var path = __dirname + '/samples';

fs.readdirSync(path).forEach(function (file) {
    var spotId = file.split('_')[1];
    var raw = fs.readFileSync(path + '/' + file);
    mocks[spotId] = JSON.parse(raw);
});

module.exports = mocks;