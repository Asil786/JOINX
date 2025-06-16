 
import React, {useContext} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {isWebInternal} from '../utils/common';
import ColorContext from '../components/ColorContext';

/**
 * A component to open the meeting using a native application.
 * This component will be rendered only on web
 * WIP. Need to implement deeplinks on native apps.
 */
const OpenInNativeButton = () => {
  const {primaryColor} = useContext(ColorContext);
  const openInNative = () => {};
  return isWebInternal() ? (
    <View style={{position: 'absolute', right: 0}}>
      <TouchableOpacity
        style={[style.btn, {borderColor: primaryColor}]}
        onPress={() => openInNative()}>
        <Text style={[style.btnText, {color: '#fff'}]}>Open in Desktop</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <></>
  );
};

const style = StyleSheet.create({
  btn: {
    backgroundColor: $config.PRIMARY_ACTION_BRAND_COLOR,
    // width: 110,
    flex: 1,
    paddingHorizontal: 10,
    height: 30,
    // borderWidth: 1,
    // borderColor: $config.PRIMARY_ACTION_BRAND_COLOR,
    borderRadius: 100,
    // marginTop: 5,
    // marginRight: 10,
  },
  btnText: {
    fontSize: 12,
    lineHeight: 29,
    // fontWeight: '500',
    textAlign: 'center',
    color: $config.SECONDARY_ACTION_COLOR,
  },
});

export default OpenInNativeButton;
