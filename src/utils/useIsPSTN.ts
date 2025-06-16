 
import {useContent} from 'customization-api';
import {UidType} from '../../agora-rn-uikit';

/**
 * Returns a function that checks whether the given uid is a PSTN user and returns true/false
 * @returns function
 */
function useIsPSTN() {
  const {defaultContent} = useContent();
  /**
   *
   * @param uid number
   * @returns boolean
   */
  const isPSTN = (uid: UidType) =>
    !defaultContent[uid] && String(uid)[0] === '1' ? true : false;
  return isPSTN;
}

export default useIsPSTN;
