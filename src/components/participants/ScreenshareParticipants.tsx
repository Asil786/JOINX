 
import React, {useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import ThemeConfig from '../../theme';
import UserAvatar from '../../atoms/UserAvatar';
import hexadecimalTransparency from '../../utils/hexadecimalTransparency';
import {ContentInterface} from 'customization-api';
import {isWebInternal, isMobileUA} from '../../utils/common';
import IconButton from '../../atoms/IconButton';
import UserActionMenuOptionsOptions from './UserActionMenuOptions';

const ScreenshareParticipants = (props: {user: ContentInterface}) => {
  const screenshareRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const [actionMenuVisible, setActionMenuVisible] = useState(false);

  const showModal = () => {
    setActionMenuVisible(state => !state);
  };
  return (
    <>
      {/* {renderActionMenu()} */}
      <UserActionMenuOptionsOptions
        actionMenuVisible={actionMenuVisible}
        setActionMenuVisible={setActionMenuVisible}
        user={props.user}
        btnRef={screenshareRef}
        from={'screenshare-participant'}
      />
      <PlatformWrapper showModal={showModal} setIsHovered={setIsHovered}>
        <View style={styles.container}>
          <View style={styles.bgContainerStyle}>
            <UserAvatar
              name={props.user.name}
              containerStyle={styles.containerStyle}
              textStyle={styles.textStyle}
            />
          </View>
          <View style={{flex: 1, marginHorizontal: 8, alignSelf: 'center'}}>
            <Text style={styles.participantNameText} numberOfLines={1}>
              {props.user.name}
            </Text>
          </View>
          {true ? (
            <View
              style={styles.iconContainer}
              ref={screenshareRef}
              collapsable={false}>
              {isHovered || actionMenuVisible || isMobileUA() ? (
                //todo mobile by default it should show
                <View
                  style={{
                    width: 24,
                    height: 24,
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
                <View style={{width: 24, height: 24, opacity: 0}} />
              )}
            </View>
          ) : (
            <View style={{width: 24, height: 24, opacity: 0}} />
          )}
        </View>
      </PlatformWrapper>
    </>
  );
};
export default ScreenshareParticipants;

const PlatformWrapper = ({children, showModal, setIsHovered}) => {
  return isWebInternal() ? (
    <div
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
    fontSize: 12,
    fontFamily: ThemeConfig.FontFamily.sansPro,
    flexDirection: 'row',
    color: $config.FONT_COLOR,
    textAlign: 'left',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  userInfoContainer: {
    flexDirection: 'row',
  },
  iconContainer: {
    flexDirection: 'row',
  },
});
