 
import {UidType} from '../../agora-rn-uikit';
import {useLiveStreamDataContext} from '../components/contexts/LiveStreamDataContext';
import {useVideoMeetingData} from '../components/contexts/VideoMeetingDataContext';

/**
 * Returns a function that checks whether the given uid is a host and returns true/false
 * @returns function
 */
function useIsHost() {
  const {hostUids: liveStreamHostUids} = useLiveStreamDataContext();
  const {hostUids: videoMeetingHostUids} = useVideoMeetingData();
  const isHost = (uid: UidType) => {
    const hostUidsData = $config.EVENT_MODE
      ? liveStreamHostUids
      : videoMeetingHostUids;
    return hostUidsData.filter((hostId) => hostId === uid).length
      ? true
      : false;
  };
  return isHost;
}

export default useIsHost;
