 

import React, {useContext, useEffect, useState} from 'react';
import Toast from '../../../react-native-toast-message';
import Error from '../../subComponents/Error';
type ErrorType = {
  name: string;
  message: string;
  networkError?: {
    name?: string;
    result?: {
      error?: {
        code?: number;
        message?: string;
      };
    };
  };
};
type ErrorContextType = {
  error: ErrorType | undefined;
  setGlobalErrorMessage: (error: any) => void;
  resetError: () => void;
};
const ErrorContext = React.createContext<ErrorContextType>({
  error: {name: '', message: ''},
  setGlobalErrorMessage: () => {},
  resetError: () => {},
});

const ErrorProvider = (props: {children: React.ReactNode}) => {
  const [error, setError] = useState<ErrorType>();
  const setGlobalErrorMessage = (error: ErrorType) => {
    setError(error);
  };
  const resetError = () => {
    setError(undefined);
  };
  return (
    <ErrorContext.Provider value={{error, setGlobalErrorMessage, resetError}}>
      {props.children}
    </ErrorContext.Provider>
  );
};

const CommonError: React.FC = () => {
  const {error} = useContext(ErrorContext);
  useEffect(() => {
    if (
      error?.networkError?.name ||
      error?.networkError?.result?.error?.message ||
      error?.name ||
      error?.message
    ) {
      Toast.show({
        leadingIconName: 'alert',
        type: 'error',
        text1: error?.networkError?.name || error.name,
        text2: error?.networkError?.result?.error?.message || error.message,
        visibilityTime: 1000 * 10,
        primaryBtn: null,
        secondaryBtn: null,
        leadingIcon: null,
      });
    }
  }, [error]);
  return <></>;
  // return error && (error.name || error.message) ? (
  //    <Error error={error} showBack={true} />
  // ) : (
  //   <></>
  // );
};
export {ErrorContext, ErrorProvider};
export default CommonError;
