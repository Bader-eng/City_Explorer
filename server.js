'use strict';
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const superagent = require('superagent');


const server=express();
const PORT=process.env.PORT || 3000;



server.listen(PORT,()=>{
  console.log(`listening on port ${PORT}`);
});
server.use(cors());


// server.get('/data',(req,res)=>{
//   res.status(200).send('Hi from the data page, I am the server !!!');
// });

//	http://localhost:5000/location?city=amman

server.get('/location',locationHandler);
server.get('/weather',weatherHandler);
server.get('*',generalHandler);





function locationHandler(req,res){
  let cityName=req.query.city;
  let key=process.env.LOCATION_KEY;
  //pk.f7c16ea4ef7fffdc3b4cbaeb3fd07102
  let locURL=` https://us1.locationiq.com/v1/search.php?key=${key}&q=${cityName}&format=json`;
  superagent.get(locURL);

  .then(geodata=>{
    let gData = geoData.body;
    let locationData = new Location(cityName,gData);
    res.send(locationData);
   })
   .catch(error=>{
    console.log(error);
    res.send(error);
})
  
}




function weatherHandler(req,res){
  let weather =[];
let cityName=req.query.city
let key=process.env.WEATHER_KEY;
let weaURL=`http://api.weatherbit.io/v2.0/forecast/daily?city=${cityName}&key=${key}`
superagent.get(weaURL);

 .then(wetDATA=>{
  wetDATA.body.data.map(item=>{
  let weatherRes= new Weather (item);
 weather.push(weatherRes);
  });
  res.send(weather);
 })
 .catch(error=>{
  console.log(error);
  res.send(error);
})
  // let weatherData=require('./data/weather.json').data;
  // let weather =[];
  // weatherData.forEach(item =>{
  //   let weatherRes= new Weather (item);
  //   weather.push(weatherRes);
  // });
}




function Weather(local){
  this.forecast=local.weather.description;
  this.time=local.datetime;
}

function Location(cityName,locData){
  this.search_query=cityName;
  this.formatted_query=locData[0].display_name;
  this.latitude=locData[0].lat;
  this.longitude=locData[0].lon;
}


function generalHandler(req,res){
  let errObj = {
    status: 500,
    resText: 'sorry! this page not found'
  };
  res.status(404).send(errObj);
}