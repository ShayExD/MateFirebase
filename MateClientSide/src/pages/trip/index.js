import { StyleSheet, Image, Text, View, ScrollView } from 'react-native'
import React from 'react'
import {
  HorizontalScale,
  VerticalScale,
  windowHeight,
  windowWidth,
} from '../../utils'
import Theme from '../../../assets/styles/theme'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Fontisto from 'react-native-vector-icons/Fontisto'
import DropDown from '../../components/DropDown/DropDown'
import Button from '../../components/Button/Button'
export default function Trip({ navigation }) {
  return (
    <ScrollView
      contentContainerStyle={[styles.screen]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[Theme.screen, styles.screen]}>
        <View>
          <Image
            source={require('../../../assets/images/IntroImage.png')}
            resizeMode='cover'
            style={styles.image}
          />
        </View>
        <View style={styles.wrap}>
          <View style={styles.header}>
            <View style={styles.place}>
              <Text style={[styles.primaryText, { fontWeight: 'bold' }]}>
                פוארטו אסקונדידו מקסיקו
              </Text>
              <MaterialIcons
                name='place'
                size={20}
                color='#1C9FE2'
                style={[styles.icon]}
              />
            </View>
            <Text style={[styles.primaryTitle]}>טיול גלישה</Text>
          </View>
          <View style={styles.content}>
            <View style={styles.iconText}>
              <Fontisto
                name='date'
                size={20}
                color='#1C9FE2'
                style={styles.icon}
              />
              <Text style={[styles.primaryText]}>
                7 באפריל 2024 - 31 מאי 2024
              </Text>
            </View>
            <View style={styles.iconText}>
              <Ionicons
                name='person-outline'
                size={20}
                color='#1C9FE2'
                style={styles.icon}
              />
              <Text style={[styles.primaryText]}>64 אנשים נרשמו לטיול</Text>
            </View>
            <Text style={[styles.text, styles.details]}>
              צאו להרפתקאת גלישה בפוארטו אסקונדידו, מקסיקו - גן עדן לגולשים.
              חוויה מרגשת מחכה לכם בין גלים אגדיים ותרבות חוף ססגונית. הטיול
              מתאים לכל רמות הגלישה, מלווה בהדרכה מקצועית, ומבטיח זכרונות שלא
              ישכחו.
            </Text>
          </View>
        </View>
        <Button
          textContent={'הצטרף לקבוצה'}
          handlePress={() => {
            navigation.navigate('Login')
          }}
        />
        <DropDown header={'יעדים'}></DropDown>
        <DropDown header={'תחומי עניין'}></DropDown>
        <DropDown header={'מנוהל ע"י'}></DropDown>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  wrap: {
    width: '90%',
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    direction: 'ltr',
  },
  icon: {
    marginRight: HorizontalScale(8),
  },
  place: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  iconText: {
    marginTop: VerticalScale(10),
    flexDirection: 'row',
    direction: 'rtl',
  },
  screen: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  image: {
    width: windowWidth,
    height: windowHeight * 0.4,
    borderRadius: 30,
    marginBottom: windowHeight * 0.0234,
  },
  title: {
    marginTop: windowHeight * -0.079,
    marginHorizontal: windowWidth * 0.1,
    textAlign: 'center',
    lineHeight: windowHeight * 0.0422,
    marginBottom: windowHeight * 0.0234,
  },
  span: {
    color: '#e6824a',
  },
  content: {
    textAlign: 'right',
  },
  text: {
    textAlign: 'right', // מגדיר את יישור הטקסט
    writingDirection: 'rtl',
    fontSize: Theme.primaryText.fontSize,
    color: 'gray',
  },
  details: {
    marginTop: VerticalScale(10),
  },
  primaryText: {
    color: '#1C9FE2',
    fontFamily: 'OpenSans',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: windowHeight * 0.0281,
  },
  primaryTitle: {
    color: 'black',
    fontFamily: 'OpenSans-ExtraBold',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
})
