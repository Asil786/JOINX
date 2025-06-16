 
const commons = require('./webpack.commons');
const {merge} = require('webpack-merge');
const path = require('path');

const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = merge(commons, {
  // Enable optimizations in production
  mode: isDevelopment ? 'development' : 'production',
  // Main entry point for the web application
  entry: {
    main: './index.web.js',
  },
  output: {
    path: path.resolve(__dirname, `../Builds/web`),
  },
  // Webpack dev server config
  devServer: {
    port: 9000,
    // https: true,
    historyApiFallback: true, // Support for react-router
    static: './', // same as contentBase from webpack v4 config
    client: {
      overlay: false,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    },
  },
});
