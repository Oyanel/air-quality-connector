'use strict';

let config = require('../../config');
let routes = require('./routes');
let axios = require('axios');
let log = require('../../utils/logger');
let _ = require('lodash');

let token = null;

const getAuthParameter = function (user, password) {
  return 'Basic ' + Buffer.from(`${user}:${password}`).toString('base64');
};

const BASE_HEADERS = {
    "Content-Type": "application/json",
    "Ocp-Apim-Subscription-Key": config.hagerService.apiKey,
  },
  HOST = config.hagerService.host + config.hagerService.endPoint;

const http = axios.create({
  baseURL: HOST,
  headers: BASE_HEADERS
});


const login = async () => {
  const header = {
    ...BASE_HEADERS,
    Authorization: getAuthParameter(config.hagerService.user, config.hagerService.password)
  };
  return await axios.post(HOST + routes.BASE_LOGIN_ROUTE, null, {headers: header})
    .then(res => Promise.resolve(res.data))
    .catch(err => Promise.reject(err));
};

/**
 * Add the token to every call.
 */
http.interceptors.request.use(async function (config) {
    if (_.isNil(token)) {
      try {
        token = await login();
      } catch (e) {
        console.log('erreur login', e);
        return config;
      }
    }
    config.headers['Authorization'] = getAuthParameter(token, '');
    return config;
  },
  (error) => {
    let message = 'ThingsBoard has return status code ' + error.response.status;
    log.log('error', 'error');
    return Promise.reject(message);
  }
);

module.exports = http;