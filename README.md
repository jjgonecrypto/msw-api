Magicseaweed API
=============

![](https://travis-ci.org/justinjmoses/msw-api.png)

Node wrapper for Magicseaweed (MSW) developer API. 

[MSW API Docs](http://magicseaweed.com/developer/forecast-api)

Example
------    

Add the API to your module

```javascript
var msw = require('msw-api');
```

Configure the instance to use your API key

```javascript
msw.set({ apiKey: 'YOUR API KEY GOES HERE' });
```

Call and utilize the swell data

````javascript   
msw.forecast(358).then(function (forecast) {
    console.log('Successfully retrived data for Manasquan, NJ');
    console.log(forecast.toString()); 
}, function (err) {
    console.log('ERR: encountered error getting MSW data: ' + err);
});
```

Outputs something like:

````
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