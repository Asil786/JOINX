 
import React from 'react';
import platform from '../../subComponents/Platform';
import {SHARE_LINK_CONTENT_TYPE, useShareLink} from '../useShareLink';
import isSDKCheck from '../../utils/isSDK';
import {useRoomInfo} from '../room-info/useRoomInfo';
import {FontSizes} from '../../theme';
import MeetingLink from '../../atoms/MeetingLink';
import {useString} from '../../utils/useString';
import {
  shareRoomAttendeeLinkLabel,
  shareRoomAttendeeLinkSubText,
  shareRoomHostLinkLabel,
  shareRoomHostLinkSubText,
  shareRoomPSTNLabel,
  shareRoomPSTNNumberLabel,
  shareRoomPSTNPinLabel,
  shareRoomPSTNSubText,
} from '../../language/default-labels/shareLinkScreenLabels';

export interface MeetingInfoBodyProps {
  showHelperText?: boolean;
  size?: keyof FontSizes;
  variant?: 'primary' | 'secondary';
}
export const MeetingInfoLinks = (props?: MeetingInfoBodyProps) => {
  const {showHelperText = false, variant = 'primary', size = 'medium'} = props;
  const {
    data: {isHost, pstn, isSeparateHostLink},
  } = useRoomInfo();
  const {getShareLink} = useShareLink();

  const isSDK = isSDKCheck();
  const isWebCheck =
    $config.FRONTEND_ENDPOINT || (platform === 'web' && !isSDK);

  const shareRoomHostLink = useString<any>(shareRoomHostLinkLabel)(isWebCheck);
  const shareRoomHostLinkSubTextLocal = useString<any>(
    shareRoomHostLinkSubText,
  )();
  const shareRoomAttendeeLink = useString<any>(shareRoomAttendeeLinkLabel)(
    isWebCheck,
  );
  const shareRoomAttendeeLinkSubTextLocal = useString<any>(
    shareRoomAttendeeLinkSubText,
  )();
  const shareRoomPSTN = useString<any>(shareRoomPSTNLabel)();
  const shareRoomPSTNNumber = useString<any>(shareRoomPSTNNumberLabel)();
  const shareRoomPSTNPin = useString<any>(shareRoomPSTNPinLabel)();
  const shareRoomPSTNSubTextLocal = useString<any>(shareRoomPSTNSubText)();

  const getAttendeeLabel = () => shareRoomAttendeeLink;

  const getHostLabel = () => shareRoomHostLink;

  return (
    <>
      {isHost ? (
        <>
          <MeetingLink
            styleProps={{
              size,
              variant,
            }}
            label={getHostLabel()}
            link={getShareLink(SHARE_LINK_CONTENT_TYPE.HOST)}
            linkToCopy={SHARE_LINK_CONTENT_TYPE.HOST}
            helperText={showHelperText ? shareRoomHostLinkSubTextLocal : ''}
            gutterBottom
          />
        </>
      ) : (
        <></>
      )}
      {isSeparateHostLink ? (
        <>
          <MeetingLink
            styleProps={{
              size,
              variant,
            }}
            label={getAttendeeLabel()}
            link={getShareLink(SHARE_LINK_CONTENT_TYPE.ATTENDEE)}
            linkToCopy={SHARE_LINK_CONTENT_TYPE.ATTENDEE}
            helperText={showHelperText ? shareRoomAttendeeLinkSubTextLocal : ''}
            gutterBottom
          />
        </>
      ) : (
        <></>
      )}
      {$config.PSTN && pstn && pstn?.number && pstn?.pin ? (
        <>
          <MeetingLink
            styleProps={{
              size,
              variant,
            }}
            label={shareRoomPSTN}
            link={`${shareRoomPSTNNumber} - ${pstn?.number}  |  ${shareRoomPSTNPin} - ${pstn?.pin}`}
            linkToCopy={SHARE_LINK_CONTENT_TYPE.PSTN}
            helperText={showHelperText ? shareRoomPSTNSubTextLocal : ''}
            gutterBottom
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
};
export default MeetingInfoLinks;
