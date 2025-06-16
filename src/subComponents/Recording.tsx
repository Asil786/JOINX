 
import React from 'react';
import {useRecording} from './recording/useRecording';
import IconButton, {IconButtonProps} from '../atoms/IconButton';
import {useVideoCall} from '../components/useVideoCall';
import {useToolbarMenu} from '../utils/useMenu';
import ToolbarMenuItem from '../atoms/ToolbarMenuItem';
import {useActionSheet} from '../utils/useActionSheet';
import {useString} from '../utils/useString';
import {toolbarItemRecordingText} from '../language/default-labels/videoCallScreenLabels';
import {useToolbarProps} from '../atoms/ToolbarItem';

export interface RecordingButtonProps {
  showLabel?: boolean;
  render?: (onPress: () => void, isRecordingActive: boolean) => JSX.Element;
}

const Recording = (props: RecordingButtonProps) => {
  const {label = null, onPress: onPressCustom = null} = useToolbarProps();
  const {isToolbarMenuItem} = useToolbarMenu();
  const {startRecording, inProgress, isRecordingActive} = useRecording();
  const recordingButton = useString<boolean>(toolbarItemRecordingText);
  const {isOnActionSheet, showLabel} = useActionSheet();
  const {setShowStopRecordingPopup} = useVideoCall();
  const onPress = () => {
    if (!isRecordingActive) {
      startRecording && startRecording();
    } else {
      setShowStopRecordingPopup(true);
    }
  };
  let iconButtonProps: IconButtonProps = {
    iconProps: {
      name: isRecordingActive ? 'stop-recording' : 'recording',
      tintColor: isRecordingActive
        ? $config.SEMANTIC_ERROR
        : $config.SECONDARY_ACTION_COLOR,
    },
    btnTextProps: {
      text: showLabel ? label || recordingButton(isRecordingActive) : '',
      textColor: $config.FONT_COLOR,
    },
    onPress: onPressCustom || onPress,
    disabled: inProgress,
    containerStyle: inProgress ? {opacity: 0.6} : {},
  };

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
  iconButtonProps.isOnActionSheet = isOnActionSheet;

  return props?.render ? (
    props.render(onPress, isRecordingActive)
  ) : isToolbarMenuItem ? (
    <ToolbarMenuItem {...iconButtonProps} />
  ) : (
    <IconButton {...iconButtonProps} />
  );
};

export default Recording;
