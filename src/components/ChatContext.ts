 
import RtmEngine from 'agora-react-native-rtm';
import {UidType} from '../../agora-rn-uikit';
import {createContext, SetStateAction} from 'react';

import {ChatMessageType, Reaction} from './chat-messages/useChatMessages';
import {createHook} from 'customization-implementation';
import {ViewStyle} from 'react-native';
import {EMessageStatus} from '../../src/ai-agent/components/AgentControls/message';

export interface ChatBubbleProps {
  isLocal: boolean;
  message: string;
  createdTimestamp: number;
  updatedTimestamp?: number;
  uid: UidType;
  msgId: string;
  isDeleted: boolean;
  isSameUser: boolean;
  type: ChatMessageType;
  thumb?: string;
  url?: string;
  fileName?: string;
  ext?: string;
  previousMessageCreatedTimestamp?: string;
  reactions?: Reaction[];
  scrollOffset?: number;
  replyToMsgId?: string;
  isLastMsg?: boolean;
  agent_text_status?: EMessageStatus | null;
  disableReactions?: boolean;
  remoteUIConfig?: {
    username?: string; // Custom username for remote user
    avatarIcon?: string;
    bubbleStyleLayer1?: ViewStyle;
    bubbleStyleLayer2?: ViewStyle;
  };

  render?: (
    isLocal: boolean,
    message: string,
    createdTimestamp: number,
    uid: UidType,
    msgId: string,
    isDeleted: boolean,
    updatedTimestamp: number,
    isSameUser: boolean,
    type: ChatMessageType,
    thumb?: string,
    url?: string,
    fileName?: string,
    ext?: string,
    previousMessageCreatedTimestamp?: string,
    reactions?: Reaction[],
    replyToMsgId?: string,
    agent_text_status?: EMessageStatus | null,
    disableReactions?: boolean,
  ) => JSX.Element;
}

export interface messageStoreInterface {
  createdTimestamp: number;
  updatedTimestamp?: number;
  uid: UidType;
  msg: string;
}

export enum messageActionType {
  Control = '0',
  Normal = '1',
}

export interface RtmActiveUids {
  [key: UidType]: {
    isHost: boolean;
  };
}
export interface RtmContextInterface {
  isInitialQueueCompleted: boolean;
  hasUserJoinedRTM: boolean;
  rtmInitTimstamp: number;
  engine: RtmEngine;
  localUid: UidType;
  onlineUsersCount: number;
}

export enum controlMessageEnum {
  muteVideo = '1',
  muteAudio = '2',
  muteSingleVideo = '3',
  muteSingleAudio = '4',
  kickUser = '5',
  requestVideo = '6',
  requestAudio = '7',
  //newUserJoined = '8',
  kickScreenshare = '9',
}

const RtmContext = createContext(null as unknown as RtmContextInterface);

const useRtm = createHook(RtmContext);

export {useRtm};
export default RtmContext;
