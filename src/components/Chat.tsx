 
import React, {useState, useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import ChatContainer from '../subComponents/ChatContainer';
import ChatInput from '../subComponents/ChatInput';
import ChatParticipants from '../subComponents/chat/ChatParticipants';
import ColorContext from './ColorContext';
import {useChatNotification} from './chat-notification/useChatNotification';
import {useString} from '../utils/useString';
import {
  isIOS,
  isMobileUA,
  isValidReactComponent,
  isWebInternal,
  useIsSmall,
} from '../utils/common';
import {ChatType, useChatUIControls} from './chat-ui/useChatUIControls';
import {useCustomization} from 'customization-implementation';
import {UidType} from '../../agora-rn-uikit';
import {ChatBubbleProps} from './ChatContext';
import {useSidePanel} from '../utils/useSidePanel';
import {SidePanelType} from '../subComponents/SidePanelEnum';
import IconButton from '../atoms/IconButton';
import ThemeConfig from '../theme';
import hexadecimalTransparency from '../utils/hexadecimalTransparency';
import SidePanelHeader from '../subComponents/SidePanelHeader';
import CommonStyles from './CommonStyles';
import {useLayout} from '../utils/useLayout';
import {getGridLayoutName} from '../pages/video-call/DefaultLayouts';
import {ChatHeader} from '../pages/video-call/SidePanelHeader';
import useCaptionWidth from '../../src/subComponents/caption/useCaptionWidth';
import {useIsRecordingBot} from '../subComponents/recording/useIsRecordingBot';
import {chatErrorNotConnected} from '../language/default-labels/videoCallScreenLabels';
import Loading from '../subComponents/Loading';
import {initializingChatText} from '../language/default-labels/commonLabels';

export interface ChatProps {
  chatBubble?: React.ComponentType<ChatBubbleProps>;
  chatInput?: React.ComponentType;
  showHeader?: boolean;
}

const Chat = (props?: ChatProps) => {
  // commented for v1 release
  const isSmall = useIsSmall();
  const {setSidePanel} = useSidePanel();
  const {showHeader = true} = props;
  const {isRecordingBot} = useIsRecordingBot();
  const {chatType, setChatType, setPrivateChatUser, chatConnectionStatus} =
    useChatUIControls();

  const {transcriptHeight} = useCaptionWidth();

  const chatErrNotConnectedText = useString(chatErrorNotConnected)();
  const loadingLabel = useString(initializingChatText)();

  React.useEffect(() => {
    return () => {
      // reset both the active tabs
      setChatType(ChatType.Group);
      setPrivateChatUser(0);
    };
  }, []);

  const selectUser = (userUID: UidType) => {
    setPrivateChatUser(userUID);
    setChatType(ChatType.Private);
    //move this logic into ChatContainer
    // setUnreadIndividualMessageCount((prevState) => {
    //   return {
    //     ...prevState,
    //     [userUID]: 0,
    //   };
    // });
    // setUnreadPrivateMessageCount(
    //   unreadPrivateMessageCount - (unreadIndividualMessageCount[userUID] || 0),
    // );
  };

  const {ChatAfterView, ChatBeforeView, ChatInputComponent} = useCustomization(
    data => {
      let components: {
        ChatAfterView: React.ComponentType;
        ChatBeforeView: React.ComponentType;
        ChatInputComponent: React.ComponentType;
      } = {
        ChatAfterView: React.Fragment,
        ChatBeforeView: React.Fragment,
        ChatInputComponent: ChatInput,
      };
      if (
        data?.components?.videoCall &&
        typeof data?.components?.videoCall === 'object'
      ) {
        if (
          data?.components?.videoCall?.chat &&
          typeof data?.components?.videoCall?.chat === 'object'
        ) {
          if (
            data?.components?.videoCall?.chat?.chatInput &&
            typeof data?.components?.videoCall?.chat?.chatInput !== 'object' &&
            isValidReactComponent(data?.components?.videoCall?.chat?.chatInput)
          ) {
            components.ChatInputComponent =
              data?.components?.videoCall?.chat?.chatInput;
          }
        }
        // commented for v1 release
        // if (
        //   data?.components?.videoCall?.chat &&
        //   typeof data?.components?.videoCall?.chat === 'object'
        // ) {
        //   if (
        //     data?.components?.videoCall?.chat?.after &&
        //     isValidReactComponent(data?.components?.videoCall?.chat?.after)
        //   ) {
        //     components.ChatAfterView = data?.components?.videoCall?.chat?.after;
        //   }
        //   if (
        //     data?.components?.videoCall?.chat?.before &&
        //     isValidReactComponent(data?.components?.videoCall?.chat?.before)
        //   ) {
        //     components.ChatBeforeView = data?.components?.videoCall?.chat?.before;
        //   }
        // }
      } else {
        if (props?.chatInput && isValidReactComponent(props.chatInput)) {
          components.ChatInputComponent = props.chatInput;
        }
      }
      return components;
    },
  );
  const {currentLayout} = useLayout();
  return (
    <>
      <View
        style={[
          isMobileUA()
            ? //mobile and mobile web
              CommonStyles.sidePanelContainerNative
            : isSmall()
            ? // desktop minimized
              CommonStyles.sidePanelContainerWebMinimzed
            : // desktop maximized
              CommonStyles.sidePanelContainerWeb,
          isWebInternal() && !isSmall() && currentLayout === getGridLayoutName()
            ? {marginTop: 4}
            : {},
          // @ts-ignore
          transcriptHeight && !isMobileUA() && {height: transcriptHeight},
          // showEmojiPicker && {
          //   backgroundColor:
          //     $config.HARD_CODED_BLACK_COLOR + hexadecimalTransparency['60'],
          // },
          ,
        ]}>
        {/**
         * In Native device we are setting absolute view. so placed ChatBeforeView and ChatAfterView inside the main view
         */}

        {chatConnectionStatus === 'loading' ? (
          <Loading
            text={loadingLabel}
            background={$config.CARD_LAYER_1_COLOR}
            textColor={$config.FONT_COLOR}
          />
        ) : chatConnectionStatus === 'failed' ? (
          <View style={style.defaultMessageContainer}>
            <Text style={style.defaultMessageText}>
              {chatErrNotConnectedText}
            </Text>
          </View>
        ) : (
          <>
            <ChatBeforeView />
            {showHeader && <ChatHeader />}
            {chatType === ChatType.Group ? (
              <>
                <ChatContainer {...props} />
                {isRecordingBot ? (
                  <></>
                ) : (
                  <View style={style.chatInputContainer}>
                    <ChatInputComponent />
                  </View>
                )}
              </>
            ) : (
              <></>
            )}
            {chatType === ChatType.MemberList ? (
              <ChatParticipants selectUser={selectUser} />
            ) : (
              <></>
            )}
            {chatType === ChatType.Private ? (
              <>
                <ChatContainer {...props} />
                {isRecordingBot ? (
                  <></>
                ) : (
                  <View>
                    <View style={style.chatInputContainer}>
                      <ChatInputComponent />
                    </View>
                  </View>
                )}
              </>
            ) : (
              <></>
            )}
            <ChatAfterView />
          </>
        )}
      </View>
    </>
  );
};

const style = StyleSheet.create({
  buttonHolder: {
    backgroundColor:
      $config.HARD_CODED_BLACK_COLOR + hexadecimalTransparency['30%'],
    borderRadius: 12,
    flexDirection: 'row',
  },
  chatViewNative: {
    zIndex: 5,
    width: '100%',
    height: '100%',
    right: 0,
    bottom: 0,
  },
  chatInputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeContainer: {
    margin: 2,
    backgroundColor: $config.PRIMARY_ACTION_BRAND_COLOR,
    borderRadius: 11,
    alignSelf: 'center',
  },
  nonActiveContainer: {
    alignSelf: 'center',
  },
  activeText: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '600',
    fontSize: 12,
    color: $config.PRIMARY_ACTION_TEXT_COLOR,
  },
  nonActiveText: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '600',
    fontSize: 12,
    color: $config.FONT_COLOR,
  },
  chatNotification: {
    width: 8,
    height: 8,
    backgroundColor: $config.SEMANTIC_ERROR,
    borderRadius: 30,
    position: 'absolute',
    right: 8,
    top: 4,
  },
  defaultMessageContainer: {
    backgroundColor: $config.CARD_LAYER_2_COLOR,
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
    marginHorizontal: 12,
    marginBottom: 0,
    flexDirection: 'row',
  },
  defaultMessageText: {
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '400',
    fontSize: 12,
    color: $config.FONT_COLOR,
  },
});

export default Chat;
