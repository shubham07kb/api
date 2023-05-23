const setup = require('./setup');
const route = require('../routes');
module.exports = {
    setup: setup.run,
    route: route.route
}