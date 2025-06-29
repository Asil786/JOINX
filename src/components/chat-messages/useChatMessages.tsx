 
import {createHook} from 'customization-implementation';
import React, {useState, useEffect, useRef, useContext} from 'react';
import {useContent, useRoomInfo} from 'customization-api';
import {SidePanelType} from '../../subComponents/SidePanelEnum';
import {
  useLocalUid,
  UidType,
  ContentInterface,
  DispatchContext,
} from '../../../agora-rn-uikit';
import {
  ChatType as ChatType,
  useChatUIControls,
} from '../chat-ui/useChatUIControls';
import {useChatNotification} from '../chat-notification/useChatNotification';
import Toast from '../../../react-native-toast-message';
import {timeNow} from '../../rtm/utils';
import {useSidePanel} from '../../utils/useSidePanel';
import getUniqueID from '../../utils/getUniqueID';
import {trimText} from '../../utils/common';
import {useStringRef} from '../../utils/useString';
import {
  publicChatToastHeading,
  publicChatFileToastHeading,
  publicChatImgToastHeading,
  multiplePublicChatToastHeading,
  multiplePrivateChatToastHeading,
  privateChatToastHeading,
  multiplePublicAndPrivateChatToastHeading,
  multiplePublicAndPrivateChatToastSubHeading,
  multiplePublicChatToastSubHeading,
} from '../../language/default-labels/videoCallScreenLabels';

interface ChatMessagesProviderProps {
  children: React.ReactNode;
  callActive: boolean;
}
export enum ChatMessageType {
  /**
   * Text message.
   */
  TXT = 'txt',
  /**
   * Image message.
   */
  IMAGE = 'img',
  /**
   * Video message.
   */
  VIDEO = 'video',
  /**
   * Location message.
   */
  LOCATION = 'loc',
  /**
   * Voice message.
   */
  VOICE = 'voice',
  /**
   * File message.
   */
  FILE = 'file',
  /**
   * Command message.
   */
  CMD = 'cmd',
  /**
   * Custom message.
   */
  CUSTOM = 'custom',
  /**
   * Combined message.
   */
  COMBINE = 'combine',
}

export interface messageInterface {
  createdTimestamp: number;
  updatedTimestamp?: number;
  msg: string;
  msgId: string;
  isDeleted: boolean;
  type: ChatMessageType;
  thumb?: string;
  url?: string;
  fileName?: string;
  ext?: string;
  reactions?: Reaction[];
  replyToMsgId?: string;
  hide?: boolean;
}

export enum SDKChatType {
  SINGLE_CHAT = 'singleChat',
  GROUP_CHAT = 'groupChat',
}

export interface ChatOption {
  chatType: SDKChatType;
  type: ChatMessageType;
  from: string;
  to: string;
  msg?: string;
  file?: object;
  ext?: {
    file_length?: number;
    file_ext?: string;
    file_name?: string;
    file_url?: string;
    from_platform?: string;
    channel?: string;
    msg?: string;
    replyToMsgId?: string;
  };
  url?: string;
}

export interface Reaction {
  count: number;
  reaction: string; // emojis
  userList: string[]; // list of user who gave reactions
}

interface ChatMessage {
  msgId?: string;
  localMsgId?: string;
  conversationId?: string;
  from?: string;
  to?: string;
  localTime?: number;
  serverTime?: number;
  hasDeliverAck?: boolean;
  hasReadAck?: boolean;
  needGroupAck?: boolean;
  groupAckCount?: number;
  hasRead?: boolean;
  chatType?: number;
  direction?: string;
  status?: number;
  attributes?: any;
  body: any;
  isChatThread?: boolean;
  isOnline?: boolean;
  deliverOnlineOnly?: boolean;
  receiverList?: string[];
}
export interface MessageStatusCallback {
  onProgress?(localMsgId: string, progress: number): void;
  onError(localMsgId: string, error: any): void;
  onSuccess(message: ChatMessage): void;
}
export interface messageStoreInterface extends messageInterface {
  uid: UidType;
}

interface ChatMessagesInterface {
  messageStore: messageStoreInterface[];
  privateMessageStore: {[key: string]: messageStoreInterface[]};
  addMessageToPrivateStore: (
    uid: UidType,
    body: messageInterface,
    local: boolean,
  ) => void;
  addMessageToStore: (uid: UidType, body: messageInterface) => void;
  showMessageNotification: (
    msg: string,
    uid: string,
    isPrivateMessage?: boolean,
    msgType?: ChatMessageType,
  ) => void;
  openPrivateChat: (toUid: UidType) => void;
  removeMessageFromStore: (msgId: string, isMsgRecalled: boolean) => void;
  removeMessageFromPrivateStore: (
    msgId: string,
    isMsgRecalled: boolean,
  ) => void;
  addReactionToStore: (msgId: string, reaction: Reaction[]) => void;
  addReactionToPrivateStore: (
    uid: UidType,
    msgId: string,
    reaction: Reaction[],
  ) => void;
}

const ChatMessagesContext = React.createContext<ChatMessagesInterface>({
  messageStore: [],
  privateMessageStore: {},
  addMessageToStore: () => {},
  addMessageToPrivateStore: () => {},
  showMessageNotification: () => {},
  openPrivateChat: () => {},
  removeMessageFromStore: () => {},
  removeMessageFromPrivateStore: () => {},
  addReactionToStore: () => {},
  addReactionToPrivateStore: () => {},
});

const ChatMessagesProvider = (props: ChatMessagesProviderProps) => {
  const isToastVisibleRef = useRef(false);
  const previousNotificationRef = useRef([]);
  const timeoutRef = useRef<any>();
  const {callActive} = props;
  const {
    data: {isHost},
  } = useRoomInfo();
  const {dispatch} = useContext(DispatchContext);
  const {defaultContent, isUserBaned} = useContent();
  const localUid = useLocalUid();
  const {setSidePanel, sidePanel} = useSidePanel();
  const {chatType, setChatType, privateChatUser, setPrivateChatUser} =
    useChatUIControls();
  const {setUnreadGroupMessageCount, setUnreadIndividualMessageCount} =
    useChatNotification();
  // to store group msgs
  const [messageStore, setMessageStore] = useState<messageStoreInterface[]>([]);
  // to store private msgs
  const [privateMessageStore, setPrivateMessageStore] = useState<{
    [key: string]: messageStoreInterface[];
  }>({});

  const defaultContentRef = useRef({defaultContent: defaultContent});
  const isUserBanedRef = useRef({isUserBaned: isUserBaned});

  const isHostRef = useRef({isHost: isHost});
  const callActiveRef = useRef({callActive: callActive});

  const groupActiveRef = useRef<boolean>(false);
  const individualActiveRef = useRef<string | number>();

  //i18 labels:

  //public multple
  const multiplePublicChatToastHeadingTT = useStringRef(
    multiplePublicChatToastHeading,
  );
  //@ts-ignore
  const multiplePublicChatToastSubHeadingTT = useStringRef<{
    count: number;
    from: string;
  }>(multiplePublicChatToastSubHeading);

  //private single
  const privateMessageLabel = useStringRef(privateChatToastHeading);

  //private multiple
  //@ts-ignore
  const multiplePrivateChatToastHeadingTT = useStringRef<{count: number}>(
    multiplePrivateChatToastHeading,
  );

  //multiple private and public toast
  const multiplePublicAndPrivateChatToastHeadingTT = useStringRef(
    multiplePublicAndPrivateChatToastHeading,
  );
  //@ts-ignore
  const multiplePublicAndPrivateChatToastSubHeadingTT = useStringRef<{
    publicChatCount: number;
    privateChatCount: number;
    from: string;
  }>(multiplePublicAndPrivateChatToastSubHeading);

  //public single
  const txtToastHeading = useStringRef(publicChatToastHeading);
  const imgToastHeading = useStringRef(publicChatImgToastHeading);
  const fileToastHeading = useStringRef(publicChatFileToastHeading);

  //commented for v1 release
  //const fromText = useString('messageSenderNotificationLabel');
  const fromText = (name: string, msgType: ChatMessageType) => {
    let text = '';
    switch (msgType) {
      case ChatMessageType.TXT:
        text = txtToastHeading?.current(name);
        break;
      case ChatMessageType.IMAGE:
        text = imgToastHeading?.current(name);
        break;
      case ChatMessageType.FILE:
        text = fileToastHeading?.current(name);
        break;
      default:
        text = txtToastHeading?.current(name);
        break;
    }
    return text;
  };

  useEffect(() => {
    callActiveRef.current.callActive = callActive;
  }, [callActive]);
  useEffect(() => {
    isHostRef.current.isHost = isHost;
  }, [isHost]);

  useEffect(() => {
    defaultContentRef.current.defaultContent = defaultContent;
  }, [defaultContent]);

  useEffect(() => {
    isUserBanedRef.current.isUserBaned = isUserBaned;
  }, [isUserBaned]);

  useEffect(() => {
    groupActiveRef.current =
      chatType === ChatType.Group && sidePanel === SidePanelType.Chat;
  }, [chatType, sidePanel]);

  useEffect(() => {
    individualActiveRef.current = privateChatUser;
  }, [privateChatUser]);

  const allEqual = arr => arr.every(val => val === arr[0]);
  const openPrivateChat = (uidAsNumber: number) => {
    setPrivateChatUser(uidAsNumber);
    setChatType(ChatType.Private);
    setSidePanel(SidePanelType.Chat);
  };

  //TODO: check why need

  const updateRenderListState = (
    uid: number,
    data: Partial<ContentInterface>,
  ) => {
    dispatch({type: 'UpdateRenderList', value: [uid, data]});
  };

  const addMessageToStore = (uid: UidType, body: messageInterface) => {
    setMessageStore((m: messageStoreInterface[]) => {
      return [
        ...m,
        {
          createdTimestamp: body.createdTimestamp,
          uid,
          msg: body.msg,
          msgId: body.msgId,
          isDeleted: body.isDeleted,
          type: body.type,
          thumb: body?.thumb,
          url: body?.url,
          ext: body?.ext,
          fileName: body?.fileName,
          replyToMsgId: body?.replyToMsgId,
          hide: false,
        },
      ];
    });
  };

  const addMessageToPrivateStore = (
    uid: UidType,
    body: messageInterface,
    local: boolean,
  ) => {
    setPrivateMessageStore(state => {
      let newState = {...state};
      newState[uid] !== undefined
        ? (newState[uid] = [
            ...newState[uid],
            {
              createdTimestamp: body.createdTimestamp,
              uid: local ? localUid : uid,
              msg: body.msg,
              msgId: body.msgId,
              isDeleted: body.isDeleted,
              type: body.type,
              thumb: body?.thumb,
              url: body?.url,
              ext: body?.ext,
              fileName: body?.fileName,
              replyToMsgId: body?.replyToMsgId,
              hide: false,
            },
          ])
        : (newState = {
            ...newState,
            [uid]: [
              {
                createdTimestamp: body.createdTimestamp,
                uid: local ? localUid : uid,
                msg: body.msg,
                msgId: body.msgId,
                isDeleted: body.isDeleted,
                type: body.type,
                thumb: body.thumb,
                url: body.url,
                ext: body?.ext,
                fileName: body?.fileName,
                replyToMsgId: body?.replyToMsgId,
                hide: false,
              },
            ],
          });
      return {...newState};
    });
  };

  const removeMessageFromStore = (msgID, isMsgRecalled) => {
    setMessageStore(prev => {
      const recalledMsgIndex = prev.findIndex(msg => msg.msgId === msgID);
      if (recalledMsgIndex === -1) return prev;

      const updatedMessages = [...prev];
      updatedMessages[recalledMsgIndex][isMsgRecalled ? 'isDeleted' : 'hide'] =
        true;
      return updatedMessages;
    });
  };

  const removeMessageFromPrivateStore = (msgID, isMsgRecalled) => {
    setPrivateMessageStore(state => {
      const newState = {...state};

      Object.keys(newState).forEach(uid => {
        const messages = newState[uid];
        if (messages) {
          const recalledMsgIndex = messages.findIndex(
            msg => msg.msgId === msgID,
          );
          if (recalledMsgIndex !== -1) {
            const updatedMessages = [...messages];
            if (isMsgRecalled) {
              updatedMessages[recalledMsgIndex].isDeleted = true;
            } else {
              updatedMessages[recalledMsgIndex].hide = true;
            }
            newState[uid] = updatedMessages;
          }
        }
      });

      return newState;
    });
  };

  const addReactionToStore = (msgId: string, newReactions: Reaction[]) => {
    setMessageStore(prev => {
      const msgIndex = prev.findIndex(msg => msg.msgId === msgId);
      if (msgIndex !== -1) {
        const updatedMessages = [...prev];
        const message = updatedMessages[msgIndex];

        // Merge reactions
        const existingReactions = message.reactions || [];
        newReactions.forEach(newReaction => {
          const reactionIndex = existingReactions.findIndex(
            r => r.reaction === newReaction.reaction,
          );
          if (reactionIndex !== -1) {
            // Update existing reaction
            existingReactions[reactionIndex] = newReaction;
          } else {
            // Add new reaction
            existingReactions.push(newReaction);
          }
        });

        // Update the message with merged reactions
        message.reactions = [...existingReactions];
        return updatedMessages;
      }
      return prev;
    });
  };

  const addReactionToPrivateStore = (
    uid: UidType,
    msgId: string,
    newReactions: Reaction[],
  ) => {
    setPrivateMessageStore(prev => {
      const newState = {...prev};
      const messages = newState[uid];

      if (messages) {
        const msgIndex = messages.findIndex(msg => msg.msgId === msgId);

        if (msgIndex !== -1) {
          const message = messages[msgIndex];
          const existingReactions = message.reactions || [];

          // Loop through each new reaction and merge with existing reactions
          newReactions.forEach(newReaction => {
            const reactionIndex = existingReactions.findIndex(
              r => r.reaction === newReaction.reaction,
            );

            if (reactionIndex !== -1) {
              // Update the existing reaction
              existingReactions[reactionIndex] = newReaction;
            } else {
              // Add the new reaction
              existingReactions.push(newReaction);
            }
          });

          // Update the message with the merged reactions
          message.reactions = [...existingReactions];
          newState[uid] = [...messages];
        }
      }
      return newState;
    });
  };

  const showMessageNotification = (
    msg: string,
    uid: string,
    isPrivateMessage: boolean = false,
    msgType: ChatMessageType,
    forceStop: boolean = false,
  ) => {
    if (isUserBanedRef.current.isUserBaned) {
      return;
    }
    if (isPrivateMessage) {
      // update notification count
      if (!(individualActiveRef.current === Number(uid))) {
        setUnreadIndividualMessageCount(prevState => {
          const prevCount = prevState && prevState[uid] ? prevState[uid] : 0;
          return {
            ...prevState,
            [uid]: prevCount + 1,
          };
        });
      }
    } else {
      if (!groupActiveRef.current) {
        setUnreadGroupMessageCount(prevState => {
          return prevState + 1;
        });
      }
    }

    //don't show group message notification if group chat is open
    if (!isPrivateMessage && groupActiveRef.current) {
      return;
    }
    const uidAsNumber = parseInt(uid);
    //don't show private message notification if private chat is open
    if (isPrivateMessage && uidAsNumber === individualActiveRef.current) {
      return;
    }
    if (forceStop) {
      return;
    }
    clearTimeout(timeoutRef.current);
    isToastVisibleRef.current = true;
    timeoutRef.current = setTimeout(() => {
      isToastVisibleRef.current = false;
      previousNotificationRef.current = [];
    }, 3000);

    previousNotificationRef.current.push({
      isPrivateMessage: isPrivateMessage,
      fromUid: isPrivateMessage ? uidAsNumber : 0,
      from:
        !isPrivateMessage &&
        //@ts-ignore
        defaultContentRef.current.defaultContent[uidAsNumber]?.name
          ? trimText(
              //@ts-ignore
              defaultContentRef.current.defaultContent[uidAsNumber]?.name,
            )
          : '',
    });

    const privateMessages = previousNotificationRef.current.filter(
      i => i.isPrivateMessage,
    );
    const publicMessages = previousNotificationRef.current.filter(
      i => !i.isPrivateMessage,
    );

    //if 1 or more public and private messages
    if (publicMessages && publicMessages.length > 1) {
      const fromNamesArray = publicMessages
        .filter(i => i.from !== undefined && i.from !== null && i.from !== '')
        .map(i => i.from);
      //removing the duplicate names
      const fromNamesArrayUnique = [...new Set(fromNamesArray)];
      //public chat with two name will seperated by "and"
      //public chat with two or more name will have "and more" at the end
      const fromNamesArrayUpdated =
        fromNamesArrayUnique.length > 2
          ? fromNamesArrayUnique
              .slice(0, 2)
              .map((i, index) => (index === 0 ? i + ', ' : i))
              .concat(privateMessages?.length ? ', more' : ' and more')
          : fromNamesArrayUnique.length == 2
          ? fromNamesArrayUnique.map((i, index) =>
              index === 0 ? i + ' and ' : i,
            )
          : fromNamesArrayUnique;
      //converting the names array to string
      const fromNames = fromNamesArrayUpdated.join('');
      Toast.show({
        //@ts-ignore
        update: isToastVisibleRef.current ? true : false,
        primaryBtn: null,
        secondaryBtn: null,
        type: 'info',
        leadingIconName: 'chat-nav',
        text1:
          privateMessages && privateMessages.length
            ? multiplePublicAndPrivateChatToastHeadingTT?.current()
            : multiplePublicChatToastHeadingTT?.current(),
        text2:
          privateMessages && privateMessages.length
            ? //@ts-ignore
              multiplePublicAndPrivateChatToastSubHeadingTT?.current({
                publicChatCount: publicMessages.length,
                privateChatCount: privateMessages.length,
                from: fromNames,
              })
            : //@ts-ignore
              multiplePublicChatToastSubHeadingTT?.current({
                count: publicMessages.length,
                from: fromNames,
              }),
        visibilityTime: 3000,
        onPress: () => {
          if (isPrivateMessage) {
            openPrivateChat(uidAsNumber);
          } else {
            //move this logic into ChatContainer
            // setUnreadGroupMessageCount(0);
            setPrivateChatUser(0);
            setChatType(ChatType.Group);
            setSidePanel(SidePanelType.Chat);
          }
        },
      });
    }
    //if one or more private message and no public messages
    else if (privateMessages && privateMessages.length > 1) {
      Toast.show({
        //@ts-ignore
        update: isToastVisibleRef.current ? true : false,
        primaryBtn: null,
        secondaryBtn: null,
        type: 'info',
        leadingIconName: 'chat-nav',
        //@ts-ignore
        text1: multiplePrivateChatToastHeadingTT?.current({
          count: privateMessages.length,
        }),
        text2: ``,
        visibilityTime: 3000,
        onPress: () => {
          const openPrivateChatDetails = allEqual(
            privateMessages.map(i => i.fromUid),
          );
          //if all private message comes from the single user then open details private chat
          if (openPrivateChatDetails) {
            openPrivateChat(privateMessages[0].fromUid);
          }
          //if private message comes from different user then open private tab not the private chatting window
          else {
            //open private tab (not the detail of private chat user)
            setPrivateChatUser(0);
            setChatType(ChatType.Group);
            setSidePanel(SidePanelType.Chat);
          }
        },
      });
    }
    //either 1 public or 1 private message
    else {
      Toast.show({
        //@ts-ignore
        update: isToastVisibleRef.current ? true : false,
        primaryBtn: null,
        secondaryBtn: null,
        type: 'info',
        leadingIconName: 'chat-nav',
        text1: isPrivateMessage
          ? privateMessageLabel?.current()
          : //@ts-ignore
          defaultContentRef.current.defaultContent[uidAsNumber]?.name
          ? fromText(
              trimText(
                //@ts-ignore
                defaultContentRef.current.defaultContent[uidAsNumber]?.name,
              ),
              msgType,
            )
          : '',
        text2: isPrivateMessage
          ? ''
          : msg.length > 30
          ? msg.slice(0, 30) + '...'
          : msg,
        visibilityTime: 3000,
        onPress: () => {
          if (isPrivateMessage) {
            openPrivateChat(uidAsNumber);
          } else {
            setPrivateChatUser(0);
            setChatType(ChatType.Group);
            setSidePanel(SidePanelType.Chat);
          }
        },
      });
    }
  };

  return (
    <ChatMessagesContext.Provider
      value={{
        messageStore,
        privateMessageStore,
        addMessageToStore,
        addMessageToPrivateStore,
        removeMessageFromStore,
        removeMessageFromPrivateStore,
        showMessageNotification,
        openPrivateChat,
        addReactionToStore,
        addReactionToPrivateStore,
      }}>
      {props.children}
    </ChatMessagesContext.Provider>
  );
};

const useChatMessages = createHook(ChatMessagesContext);

export {ChatMessagesProvider, useChatMessages};
