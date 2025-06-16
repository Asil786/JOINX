 

import {DispatchContext, RtcContext} from '../../agora-rn-uikit';
import {useContext} from 'react';
import {isWeb} from './common';

function useLocalAudio() {
  const {dispatch} = useContext(DispatchContext);
  const {RtcEngineUnsafe} = useContext(RtcContext);

  const disableAudioButton = () => {
    RtcEngineUnsafe.muteLocalAudioStream(true);
    dispatch({
      type: 'LocalMuteAudio',
      value: [0, true],
    });
  };

  const enableAudioButton = () => {
    dispatch({
      type: 'LocalMuteAudio',
      value: [0, false],
    });
  };

  const getLocalAudioStream = () => {
    try {
      return isWeb() ? window?.engine?.localStream?.audio : null;
    } catch (error) {
      throw error;
    }
  };

  const getRemoteAudioStream = (uid: number) => {
    try {
      return isWeb() ? window?.engine?.remoteStreams?.get(uid)?.audio : null;
    } catch (error) {
      throw error;
    }
  };

  const getLocalScreenshareAudioStream = () => {
    try {
      return isWeb() ? window?.engine?.screenStream?.audio : null;
    } catch (error) {
      throw error;
    }
  };

  return {
    enableAudioButton,
    disableAudioButton,
    getLocalAudioStream,
    getRemoteAudioStream,
    getLocalScreenshareAudioStream,
  };
}

export default useLocalAudio;
