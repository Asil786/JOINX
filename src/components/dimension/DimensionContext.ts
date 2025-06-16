 
import {createContext} from 'react';

interface DimensionContextInterface {
  getDimensionData: (
    width?: number,
    height?: number,
  ) => {dim: [number, number, boolean]; isDesktop: boolean};
}

const DimensionContext = createContext<DimensionContextInterface>({
  getDimensionData: () => {
    return {dim: [0, 0, false], isDesktop: false};
  },
});

export default DimensionContext;
