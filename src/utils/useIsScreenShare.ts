 
import {UidType} from '../../agora-rn-uikit';
import {useScreenContext} from '../components/contexts/ScreenShareContext';

/**
 * This hook will return the function which take UID and return true if screensharing active on the UID
 * @returns function
 */
function useIsScreenShare() {
  const {screenShareData} = useScreenContext();
  /**
   *
   * @param uid number | string
   * @returns boolean
   */
  const isScreenShare = (uid: UidType): boolean =>
    screenShareData[uid]?.isActive ? true : false;
  return isScreenShare;
}

export default useIsScreenShare;
