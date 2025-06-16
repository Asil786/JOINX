 
import {useContext} from 'react';
import LiveStreamContext from '../components/livestream';
/**
 * This hook will fetch the user list
 * @returns userList
 */

function useGetLiveStreamingRequests() {
  const {currLiveStreamRequest} = useContext(LiveStreamContext);
  return currLiveStreamRequest;
}

export default useGetLiveStreamingRequests;
