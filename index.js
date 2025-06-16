 
/**
 * @format
 */

import {AppRegistry} from 'react-native';
import 'react-native-url-polyfill/auto';
import App from './src/App';
import {name as appName} from './app.json';
import React from 'react';
import {
  DatadogProvider,
  getConfig,
} from './src/logger/transports/agora-transport';
import {ENABLE_AGORA_LOGGER_TRANSPORT} from './src/logger/constants';

if (ENABLE_AGORA_LOGGER_TRANSPORT) {
  const config = getConfig();
  const AppWithLogs = () => (
    <DatadogProvider configuration={config}>
      <App />
    </DatadogProvider>
  );
  AppRegistry.registerComponent(appName, () => AppWithLogs);
} else {
  AppRegistry.registerComponent(appName, () => App);
}
