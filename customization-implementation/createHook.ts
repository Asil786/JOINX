 
import React, {useContext} from 'react';
/**
 *
 * @param context - any context data which we want to extract the data.
 * @returns useContextWithSelector in which we can pass selector function to extract data from the context that we passed.
 */
function createHook<T>(context: React.Context<T>) {
  function useContextWithSelector<U>(contextSelector: (data: T) => U): U;
  function useContextWithSelector(): T;
  /**
   *
   * @param contextSelector is used to pass callback function used to select data from the context data
   * @returns the data selected from the context
   */
  function useContextWithSelector<U>(contextSelector?: (data: T) => U): U | T {
    const data = useContext(context);
    return contextSelector ? contextSelector(data) : data;
  }
  return useContextWithSelector;
}

export function createConcealedHook<T, V>(
  context: React.Context<T>,
  preselect: (data: T) => V,
) {
  function useContextWithSelector<U>(contextSelector: (data: V) => U): U;
  function useContextWithSelector(): V;
  /**
   *
   * @param contextSelector is used to pass callback function used to select data from the context data
   * @returns the data selected from the context
   */
  function useContextWithSelector<U>(contextSelector?: (data: V) => U): U | V {
    const data = useContext(context);
    return contextSelector ? contextSelector(preselect(data)) : preselect(data);
  }
  return useContextWithSelector;
}

export default createHook;
