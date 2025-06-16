 
import React, {useContext} from 'react';
import {CustomizationApiInterface} from 'customization-api';
import customizationConfig from 'customization';
import createHook from './createHook';
import {SdkApiContext} from '../src/components/SdkApiContext';

const CustomizationContext: React.Context<CustomizationApiInterface> =
  React.createContext(customizationConfig);

const CustomizationProvider: React.FC = (props) => {
  const {customize: userCustomization} = useContext(SdkApiContext);

  return (
    <CustomizationContext.Provider value={userCustomization.customization}>
      {props.children}
    </CustomizationContext.Provider>
  );
};

const useCustomization = createHook(CustomizationContext);

export {useCustomization, CustomizationProvider};
