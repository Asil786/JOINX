 

import React, {SetStateAction, useState} from 'react';
import {createHook} from 'customization-implementation';
import useLayoutsData from '../pages/video-call/useLayoutsData';
import {isArray} from './common';

export interface LayoutContextInterface {
  currentLayout: string;
  setLayout: React.Dispatch<SetStateAction<string>>;
}

const LayoutContext = React.createContext<LayoutContextInterface>({
  currentLayout: '',
  setLayout: () => {},
});

interface LayoutProviderProps {
  children: React.ReactNode;
}
const LayoutProvider = (props: LayoutProviderProps) => {
  const layouts = useLayoutsData();
  const defaultLayoutName = isArray(layouts) ? layouts[0].name : '';
  const [currentLayout, setLayout] = useState(defaultLayoutName);

  const value = {currentLayout, setLayout};
  return (
    <LayoutContext.Provider value={value}>
      {props.children}
    </LayoutContext.Provider>
  );
};
/**
 * The Layout app state governs the video call screen content display layout.
 */
const useLayout = createHook(LayoutContext);

export {LayoutProvider, useLayout};
