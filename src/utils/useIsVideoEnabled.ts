 
import {useContent} from 'customization-api';
import {UidType, ToggleState} from '../../agora-rn-uikit';

/**
 * Returns a function that checks the video state for a given uid and returns true/false
 * @returns function
 */
function useIsVideoEnabled() {
  const {defaultContent} = useContent();

  /**
   *
   * @param uid UidType
   * @returns boolean
   */
  const isVideoEnabled = (uid: UidType): boolean =>
    defaultContent[uid]?.video === ToggleState.enabled;

  return isVideoEnabled;
}
export default useIsVideoEnabled;
