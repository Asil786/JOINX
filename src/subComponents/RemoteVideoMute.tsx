 
import React, {useState, useRef} from 'react';
import {useWindowDimensions, ViewStyle} from 'react-native';
import {UidType} from '../../agora-rn-uikit';
import useRemoteMute, {MUTE_REMOTE_TYPE} from '../utils/useRemoteMute';
import IconButton from '../atoms/IconButton';
import RemoteMutePopup from './RemoteMutePopup';
import {I18nMuteType, useContent} from 'customization-api';
import {calculatePosition} from '../utils/common';
import useRemoteRequest, {REQUEST_REMOTE_TYPE} from '../utils/useRemoteRequest';
/**
 * Component to mute / unmute remote video.
 * Sends a control message to another user over RTM if the local user is a host.
 * If the local user is not a host, it simply renders an image
 */
export interface RemoteVideoMuteProps {
  uid: UidType;
  video: boolean;
  isHost: boolean;
  userContainerRef: any;
  iconContainerStyle?: ViewStyle;
}
const RemoteVideoMute = (props: RemoteVideoMuteProps) => {
  const btnRef = useRef(null);
  const {isHost = false, userContainerRef, iconContainerStyle = {}} = props;
  const muteRemoteVideo = useRemoteMute();
  const requestRemoteVideo = useRemoteRequest();
  const [showModal, setShowModal] = useState(false);
  const [pos, setPos] = useState({});
  const {defaultContent} = useContent();
  const {width: globalWidth, height: globalHeight} = useWindowDimensions();
  const onPress = () => {
    props?.video
      ? muteRemoteVideo(MUTE_REMOTE_TYPE.video, props.uid)
      : requestRemoteVideo(REQUEST_REMOTE_TYPE.video, props.uid);
    setShowModal(false);
  };
  return String(props.uid)[0] !== '1' ? (
    <>
      <RemoteMutePopup
        action={props?.video ? 'mute' : 'request'}
        type={I18nMuteType.video}
        actionMenuVisible={showModal}
        setActionMenuVisible={setShowModal}
        name={defaultContent[props.uid]?.name}
        modalPosition={pos}
        onMutePress={onPress}
      />
      <IconButton
        hoverEffect={true}
        hoverEffectStyle={{
          backgroundColor: $config.ICON_BG_COLOR,
          borderRadius: 20,
        }}
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
        iconProps={{
          iconContainerStyle: {...iconContainerStyle},
          name: props?.video ? 'video-on' : 'video-off',
          iconSize: 20,
          iconType: 'plain',
          tintColor: props.video
            ? $config.PRIMARY_ACTION_BRAND_COLOR
            : $config.SEMANTIC_NEUTRAL,
        }}
      />
    </>
  ) : (
    <></>
  );
};

export default RemoteVideoMute;
