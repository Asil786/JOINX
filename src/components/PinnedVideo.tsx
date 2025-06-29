 
import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import {layoutProps} from '../../theme.json';
import {useContent, useLocalUserInfo} from 'customization-api';
import RenderComponent from '../pages/video-call/RenderComponent';
import IconButton from '../atoms/IconButton';
import hexadecimalTransparency from '../utils/hexadecimalTransparency';
import {BREAKPOINTS, isMobileUA, isWebInternal} from '../utils/common';
import {DispatchContext} from '../../agora-rn-uikit';
import {useVideoCall} from '../components/useVideoCall';
import useActiveSpeaker from '../utils/useActiveSpeaker';
import ImageIcon from '../atoms/ImageIcon';
import ThemeConfig from '../theme';
import {useWhiteboard} from '../components/whiteboard/WhiteboardConfigure';
import {useString} from '../utils/useString';
import {
  moreBtnRemoveFromLarge,
  videoRoomGoToActiveSpeakerText,
} from '../language/default-labels/videoCallScreenLabels';
import {useFullScreen} from '..//utils/useFullScreen';
const {topPinned} = layoutProps;

const PinnedVideo = ({renderData}) => {
  const {screenUid} = useLocalUserInfo();
  const {requestFullscreen} = useFullScreen();
  const removeFromLargeText = useString(moreBtnRemoveFromLarge)();
  const goToASText = useString(videoRoomGoToActiveSpeakerText)();
  const [isOnTop, setIsOnTop] = useState(true);
  const {pinnedUid, secondaryPinnedUid} = useContent();
  const [collapse, setCollapse] = useState(false);
  const {width} = useWindowDimensions();
  const isDesktop = width > BREAKPOINTS.lg;
  const isSidePinnedlayout = topPinned === true ? false : isDesktop; // if either explicity set to false or auto evaluation
  const [maxUid, ...minUids] = renderData;
  const activeSpeaker = useActiveSpeaker();
  const {dispatch} = useContext(DispatchContext);
  const {videoTileInViewPortState} = useVideoCall();
  const {getWhiteboardUid = () => 0} = useWhiteboard();
  const {defaultContent, customContent} = useContent();
  useEffect(() => {
    if (activeSpeaker && !videoTileInViewPortState[activeSpeaker] && isOnTop) {
      dispatch({
        type: 'ActiveSpeaker',
        value: [activeSpeaker],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSpeaker, videoTileInViewPortState, isOnTop]);

  const scrollRef = useRef() as any;

  const scrollToTop = () => {
    scrollRef?.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };
  const handleScroll = (event: any) => {
    if (
      (isSidePinnedlayout && event.nativeEvent.contentOffset.y >= 5) ||
      (!isSidePinnedlayout && event.nativeEvent.contentOffset.x >= 5)
    ) {
      isOnTop && setIsOnTop(false);
    } else {
      !isOnTop && setIsOnTop(true);
    }
  };

  const isWhiteboard = customContent && customContent[pinnedUid || maxUid];
  const isRemoteScreenshare =
    (pinnedUid || maxUid) != screenUid &&
    defaultContent &&
    defaultContent[pinnedUid || maxUid]?.video &&
    defaultContent[pinnedUid || maxUid]?.type === 'screenshare';

  //fixed issue on expand/collapse for screenshare
  //screen will have the fullscreen functionality
  useEffect(() => {
    const maximizedUid = pinnedUid || maxUid;
    if (getWhiteboardUid() != maximizedUid && collapse) {
      setCollapse(false);
    }
  }, [isWhiteboard, collapse, pinnedUid, maxUid, getWhiteboardUid]);

  return (
    <View
      style={{
        flexDirection: isSidePinnedlayout ? 'row' : 'column',
        flex: 1,
      }}>
      {!collapse && (
        <>
          <ScrollView
            onScroll={handleScroll}
            ref={scrollRef}
            horizontal={!isSidePinnedlayout}
            showsHorizontalScrollIndicator={isMobileUA() ? false : true}
            decelerationRate={0}
            style={
              isSidePinnedlayout
                ? {
                    width: '20%',
                    paddingRight: 8,
                    // borderWidth: 2,
                    // borderColor: 'transparent',
                  }
                : {
                    flex: 1,
                    minHeight: 160,
                    marginBottom: 8,
                  }
            }>
            {secondaryPinnedUid &&
            secondaryPinnedUid !== pinnedUid &&
            secondaryPinnedUid !== maxUid ? (
              <Pressable
                disabled={true}
                style={
                  isSidePinnedlayout
                    ? {
                        width: '100%',
                        height: width * 0.1125 + 2, // width * 20/100 * 9/16 + 2
                        zIndex: 40,
                        paddingBottom: 8,
                      }
                    : {
                        // width: ((height / 3) * 16) / 9 / 2 + 12, //dim[1] /4.3
                        width: 254,
                        height: '100%',
                        zIndex: 40,
                        marginRight: 8,
                      }
                }
                key={'minVideo' + secondaryPinnedUid}
                onPress={() => {}}>
                <RenderComponent uid={secondaryPinnedUid} />
              </Pressable>
            ) : (
              <></>
            )}
            {/* Pinned Video Top View(Desktop minimized and Mobile native and Mobile web) / Side View(Desktop maximized)*/}
            {minUids?.map((minUid, i) => {
              if (minUid === secondaryPinnedUid) return null;
              if (minUid === pinnedUid) return null;
              if (minUid === maxUid) return null;
              //rendering minimized view
              return (
                <Pressable
                  //old
                  //if user pinned somebody then side panel items should not be clickable - swap video should be called
                  //instead we will show replace pin button on hovering the video tile
                  //old
                  disabled={
                    //old fix
                    //activeSpeaker || pinnedUid || screenShareOn ? true : false
                    //old fix

                    //latest fix : pinned video sidepanel layout should not be clickable
                    //if user hover on it we will show pin for me/replace pin(if someone already pinned) button
                    true
                  }
                  style={
                    isSidePinnedlayout
                      ? {
                          width: '100%',
                          height: width * 0.1125 + 2, // width * 20/100 * 9/16 + 2
                          zIndex: 40,
                          paddingBottom: 8,
                        }
                      : {
                          // width: ((height / 3) * 16) / 9 / 2 + 12, //dim[1] /4.3
                          width: 254,
                          height: '100%',
                          zIndex: 40,
                          marginRight: 8,
                        }
                  }
                  key={'minVideo' + i}
                  onPress={() => {}}>
                  <RenderComponent uid={minUid} />
                </Pressable>
              );
            })}
          </ScrollView>
          {$config.ACTIVE_SPEAKER && !isOnTop && isWebInternal() && (
            <View
              style={
                isSidePinnedlayout
                  ? {
                      width: '20%',
                      position: 'absolute',
                      bottom: 0,
                      zIndex: 999,
                    }
                  : {
                      position: 'absolute',
                      right: 5,
                      top: 5,
                    }
              }>
              <TouchableOpacity
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  flexDirection: 'row',
                  borderRadius: 27,
                  backgroundColor: $config.CARD_LAYER_5_COLOR,
                  maxWidth: 180,
                  alignSelf: 'center',
                }}
                onPress={scrollToTop}>
                <ImageIcon
                  iconType="plain"
                  name={'view-last'}
                  iconSize={20}
                  tintColor={$config.FONT_COLOR}
                  iconContainerStyle={
                    isSidePinnedlayout
                      ? {
                          transform: [{rotate: '180deg'}],
                        }
                      : {
                          transform: [{rotate: '90deg'}],
                        }
                  }
                />
                <Text
                  style={{
                    marginLeft: 4,
                    color: $config.FONT_COLOR,
                    textAlign: 'center',
                    fontSize: 14,
                    fontFamily: ThemeConfig.FontFamily.sansPro,
                    alignSelf: 'center',
                  }}>
                  {goToASText}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
      {(pinnedUid || maxUid) && (
        <View
          style={
            isSidePinnedlayout
              ? collapse
                ? style.width100
                : style.width80
              : style.flex8
          }>
          <View style={style.flex1} key={'maxVideo' + (pinnedUid || maxUid)}>
            {isSidePinnedlayout && (isWhiteboard || isRemoteScreenshare) ? (
              <IconButton
                containerStyle={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  zIndex: 999,
                  elevation: 999,
                }}
                onPress={() => {
                  if (
                    defaultContent &&
                    defaultContent[pinnedUid || maxUid]?.video
                  ) {
                    requestFullscreen(pinnedUid || maxUid);
                  } else if (customContent[pinnedUid || maxUid]) {
                    setCollapse(!collapse);
                  }
                }}
                iconProps={{
                  iconContainerStyle: {
                    padding: 8,
                    backgroundColor:
                      $config.CARD_LAYER_5_COLOR +
                      hexadecimalTransparency['10%'],
                  },
                  name: isRemoteScreenshare
                    ? 'fullscreen'
                    : isWhiteboard && collapse
                    ? 'collapse'
                    : 'expand',
                  tintColor: $config.SECONDARY_ACTION_COLOR,
                  iconSize: 24,
                }}
              />
            ) : (
              <></>
            )}
            {/* {pinnedUid && pinnedUid !== getWhiteboardUid() ? (
              <IconButton
                containerStyle={{
                  paddingHorizontal: 8,
                  paddingVertical: 10,
                  backgroundColor: $config.VIDEO_AUDIO_TILE_OVERLAY_COLOR,
                  borderRadius: 8,
                  flexDirection: 'row',
                  position: 'absolute',
                  top: 12,
                  left: 12 + (isSidePinnedlayout ? 32 + 12 + 8 : 0),
                  zIndex: 999,
                  elevation: 999,
                }}
                iconProps={{
                  iconType: 'plain',
                  iconContainerStyle: {
                    padding: 0,
                  },
                  name: 'unpin-filled',
                  iconSize: 20,
                  tintColor: $config.VIDEO_AUDIO_TILE_TEXT_COLOR,
                }}
                onPress={() => {
                  dispatch({type: 'UserPin', value: [0]});
                }}
                btnTextProps={{
                  text: removeFromLargeText,
                  textColor: $config.VIDEO_AUDIO_TILE_TEXT_COLOR,
                  textStyle: {
                    marginTop: 0,
                    marginLeft: 6,
                    marginRight: 2,
                    fontWeight: '700',
                  },
                }}
              />
            ) : (
              <></>
            )} */}
            {/** Render the maximized view */}
            <RenderComponent uid={pinnedUid || maxUid} isMax={true} />
          </View>
        </View>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  width80: {width: '80%'},
  width100: {width: '100%'},
  flex2: {flex: 2},
  flex8: {flex: 8},
  flex1: {flex: 1},
});

export default PinnedVideo;
