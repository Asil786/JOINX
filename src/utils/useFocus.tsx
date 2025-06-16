 

import React, {SetStateAction, useState} from 'react';
import {createHook} from 'customization-implementation';

export interface currentFocus {
  editName: boolean;
}
export interface FocusContextInterface {
  currentFocus: currentFocus;
  setFocus: React.Dispatch<SetStateAction<currentFocus>>;
}

const FocusContext = React.createContext<FocusContextInterface>({
  currentFocus: {editName: false},
  setFocus: () => {},
});

interface FocusProviderProps {
  children: React.ReactNode;
}
const FocusProvider = (props: FocusProviderProps) => {
  const [currentFocus, setFocus] = useState<currentFocus>({
    editName: false,
  });

  const value = {currentFocus, setFocus};

  return (
    <FocusContext.Provider value={value}>
      {props.children}
    </FocusContext.Provider>
  );
};

/**
 * The Focus app state governs the chatinput and editname.
 */
const useFocus = createHook(FocusContext);

export {FocusProvider, useFocus};
