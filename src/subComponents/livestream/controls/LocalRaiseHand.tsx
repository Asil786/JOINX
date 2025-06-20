 
import React, {useContext} from 'react';
import LiveStreamContext, {
  RaiseHandValue,
} from '../../../components/livestream';
import {useString} from '../../../utils/useString';
import ChatContext from '../../../components/ChatContext';
import IconButton from '../../../atoms/IconButton';
import {isMobileUA} from '../../../utils/common';
import {IconButtonProps} from '../../../atoms/IconButton';
import {useToolbarMenu} from '../../../utils/useMenu';
import ToolbarMenuItem from '../../../atoms/ToolbarMenuItem';
import {useActionSheet} from '../../../utils/useActionSheet';
import {toolbarItemRaiseHandText} from '../../../language/default-labels/videoCallScreenLabels';
import {useToolbarProps} from '../../../atoms/ToolbarItem';

const LocalRaiseHand = () => {
  const {isToolbarMenuItem} = useToolbarMenu();
  const {audienceSendsRequest, audienceRecallsRequest, raiseHandList} =
    useContext(LiveStreamContext);

  const {localUid} = useContext(ChatContext);
  const {isOnActionSheet, showLabel} = useActionSheet();
  const {label = null, onPress: onPressCustom = null} = useToolbarProps();

  const handStatusText = useString<boolean>(toolbarItemRaiseHandText);
  const isHandRasied = raiseHandList[localUid]?.raised === RaiseHandValue.TRUE;
  const onPress = () => {
    if (isHandRasied) {
      audienceRecallsRequest();
    } else {
      audienceSendsRequest();
    }
  };
  const iconButtonProps: IconButtonProps = {
    iconProps: {
      name: isHandRasied ? 'lower-hand' : 'raise-hand',
      tintColor: isHandRasied
        ? $config.PRIMARY_ACTION_TEXT_COLOR
        : $config.SECONDARY_ACTION_COLOR,
      iconBackgroundColor: isHandRasied
        ? $config.PRIMARY_ACTION_BRAND_COLOR
        : '',
      base64: isMobileUA() ? true : false,
    },
    btnTextProps: {
      text: showLabel
        ? label ||
          handStatusText(isHandRasied)?.replace(
            ' ',
            isOnActionSheet ? '\n' : ' ',
          )
        : '',
      textColor: $config.FONT_COLOR,
      numberOfLines: 2,
    },
    onPress: onPressCustom || onPress,
  };
  iconButtonProps.isOnActionSheet = isOnActionSheet;
  if (isOnActionSheet) {
    iconButtonProps.btnTextProps.textStyle = {
      color: $config.FONT_COLOR,
      marginTop: 8,
      fontSize: 12,
      fontWeight: '400',
      fontFamily: 'Source Sans Pro',
      textAlign: 'center',
    };
  }
  return isToolbarMenuItem ? (
    <ToolbarMenuItem {...iconButtonProps} />
  ) : (
    <IconButton {...iconButtonProps} />
  );
};

export default LocalRaiseHand;
