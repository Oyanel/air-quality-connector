'use strict';

const AZIMUT_CRICKET_TYPE = 'Azimut Cricket',
  ITEM_NOT_FOUND_CODE = 32,
  log = require('../../utils/logger'),
  ThingsBoardService = require('../../service/thingsBoardService/thingsBoardService.js'),
  Device = require('../../model/thingsBoard/device');

/**
 * Manage all the requests to the ThingsBoard API.
 */
class ThingsBoardController {

  /**
   * Update the device with the given telemetry.
   *
   * @param device
   * @returns {Promise}
   */
  static async updateOrCreateDevice(device) {
    const deviceId = await ThingsBoardService.getTenantDeviceId(device.name)
      .then(res => Promise.resolve(res))
      .catch(async err => {

        // If the device does not exist
        if (err.response.data.errorCode === ITEM_NOT_FOUND_CODE) {

          // Save a device with just a name and a type
          let newDevice = new Device(device.name, AZIMUT_CRICKET_TYPE);
          let savedDevice = await ThingsBoardService.saveDevice(newDevice)
            .then(res => {
              let message = 'Device : ' + device.name + ' has been created.';
              log.log('info', message);
              return Promise.resolve(res);
            }).catch(err => Promise.resolve(false));

          if (!savedDevice)
            return false;

          // Return the device id.
          return Promise.resolve(savedDevice.id.id);
        }
      });

    if (deviceId) {
      const deviceToken = await ThingsBoardService.getDeviceToken(deviceId);
      return ThingsBoardService.updateDevice(deviceToken, device.telemetry)
        .then(res => Promise.resolve(res))
        .catch(err => Promise.reject(err));
    }
  }

}

module.exports = ThingsBoardController;