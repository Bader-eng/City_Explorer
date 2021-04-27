'use strict';
const express = require('express');
require('dotenv').config();

<<<<<<< HEAD
=======
//http://localhost:3000
>>>>>>> ae1bc3b565102d990c90f4ebb020f2cd00e2b722
const cors = require('cors');

const server=express();

const PORT=process.env.PORT || 3000;

server.listen(PORT,()=>{
  console.log(`listening on port ${PORT}`);
});

server.use(cors());

server.get('/data',(req,res)=>{
  res.status(200).send('Hi from the data page, I am the server !!!');
});

server.get('location',(req,res)=>{
  let locationData=require('./data/location.json');
  let locationRes= new Location(locationData);
  res.send(locationRes);
});
let weather =[];
server.get('weather',(req,res)=>{
  let weatherData=require('./data/weather.json').data;
  weatherData.forEach(item =>{
    let weatherRes= new Weather (item);

    weather.push(weatherRes);
  });
  res.send(weather);

});

function Weather(local){
  this.forecast=local.weather.description;
  this.time=local.datetime;
}

function Location(locData){
  this.search_query='Lynnwood';
  this.formatted_query=locData[0].display_name;
  this.latitude=locData[0].lat;
  this.longitude=locData[0].lon;
}

server.get('*',(req,res)=>{
  let errObj = {
    status: 500,
    resText: 'sorry! this page not found'
  };
  res.status(404).send(errObj);
});
//commit///