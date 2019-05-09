'use strict';

let _ = require('lodash');

class AzimutCricketSensor {
  constructor(humidity, temperature, light, CO2) {
    this.humidity = humidity;
    this.temperature = temperature;
    this.light = light;
    this.CO2 = CO2;
  }

  toString() {
    const sensor = {
      ...(!_.isNil(this.humidity) && {humidity: this.humidity}),
      ...(!_.isNil(this.temperature) && {temperature: this.temperature}),
      ...(!_.isNil(this.light) && {light: this.light}),
      ...(!_.isNil(this.CO2) && {CO2: this.CO2})
    };

    return JSON.stringify(sensor);
  }
}

module.exports = AzimutCricketSensor;