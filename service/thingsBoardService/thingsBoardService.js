'use strict';

const routes = require('./routes'),
  http = require('./http');

/**
 * Manage all the requests to the ThingsBoard API.
 */
class ThingsBoardService {

  /**
   * Update the device with the given telemetry.
   *
   * @param deviceToken
   * @param telemetry
   * @returns {Promise}
   */
  static async updateDevice(deviceToken, telemetry) {
    const route = routes.BASE_TELEMETRY_ROUTE.replace('%token%', deviceToken);
    return await http.post(route, telemetry)
      .then(res => Promise.resolve(res.data ? res.data : false))
      .catch(err => Promise.reject(err));
  }

  /**
   * Function to save a device in thingsBoard.
   *
   * @param device
   * @returns {Promise}
   */
  static async saveDevice(device) {
    return await http.post(routes.CREATE_DEVICE_ROUTE, device.toString())
      .then(res => Promise.resolve(res.data ? res.data : false))
      .catch(err => Promise.reject(err));
  }

  /**
   * Retrieve the deviceId with the device name
   * Only browse in the tenant devices
   *
   * @param deviceName
   * @returns {Promise}
   */
  static async getTenantDeviceId(deviceName) {
    const route = routes.TENANT_DEVICE_ROUTE.replace('%deviceName%', deviceName);

    return await http.get(route)
      .then(res => Promise.resolve(res.data && res.data.id ? res.data.id.id : false))
      .catch(err => Promise.reject(err));
  }

  /**
   * Retrieve the device token from the device Id, useful to update a device.
   * @param deviceId
   * @returns {Promise}
   */
  static async getDeviceToken(deviceId) {
    const route = routes.DEVICE_CREDENTIALS_ROUTE.replace('%deviceId%', deviceId);
    return await http.get(route)
      .then(res => Promise.resolve(res.data && res.data.credentialsId ? res.data.credentialsId : false))
      .catch(err => Promise.reject(err));
  }

}

module.exports = ThingsBoardService;