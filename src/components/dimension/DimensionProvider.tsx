 
import React from 'react';
import {Dimensions} from 'react-native';
import DimensionContext from './DimensionContext';

const DimensionProvider = (props: {children: React.ReactNode}) => {
  const getDimensionData = (width?: number, height?: number) => {
    (width = width ? width : Dimensions.get('window').width),
      (height = height ? height : Dimensions.get('window').height);
    const dim: [number, number, boolean] = [width, height, width > height];
    return {
      dim: dim,
      isDesktop: width < height + 150 ? false : true,
    };
  };

  return (
    <DimensionContext.Provider value={{getDimensionData}}>
      {props.children}
    </DimensionContext.Provider>
  );
};

export default DimensionProvider;
