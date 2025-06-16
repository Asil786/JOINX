 

import React from 'react';
import {createHook} from 'customization-implementation';

const ToolbarMenuContext = React.createContext({isToolbarMenuItem: false});

export interface ToolbarMenuProviderProps {
  children: React.ReactNode;
}
const ToolbarMenuProvider = (props: ToolbarMenuProviderProps) => {
  return (
    <ToolbarMenuContext.Provider value={{isToolbarMenuItem: true}}>
      {props.children}
    </ToolbarMenuContext.Provider>
  );
};

const useToolbarMenu = createHook(ToolbarMenuContext);

export {ToolbarMenuProvider, useToolbarMenu};
