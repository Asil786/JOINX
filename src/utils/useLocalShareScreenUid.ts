 
import {useContext} from 'react';
import {PropsContext} from '../../agora-rn-uikit';

const useLocalScreenShareUid = () => {
  const {rtcProps} = useContext(PropsContext);
  return rtcProps?.screenShareUid || 0;
};
export default useLocalScreenShareUid;
