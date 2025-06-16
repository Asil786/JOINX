 
const configVars = require('./configTransform');
const { getCustomizationApiPath } =  require('./customization.config');

// This file is read only by react native for IOS & Android. Doesn't apply to electron, Web targets
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['transform-define', configVars],
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        root: ['./'],
        alias: {
          'customization-api': './customization-api/index.ts',
          'customization-implementation':
            './customization-implementation/index.ts',
          customization: getCustomizationApiPath(),
        },
      },
    ],
    'react-native-reanimated/plugin'
  ],
};
