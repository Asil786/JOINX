import React, {useState, useContext, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useHistory} from '../components/Router';
//import Logo from '../subComponents/Logo';
import Logo from '../components/common/Logo';
import Spacer from '../atoms/Spacer';
import {
  AuthErrorCodes,
  isMobileUA,
  isValidReactComponent,
  shouldAuthenticate,
  useHasBrandLogo,
} from '../utils/common';
import LogoutButton from '../subComponents/LogoutButton';
import PrimaryButton from '../atoms/PrimaryButton';
import SecondaryButton from '../atoms/SecondaryButton';
import HorizontalRule from '../atoms/HorizontalRule';
import TextInput from '../atoms/TextInput';
import Error from '../subComponents/Error';
import {useString} from '../utils/useString';
import {useCustomization} from 'customization-implementation';
import {useSetRoomInfo} from '../components/room-info/useSetRoomInfo';
import {RoomInfoDefaultValue} from '../components/room-info/useRoomInfo';
import Card from '../atoms/Card';
import Input from '../atoms/Input';
import LinkButton from '../atoms/LinkButton';
import Toast from '../../react-native-toast-message';
import useJoinRoom from '../utils/useJoinRoom';
import isMobileOrTablet from '../utils/isMobileOrTablet';
import ThemeConfig from '../theme';
import IDPLogoutComponent from '../auth/IDPLogoutComponent';
import {
  joinRoomBtnText,
  joinRoomCreateBtnText,
  joinRoomErrorToastHeading,
  joinRoomErrorToastSubHeading,
  joinRoomHeading,
  joinRoomInputLabel,
  joinRoomInputPlaceHolderText,
} from '../language/default-labels/joinScreenLabels';
// --- ADD THIS IMPORT ---
import { createRoomMadeByLabel } from '../language/default-labels/createScreenLabels';
import {LogSource, logger} from '../logger/AppBuilderLogger';
import isSDK from '../utils/isSDK';
import SDKEvents from '../utils/SdkEvents';

const mobileOrTablet = isMobileOrTablet();

const Join = () => {
  const hasBrandLogo = useHasBrandLogo();

  const headingText = useString<any>(joinRoomHeading)({
    eventMode: $config.EVENT_MODE,
  });

  const inputLabel = useString<any>(joinRoomInputLabel)({
    eventMode: $config.EVENT_MODE,
  });

  const placeHolderText = useString<any>(joinRoomInputPlaceHolderText)({
    eventMode: $config.EVENT_MODE,
  });

  const joinBtnText = useString<any>(joinRoomBtnText)({
    eventMode: $config.EVENT_MODE,
  });

  const createBtnText = useString<any>(joinRoomCreateBtnText)({
    eventMode: $config.EVENT_MODE,
  });

  // --- ADD THIS LINE ---
  const madeByLabel = useString(createRoomMadeByLabel)();

  //toast
  const invalidRoomIdToastHeading = useString<any>(joinRoomErrorToastHeading)({
    eventMode: $config.EVENT_MODE,
  });
  const invalidRoomIdToastSubheading = useString<any>(
    joinRoomErrorToastSubHeading,
  )({
    eventMode: $config.EVENT_MODE,
  });

  const history = useHistory();
  const [phrase, setPhrase] = useState('');
  const [error, setError] = useState<null | {name: string; message: string}>(
    null,
  );

  const apiJoinCall = useJoinRoom();
  const {setRoomInfo} = useSetRoomInfo();

  const createMeeting = () => {
    logger.log(
      LogSource.Internals,
      'JOIN_MEETING',
      'User is navigated to create-room screen',
    );
    history.push('/create');
  };

  useEffect(() => {
    logger.log(
      LogSource.Internals,
      'JOIN_MEETING',
      'user landed on join-meeting screen',
    );
  }, []);

  const startCall = async () => {
    logger.log(
      LogSource.Internals,
      'JOIN_MEETING',
      'User wants to join meeting',
      phrase,
    );
    apiJoinCall(phrase)
      .then(() => {
        setRoomInfo(prevState => {
          return {
            ...RoomInfoDefaultValue,
            loginToken: prevState?.loginToken,
          };
        });
        logger.log(
          LogSource.Internals,
          'JOIN_MEETING',
          'Navigating the user to precall screen or video call screen depending upon the project config',
          phrase,
        );
        history.push(phrase);
      })
      .catch(error => {
        const errorCode = error?.code;
        if (AuthErrorCodes.indexOf(errorCode) !== -1 && isSDK()) {
          SDKEvents.emit('unauthorized', error);
        }
        logger.error(
          LogSource.Internals,
          'JOIN_MEETING',
          'Error on join room page',
          JSON.stringify(error || {}),
        );
        const isInvalidUrl =
          error?.message.toLowerCase().trim() === 'invalid passphrase' || false;
        Toast.show({
          leadingIconName: 'alert',
          type: 'error',
          text1: isInvalidUrl
            ? invalidRoomIdToastHeading
            : 'Some Error Occured.',
          text2: isInvalidUrl
            ? invalidRoomIdToastSubheading
            : 'Please try again',
          visibilityTime: 3000,
          primaryBtn: null,
          secondaryBtn: null,
          leadingIcon: null,
        });
      });
  };

  const {JoinComponent} = useCustomization(data => {
    let components: {
      JoinComponent?: React.ComponentType;
    } = {};
    // commented for v1 release
    // if (
    //   data?.components?.join &&
    //   typeof data?.components?.join !== 'object' &&
    //   isValidReactComponent(data?.components?.join)
    // ) {
    //   components.JoinComponent = data?.components?.join;
    // }
    return components;
  });

  return JoinComponent ? (
    <JoinComponent />
  ) : (
    <View style={style.root}>
      {!isMobileUA() ? (
        <IDPLogoutComponent containerStyle={{marginBottom: -100}} />
      ) : (
        <></>
      )}
      <ScrollView contentContainerStyle={style.main}>
        {error ? <Error error={error} /> : <></>}
        <Card>
          <View>
            <View style={style.logoContainerStyle}>
              <Logo />
              {isMobileUA() ? (
                <IDPLogoutComponent
                  containerStyle={{marginTop: 0, marginRight: 0}}
                />
              ) : (
                <></>
              )}
            </View>
            <Spacer size={20} />
            <Text style={style.heading}>{headingText}</Text>
            <Spacer size={40} />
            <Input
              labelStyle={style.labelStyle}
              label={inputLabel}
              autoFocus
              value={phrase}
              placeholder={placeHolderText}
              onChangeText={text => setPhrase(text)}
              onSubmitEditing={() => startCall()}
            />
            <Spacer size={60} />
          </View>
          <View style={style.btnContainer}>
            <PrimaryButton
              iconName="video-on"
              disabled={phrase === ''}
              onPress={() => startCall()}
              text={joinBtnText}
              containerStyle={isMobileUA() && {width: '100%'}}
            />
            <Spacer size={16} />
            <LinkButton text={createBtnText} onPress={() => createMeeting()} />
            {/* --- ADD THIS LINE BELOW THE CREATE BUTTON --- */}
            <Text style={style.madeByLabel}>{madeByLabel}</Text>
            {shouldAuthenticate ? (
              <LogoutButton
                //@ts-ignore
                setError={setError}
              /> //setError not available in logout?
            ) : (
              <></>
            )}
          </View>
        </Card>
      </ScrollView>
    </View>
  );
};

const style = StyleSheet.create({
  logoContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnContainer: {
    width: '100%',
    alignItems: 'center',
  },
  labelStyle: {
    paddingLeft: 8,
  },
  root: {
    flex: 1,
  },
  main: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  heading: {
    fontSize: ThemeConfig.FontSize.extraLarge,
    fontWeight: '700',
    lineHeight: ThemeConfig.FontSize.extraLarge,
    color: $config.FONT_COLOR,
    fontFamily: ThemeConfig.FontFamily.sansPro,
  },
  // --- ADD THIS STYLE ---
  madeByLabel: {
    marginTop: 8,
    color: '#a3a3a3',
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
  },
});

export default Join;
