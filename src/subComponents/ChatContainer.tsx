 
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  Text,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import ChatBubble from './ChatBubble';
import {ChatBubbleProps} from '../components/ChatContext';
import {
  DispatchContext,
  ContentInterface,
  useLocalUid,
} from '../../agora-rn-uikit';
import TextWithTooltip from './TextWithTooltip';
import {useCustomization} from 'customization-implementation';
import {isValidReactComponent, isWebInternal} from '../utils/common';
import {useString} from '../utils/useString';
import {
  ChatType,
  useChatUIControls,
} from '../components/chat-ui/useChatUIControls';
import {useContent} from 'customization-api';
import hexadecimalTransparency from '../utils/hexadecimalTransparency';
import ThemeConfig from '../theme';
import UserAvatar from '../atoms/UserAvatar';
import Spacer from '../atoms/Spacer';
import {useChatNotification} from '../components/chat-notification/useChatNotification';
import {
  messageInterface,
  messageStoreInterface,
  useChatMessages,
} from '../components/chat-messages/useChatMessages';
import {
  chatPanelUnreadMessageText,
  chatPanelUserOfflineText,
  groupChatWelcomeContent,
} from '../language/default-labels/videoCallScreenLabels';
import CommonStyles from '../components/CommonStyles';
import PinnedMessage from './chat/PinnedMessage';

/**
 * Chat container is the component which renders all the chat messages
 * It retrieves all the messages from the appropriate stores (Message store an provate message store)
 * and maps it to a ChatBubble
 */
const ChatContainer = (props?: {
  chatBubble?: React.ComponentType<ChatBubbleProps>;
}) => {
  const info1 = useString<boolean>(groupChatWelcomeContent);
  const [scrollToEnd, setScrollToEnd] = useState(false);
  const {dispatch} = useContext(DispatchContext);
  const [grpUnreadCount, setGrpUnreadCount] = useState(0);
  const [privateUnreadCount, setPrivateUnreadCount] = useState(0);
  const {defaultContent} = useContent();
  const {privateMessageStore, messageStore} = useChatMessages();
  const messageStoreLengthRef = useRef(messageStore.length);
  const {height, width} = useWindowDimensions();
  const {
    chatType,
    setChatType,
    privateChatUser,
    inputActive,
    showEmojiPicker,
    pinMsgId,
    pinnedByUser,
  } = useChatUIControls();
  const privateMessageStoreRef = useRef(
    privateMessageStore[privateChatUser]?.length,
  );

  const [scrollOffset, setScrollOffset] = useState(0);
  const {
    setUnreadGroupMessageCount,
    unreadGroupMessageCount,
    unreadIndividualMessageCount,
    setUnreadIndividualMessageCount,
  } = useChatNotification();
  const localUid = useLocalUid();
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (chatType === ChatType.Group) {
      setGrpUnreadCount(unreadGroupMessageCount);
      setUnreadGroupMessageCount(0);
    }
  }, [chatType]);

  useEffect(() => {
    if (privateChatUser) {
      setPrivateUnreadCount(unreadIndividualMessageCount[privateChatUser]);
      setUnreadIndividualMessageCount(prevState => {
        return {
          ...prevState,
          [privateChatUser]: 0,
        };
      });
      //Once message is seen, reset lastMessageTimeStamp.
      //so whoever has unread count will show in the top of participant list
      updateRenderListState(privateChatUser, {lastMessageTimeStamp: 0});
    }
  }, [privateChatUser]);

  const updateRenderListState = (
    uid: number,
    data: Partial<ContentInterface>,
  ) => {
    dispatch({type: 'UpdateRenderList', value: [uid, data]});
  };

  const onScroll = event => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };

  const {ChatBubbleComponent} = useCustomization(data => {
    let components: {
      ChatBubbleComponent: React.ComponentType<ChatBubbleProps>;
    } = {
      ChatBubbleComponent: ChatBubble,
    };
    if (
      data?.components?.videoCall &&
      typeof data?.components?.videoCall === 'object'
    ) {
      //commented for v1 release
      if (
        data?.components?.videoCall?.chat &&
        typeof data?.components?.videoCall?.chat === 'object'
      ) {
        if (
          data?.components?.videoCall?.chat?.chatBubble &&
          typeof data?.components?.videoCall?.chat?.chatBubble !== 'object' &&
          isValidReactComponent(data?.components?.videoCall?.chat?.chatBubble)
        ) {
          components.ChatBubbleComponent =
            data?.components?.videoCall?.chat?.chatBubble;
        }
      }
    } else {
      if (props?.chatBubble && isValidReactComponent(props?.chatBubble)) {
        components.ChatBubbleComponent = props?.chatBubble;
      }
    }
    return components;
  });

  const userOfflineLabel = useString(chatPanelUserOfflineText)();
  const unreadMessageLabel = useString(chatPanelUnreadMessageText)();

  //if we don't have unread count then enable scroll to end
  useEffect(() => {
    const isPrivateActive = chatType === ChatType.Private;
    if (!isPrivateActive && !grpUnreadCount) {
      setScrollToEnd(true);
    } else if (isPrivateActive && !privateUnreadCount) {
      setScrollToEnd(true);
    }
  }, [chatType, grpUnreadCount, privateUnreadCount]);

  const onContentSizeChange = useCallback(() => {
    if (scrollToEnd) {
      scrollViewRef.current?.scrollToEnd({animated: false});
    }
  }, [scrollToEnd]);

  //if we have unread container then scrollTo that container and scrollToEnd will be disabled since its has unread count
  const unreadViewOnLayout = ({
    nativeEvent: {
      layout: {y},
    },
  }) => {
    //scroll to unread message label
    if (y) {
      scrollViewRef.current?.scrollTo({y, animated: false});
    }
  };

  return (
    <View style={style.containerView}>
      {showEmojiPicker ? <View style={CommonStyles.tintedOverlay} /> : null}
      {chatType === ChatType.Private && privateChatUser ? (
        <>
          <View style={style.participantContainer}>
            <View style={style.bgContainerStyle}>
              <UserAvatar
                name={defaultContent[privateChatUser].name}
                containerStyle={style.userAvatarContainer}
                textStyle={style.userAvatarText}
              />
            </View>
            <View style={style.participantTextContainer}>
              <Text style={[style.participantText]} numberOfLines={1}>
                {defaultContent[privateChatUser].name}
              </Text>
            </View>
          </View>
          <Spacer size={10} />
        </>
      ) : null}
      {pinMsgId && chatType === ChatType.Group ? (
        <PinnedMessage pinMsgId={pinMsgId} pinnedByUser={pinnedByUser} />
      ) : null}
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={onContentSizeChange}
        onScroll={onScroll}>
        {chatType === ChatType.Group ? (
          <>
            <View style={style.defaultMessageContainer}>
              <Text style={style.defaultMessageText}>
                {info1(messageStore?.length ? false : true)}
              </Text>
            </View>

            {messageStore.map((message: messageStoreInterface, index) => (
              <React.Fragment key={`message-group-${message.msgId}`}>
                {messageStoreLengthRef.current === messageStore.length &&
                grpUnreadCount &&
                messageStore.length - grpUnreadCount === index ? (
                  <View
                    style={[
                      style.unreadMessageContainer,
                      index === 0 && {marginTop: 8, marginBottom: 0},
                    ]}
                    onLayout={unreadViewOnLayout}>
                    <Text style={style.unreadMessageText}>
                      {grpUnreadCount} {unreadMessageLabel}
                    </Text>
                  </View>
                ) : null}
                {!message?.hide ? (
                  <ChatBubbleComponent
                    isLocal={localUid === message.uid}
                    isSameUser={
                      index !== 0 && messageStore[index - 1].uid === message.uid
                        ? true
                        : false
                    }
                    previousMessageCreatedTimestamp={
                      index !== 0
                        ? (messageStore[index - 1]
                            .createdTimestamp as unknown as string)
                        : ''
                    }
                    message={message.msg}
                    createdTimestamp={message.createdTimestamp}
                    updatedTimestamp={message.updatedTimestamp}
                    uid={message.uid}
                    key={message.msgId}
                    msgId={message.msgId}
                    isDeleted={message.isDeleted}
                    type={message.type}
                    url={message?.url}
                    thumb={message?.thumb}
                    fileName={message?.fileName}
                    ext={message?.ext}
                    reactions={message?.reactions}
                    scrollOffset={scrollOffset}
                    replyToMsgId={message?.replyToMsgId}
                    isLastMsg={messageStore.length - 1 === index}
                  />
                ) : null}
                {messageStore?.length - 1 === index ? (
                  <Spacer size={10} />
                ) : null}
              </React.Fragment>
            ))}
          </>
        ) : null}
        {chatType === ChatType.Private &&
        privateChatUser &&
        privateMessageStore[privateChatUser] ? (
          <>
            {privateMessageStore[privateChatUser].map(
              (message: messageStoreInterface, index) => (
                <>
                  {privateMessageStoreRef.current ===
                    privateMessageStore[privateChatUser]?.length &&
                  privateUnreadCount &&
                  privateMessageStore[privateChatUser]?.length -
                    privateUnreadCount ===
                    index ? (
                    <View
                      style={[
                        style.unreadMessageContainer,
                        index === 0 && {marginTop: 8, marginBottom: 0},
                      ]}
                      onLayout={unreadViewOnLayout}>
                      <Text style={style.unreadMessageText}>
                        {privateUnreadCount} {unreadMessageLabel}
                      </Text>
                    </View>
                  ) : null}
                  {!message?.hide ? (
                    <ChatBubbleComponent
                      isLocal={localUid === message.uid}
                      isSameUser={
                        index !== 0 &&
                        privateMessageStore[privateChatUser][index - 1].uid ===
                          message.uid
                          ? true
                          : false
                      }
                      message={message.msg}
                      createdTimestamp={message.createdTimestamp}
                      updatedTimestamp={message.updatedTimestamp}
                      uid={message.uid}
                      key={message.msgId}
                      msgId={message.msgId}
                      isDeleted={message.isDeleted}
                      type={message.type}
                      url={message?.url}
                      thumb={message?.thumb}
                      fileName={message?.fileName}
                      ext={message?.ext}
                      reactions={message?.reactions}
                      replyToMsgId={message?.replyToMsgId}
                      scrollOffset={scrollOffset}
                      isLastMsg={
                        privateMessageStore[privateChatUser].length - 1 ===
                        index
                      }
                    />
                  ) : null}
                  {privateMessageStore[privateChatUser]?.length - 1 ===
                  index ? (
                    <Spacer size={10} />
                  ) : null}
                </>
              ),
            )}
          </>
        ) : null}
        {defaultContent[privateChatUser]?.offline && (
          <View style={style.infoTextView}>
            <Text style={style.infoText}>{userOfflineLabel}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const style = StyleSheet.create({
  unreadMessageContainer: {
    backgroundColor: $config.CARD_LAYER_2_COLOR,
    padding: 8,
    marginVertical: 20,
  },
  unreadMessageText: {
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '600',
    fontSize: 12,
    color: $config.FONT_COLOR,
    textAlign: 'center',
  },
  defaultMessageContainer: {
    backgroundColor: $config.CARD_LAYER_2_COLOR,
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
    marginHorizontal: 12,
    marginBottom: 0,
  },
  defaultMessageText: {
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '400',
    fontSize: 12,
    color: $config.FONT_COLOR + hexadecimalTransparency['40%'],
  },
  bgContainerStyle: {
    backgroundColor: $config.VIDEO_AUDIO_TILE_AVATAR_COLOR,
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    marginLeft: 20,
    marginVertical: 8,
  },
  userAvatarContainer: {
    backgroundColor:
      $config.PRIMARY_ACTION_BRAND_COLOR + hexadecimalTransparency['10%'],
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  userAvatarText: {
    fontSize: ThemeConfig.FontSize.small,
    lineHeight: 14,
    fontWeight: '600',
    color: $config.CARD_LAYER_1_COLOR,
  },
  participantContainer: {
    flexDirection: 'row',
    overflow: 'hidden',
    justifyContent: 'space-between',
    backgroundColor:
      $config.HARD_CODED_BLACK_COLOR + hexadecimalTransparency['10%'],
  },
  participantTextContainer: {
    flex: 1,
    alignSelf: 'center',
    marginRight: 8,
  },
  participantText: {
    // flex: 1,
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '600',
    fontSize: 14,
    color: $config.FONT_COLOR,
    textAlign: 'left',
    flexShrink: 1,
  },
  containerView: {
    flex: 8,
    position: 'relative',
  },
  infoTextView: {
    marginVertical: 2,
    flexDirection: 'row',
  },
  infoText: {
    color: $config.FONT_COLOR + hexadecimalTransparency['60%'],
    fontWeight: '500',
    fontSize: 14,
    flex: 1,
    textAlign: 'center',
  },
});

export default ChatContainer;
