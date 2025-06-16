 
import {useLiveStreamDataContext} from '../components/contexts/LiveStreamDataContext';
/**
 * This hook will fetch the user list
 * @returns userList
 */

function useLiveStreamingUids() {
  const {audienceUids, hostUids} = useLiveStreamDataContext();
  return {
    hostUids: hostUids,
    audienceUids: audienceUids,
  };
}

export default useLiveStreamingUids;
