 

import React, {useContext, useEffect, useState} from 'react';
import PrimaryButton from '../../atoms/PrimaryButton';
import {usePreCall} from './usePreCall';
import {useString, useStringRef} from '../../utils/useString';
import {
  DispatchContext,
  PropsContext,
  useLocalUid,
} from '../../../agora-rn-uikit';
import {
  PrecallWaitingRoomJoinBtnTextInterface,
  precallWaitingRoomJoinBtnText,
} from '../../language/default-labels/precallScreenLabels';
import {WaitingRoomStatus, useRoomInfo} from '../room-info/useRoomInfo';
import useGetName from '../../utils/useGetName';
import {useUserPreference} from '../useUserPreference';
import {useSetRoomInfo} from '../room-info/useSetRoomInfo';
import Toast from '../../../react-native-toast-message';
import events from '../../rtm-events-api';
import {EventNames} from '../../rtm-events';
import useWaitingRoomAPI from '../../subComponents/waiting-rooms/useWaitingRoomAPI';
import {useContent} from 'customization-api';
import EventsConfigure from '../EventsConfigure';
import {
  waitingRoomApprovalRejectionToastHeading,
  waitingRoomApprovalRejectionToastSubHeading,
  waitingRoomHostNotJoined,
  waitingRoomUsersInCall,
} from '../../language/default-labels/videoCallScreenLabels';

export interface PreCallJoinWaitingRoomBtnProps {
  render?: (
    onPress: () => void,
    title: string,
    disabled: boolean,
  ) => JSX.Element;
}

let shouldWaitingRoomPoll = null;
const JoinWaitingRoomBtn = (props: PreCallJoinWaitingRoomBtnProps) => {
  const headinglabel = useStringRef(waitingRoomApprovalRejectionToastHeading);
  const subheadinglabel = useStringRef(
    waitingRoomApprovalRejectionToastSubHeading,
  );
  const waitingRoomUserNotJoinedText = useString(waitingRoomHostNotJoined);
  const waitingRoomUsersInCallText = useString(waitingRoomUsersInCall);
  let pollingTimeout = React.useRef(null);
  const {rtcProps} = useContext(PropsContext);
  const {setCallActive, callActive} = usePreCall();
  const username = useGetName();
  const {isJoinDataFetched, isInWaitingRoom} = useRoomInfo();
  const {setRoomInfo} = useSetRoomInfo();
  const [hasHostJoined, setHasHostJoined] = useState(false);
  const {defaultContent} = useContent();

  const waitingRoomButton = useString<PrecallWaitingRoomJoinBtnTextInterface>(
    precallWaitingRoomJoinBtnText,
  );
  const [buttonText, setButtonText] = React.useState(
    waitingRoomButton({
      ready: isInWaitingRoom,
      isAutoRequest: $config.ENABLE_WAITING_ROOM_AUTO_REQUEST,
      isAutoApproval: $config.ENABLE_WAITING_ROOM_AUTO_APPROVAL,
    }),
  );
  const {request: requestToJoin} = useWaitingRoomAPI();
  const {dispatch} = useContext(DispatchContext);
  const localUid = useLocalUid();
  const {activeUids} = useContent();
  const activeUidsRef = React.useRef(activeUids);

  React.useEffect(() => {
    activeUidsRef.current = activeUids;
  }, [activeUids]);

  React.useEffect(() => {
    if ($config.ENABLE_WAITING_ROOM_AUTO_REQUEST) {
      const hostUsersInCall = Object.keys(defaultContent).filter(
        key =>
          defaultContent[key].type === 'rtc' &&
          defaultContent[key].offline === false &&
          Number(key) !== localUid &&
          defaultContent[key].isHost === 'true',
      );

      //console.log('host users in call ->', hostUsersInCall);

      setHasHostJoined(hostUsersInCall.length > 0);

      setButtonText(
        hostUsersInCall.length > 0
          ? waitingRoomUsersInCallText()
          : waitingRoomUserNotJoinedText(),
      );
    }
  }, [defaultContent]);

  const {
    data: {token, isHost},
  } = useRoomInfo();

  useEffect(() => {
    if ($config.ENABLE_WAITING_ROOM && !isHost && token) {
      setCallActive(true);
    }
  }, [token]);

  useEffect(() => {
    setButtonText(
      waitingRoomButton({
        ready: !isInWaitingRoom,
        isAutoRequest: $config.ENABLE_WAITING_ROOM_AUTO_REQUEST,
        isAutoApproval: $config.ENABLE_WAITING_ROOM_AUTO_APPROVAL,
      }),
    );
  }, [isInWaitingRoom]);

  useEffect(() => {
    events.on(EventNames.WAITING_ROOM_RESPONSE, data => {
      const {approved, mainUser, screenShare, whiteboard, chat} = JSON.parse(
        data?.payload,
      );
      // stop polling if user has responsed with yes / no
      pollingTimeout.current && clearTimeout(pollingTimeout.current);
      shouldWaitingRoomPoll = false;

      if (callActive) return;
      // on approve/reject response from host, waiting room permission is reset
      // update waitinng room status on uid
      dispatch({
        type: 'UpdateRenderList',
        value: [localUid, {isInWaitingRoom: false}],
      });

      if (approved) {
        setRoomInfo(prev => {
          return {
            ...prev,
            isInWaitingRoom: false,
            waitingRoomStatus: WaitingRoomStatus.APPROVED,
            data: {
              ...prev.data,
              token: mainUser.rtc,
              screenShareToken: screenShare.rtc,
              screenShareUid: screenShare.uid,
              whiteboard,
              chat: {
                user_token: chat?.userToken,
                group_id: chat?.groupId,
                is_group_owner: chat?.isGroupOwner,
              },
            },
          };
        });
      } else {
        setRoomInfo(prev => {
          return {
            ...prev,
            isInWaitingRoom: false,
            waitingRoomStatus: WaitingRoomStatus.REJECTED,
          };
        });
        // inform user that entry was denied by the host
        Toast.show({
          leadingIconName: 'info',
          text1: headinglabel?.current(),
          text2: subheadinglabel?.current(),
          visibilityTime: 3000,
          type: 'error',
          primaryBtn: null,
          secondaryBtn: null,
        });
      }
    });

    return () => {
      clearTimeout(pollingTimeout.current);
      shouldWaitingRoomPoll = false;
    };
  }, []);

  const requestServerToJoinRoom = async () => {
    // polling for every 30 seconds
    const pollFunction = async () => {
      if (shouldWaitingRoomPoll) {
        const res = await requestToJoin({send_event: true});
        pollingTimeout.current = setTimeout(() => {
          pollFunction();
        }, 15000);
      }

      if (!shouldWaitingRoomPoll) {
        // If the request is approved/rejected stop polling
        clearTimeout(pollingTimeout.current);
      }
    };

    // Call the polling function immediately
    pollFunction();
  };

  const onSubmit = () => {
    shouldWaitingRoomPoll = true;
    // Enter waiting rooom;
    setRoomInfo(prev => {
      return {...prev, isInWaitingRoom: true};
    });

    // add the waitingRoomStatus to the uid
    dispatch({
      type: 'UpdateRenderList',
      value: [localUid, {isInWaitingRoom: true}],
    });

    // join request API to server, server will send RTM message to all hosts regarding request from this user,
    requestServerToJoinRoom();
    // send a message to host for asking permission to enter the call , then set setCallActive(true) isInWaitingRoom:false
  };

  const title = buttonText;
  const onPress = () => onSubmit();
  const disabled = $config.ENABLE_WAITING_ROOM_AUTO_REQUEST
    ? !hasHostJoined || isInWaitingRoom || username?.trim() === ''
    : isInWaitingRoom || username?.trim() === '';
  return props?.render ? (
    props.render(onPress, title, disabled)
  ) : (
    <PrimaryButton onPress={onPress} disabled={disabled} text={title} />
  );
};

export default JoinWaitingRoomBtn;
