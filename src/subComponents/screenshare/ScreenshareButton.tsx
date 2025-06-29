 
import React, {useContext} from 'react';
import IconButton, {IconButtonProps} from '../../atoms/IconButton';
import {useString} from '../../utils/useString';
import {useScreenshare} from './useScreenshare';
import {PropsContext, ClientRoleType} from '../../../agora-rn-uikit';
import {useLocalUserInfo, useRoomInfo} from 'customization-api';
import useIsHandRaised from '../../utils/useIsHandRaised';
import {isAndroid, isIOS} from '../../utils/common';
import {useVideoCall} from '../../components/useVideoCall';
import {useToolbarMenu} from '../../utils/useMenu';
import ToolbarMenuItem from '../../atoms/ToolbarMenuItem';
import {
  livestreamingShareTooltipText,
  toolbarItemShareText,
} from '../../language/default-labels/videoCallScreenLabels';
import {useToolbarProps} from '../../atoms/ToolbarItem';
/**
 * A component to start and stop screen sharing on web clients.
 * Screen sharing is not yet implemented on mobile platforms.
 * Electron has it's own screen sharing component
 */

export interface ScreenshareButtonProps {
  render?: (onPress: () => void, isScreenshareActive: boolean) => JSX.Element;
  showLabel?: boolean;
  isOnActionSheet?: boolean;
}

const ScreenshareButton = (props: ScreenshareButtonProps) => {
  const {label = null, onPress: onPressCustom = null} = useToolbarProps();
  const {isToolbarMenuItem} = useToolbarMenu();
  const {rtcProps} = useContext(PropsContext);
  const {showLabel = $config.ICON_TEXT || false, isOnActionSheet = false} =
    props;
  const {
    data: {isHost},
  } = useRoomInfo();
  const local = useLocalUserInfo();
  const isHandRaised = useIsHandRaised();
  const {isScreenshareActive, startScreenshare, stopScreenshare} =
    useScreenshare();
  const {setShowStartScreenSharePopup} = useVideoCall();
  const screenShareButtonLabel = useString<boolean>(toolbarItemShareText);
  const lstooltip = useString<boolean>(livestreamingShareTooltipText);
  const onPress = () => {
    if (isScreenshareActive) {
      stopScreenshare();
    } else {
      if (isAndroid() || isIOS()) {
        //native screen we need to ask user to stop all coming video before proceeding the screenshare
        //so showing confirm popup to stop incoming video and option to share audio
        setShowStartScreenSharePopup(true);
      } else {
        startScreenshare();
      }
    }
  };

  let iconButtonProps: IconButtonProps = {
    iconProps: {
      name: isScreenshareActive ? 'stop-screen-share' : 'screen-share',
      tintColor: isScreenshareActive
        ? $config.SEMANTIC_ERROR
        : $config.SECONDARY_ACTION_COLOR,
    },
    onPress: onPressCustom || onPress,
    btnTextProps: {
      text: showLabel
        ? label || screenShareButtonLabel(isScreenshareActive)
        : '',
      textColor: $config.FONT_COLOR,
    },
  };
  iconButtonProps.isOnActionSheet = isOnActionSheet;
  if (
    rtcProps.role == ClientRoleType.ClientRoleAudience &&
    $config.EVENT_MODE &&
    !$config.RAISE_HAND
  ) {
    return null;
  }

  if (
    rtcProps.role == ClientRoleType.ClientRoleAudience &&
    $config.EVENT_MODE &&
    $config.RAISE_HAND &&
    !isHost
  ) {
    iconButtonProps.iconProps = {
      ...iconButtonProps.iconProps,
      tintColor: $config.SEMANTIC_NEUTRAL,
    };
    iconButtonProps.toolTipMessage = lstooltip(isHandRaised(local.uid));
    iconButtonProps.disabled = true;
  }

  return props?.render ? (
    props.render(onPress, isScreenshareActive)
  ) : isToolbarMenuItem ? (
    <ToolbarMenuItem {...iconButtonProps} />
  ) : (
    <IconButton {...iconButtonProps} />
  );
};

export default ScreenshareButton;
