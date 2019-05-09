'use strict';

const config = require('../../config'),
  routes = require('./routes'),
  axios = require('axios'),
  _ = require('lodash');

const BASE_HEADERS = {"Content-Type": "application/json", Accept: "application/json"},
  HOST = `${config.thingsboard.host}:${config.thingsboard.port}${config.thingsboard.endPoint}`;

const http = axios.create({
  baseURL: HOST,
  headers: BASE_HEADERS
});

let token = null;

/**
 * Format the Authentication header value.
 *
 * @param token
 * @returns {string}
 */
const getAuthParameter = function (token) {
  return 'Bearer ' + token;
};

/**
 * Login function
 *
 * @returns {Promise}
 */
const login = async () => {

  const body = {username: config.thingsboard.user, password: config.thingsboard.password};
  return await axios.post(HOST + routes.BASE_LOGIN_ROUTE, body, {headers: BASE_HEADERS})
    .then(res => Promise.resolve(res.data.token))
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

  config.headers['X-Authorization'] = getAuthParameter(token);
  return config;
}, (error) => Promise.reject(error));

module.exports = http;