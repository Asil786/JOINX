 

import React, {useContext, useEffect} from 'react';
import PrimaryButton from '../../atoms/PrimaryButton';
import {usePreCall} from '../../components/precall/usePreCall';
import {useString} from '../../utils/useString';
import {ChannelProfile, PropsContext} from '../../../agora-rn-uikit';
import {
  PrecallJoinBtnTextInterface,
  precallJoinBtnText,
} from '../../language/default-labels/precallScreenLabels';
import {useRoomInfo} from '../room-info/useRoomInfo';
import useGetName from '../../utils/useGetName';
import {useWakeLock} from '../../components/useWakeLock';
import isMobileOrTablet from '../../utils/isMobileOrTablet';
import {isWebInternal} from '../../utils/common';
import useSetName from '../../utils/useSetName';
import {useUserPreference} from '../useUserPreference';
import {LogSource, logger} from '../../logger/AppBuilderLogger';

const audio = new Audio(
  'https://dl.dropboxusercontent.com/s/1cdwpm3gca9mlo0/kick.mp3',
);

export interface PreCallJoinCallBtnProps {
  render?: (
    onPress: () => void,
    title: string,
    disabled: boolean,
  ) => JSX.Element;
}

const JoinCallBtn = (props: PreCallJoinCallBtnProps) => {
  const {rtcProps} = useContext(PropsContext);
  const {setCallActive} = usePreCall();
  const username = useGetName();
  const setUsername = useSetName();
  const {isJoinDataFetched} = useRoomInfo();
  const {awake, request} = useWakeLock();
  const joinRoomButton =
    useString<PrecallJoinBtnTextInterface>(precallJoinBtnText);

  const [buttonText, setButtonText] = React.useState(
    joinRoomButton({
      waitingRoom: false,
      ready: isJoinDataFetched,
      role: $config.EVENT_MODE ? rtcProps.role : undefined,
    }),
  );

  const onSubmit = () => {
    logger.log(
      LogSource.Internals,
      'PRECALL_SCREEN',
      'User clicked on join call button. setting call active to true',
    );
    setUsername(username.trim());
    setCallActive(true);
    // Play a sound to avoid autoblocking in safari
    if (isWebInternal() || isMobileOrTablet()) {
      audio.volume = 0;
      audio.play().then(() => {
        // pause directly once played
        audio.pause();
      });
    }
    // Avoid Sleep only on mobile browsers
    if (isWebInternal() && isMobileOrTablet() && !awake) {
      // Request wake lock
      request();
    }
  };

  useEffect(() => {
    if (rtcProps?.role) {
      setButtonText(
        joinRoomButton({
          waitingRoom: false,
          ready: isJoinDataFetched,
          role: $config.EVENT_MODE ? rtcProps.role : undefined,
        }),
      );
    }
  }, [rtcProps?.role]);

  const title = buttonText;
  const onPress = () => onSubmit();
  const disabled = !isJoinDataFetched || username?.trim() === '';
  return props?.render ? (
    props.render(onPress, title, disabled)
  ) : (
    <PrimaryButton
      // iconName={'video-on'}
      onPress={onPress}
      disabled={disabled}
      text={title}
      containerStyle={{
        minWidth: '100%',
        paddingHorizontal: 10,
      }}
      textStyle={{textAlign: 'center'}}
    />
  );
};

export default JoinCallBtn;
