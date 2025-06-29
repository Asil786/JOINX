 
import React, {useContext, useRef, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import RemoteAudioMute from '../../subComponents/RemoteAudioMute';
import RemoteVideoMute from '../../subComponents/RemoteVideoMute';
import {ContentInterface, UidType} from '../../../agora-rn-uikit';
import UserAvatar from '../../atoms/UserAvatar';
import {isMobileUA, isWebInternal} from '../../utils/common';
import ActionMenu, {ActionMenuItem} from '../../atoms/ActionMenu';
import Spacer from '../../atoms/Spacer';
import useRemoteEndCall from '../../utils/useRemoteEndCall';
import LocalVideoMute from '../../subComponents/LocalVideoMute';
import LocalAudioMute from '../../subComponents/LocalAudioMute';
import RemoveMeetingPopup from '../../subComponents/RemoveMeetingPopup';
import {useRoomInfo} from '../room-info/useRoomInfo';
import {
  RaiseHandValue,
  LiveStreamContext,
  LiveStreamControlMessageEnum,
} from '../livestream';
import events, {PersistanceLevel} from '../../rtm-events-api';
import IconButton from '../../atoms/IconButton';
import ThemeConfig from '../../theme';
import hexadecimalTransparency from '../../utils/hexadecimalTransparency';
import useRemoteRequest, {
  REQUEST_REMOTE_TYPE,
} from '../../utils/useRemoteRequest';
import useRemoteMute, {MUTE_REMOTE_TYPE} from '../../utils/useRemoteMute';
import {useLiveStreamDataContext} from '../contexts/LiveStreamDataContext';
import {
  SidePanelType,
  useLayout,
  useContent,
  useSidePanel,
  useSpotlight,
} from 'customization-api';
import {getPinnedLayoutName} from '../../pages/video-call/DefaultLayouts';
import UserActionMenuOptionsOptions from './UserActionMenuOptions';

import WaitingRoomButton from '../../subComponents/waiting-rooms/WaitingRoomControls';
import {useString} from '../../utils/useString';
import {
  peoplePanelMeText,
  peoplePanelPresenterText,
} from '../../language/default-labels/videoCallScreenLabels';
interface ParticipantInterface {
  isLocal: boolean;
  name: string;
  user: ContentInterface;
  showControls: boolean;
  isHostUser: boolean;
  isAudienceUser: boolean;
  isMobile?: boolean;
  waitingRoomUser?: boolean;
  handleClose: () => {};
  updateActionSheet: (screenName: 'chat' | 'participants' | 'settings') => {};
  uid?: UidType;
  screenUid?: UidType;
}

const Participant = (props: ParticipantInterface) => {
  const metext = useString(peoplePanelMeText)();
  const presentertext = useString(peoplePanelPresenterText)();
  const {coHostUids} = useContext(LiveStreamContext);
  const [isHovered, setIsHovered] = React.useState(false);
  const [actionMenuVisible, setActionMenuVisible] = React.useState(false);
  const usercontainerRef = useRef(null);
  const moreIconRef = useRef(null);
  const {
    user,
    name,
    showControls,
    isHostUser,
    isLocal,
    isAudienceUser,
    isMobile = false,
    handleClose,
    updateActionSheet,
    waitingRoomUser = false,
    uid,
    screenUid,
  } = props;
  const {
    data: {isHost},
  } = useRoomInfo();

  const showModal = () => {
    setActionMenuVisible(state => !state);
  };
  const {setSpotlightUid, spotlightUid} = useSpotlight();

  return (
    <>
      <UserActionMenuOptionsOptions
        actionMenuVisible={actionMenuVisible}
        setActionMenuVisible={setActionMenuVisible}
        user={props.user}
        btnRef={moreIconRef}
        from={'partcipant'}
        spotlightUid={spotlightUid}
        setSpotlightUid={setSpotlightUid}
      />
      <PlatformWrapper showModal={showModal} setIsHovered={setIsHovered}>
        <View style={styles.container} ref={usercontainerRef}>
          <View style={styles.bgContainerStyle}>
            <UserAvatar
              name={name}
              containerStyle={styles.containerStyle}
              textStyle={styles.textStyle}
            />
          </View>
          <View style={{flex: 1, marginHorizontal: 8, alignSelf: 'center'}}>
            <Text style={styles.participantNameText} numberOfLines={1}>
              {name}
            </Text>
            {isLocal && <Text style={styles.subText}>{metext}</Text>}
            {!isLocal &&
            $config.EVENT_MODE &&
            coHostUids.indexOf(user.uid) !== -1 ? (
              <Text style={styles.subText}>{presentertext}</Text>
            ) : (
              <></>
            )}
          </View>
          <View style={styles.iconContainer}>
            {(isHovered || actionMenuVisible || isMobileUA()) &&
            !waitingRoomUser ? (
              <View
                ref={moreIconRef}
                collapsable={false}
                style={{
                  width: 28,
                  height: 28,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 20,
                }}>
                <IconButton
                  hoverEffect={true}
                  hoverEffectStyle={{
                    backgroundColor:
                      $config.CARD_LAYER_5_COLOR +
                      hexadecimalTransparency['20%'],
                    borderRadius: 20,
                    padding: 5,
                  }}
                  iconProps={{
                    iconType: 'plain',
                    name: 'more-menu',
                    iconSize: 20,
                    tintColor: $config.SECONDARY_ACTION_COLOR,
                  }}
                  onPress={() => {
                    showModal();
                  }}
                />
              </View>
            ) : (
              <Spacer size={24} horizontal={true} />
            )}
            {waitingRoomUser ? (
              <>
                <WaitingRoomButton
                  uid={uid}
                  screenUid={screenUid}
                  isAccept={false}
                />
                <Spacer horizontal={true} size={8} />
                <WaitingRoomButton
                  uid={uid}
                  screenUid={screenUid}
                  isAccept={true}
                />
              </>
            ) : (
              <></>
            )}
            {showControls ? (
              <>
                {!$config.AUDIO_ROOM &&
                  (isLocal
                    ? !isAudienceUser && (
                        <View style={styles.mlIcon}>
                          <LocalVideoMute
                            plainIconHoverEffect={true}
                            iconProps={(isVideoEnabled, isPermissionDenied) => {
                              return {
                                iconSize: 20,
                                iconType: 'plain',
                                iconContainerStyle: styles.iconContainerStyle,
                                showWarningIcon: false,
                                tintColor: isVideoEnabled
                                  ? $config.PRIMARY_ACTION_BRAND_COLOR
                                  : isPermissionDenied
                                  ? $config.SEMANTIC_NEUTRAL
                                  : $config.SEMANTIC_ERROR,
                              };
                            }}
                          />
                        </View>
                      )
                    : !isAudienceUser && (
                        <View style={styles.mlIcon}>
                          <RemoteVideoMute
                            uid={user.uid}
                            video={user.video}
                            isHost={isHost}
                            userContainerRef={usercontainerRef}
                            iconContainerStyle={styles.iconContainerStyle}
                          />
                        </View>
                      ))}
                {isLocal
                  ? !isAudienceUser && (
                      <View style={styles.mlIcon}>
                        <LocalAudioMute
                          plainIconHoverEffect={true}
                          iconProps={(isAudioEnabled, isPermissionDenied) => {
                            return {
                              iconSize: 20,
                              iconType: 'plain',
                              iconContainerStyle: styles.iconContainerStyle,
                              showWarningIcon: false,
                              tintColor: isAudioEnabled
                                ? $config.PRIMARY_ACTION_BRAND_COLOR
                                : isPermissionDenied
                                ? $config.SEMANTIC_NEUTRAL
                                : $config.SEMANTIC_ERROR,
                            };
                          }}
                        />
                      </View>
                    )
                  : !isAudienceUser && (
                      <View style={styles.mlIcon}>
                        <RemoteAudioMute
                          uid={user.uid}
                          audio={user.audio}
                          isHost={isHost}
                          iconContainerStyle={styles.iconContainerStyle}
                          userContainerRef={usercontainerRef}
                        />
                      </View>
                    )}
              </>
            ) : (
              <></>
            )}
          </View>
        </View>
      </PlatformWrapper>
    </>
  );
};
export default Participant;

const PlatformWrapper = ({children, showModal, setIsHovered}) => {
  return isWebInternal() ? (
    <div
      style={{}}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}>
      {children}
    </div>
  ) : (
    <>{children}</>
  );
};

const styles = StyleSheet.create({
  bgContainerStyle: {
    backgroundColor: $config.VIDEO_AUDIO_TILE_AVATAR_COLOR,
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  containerStyle: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  textStyle: {
    fontSize: ThemeConfig.FontSize.small,
    lineHeight: 21,
    fontWeight: '600',
    color: $config.CARD_LAYER_1_COLOR,
  },
  participantNameText: {
    fontWeight: '400',
    fontSize: ThemeConfig.FontSize.tiny,
    fontFamily: ThemeConfig.FontFamily.sansPro,
    flexDirection: 'row',
    color: $config.FONT_COLOR,
    textAlign: 'left',
  },
  subText: {
    fontSize: ThemeConfig.FontSize.tiny,
    lineHeight: ThemeConfig.FontSize.tiny,
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '400',
    color: $config.FONT_COLOR + ThemeConfig.EmphasisPlus.disabled,
    marginTop: 4,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  userInfoContainer: {
    flexDirection: 'row',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  controlsContainer: {
    backgroundColor: 'red',
  },
  iconContainerStyle: {
    width: 30,
    height: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mlIcon: {
    marginLeft: 8,
  },
});
