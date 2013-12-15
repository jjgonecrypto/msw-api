Magicseaweed API
=============

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
