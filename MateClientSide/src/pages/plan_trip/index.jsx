import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import BackArrow from '../../components/BackArrow/backArrow';
import ButtonLower from '../../components/ButtonLower/buttonLower';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import Theme from '../../../assets/styles/theme';
import { windowHeight, windowWidth, VerticalScale, HorizontalScale } from '../../utils';
import * as googleGenerativeAI from '@google/generative-ai';
import DropdownComponent from '../../components/DropdownCountryCityComponents/dropdownCountryCityComponents';
import NumberPicker from '../../components/NumberPicker/numberPicker';
import DialogAi from '../../components/DialogAi/dialogAi';
import { Alert } from 'react-native';


const PlanTrip = () => {
  const [daysNumber, setDaysNumber] = useState('');
  const [cityLabel, setCityLabel] = useState('');
  const [countryLabel, setCountryLabel] = useState('');
  const [answer, setAnswer] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const hideDialog = () => setVisible(false);
  const StartChat = async () => {
    if (daysNumber=='' || country=='' ) {
      Alert.alert(
        'Empty Fields',
        'Please fill in all fields before starting the chat with AI.',
        [
          {
            text: 'OK',
          },
        ]
      );
      return;
    }

    setIsLoading(true);

    const API_KEY = 'AIzaSyBozb6vVgoZ6pYEjsfZ7W5jtsEZjRSgI2Y';
    const genAI = new googleGenerativeAI.GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Write travel for ${daysNumber} days in ${countryLabel} in ${cityLabel} please write me without the "*" and answer me in hebrew please`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    setCity('');
    setCountry('');
    setCountryLabel('');
    setCityLabel('');
    setDaysNumber('');
    setAnswer(text);
    // console.log(text);
    setVisible(true);
    setIsLoading(false);
  };

  return (
    <ScrollView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.screen}>
          <BackArrow />
          <Text style={[Theme.primaryTitle, styles.title]}>התייעצות עם Ai</Text>
          <View style={styles.inputsContainer}>
            <DropdownComponent
              setCountryLabel={setCountryLabel}
              setCityLabel={setCityLabel}
              setCountryValue={setCountry}
              setCityValue={setCity}
              cityValue={city}
              countryValue={country}
              disabled={isLoading}
            ></DropdownComponent>
            <NumberPicker
              selectedValueState={daysNumber}
              onValueChange={setDaysNumber}
              text="מספר ימים"
              disabled={isLoading}
            />
          </View>
          <ButtonLower
            textContent={'יצירת תכנון טיול עם Ai'}
            handlePress={() => StartChat()}
            disabled={isLoading}
          />
          {isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={Theme.primaryColor} />
            </View>
          ) : (
            <View>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
      <DialogAi text={answer} visible={visible} onDismiss={hideDialog}></DialogAi>
    </ScrollView>
  );
};

export default PlanTrip;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    marginTop: windowHeight * 0.175,
    marginBottom: windowHeight * 0.0174,
  },
  inputsContainer: {
    marginTop: VerticalScale(44),
  },
  input: {
    width: '95%',
  },
  loaderContainer: {
    marginTop: VerticalScale(20),
  },
});