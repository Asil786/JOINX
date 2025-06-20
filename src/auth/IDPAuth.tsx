import React, {useEffect} from 'react';
import {useAuth} from './AuthProvider';
import {useHistory, useParams} from '../components/Router';
import Loading from '../subComponents/Loading';
import Toast from '../../react-native-toast-message';
import {getParamFromURL} from '../utils/common';
import useTokenAuth from './useTokenAuth';
import {useString} from '../utils/useString';
import {
  authAuthorizingApplicationText,
  authErrorOnLoginToastHeading,
} from '../language/default-labels/commonLabels';
import {LogSource, logger} from '../logger/AppBuilderLogger';

export const IDPAuth = () => {
  const toastheading = useString(authErrorOnLoginToastHeading)();
  const text = useString(authAuthorizingApplicationText)();
  const {setIsAuthenticated, authLogin} = useAuth();
  const history = useHistory();
  const {token: returnTo}: {token: string} = useParams();
  //token used as returnTo and webToken is sent on the token query param
  const {enableTokenAuth} = useTokenAuth();

  useEffect(() => {
    const token = getParamFromURL(history.location.search, 'token');
    if (token) {
      enableTokenAuth(token)
        .then(() => {
          setIsAuthenticated(true);
          if (returnTo && returnTo.indexOf('authorize') === -1) {
            history.push('/' + returnTo);
          } else {
            history.push('/');
          }
        })
        .catch(error => {
          setIsAuthenticated(false);
          logger.error(
            LogSource.Internals,
            'AUTH',
            'error on IDP token setting',
            error,
          );
        });
    } else {
      setIsAuthenticated(false);
      Toast.show({
        leadingIconName: 'alert',
        type: 'error',
        text1: toastheading,
        visibilityTime: 3000,
      });
      setTimeout(() => {
        authLogin();
      }, 3000);
    }
  }, []);

  return <Loading text={text} />;
};
