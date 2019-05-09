'use strict';

let HagerServiceService = require('../../service/hagerServiceService/hagerServiceService');
let AzimutCricketSensor = require('../../model/thingsBoard/AzimutCricketSensor');
let _ = require('lodash');
let log = require('../../utils/logger');

/**
 * Channel Type enumeration (see HagerServices doc for code ref.)
 *
 * @type {Readonly<{light: string, hygrometry: string, CO2: string, temperature: string}>}
 */
const ENUM_CHANNELS_TYPE = Object.freeze({
  temperature: "2",
  hygrometry: "12",
  CO2: "330",
  light: "339"
});

/**
 * Data Type enumeration (see HagerServices doc for code ref.)
 *
 * @type {Readonly<{light: string, hygrometry: string, CO2: string, temperature: string}>}
 */
const ENUM_DATA_TYPE = Object.freeze({
  temperature: "8",
  hygrometry: "9",
  CO2: "22",
  light: "28"
});

/** Code process for accessing generic datas (see HagerServices doc for code ref.) **/
const CODE_PROCCESS = '10';

class HargerServiceController {

  /**
   * Find the project list. Useful to get the project codes.
   *
   * @returns {Promise<T>}
   */
  static getProjectList() {
    return HagerServiceService.getProjectList()
      .then(res => Promise.resolve(res))
      .catch(err => Promise.reject(err));
  }

  /**
   * Return the sensors data from hager and create a list of AzimutCricketSensor Objects
   *
   * @returns {Promise<Array>}
   */
  static getAzimutCricketSensors() {
    return HagerServiceService.getLastData()
      .then(res => {
        const devices = [];
        let temperature, hygrometry, CO2, light;
        log.log('info', 'Data retrieved from Hager Services');

        Object.entries(res.locations).map(device => {
          const rawdata = device[1].processes[CODE_PROCCESS].rawdata;

          if (rawdata[ENUM_DATA_TYPE.temperature])
            temperature = rawdata[ENUM_DATA_TYPE.temperature].channels[ENUM_CHANNELS_TYPE.temperature][0].value;

          if (rawdata[ENUM_DATA_TYPE.hygrometry])
            hygrometry = rawdata[ENUM_DATA_TYPE.hygrometry].channels[ENUM_CHANNELS_TYPE.hygrometry][0].value;

          if (rawdata[ENUM_DATA_TYPE.CO2])
            CO2 = rawdata[ENUM_DATA_TYPE.CO2].channels[ENUM_CHANNELS_TYPE.CO2][0].value;

          if (rawdata[ENUM_DATA_TYPE.light])
            light = rawdata[ENUM_DATA_TYPE.light].channels[ENUM_CHANNELS_TYPE.light][0].value;

          if (!_.isNil(temperature) && !_.isNil(hygrometry) && !_.isNil(CO2) || !_.isNil(light))
            devices.push({
              name: device[1].name,
              telemetry: new AzimutCricketSensor(hygrometry, temperature, light, CO2).toString()
            });
        });

        return Promise.resolve(devices);
      })
      .catch(err => Promise.reject(err));
  }

}

module.exports = HargerServiceController;