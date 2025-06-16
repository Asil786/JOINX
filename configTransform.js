 
let jsonFile = require('./config.json');
let PREFIX = '$config';
let config = {};
Object.keys(jsonFile).map(key => {
  config[`${PREFIX}.${key}`] = jsonFile[key];
});

//find any missing config
const defaultConfig = require('./defaultConfig');
const filteredArray = Object.keys(defaultConfig).filter(
  value => !Object.keys(jsonFile).includes(value),
);

//add missing config with default value
if (filteredArray && filteredArray?.length) {
  //console.error('config.json missing ', filteredArray);
  filteredArray.forEach(i => {
    config[`${PREFIX}.${i}`] = defaultConfig[i];
  });
}

module.exports = config;
