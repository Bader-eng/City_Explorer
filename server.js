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
server.get('/parks',parkHandler);
server.get('*',generalHandler);
//pk.f7c16ea4ef7fffdc3b4cbaeb3fd07102
//VG7a8BnF9CQ13Bwtd8LTKGqofgtDiiazhqLUNbQ3
//[ Base URL: developer.nps.gov/api/v1 ]

//let parkurl=`https://developer.nps.gov/api/v1/parks?q=${cityName}&api_key=${key}`



function locationHandler(req,res){
  let cityName=req.query.city;
  let key=process.env.LOCATION_KEY;
  let locURL=`https://us1.locationiq.com/v1/search.php?key=${key}&q=${cityName}&format=json`;
  superagent.get(locURL)

    .then(geodata=>{
      //console.log(geodata);
      let gData = geodata.body;
      let locationData = new Location(cityName,gData);
      res.send(locationData);
    })
    .catch(error=>{
      console.log(error);
      res.send(error);
    });
}




function weatherHandler(req,res){
  let weather =[];
  let cityName=req.query.search_query;
  let key=process.env.WEATHER_KEY;
  let weaURL=`http://api.weatherbit.io/v2.0/forecast/daily?city=${cityName}&key=${key}&days=5`;
  superagent.get(weaURL)

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
    });
}


function parkHandler(req,res){
  let park =[];
  let cityName=req.query.search_query;
  let key=process.env.PARK_KEY;
  let parkURL=`https://developer.nps.gov/api/v1/parks?q=${cityName}&api_key=${key}&limit=8`;
  superagent.get(parkURL)

    .then(parkDATA=>{
      parkDATA.body.data.map(item=>{
        let parkRes= new Park (item);
        park.push(parkRes);
      });
      res.send(park);
    })
    .catch(error=>{
      console.log(error);
      res.send(error);
    });
}




function Weather(local){
  this.forecast=local.weather.description;
  this.time= new Date(local.datetime).toString().slice(0,15);
}

function Location(cityName,locData){
  this.search_query=cityName;
  this.formatted_query=locData[0].display_name;
  this.latitude=locData[0].lat;
  this.longitude=locData[0].lon;
}

function Park(cityName){
  this.name=cityName.fullName;
  this.address=`${cityName.addresses[0].line1},${cityName.addresses[0].city},${cityName.addresses[0].stateCode},${cityName.addresses[0].postalCode}`;
  this.fee='0.00';
  this.description=cityName.description;
  this.url=cityName.url;
}


function generalHandler(req,res){
  let errObj = {
    status: 500,
    resText: 'sorry! this page not found'
  };
  res.status(404).send(errObj);
}
