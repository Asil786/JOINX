 
import React from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';
import hexadecimalTransparency from '../utils/hexadecimalTransparency';

export default function HorizontalRule(props: ViewProps) {
  return <View style={[styles.ruler, props?.style]} />;
}

const styles = StyleSheet.create({
  ruler: {
    borderBottomColor:
      $config.PRIMARY_ACTION_BRAND_COLOR + hexadecimalTransparency['80%'],
    borderBottomWidth: 1,
    margin: '2%',
    width: '100%',
    maxWidth: 200,
  },
});
