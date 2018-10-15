let env = 'production' || process.env.NODE_ENV;

if (env === 'production') {
  let config = require('./config.json');
  let envConfig = config[env];
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}
