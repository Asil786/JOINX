 
import {createContext} from 'react';
import {createHook} from 'customization-implementation';

export interface ScreenshareContextInterface {
  isScreenshareActive: boolean;
  startScreenshare: () => void;
  stopScreenshare: () => void;
}

export const ScreenshareContext = createContext<ScreenshareContextInterface>({
  isScreenshareActive: false,
  startScreenshare: () => {},
  stopScreenshare: () => {},
  //@ts-ignore
  ScreenshareStoppedCallback: () => {},
});

const useScreenshare = createHook(ScreenshareContext);

export {useScreenshare};
