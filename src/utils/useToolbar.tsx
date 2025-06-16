 

import React, {useEffect, useState} from 'react';
import {createHook} from 'customization-implementation';

export enum ToolbarPosition {
  top = 'TOP',
  bottom = 'BOTTOM',
  left = 'LEFT',
  right = 'RIGHT',
}

export interface ToolbarInferface {
  position?: ToolbarPosition;
  isHorizontal?: boolean;
}

const ToolbarContext = React.createContext<ToolbarInferface>({
  position: undefined,
  isHorizontal: true,
});

interface ToolbarProviderProps {
  value: ToolbarInferface;
  children: React.ReactNode;
}
const ToolbarProvider = (props: ToolbarProviderProps) => {
  const [isHorizontal, setIsHorizontal] = useState(true);
  useEffect(() => {
    if (
      props?.value?.position === ToolbarPosition.left ||
      props?.value?.position === ToolbarPosition.right
    ) {
      setIsHorizontal(false);
    } else {
      !isHorizontal && setIsHorizontal(true);
    }
  }, [props?.value?.position]);
  return (
    <ToolbarContext.Provider
      value={{position: props?.value?.position, isHorizontal}}>
      {props.children}
    </ToolbarContext.Provider>
  );
};

const useToolbar = createHook(ToolbarContext);

export {ToolbarProvider, useToolbar};
