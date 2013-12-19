Magicseaweed API
=============

[![Build Status](https://travis-ci.org/justinjmoses/msw-api.png)](https://travis-ci.org/justinjmoses/msw-api)

Node wrapper for Magicseaweed (MSW) developer API. 

[MSW API Docs](http://magicseaweed.com/developer/forecast-api)

Quickstart
------    


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




API
---

###Set Static Configuration

```javascript
msw.set(Object parameters) : msw;
```

####apiKey

Your MSW API key is required for any transactions. 

```javascript
msw.set({ apiKey: 'YOUR API KEY GOES HERE' });
```

####units
Optionally set the units you want (option of US, EU &amp; UK). Default of 'US'. Case insensitive.

```javascript
msw.set({ units: 'EU' });
```


###Retrieve Forecast

```javascript
msw.forecast(int spotId | Object options) : Promises/A+ for Forecast
```

Accepts ither:

* integer parameter for spotID (and uses pre-set `units` via `set` or default value of 'US'); or
* hash parameter for options
    * `spotId` required
    * `units` optional: overrides whatever pre-defined units are for this call only

Throws: 

* if no parameter is given
* if `apiKey` has not already been `set()`

###Output Swell Data 

```javascript
forecast.toString([Optional] Object params) : String
```

Takes an optional parameter hash and returns a string with one line for each forecast entry. 

```javascript   
msw.forecast(358).then(function (forecast) {
    console.log('Successfully retrived data for Manasquan, NJ');
    console.log(forecast.toString()); 
}, function (err) {
    console.log('ERR: encountered error getting MSW data: ' + err);
});
```

Supports UTC times via:

```javascript
forecast.toString({ utc: true });
```

Outputs swell data in the following format:

```
Successfully retrived data for Manasquan, NJ
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

###Query Forecast Data

####Supported Parameters

Can use any combination of the following for:

* __Breaking height__ (the height of the swell in units): `minBreakingHeight` &/or `maxBreakingHeight` 
* __Solid stars__ 
* __Faded stars__
* __Swell period__
* __Wind speed__
* __Wind direction__ (the direction of the wind represented as degrees in the range 0° - 360°): `lowerWindDirection` AND `upperWindDirection`. Both parameters are required to query on wind direction.
* __Datetime__ `minDateTime`, `maxDateTime` (relative to the zone's timezone)

####Min & Max inclusivity

All queries are inclusive. E.g. `minBreakingHeight` of 3 matches all entries `>=` 3

####Examples 

```javascript   
msw.forecast(169).then(function (forecast) {
    //returns all forecasts at least 5 solid stars and at least 6 
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

