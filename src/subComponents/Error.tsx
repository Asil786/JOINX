 
import React, {useContext, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useString} from '../utils/useString';
import {ErrorContext} from '../components/common';
import {useHistory} from '../components/Router';

const Error = (props: {
  error: {name: string; message: string};
  showBack?: boolean;
}) => {
  const {resetError} = useContext(ErrorContext);
  const history = useHistory();
  //commented for v1 release
  //const goBackButton = useString('goBackButton')();
  const goBackButton = 'Go back';
  return (
    <View
      style={{
        position: 'absolute',
        backgroundColor: '#F7E5EC',
        paddingHorizontal: 10,
        paddingVertical: 4,
        maxWidth: 250,
        width: '65%',
        left: 0,
        right: 0,
        top: '30%',
        marginHorizontal: 'auto',
        zIndex: 55,
        borderRadius: 10,
      }}>
      <Text
        style={{
          fontWeight: '500',
          color: '#FD0845',
          textAlign: 'center',
          fontSize: 16,
        }}>
        {props.error.name}
      </Text>
      <Text style={{textAlign: 'center', padding: 4}}>
        {props.error.message}
      </Text>
      {props.showBack ? (
        <TouchableOpacity
          style={{alignSelf: 'center'}}
          onPress={() => {
            resetError && resetError();
            history.replace('./');
          }}>
          <Text
            style={{
              fontWeight: '500',
              textAlign: 'center',
              textDecorationLine: 'underline',
            }}>
            {goBackButton}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
export default Error;
