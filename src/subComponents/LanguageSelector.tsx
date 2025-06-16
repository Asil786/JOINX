 
import React, {useContext} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ColorContext from '../components/ColorContext';
import {useLanguage} from '../language/useLanguage';
import {useCustomization} from 'customization-implementation';
import {useString} from '../utils/useString';
import {DEFAULT_I18_DATA} from '../language';
import ThemeConfig from '../theme';
import Dropdown from '../atoms/Dropdown';
import {settingsPanelLanguageLabel} from '../language/default-labels/precallScreenLabels';

const LanguageSelector = () => {
  const {languageCode, setLanguageCode} = useLanguage();
  const languageData = useCustomization(data => data?.i18n);
  const languageText = useString(settingsPanelLanguageLabel)();
  if (!languageData || !languageData.length) {
    return <></>;
  }

  if (
    languageData.length === 1 &&
    languageData[0].locale === DEFAULT_I18_DATA.locale
  ) {
    return <></>;
  }

  const data = [];

  languageData.forEach(element => {
    data.push({
      label: element.label || element.locale,
      value: element.locale,
    });
  });

  return (
    <View>
      <Text style={style.label}>{languageText}</Text>
      <Dropdown
        icon={'lang-select'}
        enabled={true}
        selectedValue={languageCode}
        label={''}
        data={data}
        onSelect={({value}) => {
          setLanguageCode(value);
        }}
      />
    </View>
  );
};

const style = StyleSheet.create({
  label: {
    fontWeight: '400',
    fontSize: ThemeConfig.FontSize.small,
    color: $config.FONT_COLOR,
    fontFamily: ThemeConfig.FontFamily.sansPro,
    marginBottom: 12,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: $config.FONT_COLOR,
    // marginBottom: 20,
    alignSelf: 'center',
  },
  popupPicker: {
    height: 30,
    marginBottom: 10,
    borderRadius: 50,
    paddingHorizontal: 15,
    fontSize: 15,
    minHeight: 35,
  },
});

export default LanguageSelector;
