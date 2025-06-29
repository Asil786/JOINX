 
import React, {createContext, ReactChildren, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useMount from './useMount';
import {ENABLE_AUTH} from '../auth/config';
import {logger, LogSource} from '../logger/AppBuilderLogger';

type rememberedDevicesListEntries = Record<
  string,
  'switch-on-connect' | 'ignore-on-connect'
>;

export interface StoreInterface {
  token: string;
  displayName: string;
  selectedLanguageCode: string;
  rememberedDevicesList: Record<
    MediaDeviceInfo['kind'],
    rememberedDevicesListEntries
  >;
  activeDeviceId: Record<MediaDeviceInfo['kind'], string>;
  whiteboardNativeInfoToast?: boolean;
  projectId: string;
}

export interface StorageContextInterface {
  store: StoreInterface;
  setStore: React.Dispatch<React.SetStateAction<StoreInterface>> | null;
}

export const initStoreValue: StoreInterface = {
  whiteboardNativeInfoToast: false,
  token: null,
  displayName: '',
  selectedLanguageCode: '',
  rememberedDevicesList: {
    audioinput: {},
    audiooutput: {},
    videoinput: {},
  },
  activeDeviceId: {
    audioinput: '',
    audiooutput: '',
    videoinput: '',
  },
  projectId: $config.PROJECT_ID,
};

const initStorageContextValue = {
  store: initStoreValue,
  setStore: null,
};

const StorageContext = createContext<StorageContextInterface>(
  initStorageContextValue,
);

export default StorageContext;

export const StorageConsumer = StorageContext.Consumer;

export const StorageProvider = (props: {children: React.ReactNode}) => {
  const [ready, setReady] = useState(false);
  const [store, setStore] = useState<StoreInterface>(initStoreValue);

  // Initialize and hydrate store
  useMount(() => {
    const hydrateStore = async () => {
      try {
        logger.log(LogSource.Internals, 'STORE', 'hydrating store');
        const storeString = await AsyncStorage.getItem('store');
        if (storeString === null) {
          await AsyncStorage.setItem('store', JSON.stringify(initStoreValue));
          logger.log(
            LogSource.Internals,
            'STORE',
            'hydrating store from initial values done',
            initStoreValue,
          );
          setReady(true);
        } else {
          const storeFromStorage = JSON.parse(storeString);
          Object.keys(initStoreValue).forEach(key => {
            if (!storeFromStorage[key]) {
              storeFromStorage[key] = initStoreValue[key];
            }
          });
          // unauth flow delete token from the localstoage if any
          if (!ENABLE_AUTH && !$config.ENABLE_CONVERSATIONAL_AI) {
            storeFromStorage['token'] = null;
          }
          const projectId = $config.PROJECT_ID;
          //if project id different then we should not use the previous session token.
          //so setting into null and updating new project id
          if (storeFromStorage['projectId'] !== projectId) {
            storeFromStorage['token'] = null;
            storeFromStorage['projectId'] = projectId;
          }
          storeFromStorage['whiteboardNativeInfoToast'] = false;
          setStore(storeFromStorage);
          logger.log(
            LogSource.Internals,
            'STORE',
            'hydrating store from already stored values done',
            storeFromStorage,
          );
          setReady(true);
        }
        setReady(true);
      } catch (e) {
        logger.error(
          LogSource.Internals,
          'STORE',
          'problem hydrating store',
          e,
        );
      }
    };
    hydrateStore();
  });

  // Sync store with the context
  useEffect(() => {
    const syncStore = async () => {
      try {
        /**
         * if authentication is not enabled then store react state will have the token
         * but it won't be saved in the localstorage
         * Fix: if we duplicate browser tab and join the same meeting, we will create new session
         */
        let tempStore = JSON.parse(JSON.stringify(store));
        if (!ENABLE_AUTH && !$config.ENABLE_CONVERSATIONAL_AI) {
          tempStore['token'] = null;
        }
        const projectId = $config.PROJECT_ID;
        //if project id different then we should not use the previous session token.
        //so setting into null and updating new project id
        if (tempStore['projectId'] !== projectId) {
          tempStore['token'] = null;
          tempStore['projectId'] = projectId;
        }
        await AsyncStorage.setItem('store', JSON.stringify(tempStore));
        logger.log(
          LogSource.Internals,
          'STORE',
          'syncing storage done',
          tempStore,
        );
      } catch (e) {
        logger.error(
          LogSource.Internals,
          'STORE',
          'problem syncing the store',
          e,
        );
      }
    };
    ready && syncStore();
  }, [store, ready]);

  return (
    <StorageContext.Provider value={{store, setStore}}>
      {ready ? props.children : <></>}
    </StorageContext.Provider>
  );
};
