 
import React from 'react';
import {ViewStyle, View, StyleSheet} from 'react-native';
import CustomIcon, {IconsInterface} from '../atoms/CustomIcon';
import {ImageIcon as UIKitImageIcon} from '../../agora-rn-uikit';
import hexadecimalTransparency from '../utils/hexadecimalTransparency';

export interface ImageIconProps {
  tintColor?: string;
  name?: keyof IconsInterface;
  hoverIconName?: keyof IconsInterface;
  icon?: string;
  iconSize?: number;
  iconContainerStyle?: ViewStyle;
  iconBackgroundColor?: string;
  base64?: boolean;
  hoverBase64?: boolean;
  base64TintColor?: string;
  iconType?: 'round' | 'plain';
  isHovered?: boolean;
  // hoverEffect?: boolean;
  // hoverEffectStyle?: ViewStyle;
  showWarningIcon?: boolean;
  iconParentContainerStyle?: ViewStyle;
}

const ImageIcon = (props: ImageIconProps) => {
  let defaultSize = $config.ICON_TEXT ? 26 : 24;
  const {
    name,
    hoverIconName = name,
    icon = undefined,
    iconSize = defaultSize,
    tintColor,
    base64 = false,
    hoverBase64 = false,
    base64TintColor = '',
    iconType = 'round',
    iconContainerStyle,
    iconParentContainerStyle = {},
    isHovered,
  } = props;
  return (
    <View
      style={[
        styles.iconContainerStyle,
        iconType === 'round'
          ? props?.iconBackgroundColor
            ? {backgroundColor: props.iconBackgroundColor}
            : {}
          : {backgroundColor: 'transparent', borderRadius: 0},
        iconParentContainerStyle,
      ]}>
      <View
        style={[
          {alignItems: 'center'},
          iconType === 'round'
            ? {padding: $config.ICON_TEXT ? 13 : 12, borderRadius: 50}
            : {padding: 0, borderRadius: 0},
          iconType === 'round' && props?.isHovered
            ? {
                backgroundColor:
                  $config.CARD_LAYER_5_COLOR + hexadecimalTransparency['20%'],
              }
            : {},
          iconContainerStyle,
        ]}>
        {props?.showWarningIcon ? (
          <View style={{position: 'absolute', top: -2.5, right: -2}}>
            <CustomIcon
              name="alert"
              color={$config.SEMANTIC_WARNING}
              size={24}
            />
          </View>
        ) : (
          <></>
        )}
        {isHovered && hoverBase64 ? (
          <UIKitImageIcon
            tintColor={base64TintColor}
            //@ts-ignore
            name={hoverIconName}
            style={{width: iconSize, height: iconSize}}
          />
        ) : base64 ? (
          <UIKitImageIcon
            tintColor={base64TintColor}
            //@ts-ignore
            name={isHovered ? hoverIconName : name}
            style={{width: iconSize, height: iconSize}}
          />
        ) : icon ? (
          <UIKitImageIcon
            tintColor={tintColor}
            icon={icon}
            style={{width: iconSize, height: iconSize}}
          />
        ) : name ? (
          <CustomIcon
            name={isHovered ? hoverIconName : name}
            color={tintColor}
            size={iconSize}
          />
        ) : (
          <></>
        )}
      </View>
    </View>
  );
};

export default ImageIcon;

const styles = StyleSheet.create({
  iconContainerStyle: {
    borderRadius: 50,
    backgroundColor: $config.ICON_BG_COLOR,
  },
});
