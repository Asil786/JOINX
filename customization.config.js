 

/*
getCustomizationApiPath - will return customization if exists otherwise it will return the dummy customization path
*/
const fs = require('fs');
const customizationPathTs = './customization/index.ts';
const customizationPathTsx = './customization/index.tsx';
const customizationDummyPath = './customization-implementation/dummyConfig.ts';
const getCustomizationApiPath = () => {
  if (fs.existsSync(customizationPathTs)) {
    return customizationPathTs;
  }
  if (fs.existsSync(customizationPathTsx)) {
    return customizationPathTsx;
  }
  return customizationDummyPath;
};
module.exports = {getCustomizationApiPath, customizationDummyPath};
