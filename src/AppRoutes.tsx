 
import React from 'react';
import Join from './pages/Join';
import VideoCall from './pages/VideoCall';
import Create from './pages/Create';
import {Route, Switch, Redirect} from './components/Router';
import AuthRoute from './auth/AuthRoute';
import {IDPAuth} from './auth/IDPAuth';
import {Text} from 'react-native';
import {useCustomization} from 'customization-implementation';
import {CUSTOM_ROUTES_PREFIX, CustomRoutesInterface} from 'customization-api';
import PrivateRoute from './components/PrivateRoute';
import RecordingBotRoute from './components/recording-bot/RecordingBotRoute';
import {useIsRecordingBot} from './subComponents/recording/useIsRecordingBot';
import {isValidReactComponent} from './utils/common';
import ErrorBoundary from './components/ErrorBoundary';
import {ErrorBoundaryFallback} from './components/ErrorBoundaryFallback';

function VideoCallWrapper(props) {
  const {isRecordingBot} = useIsRecordingBot();
  const ErrorBoundaryFallbackComponent = <ErrorBoundaryFallback />;
  return isRecordingBot ? (
    <RecordingBotRoute history={props.history}>
      <ErrorBoundary fallback={ErrorBoundaryFallbackComponent}>
        <VideoCall />
      </ErrorBoundary>
    </RecordingBotRoute>
  ) : (
    <AuthRoute>
      <ErrorBoundary fallback={ErrorBoundaryFallbackComponent}>
        <VideoCall />
      </ErrorBoundary>
    </AuthRoute>
  );
}

function AppRoutes() {
  const CustomRoutes = useCustomization(data => data?.customRoutes);
  const AppConfig = useCustomization(data => data?.config);
  const {defaultRootFallback: DefaultRootFallback} = AppConfig || {};
  const RenderCustomRoutes = () => {
    try {
      return (
        CustomRoutes &&
        Array.isArray(CustomRoutes) &&
        CustomRoutes.length &&
        CustomRoutes?.map((item: CustomRoutesInterface, i: number) => {
          let RouteComponent = item?.isPrivateRoute ? PrivateRoute : Route;
          return (
            <RouteComponent
              path={
                item.isTopLevelRoute
                  ? item.path
                  : CUSTOM_ROUTES_PREFIX + item.path
              }
              exact={item.exact}
              key={i}
              failureRedirectTo={
                item.failureRedirectTo ? item.failureRedirectTo : '/'
              }
              {...item.routeProps}>
              <item.component {...item.componentProps} />
            </RouteComponent>
          );
        })
      );
    } catch (error) {
      console.error('Error on rendering the custom routes');
      return null;
    }
  };
  return (
    <Switch>
      <Route exact path={'/'}>
        {DefaultRootFallback &&
        (typeof DefaultRootFallback === 'object' ||
          typeof DefaultRootFallback === 'function') &&
        isValidReactComponent(DefaultRootFallback) ? (
          <DefaultRootFallback />
        ) : (
          <Redirect to={'/create'} />
        )}
      </Route>
      <Route exact path={'/authorize/:token?'}>
        <IDPAuth />
      </Route>
      <AuthRoute exact path={'/join'}>
        <Join />
      </AuthRoute>
      <AuthRoute exact path={'/create'}>
        <Create />
      </AuthRoute>
      {RenderCustomRoutes()}
      <Route exact path={'/:phrase'} component={VideoCallWrapper} />
      <Route path="*">
        <Text>Page not found</Text>
      </Route>
    </Switch>
  );
}
export default AppRoutes;
