 
import React, {useRef, useState} from 'react';
import {useWindowDimensions, ViewStyle} from 'react-native';
import {UidType} from '../../agora-rn-uikit';
import useIsPSTN from '../utils/useIsPSTN';
import useMutePSTN from '../utils/useMutePSTN';
import Styles from '../components/styles';
import useRemoteMute, {MUTE_REMOTE_TYPE} from '../utils/useRemoteMute';
import IconButton from '../atoms/IconButton';
import RemoteMutePopup from './RemoteMutePopup';
import {I18nMuteType, useContent} from 'customization-api';
import {calculatePosition} from '../utils/common';
import useRemoteRequest, {REQUEST_REMOTE_TYPE} from '../utils/useRemoteRequest';
export interface RemoteAudioMuteProps {
  uid: UidType;
  audio: boolean;
  isHost: boolean;
  userContainerRef: any;
  iconContainerStyle?: ViewStyle;
}
/**
 * Component to mute / unmute remote audio.
 * Sends a control message to another user over RTM if the local user is a host.
 * If the local user is not a host, it simply renders an image
 */
const RemoteAudioMute = (props: RemoteAudioMuteProps) => {
  const btnRef = useRef(null);
  const {isHost = false, userContainerRef, iconContainerStyle = {}} = props;
  const muteRemoteAudio = useRemoteMute();
  const requestRemoteAudio = useRemoteRequest();
  const [showModal, setShowModal] = useState(false);
  const [pos, setPos] = useState({});
  const {defaultContent} = useContent();
  const isPSTN = useIsPSTN();
  const mutePSTN = useMutePSTN();
  const {width: globalWidth, height: globalHeight} = useWindowDimensions();
  const onPress = () => {
    if (isPSTN(props.uid)) {
      try {
        mutePSTN(props.uid);
      } catch (error) {
        console.error('An error occurred while muting the PSTN user.');
      }
    } else {
      props?.audio
        ? muteRemoteAudio(MUTE_REMOTE_TYPE.audio, props.uid)
        : requestRemoteAudio(REQUEST_REMOTE_TYPE.audio, props.uid);
    }
    setShowModal(false);
  };
  return (
    <>
      <RemoteMutePopup
        action={props?.audio ? 'mute' : 'request'}
        type={I18nMuteType.audio}
        actionMenuVisible={showModal}
        setActionMenuVisible={setShowModal}
        name={defaultContent[props.uid]?.name}
        modalPosition={pos}
        onMutePress={onPress}
      />
      <IconButton
        setRef={ref => (btnRef.current = ref)}
        disabled={!isHost}
        onPress={() => {
          btnRef?.current?.measure(
            (
              _fx: number,
              _fy: number,
              localWidth: number,
              localHeight: number,
              px: number,
              py: number,
            ) => {
              const data = calculatePosition({
                px,
                py,
                localHeight,
                localWidth,
                globalHeight,
                globalWidth,
              });
              setPos(data);
              setShowModal(true);
            },
          );
        }}
        hoverEffect={true}
        hoverEffectStyle={{
          backgroundColor: $config.ICON_BG_COLOR,
          borderRadius: 20,
        }}
        iconProps={{
          iconContainerStyle: {...iconContainerStyle},
          iconSize: 20,
          iconType: 'plain',
          name: props.audio ? 'mic-on' : 'mic-off',
          tintColor: props.audio
            ? $config.PRIMARY_ACTION_BRAND_COLOR
            : $config.SEMANTIC_NEUTRAL,
        }}
      />
    </>
  );
};

export default RemoteAudioMute;
