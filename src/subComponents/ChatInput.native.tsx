 
import React, {useContext, useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
  TextInput,
  ViewStyle,
} from 'react-native';
import {useString} from '../utils/useString';
import {ChatEmojiPicker, ChatEmojiButton} from './chat/ChatEmoji.native';

import {
  ChatType,
  UploadStatus,
  useChatUIControls,
  MIN_HEIGHT,
  MAX_HEIGHT,
  LINE_HEIGHT,
  MAX_TEXT_MESSAGE_SIZE,
} from '../components/chat-ui/useChatUIControls';
import {useContent, useRoomInfo, useUserName} from 'customization-api';
import ImageIcon from '../atoms/ImageIcon';
import ThemeConfig from '../theme';
import {BottomSheetTextInput} from '@gorhom/bottom-sheet';
import {
  groupChatMeetingInputPlaceHolderText,
  groupChatLiveInputPlaceHolderText,
  privateChatInputPlaceHolderText,
  chatSendErrorTextSizeToastHeading,
  chatSendErrorTextSizeToastSubHeading,
} from '../language/default-labels/videoCallScreenLabels';
import ChatSendButton from './chat/ChatSendButton';
import {ChatAttachmentButton} from './chat/ChatAttachment';
import {useChatConfigure} from '../components/chat/chatConfigure';
import {
  ChatMessageType,
  SDKChatType,
  useChatMessages,
} from '../components/chat-messages/useChatMessages';
import hexadecimalTransparency from '../utils/hexadecimalTransparency';
import ChatUploadStatus from './chat/ChatUploadStatus';
import {isAndroid} from '../utils/common';
import Toast from '../../react-native-toast-message';
import {ReplyMessageBubble} from './ChatBubble';
import {
  ChatError,
  ChatMessage,
  ChatMessageChatType,
} from 'react-native-agora-chat';

interface ExtendedChatMessage extends ChatMessage {
  body: {
    localPath?: string;
    remotePath?: string;
    type: ChatMessageType;
  };
  attributes: {
    file_ext?: string;
    file_name?: string;
    replyToMsgId?: string;
  };
}

export interface ChatSendButtonProps {
  render?: (onPress: () => void) => JSX.Element;
}

const ChatPanel = () => {
  return (
    <View style={style.chatPanelContainer}>
      <View style={style.chatPanel}>
        <ChatAttachmentButton />
        <ChatEmojiButton />
      </View>
      <ChatSendButton />
    </View>
  );
};

export interface ChatTextInputProps {
  render?: (
    message: string,
    onChangeText: (text: string) => void,
    onSubmitEditing: () => void,
    chatMessageInputPlaceholder: string,
  ) => JSX.Element;
  style?: ViewStyle;
}
export const ChatTextInput = (props: ChatTextInputProps) => {
  const {
    privateChatUser,
    message,
    setMessage,
    chatType,
    inputActive,
    uploadStatus,
    inputHeight,
    setInputHeight,
    replyToMsgId,
  } = useChatUIControls();

  const {defaultContent} = useContent();
  const {sendChatSDKMessage} = useChatConfigure();
  const {data} = useRoomInfo();
  const [name] = useUserName();
  const groupChatInputPlaceHolder = $config.EVENT_MODE
    ? useString(groupChatLiveInputPlaceHolderText)
    : useString(groupChatMeetingInputPlaceHolderText);
  const privateChatInputPlaceHolder = useString(
    privateChatInputPlaceHolderText,
  );

  const {addMessageToPrivateStore, addMessageToStore} = useChatMessages();

  // React.useEffect(() => {
  //   if (message.length === 0) {
  //     setInputHeight(MIN_HEIGHT);
  //   }
  // }, [message]);

  const isUploadStatusShown =
    uploadStatus === UploadStatus.IN_PROGRESS ||
    uploadStatus === UploadStatus.FAILURE;

  const toastHeadingSize = useString(chatSendErrorTextSizeToastHeading)();
  const errorSubHeadingSize = useString(chatSendErrorTextSizeToastSubHeading);

  const handleContentSizeChange = ({
    nativeEvent: {
      contentSize: {width, height},
    },
  }) => {
    const lines = Math.floor(height / LINE_HEIGHT);
    const newHeight = lines < 5 ? LINE_HEIGHT * lines + 24 + 2 : MAX_HEIGHT; // Assuming lineHeight is LINE_HEIGHT
    message.length && setInputHeight(newHeight);
  };

  const chatMessageInputPlaceholder =
    chatType === ChatType.Private
      ? privateChatInputPlaceHolder(defaultContent[privateChatUser]?.name)
      : groupChatInputPlaceHolder(name);
  const onChangeText = (text: string) => setMessage(text);
  const onSubmitEditing = () => {
    if (message.length === 0) return;

    if (message.length >= MAX_TEXT_MESSAGE_SIZE * 1024) {
      Toast.show({
        leadingIconName: 'alert',
        type: 'error',
        text1: toastHeadingSize,
        text2: errorSubHeadingSize(MAX_TEXT_MESSAGE_SIZE.toString()),
        visibilityTime: 3000,
        primaryBtn: null,
        secondaryBtn: null,
      });
      return;
    }

    const groupID = data.chat.group_id;
    const option = {
      chatType: privateChatUser
        ? SDKChatType.SINGLE_CHAT
        : SDKChatType.GROUP_CHAT,
      type: ChatMessageType.TXT,
      from: data.uid.toString(),
      to: privateChatUser ? privateChatUser.toString() : groupID,
      msg: message,
      ext: {
        replyToMsgId,
      },
    };
    const onProgress = (localMsgId: string, progress: number) => {
      console.warn('chat msg in progress', progress);
    };
    const onError = (localMsgId: string, error: ChatError) => {
      console.warn('chat msg in error', error);
    };
    const onSuccess = (message: ExtendedChatMessage) => {
      console.warn('chat msg in success', message);
      // Text message added here , attachments are added in ChatAttachment.native
      const messageData = {
        msg: option.msg.replace(/^(\n)+|(\n)+$/g, ''),
        createdTimestamp: message.localTime,
        msgId: message.msgId,
        isDeleted: false,
        type: message.body.type,
        replyToMsgId: message.attributes?.replyToMsgId,
      };
      console.warn('message data', messageData);
      // this is local user messages
      if (message.chatType === ChatMessageChatType.PeerChat) {
        addMessageToPrivateStore(Number(message.to), messageData, true);
      } else {
        addMessageToStore(Number(message.from), messageData);
      }
    };
    sendChatSDKMessage(option, {onProgress, onError, onSuccess});
    setInputHeight(MIN_HEIGHT);
    setMessage('');
  };
  const {setInputActive} = useChatUIControls();

  const TextInputComponent = isAndroid() ? TextInput : BottomSheetTextInput;

  return props?.render ? (
    props.render(
      message,
      onChangeText,
      onSubmitEditing,
      chatMessageInputPlaceholder,
    )
  ) : (
    <TextInputComponent
      onFocus={() => setInputActive(true)}
      onBlur={() => setInputActive(false)}
      value={message}
      onChangeText={onChangeText}
      multiline={true}
      textAlignVertical="top"
      style={{
        color: $config.FONT_COLOR,
        textAlign: 'left',
        width: '100%',
        alignSelf: 'center',
        fontFamily: ThemeConfig.FontFamily.sansPro,
        fontWeight: '400',
        height: inputHeight,
        paddingRight: 0,
        paddingLeft: 12,
        paddingTop: 12,
        paddingBottom: 12,
        fontSize: ThemeConfig.FontSize.small,
        lineHeight: LINE_HEIGHT,
        borderWidth: 1,
        borderColor: $config.CARD_LAYER_5_COLOR + hexadecimalTransparency['8%'],
        backgroundColor: $config.CARD_LAYER_2_COLOR,
        borderRadius: 8,
        borderTopRightRadius: isUploadStatusShown ? 0 : 8,
        borderTopLeftRadius: isUploadStatusShown ? 0 : 8,
        maxHeight: MAX_HEIGHT,
        overflow: 'scroll',
        ...props.style,
      }}
      blurOnSubmit={false}
      onSubmitEditing={onSubmitEditing}
      placeholder={chatMessageInputPlaceholder}
      placeholderTextColor={
        $config.FONT_COLOR + ThemeConfig.EmphasisPlus.disabled
      }
      autoCorrect={false}
      onContentSizeChange={handleContentSizeChange}
    />
  );
};

/**
 * Input component for the Chat interface
 */
const ChatInput = () => {
  const {
    inputActive,
    showEmojiPicker,
    replyToMsgId,
    setShowEmojiPicker,
    setMessage,
  } = useChatUIControls();
  return (
    <View style={[style.inputContainer]}>
      {showEmojiPicker && (
        <ChatEmojiPicker
          isEmojiPickerOpen={true}
          setIsEmojiPickerOpen={setShowEmojiPicker}
          onEmojiSelect={emoji => setMessage(prev => prev + ' ' + emoji)}
        />
      )}

      <View style={style.inputView}>
        <ChatUploadStatus />
        <View style={replyToMsgId ? [style.inputWrapper, {}] : {}}>
          {replyToMsgId && (
            <ReplyMessageBubble
              repliedMsgId={replyToMsgId}
              replyTxt={''}
              showCoseIcon={true}
              showPreview={false}
            />
          )}
          <ChatTextInput style={replyToMsgId ? {borderWidth: 0} : {}} />
        </View>
        <ChatPanel />
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  inputActiveView: {
    borderTopWidth: 1,
    borderTopColor: $config.PRIMARY_ACTION_BRAND_COLOR,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  inputView: {
    flexDirection: 'column',
    borderTopWidth: 1,
    borderTopColor: 'transparent',
    paddingHorizontal: 12,
    paddingBottom: 8,
  },

  chatPanelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    backgroundColor: $config.CARD_LAYER_1_COLOR,
    height: 36,
    paddingTop: 4,
  },
  chatPanel: {
    flexDirection: 'row',
  },
  inputWrapper: {
    paddingHorizontal: 12,
    paddingTop: 12,
    backgroundColor: $config.CARD_LAYER_2_COLOR,
    borderWidth: 1,
    borderColor: $config.CARD_LAYER_5_COLOR + hexadecimalTransparency['40%'],
    borderRadius: 8,
    borderTopWidth: 1,
  },
});
export default ChatInput;
