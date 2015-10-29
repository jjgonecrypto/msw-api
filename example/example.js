var msw = require('../lib/main.js');

msw.set({
    apiKey: process.env.MSW_API_KEY,
    units: 'US' //optional. one of: 'US', 'EU', 'UK'
});

msw.forecast(358).then(function (forecast) {
    console.log('Swell Report for Manasquan, NJ');
    console.log(forecast.toString());

    console.log('All entries with at least one faded star');
    console.log(forecast.where({ minFadedStars: 1 }).toString());

    console.log('All entries with wind less than 10mph and period at least 6s');
    console.log(forecast.where({ maxWindSpeed: 10, minPeriod: 6 }).toString());

}, function (err) {
    console.log('ERR: encountered error getting MSW data: ' + err);
});

