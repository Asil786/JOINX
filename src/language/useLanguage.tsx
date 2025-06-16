 
import React, {createContext, useContext, useEffect, useState} from 'react';
import {createHook, useCustomization} from 'customization-implementation';
import {DEFAULT_I18_DATA} from './index';
import StorageContext from '../components/StorageContext';
import {LogSource, logger} from '../logger/AppBuilderLogger';

export interface LanguageContextInterface {
  languageCode: string;
  setLanguageCode: (code: string) => void;
}

export interface LanguagePropsInterface {
  children: React.ReactNode;
}

const LanguageContext = createContext<LanguageContextInterface>({
  languageCode: DEFAULT_I18_DATA.locale,
  setLanguageCode: () => {},
});

const LanguageProvider = (props: LanguagePropsInterface) => {
  const {store, setStore} = useContext(StorageContext);
  const i18nData = useCustomization(data => data?.i18n);

  //If language code is stored in the localstorage no longer available in fpe data
  //then we will update the localstorage value to default value
  let storedCode =
    i18nData && Array.isArray(i18nData) && i18nData.length
      ? i18nData?.find(item => item.locale === store.selectedLanguageCode)
        ? store.selectedLanguageCode
        : undefined
      : undefined;

  const [languageCode, setLanguageCodeLocal] = useState(
    storedCode ||
      (i18nData && Array.isArray(i18nData) && i18nData.length
        ? i18nData[0].locale
        : false) ||
      DEFAULT_I18_DATA.locale,
  );

  useEffect(() => {
    if (setStore) {
      setStore(prevState => {
        return {
          ...prevState,
          selectedLanguageCode: languageCode,
        };
      });
    }
  }, [languageCode]);

  useEffect(() => {
    let storedCode =
      i18nData && Array.isArray(i18nData) && i18nData.length
        ? i18nData?.find(item => item.locale === store.selectedLanguageCode)
          ? store.selectedLanguageCode
          : undefined
        : undefined;
    setLanguageCodeLocal(
      storedCode ||
        (i18nData && Array.isArray(i18nData) && i18nData.length
          ? i18nData[0].locale
          : false) ||
        DEFAULT_I18_DATA.locale,
    );
  }, [i18nData]);

  const setLanguageCode = (langCode: string) => {
    logger.log(
      LogSource.Internals,
      'LANGUAGE',
      `Language selected ${langCode}`,
    );
    setLanguageCodeLocal(langCode);
  };

  return (
    <LanguageContext.Provider value={{languageCode, setLanguageCode}}>
      {props.children}
    </LanguageContext.Provider>
  );
};
const useLanguage = createHook(LanguageContext);

export {LanguageProvider, useLanguage};
