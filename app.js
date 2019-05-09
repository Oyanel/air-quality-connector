'use strict';

let HagerServiceController = require('./controller/hagerServiceController/hagerServiceController'),
  ThingsBoardController = require('./controller/thingsBoardController/thingsBoardController'),
  log = require('./utils/logger');

/**
 * Retrieves all the data from Hager Services and send them to Thingsboard.
 */
function lunch() {

  /**
   * Retrieve data from HagerServices.
   */
  HagerServiceController.getAzimutCricketSensors().then(devices => {

    // Devices from hager Service
    devices.map(async device => {
      ThingsBoardController.updateOrCreateDevice(device).then(
        res => {
          let message = 'device : ' + device.name + ' has been updated.';
          log.log('info', message);
        })
        .catch(err => {
          log.log('error', err);
        });
    });
  }).catch(err => {
    log.log('error', err);
  });
}

lunch();