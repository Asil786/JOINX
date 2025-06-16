 
import {useLiveStreamDataContext} from '../components/contexts/LiveStreamDataContext';
import {UidType} from '../../agora-rn-uikit';
import {useVideoMeetingData} from '../components/contexts/VideoMeetingDataContext';

/**
 * Returns a function that checks whether the given uid is an attendee and returns true/false
 * @returns function
 */
function useIsAttendee() {
  const {audienceUids: lsAudienceUids} = useLiveStreamDataContext();
  const {attendeeUids: vmAudienceUids} = useVideoMeetingData();
  const isAttendee = (uid: UidType) => {
    const attUidsData = $config.EVENT_MODE ? lsAudienceUids : vmAudienceUids;
    return attUidsData.filter((attId) => attId === uid).length ? true : false;
  };
  return isAttendee;
}

export default useIsAttendee;
