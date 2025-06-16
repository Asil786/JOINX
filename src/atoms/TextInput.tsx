 
import React, {useContext} from 'react';
import {TextInputProps, StyleSheet, TextInput, Platform} from 'react-native';
import {isWebInternal} from '../utils/common';
import {textInput} from '../../theme.json';
import hexadecimalTransparency from '../utils/hexadecimalTransparency';

interface TextInputCustomProps extends TextInputProps {
  setRef?: (ref: any) => void;
}

const TextInputCustom = (props: TextInputCustomProps) => {
  const {style, setRef, ...otherProps} = props;
  return (
    <TextInput
      ref={ref => props?.setRef && props.setRef(ref)}
      style={[styles.textInput, styles.textWrapFix, styles.noOutline, style]}
      placeholderTextColor={$config.FONT_COLOR + hexadecimalTransparency['70%']}
      autoCorrect={false}
      {...otherProps}
    />
  );
};

export default TextInputCustom;

const styles = StyleSheet.create({
  // @ts-ignore
  textInput,
  // @ts-ignore
  noOutline: isWebInternal() ? {outlineStyle: 'none'} : {},
  textWrapFix: Platform.select({
    ios: {
      paddingVertical: 5,
    },
  }),
});
