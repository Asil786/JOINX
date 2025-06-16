 

// TODO: Investigate further
// Exported like so to prevent error while bundling as react-sdk. Cause: some webpack Edgecase
import {customize} from './customize';
import configJSON from '../config.json';

let $config = configJSON as unknown as ConfigInterface;

export {customize, $config};
export * from './action-library';
export * from './app-state';
export * from './customEvents';
export * from './sub-components';
export * from './typeDefinition';
export * from './utils';
export * from './types';
export * from './atoms';

//TODO: hari remove later - used for simple-practice demo
export * from './temp';
