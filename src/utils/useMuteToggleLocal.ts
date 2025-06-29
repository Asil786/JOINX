 
import {useLocalUserInfo, useRtc} from 'customization-api';
import {useContext} from 'react';
import {
  PropsContext,
  ClientRoleType,
  ToggleState,
  DispatchContext,
} from '../../agora-rn-uikit';
import {isAndroid, isIOS, isWebInternal} from './common';
import {SdkMuteQueueContext} from '../components/SdkMuteToggleListener';

export enum MUTE_LOCAL_TYPE {
  audio,
  video,
}
/**
 * Returns an asynchronous function to toggle muted state of the given track type for the local user.
 */
function useMuteToggleLocal() {
  const {RtcEngineUnsafe} = useRtc();
  const {dispatch} = useContext(DispatchContext);
  const local = useLocalUserInfo();
  const isLiveStream = $config.EVENT_MODE;
  const {rtcProps} = useContext(PropsContext);
  const isBroadCasting = rtcProps?.role == ClientRoleType.ClientRoleBroadcaster;

  const {videoMuteQueue, audioMuteQueue} = useContext(SdkMuteQueueContext);

  const toggleMute = async (
    type: MUTE_LOCAL_TYPE,
    _action?: ToggleState,
    _fromSdk?: boolean,
  ) => {
    const queueRef =
      type === MUTE_LOCAL_TYPE.video ? videoMuteQueue : audioMuteQueue;

    const handleQueue = async () => {
      if (queueRef.current.length > 0) {
        const queueItem = queueRef.current.shift();
        try {
          await toggleMute(type, queueItem.action, true);
          queueItem.resolveQueued();
        } catch (e) {
          queueItem.rejectQueued(e);
        }
      }
    };

    switch (type) {
      case MUTE_LOCAL_TYPE.audio:
        let localAudioState = local.audio;
        // Don't do anything if it is in a transitional state
        if (
          localAudioState === ToggleState.enabled ||
          localAudioState === ToggleState.disabled
        ) {
          if (localAudioState !== _action) {
            // Disable UI
            dispatch({
              type: 'LocalMuteAudio',
              value: [
                localAudioState === ToggleState.enabled
                  ? ToggleState.disabling
                  : ToggleState.enabling,
              ],
            });

            try {
              isWebInternal()
                ? await RtcEngineUnsafe.muteLocalAudioStream(
                    localAudioState === ToggleState.enabled,
                  ) //@ts-ignore
                : await RtcEngineUnsafe.enableLocalAudio(
                    localAudioState === ToggleState.enabled ? false : true,
                  );

              // Enable UI
              dispatch({
                type: 'LocalMuteAudio',
                value: [
                  localAudioState === ToggleState.enabled
                    ? ToggleState.disabled
                    : ToggleState.enabled,
                ],
              });
              handleQueue();
            } catch (e) {
              dispatch({
                type: 'LocalMuteAudio',
                value: [localAudioState],
              });
              handleQueue();
              if (_fromSdk) {
                throw e;
              } else {
                console.error('Error toggling audio', e);
              }
            }
          } else {
            handleQueue();
          }
        }
        break;
      case MUTE_LOCAL_TYPE.video:
        const localVideoState = local.video;
        // Don't do anything if it is in a transitional state
        if (
          localVideoState === ToggleState.enabled ||
          localVideoState === ToggleState.disabled
        ) {
          // Disable UI
          if (localVideoState !== _action) {
            dispatch({
              type: 'LocalMuteVideo',
              value: [
                localVideoState === ToggleState.enabled
                  ? ToggleState.disabling
                  : ToggleState.enabling,
              ],
            });

            try {
              //enableLocalVideo not available on web
              isWebInternal()
                ? await RtcEngineUnsafe.muteLocalVideoStream(
                    localVideoState === ToggleState.enabled ? true : false,
                  )
                : //@ts-ignore
                  await RtcEngineUnsafe.enableLocalVideo(
                    localVideoState === ToggleState.enabled ? false : true,
                  );
              /**
               * In native only
               * hotfix for livestream co-presenter video publishing
               * enableLocalVideo -> only enabled local video not publishing video stream
               * enable publishing for livestreaming presenter(who raised hand and approved by host)
               */
              if ((isAndroid() || isIOS()) && isLiveStream && isBroadCasting) {
                await RtcEngineUnsafe.muteLocalVideoStream(
                  localVideoState === ToggleState.enabled ? true : false,
                );
              }
              // Enable UI
              dispatch({
                type: 'LocalMuteVideo',
                value: [
                  localVideoState === ToggleState.enabled
                    ? ToggleState.disabled
                    : ToggleState.enabled,
                ],
              });
              handleQueue();
            } catch (e) {
              dispatch({
                type: 'LocalMuteVideo',
                value: [localVideoState],
              });
              handleQueue();
              if (_fromSdk) {
                throw e;
              } else {
                console.error('Error toggling video', e);
              }
            }
          } else {
            handleQueue();
          }
        }
        break;
    }
  };

  return toggleMute;
}

export default useMuteToggleLocal;
