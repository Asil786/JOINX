 
import React, {useContext} from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
} from 'react-native';
import hexadecimalTransparency from '../utils/hexadecimalTransparency';
import {secondaryBtn, secondaryButtonText} from '../../theme.json';
// import ColorContext from '../components/ColorContext';

export interface SecondaryButtonProps extends TouchableOpacityProps {
  text?: string;
  children?: React.ReactNode;
}

export default function SecondaryButton(props: SecondaryButtonProps) {
  // const primaryColor = $config.FONT_COLOR; //useContext(ColorContext);
  const {children, ...otherProps} = props;
  return (
    <TouchableOpacity
      style={[
        styles.secondaryBtn,
        {
          borderColor: props.disabled
            ? $config.PRIMARY_ACTION_BRAND_COLOR +
              hexadecimalTransparency['80%']
            : $config.PRIMARY_ACTION_BRAND_COLOR,
        },
      ]}
      {...otherProps}>
      {props.text ? (
        <Text
          style={[
            styles.secondaryButtonText as StyleProp<TextStyle>,
            {
              color: props.disabled
                ? $config.PRIMARY_ACTION_BRAND_COLOR +
                  hexadecimalTransparency['80%']
                : $config.PRIMARY_ACTION_BRAND_COLOR,
            },
          ]}>
          {props.text}
        </Text>
      ) : (
        <></>
      )}
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  //@ts-ignore
  secondaryBtn,
  //@ts-ignore
  secondaryButtonText,
});
