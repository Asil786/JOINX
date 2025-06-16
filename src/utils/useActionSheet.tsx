 

import React, {useState} from 'react';
import {createHook} from 'customization-implementation';
import {useToolbar} from './useToolbar';

export interface ActionSheetInferface {
  isOnActionSheet: boolean;
  isOnFirstRow: boolean;
  showLabel: boolean;
}

const ActionSheetContext = React.createContext<ActionSheetInferface>({
  isOnActionSheet: false,
  isOnFirstRow: false,
  showLabel: $config.ICON_TEXT,
});

interface ActionSheetProviderProps {
  children: React.ReactNode;
  isOnFirstRow?: boolean;
}
const ActionSheetProvider = (props: ActionSheetProviderProps) => {
  const {position} = useToolbar();
  return (
    <ActionSheetContext.Provider
      value={{
        isOnActionSheet: true,
        isOnFirstRow: props?.isOnFirstRow,
        showLabel:
          !props?.isOnFirstRow && $config.ICON_TEXT && position !== undefined,
      }}>
      {props.children}
    </ActionSheetContext.Provider>
  );
};

const useActionSheet = createHook(ActionSheetContext);

export {ActionSheetProvider, useActionSheet};
