 
import React, {useRef, useState} from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import {useString} from '../utils/useString';
import useRemoteMute, {MUTE_REMOTE_TYPE} from '../utils/useRemoteMute';
import TertiaryButton from '../atoms/TertiaryButton';
import Spacer from '../atoms/Spacer';
import RemoteMutePopup from '../subComponents/RemoteMutePopup';
import {calculatePosition, isValidReactComponent} from '../utils/common';
import {
  I18nMuteType,
  peoplePanelMuteAllMicBtnText,
  peoplePanelTurnoffAllCameraBtnText,
} from '../language/default-labels/videoCallScreenLabels';
import {useCustomization} from 'customization-implementation';

export interface MuteAllAudioButtonProps {
  render?: (onPress: () => void) => JSX.Element;
}

export const MuteAllAudioButton = (props: MuteAllAudioButtonProps) => {
  const [showAudioMuteModal, setShowAudioMuteModal] = useState(false);
  const audioBtnRef = useRef(null);
  const [modalPosition, setModalPosition] = useState({});
  const muteRemoteAudio = useRemoteMute();
  const muteAllAudioButton = useString(peoplePanelMuteAllMicBtnText)();
  const onPressAction = () => muteRemoteAudio(MUTE_REMOTE_TYPE.audio);
  const {width: globalWidth, height: globalHeight} = useWindowDimensions();
  const showAudioModal = () => {
    audioBtnRef?.current?.measure(
      (_fx, _fy, localWidth, localHeight, px, py) => {
        const data = calculatePosition({
          px,
          py,
          localHeight,
          localWidth,
          globalHeight,
          globalWidth,
          extra: {
            bottom: 10,
            left: localWidth / 2,
            right: -(localWidth / 2),
          },
          popupWidth: 290,
        });
        setModalPosition(data);
        setShowAudioMuteModal(true);
      },
    );
  };
  const onPress = () => {
    showAudioModal();
  };
  return props?.render ? (
    props.render(onPress)
  ) : (
    <>
      <RemoteMutePopup
        type={I18nMuteType.audio}
        actionMenuVisible={showAudioMuteModal}
        setActionMenuVisible={setShowAudioMuteModal}
        name={null}
        modalPosition={modalPosition}
        onMutePress={() => {
          onPressAction();
          setShowAudioMuteModal(false);
        }}
      />
      <TertiaryButton
        setRef={ref => (audioBtnRef.current = ref)}
        onPress={onPress}
        text={muteAllAudioButton}
      />
    </>
  );
};

export interface MuteAllVideoButtonProps {
  render?: (onPress: () => void) => JSX.Element;
}
export const MuteAllVideoButton = (props: MuteAllVideoButtonProps) => {
  const [showVideoMuteModal, setShowVideoMuteModal] = useState(false);
  const videoBtnRef = useRef(null);
  const [modalPosition, setModalPosition] = useState({});
  const muteRemoteVideo = useRemoteMute();
  const {width: globalWidth, height: globalHeight} = useWindowDimensions();
  const muteAllVideoButton = useString(peoplePanelTurnoffAllCameraBtnText)();
  const onPressAction = () => muteRemoteVideo(MUTE_REMOTE_TYPE.video);
  const showVideoModal = () => {
    videoBtnRef?.current?.measure(
      (_fx, _fy, localWidth, localHeight, px, py) => {
        const data = calculatePosition({
          px,
          py,
          localHeight,
          localWidth,
          globalHeight,
          globalWidth,
          extra: {
            bottom: 10,
            left: globalWidth < 720 ? 0 : localWidth / 2,
            right: globalHeight < 720 ? 0 : -(localWidth / 2),
          },
          popupWidth: 290,
        });
        setModalPosition(data);
        setShowVideoMuteModal(true);
      },
    );
  };
  const onPress = () => {
    showVideoModal();
  };
  return props?.render ? (
    props.render(onPress)
  ) : (
    <>
      <RemoteMutePopup
        type={I18nMuteType.video}
        actionMenuVisible={showVideoMuteModal}
        setActionMenuVisible={setShowVideoMuteModal}
        name={null}
        modalPosition={modalPosition}
        onMutePress={() => {
          onPressAction();
          setShowVideoMuteModal(false);
        }}
      />
      <TertiaryButton
        setRef={ref => (videoBtnRef.current = ref)}
        onPress={onPress}
        text={muteAllVideoButton}
      />
    </>
  );
};

const HostControlView = () => {
  const {AudioControlComponent, VideoControlComponent} = useCustomization(
    data => {
      let components: {
        AudioControlComponent: React.ComponentType;
        VideoControlComponent: React.ComponentType;
      } = {
        AudioControlComponent:
          MuteAllAudioButton as React.ComponentType<MuteAllAudioButtonProps>,
        VideoControlComponent:
          MuteAllVideoButton as React.ComponentType<MuteAllVideoButtonProps>,
      };

      if (
        data?.components?.videoCall?.hostControls?.audioControl &&
        isValidReactComponent(
          data?.components?.videoCall?.hostControls?.audioControl,
        )
      ) {
        components.AudioControlComponent =
          data?.components?.videoCall?.hostControls?.audioControl;
      }

      if (
        data?.components?.videoCall?.hostControls?.videoControl &&
        isValidReactComponent(
          data?.components?.videoCall?.hostControls?.videoControl,
        )
      ) {
        components.VideoControlComponent =
          data?.components?.videoCall?.hostControls?.videoControl;
      }

      return components;
    },
  );
  return (
    // <View style={style.container}>
    <>
      {!$config.AUDIO_ROOM && (
        <View style={{display: 'flex', flex: 1}}>
          <VideoControlComponent />
        </View>
      )}
      <Spacer horizontal size={16} />
      <View style={{display: 'flex', flex: 1}}>
        <AudioControlComponent />
      </View>
    </>
    // </View>
  );
};

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btn: {},
});

export default HostControlView;
