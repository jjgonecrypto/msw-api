Magicseaweed API
=============

[![Build Status](https://travis-ci.org/justinjmoses/msw-api.png)](https://travis-ci.org/justinjmoses/msw-api)

Node wrapper for Magicseaweed (MSW) developer API. 

[MSW API Docs](http://magicseaweed.com/developer/forecast-api)

##Quickstart

```javascript
//Add the API to your module
var msw = require('msw-api');

//Configure the instance to use your API key, optionally override the units (default is 'US')
msw.set({ apiKey: 'YOUR API KEY GOES HERE' , units: 'us' });

//Get a promise for the swell forecast for spot at id 169 (Mundaka)
msw.forecast(169).then(function (forecast) {

    //Return all forecasts at least 5 solid stars and at least 6 
    //(feet in this case as the request was using 'us' units) high, and at least 16s in primary swell period  
    forecast.where
        ({
            minSolidStars: 5,
            minBreakingHeight: 6,
            minPeriod: 16
        });

}, function (err) {
    console.log('ERR: encountered error getting MSW data: ' + err);
});
```

##API

###msw.set(): static configuration

```javascript
//signature
msw.set(Object parameters) : msw;
```

```javascript
//apiKey: your MSW API key is required for any transactions. 
msw.set({ apiKey: 'YOUR API KEY GOES HERE' });

//units: optionally set the units you want (option of US, EU &amp; UK). Default of 'US'. Case insensitive.
msw.set({ units: 'EU' });

//Obviously you can do both in one call
msw.set({ apiKey: 'API KEY', units: 'UK' });
```

>Go to [MSW](http://magicseaweed.com/developer/sign-up) to get an API key.

###msw.forecast(): get swell forecast

```javascript
//signature
msw.forecast(int spotId | Object options) : Promises/A+ for Forecast
```

```javascript

//Option 1: using spotId integer (uses pre-set `units` via `set()` or default value of 'US')
msw.forecast(123);

//Option 2: using options object 
//  spotId required
//  units optional: overrides whatever pre-defined units are for this call only
msw.forecast({ spotId: 123, units: 'eu' });
```

Throws `Error` when: 

* no parameter is given
* `apiKey` not `set()`

Returns:

* promise with `Forecast` data. (Specifically returns a [Q](https://github.com/kriskowal/q) promise). 

```javascript
msw.forecast(358).then(function (forecast) {
    console.log('Successfully retrieved data for Manasquan, NJ');
}, function (err) {
    console.log('ERR: encountered error getting MSW data: ' + err);
});
```

>Note: Errors in retrieving data from Magicseaweed, invalid API KEY and invalid spot ID handled by a rejected promise. Handle these errors in second argument to `then()` as per the Promises/A+ spec. 

##Forecast 

This is the instance yielded by a fulfilled `msw.forecast()` promise. 

###forecast.filter(): Creates new Forecast by filtering entries
```javascript
//signature
forecast.filter(Function callback) : Forecast
```

Creates a new `Forecast` via a boolean callback function. Note that the underlying `ForecastEntry` instances are shared by reference and thus are mutable. 

Callback of the standard form `function (item, index, array)`.

```javascript
msw.forecast(358).then(function (forecast) {
    var newForecast = forecast.filter(function (entry, i) {
        return entry.swell.components.secondary.height < 4;
    });
}, ...);
```

###forecast.toArray(): Swell data as Array
```javascript
//signature
forecast.toArray() : Array
```

Returns an `Array` of `ForecastEntry`.

```javascript   
msw.forecast(358).then(function (forecast) {
    var all = forecast.toArray();
}, ...);
```

>Note: the Array is a clone of the underlying `Forecast` data, however each individual `ForecastEntry` is a mutable instance, so be wary of modifying this data.

###forecast.toString(): Swell data as String 

```javascript
//signature
forecast.toString([Optional] Object params) : String
```

Takes an optional parameter hash and returns a string with one line for each forecast entry. 

```javascript   
msw.forecast(358).then(function (forecast) {
    console.log(forecast.toString());
}, ...);
```

Supports UTC times via:

```javascript
msw.forecast(358).then(function (forecast) {
    console.log(forecast.toString({ utc: true }));
}, ...);
```

Returns swell data in the following format:

```
Dec 13 01:00  ★       3-4ft (4.5ft 9s ENE)  12mph E     1F
Dec 13 04:00  ★       3-4ft (4.5ft 9s ENE)  12mph E     1F
Dec 13 07:00  ★       3-4ft (4.5ft 9s ENE)  12mph ENE   1F
Dec 13 10:00  ★ ★     3-4ft (5ft 9s ENE)    15mph ENE   1F
Dec 13 13:00  ★ ☆     3-4ft (5ft 9s ENE)    16mph E     10F
Dec 13 16:00  ★ ☆     3-4ft (5ft 9s ENE)    16mph E     10F
Dec 13 19:00  ★ ★     3-4ft (5ft 9s ENE)    14mph E     10F
Dec 13 22:00  ★       3-4ft (5ft 9s ENE)    13mph E     10F
Dec 14 01:00  ☆       2-4ft (5ft 8s ENE)    15mph E     1F
Dec 14 04:00  ★       2-4ft (5ft 8s ENE)    15mph ENE   1F
Dec 14 07:00  ★       2-4ft (5ft 8s ENE)    14mph E     1F
Dec 14 10:00  ★       2-4ft (5ft 8s ENE)    13mph E     1F
Dec 14 13:00  ★       2-4ft (5ft 8s ENE)    12mph E     10F
Dec 14 16:00  ★       2-4ft (5ft 8s ENE)    12mph E     10F
Dec 14 19:00  ★       2-4ft (5ft 8s ENE)    10mph E     11F
Dec 14 22:00  ★       2-4ft (5ft 8s ENE)    12mph E     11F
```

###forecast.where(): Query forecast data

```javascript
//signature
forecast.where(Object params) : Forecast
```

####Supported Parameters

Can use any combination of the following for:

* __Breaking height__ (the height of the swell in units): `minBreakingHeight` &/or `maxBreakingHeight` 
* __Solid stars__ (MSW assigned solid stars): `minSolidStars` &/or `maxSolidStars`
* __Faded stars__ (MSW assigned faded stars): `minFadedStars` &/or `maxFadedStars`
* __Swell period__: (the number of seconds of the primary swell period): `minPeriod` &/or `maxPeriod`
* __Wind speed__: (the direction of wind in units): `minWindSpeed` &/or `maxWindSpeed`
* __Wind direction__ (the direction of the wind represented as degrees in the range 0° to 360°): `lowerWindDirection` AND `upperWindDirection`. __Both parameters are required to query on wind direction__.
* __Datetime__: (the datetime of the forecast relative to the zone's timezone) `minDateTime` &/or `maxDateTime`
* __Sequence__: (the number of consecutive entries that must occur in order for the entry to be returned) `minSequence`

>Refer to [MSW Guide](http://magicseaweed.com/developer/forecast-api) for Solid & Faded star definitions

>All queries are inclusive. E.g. `minBreakingHeight` of 3 matches all entries `>=` 3

```javascript
//get all forecast entries with minBreakingHeight at least 3 units
forecast.where({ minBreakingHeight: 3 });

//get all forecast entries with breaking height between 3 and 8, a wind speed of no more than 10 units and a period of at least 10s
forecast.where({ minBreakingHeight: 3, maxBreakingHeight: 8, maxWindSpeed: 10, minPeriod: 10 });

//get all forecast entries with at least 3 solid and 1 faded stars
forecast.where({ minSolidStars: 3, minFadedStars: 1 });

//get all forecast entries with 5 or more solid stars, at least 6 in min breaking height and a 16 or more second period
forecast.where({ minSolidStars: 5, minBreakingHeight: 6, minPeriod: 16 });

//get all forecast entries with at least 17s period and wind no greater than 10 (mph) which occur in a sequence of at least three entries in length 
forecast.where({ minPeriod: 17, maxWindSpeed: 10, minSequence: 3 });
```