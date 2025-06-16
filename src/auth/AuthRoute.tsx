 
import React, {useEffect, useRef} from 'react';
import {Route, Redirect} from '../components/Router';
import Toast from '../../react-native-toast-message';
import type {RouteProps} from 'react-router';
import {useAuth} from './AuthProvider';
import isSDK from '../utils/isSDK';
import Loading from '../subComponents/Loading';
import Login from '../pages/Login';
import {isAndroid, isIOS} from '../utils/common';
import {useString} from '../utils/useString';
import {
  authAuthenticationFailedText,
  loadingText,
} from '../language/default-labels/commonLabels';

interface PrivateRouteProps extends RouteProps {
  children: React.ReactNode;
}

const AuthRoute: React.FC<PrivateRouteProps> = props => {
  const didMountRef = useRef(false);
  const {authenticated} = useAuth();
  const loadingLabel = useString(loadingText)();
  const failedtext = useString(authAuthenticationFailedText)();

  useEffect(() => {
    if (!didMountRef.current) return;
    if (!authenticated) {
      Toast.show({
        leadingIconName: 'alert',
        type: 'error',
        text1: failedtext,
        visibilityTime: 1000,
      });
    }
    didMountRef.current = true;
  }, [authenticated]);

  //on SDK no fallback so even though authentication failed we will still show the routes
  //when user try to perform any operation it will get failed and throw regular error message
  if (isSDK()) {
    return <Route {...props} />;
  }

  return authenticated ? (
    <>
      <Route {...props} />
    </>
  ) : (
    //if user closes the inapp browser then we are showing the loginpopup
    //: isAndroid() || isIOS() ? (
    //if user closes inapp browser then show login/signup button
    //  <Login />
    //)
    <Loading text={loadingLabel} />
  );
  // <Redirect
  //   to={{
  //     pathname: '/login',
  //   }}
  // />
  // return (
  //   <Route
  //     {...props}
  //     render={({location}) => {
  //       return authenticated ? (
  //         props.children
  //       ) : (
  //         <Redirect
  //           to={{
  //             pathname: '/login',
  //             state: {
  //               from: location,
  //             },
  //           }}
  //         />
  //       );
  //     }}
  //   />
  // );
};

export default AuthRoute;
