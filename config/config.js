var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'convoy'
    },
    port: process.env.PORT,
  },

  test: {
    root: rootPath,
    app: {
      name: 'convoy'
    },
    port: process.env.PORT,
  },

  production: {
    root: rootPath,
    app: {
      name: 'convoy'
    },
    port: process.env.PORT,
  }
};

module.exports = config[env];
