 
import {useEffect, useState} from 'react';
import LocalEventEmitter, {
  LocalEventsEnum,
} from '../rtm-events-api/LocalEvents';

/**
 * Returns active speaker uid or undefined if nobody speaking
 * @returns function
 */
function useActiveSpeaker() {
  const [activeSpeaker, setActiveSpeaker] = useState(undefined);
  useEffect(() => {
    const listenActiveSpeaker = data => {
      setActiveSpeaker(data);
    };
    LocalEventEmitter.on(LocalEventsEnum.ACTIVE_SPEAKER, listenActiveSpeaker);
    return () => {
      LocalEventEmitter.off(
        LocalEventsEnum.ACTIVE_SPEAKER,
        listenActiveSpeaker,
      );
    };
  }, []);
  return activeSpeaker;
}

export default useActiveSpeaker;
