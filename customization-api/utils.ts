 
// commented for v1 release
//export {default as useIsScreenShare} from '../src/utils/useIsScreenShare';

//hooks used to check user type
export {default as useIsHost} from '../src/utils/useIsHost';
export {default as useIsAttendee} from '../src/utils/useIsAttendee';
export {default as useIsPSTN} from '../src/utils/useIsPSTN';

//hook to manage audio/video states
export {default as useIsAudioEnabled} from '../src/utils/useIsAudioEnabled';
export {default as useIsVideoEnabled} from '../src/utils/useIsVideoEnabled';

//hook to get active speaker uid
export {default as useActiveSpeaker} from '../src/utils/useActiveSpeaker';

//hooks used for navigation
export {useHistory, useParams, Redirect} from '../src/components/Router';

//export common function
export {
  isWeb,
  isIOS,
  isAndroid,
  isDesktop,
  calculatePosition,
  isWebInternal,
  trimText,
  BREAKPOINTS,
} from '../src/utils/common';
export {default as isSDK} from '../src/utils/isSDK';
export {default as isMobileOrTablet} from '../src/utils/isMobileOrTablet';
export {useLocalUid} from '../agora-rn-uikit';
export {default as useLocalAudio} from '../src/utils/useLocalAudio';
export {default as useLocalVideo} from '../src/utils/useLocalVideo';
export {useString} from '../src/utils/useString';
export type {LanguageType} from '../src/subComponents/caption/utils';
export {default as useSpeechToText} from '../src/utils/useSpeechToText';
export {isMobileUA} from '../src/utils/common';
export {default as ThemeConfig} from '../src/theme';
export {default as hexadecimalTransparency} from '../src/utils/hexadecimalTransparency';
export {useFullScreen} from '../src/utils/useFullScreen';
export {useHideShareTitle} from '../src/utils/useHideShareTile';
export {useActionSheet} from '../src/utils/useActionSheet';
export {default as PlatformWrapper} from '../src/utils/PlatformWrapper';
export {useSpotlight} from '../src/utils/useSpotlight';
export {useActiveUids} from '../src/utils/useActiveUids';
export {default as useUserBan} from '../src/utils/useUserBan';
