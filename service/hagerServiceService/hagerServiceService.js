const http = require('./http');
const routes = require('./routes');
const config = require('../../config');

class HagerServiceService {

  static async getProjectList() {
    return await http.get(routes.PROJECT_LIST)
      .then(res => Promise.resolve(res.data))
      .catch(err => Promise.reject(err));
  }

  static async getLastData() {
    const route = routes.LAST_DATA.replace('%project_id%', config.hagerService.project);
    return await http.get(route)
      .then(res => Promise.resolve(res.data))
      .catch(err => Promise.reject(err));
  }
}

module.exports = HagerServiceService;