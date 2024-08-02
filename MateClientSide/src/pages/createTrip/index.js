import { StyleSheet, Image, Text, View, ScrollView } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { TextInput } from 'react-native-paper'
import {
  HorizontalScale,
  VerticalScale,
  windowHeight,
  windowWidth,
} from '../../utils'
import Theme from '../../../assets/styles/theme'
export default function CreateTrip({ navigation }) {
  const [fullName, setFullName] = useState('lala')

  return (
    <ScrollView
      contentContainerStyle={[styles.screen]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.container]}>
        <View>
          <Image
            source={require('../../../assets/images/IntroImage.png')}
            resizeMode='cover'
            style={styles.image}
          />
          <TextInput
            label={'שם מלא'}
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
            mode='outlined'
            activeOutlineColor='#E6824A'
            selectionColor='gray'
          />
          <TextInput
            label={'שם מלא'}
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
            mode='outlined'
            activeOutlineColor='#E6824A'
            selectionColor='gray'
          />
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: '1',
    width: '100%',
    marginVertical: 30,
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'pink',
    width: '90%',
    alignItems: 'center',
  },
  image: {
    width: windowWidth * 0.65,
    height: windowHeight * 0.2,
    borderRadius: 30,
    marginBottom: windowHeight * 0.0234,
    marginTop: windowHeight * 0.1,
  },
  input: {
    marginBottom: VerticalScale(24),
    direction: 'rtl',
    textAlign: 'right',
    fontFamily: Theme.primaryText.fontFamily,
  },
})
