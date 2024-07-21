import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useState } from 'react'
import Theme from '../../../assets/styles/theme'
import { VerticalScale, windowHeight } from '../../utils'
import BackArrow from '../../components/BackArrow/backArrow'
import { TextInput, Button } from 'react-native-paper'
import Input from '../../components/Input/input'
import ButtonLower from '../../components/ButtonLower/buttonLower'
import { Avatar } from 'react-native-paper'
import TextView from '../../components/TextView/textView'
import TagsView from '../../components/TagsView/tagsView'
import { useRoute } from '@react-navigation/native';
import { SingleCharToString } from '../../utils'
export default function ViewProfile() {
const route = useRoute();
const { profile } = route.params; 

  
  return (
    <ScrollView
      contentContainerStyle={styles.screen}
      showsVerticalScrollIndicator={false}
    >
      <BackArrow />
      <View style={styles.avatarContainer}>
        <Avatar.Image
          size={150}
          source={{uri:profile.profileImage}}
        />
        <Text style={[Theme.primaryTitle, styles.text]}>
          {profile.fullname.split(' ')[0]},{profile.age}
        </Text>
      </View>
      <View style={styles.inputsContainer}>
  
        <TextView
          title={'מין'}
          content={SingleCharToString(profile.gender)}
          iconName={
            SingleCharToString(profile.gender) === 'גבר' 
              ? 'man' 
              : SingleCharToString(profile.gender) === 'אישה'
                ? 'woman'
                : 'male-female-outline'
          }
         ></TextView>
        <TextView
          title={'קצת עלי'}
          content={
            profile.introduction}
        ></TextView>
        <TagsView title={'תחומי עניין בטיול'} list={profile.tripInterests}></TagsView>
        <TagsView title={'יעדים לטיול'} list={profile.travelPlan}></TagsView>
        <TextView
          iconName={'logo-instagram'}
          title={'אנסטגרם'}
          content={profile.instagram}
          allowCopy={true}
        ></TextView>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: '1',
    width: '100%',
    paddingVertical: 20,
    alignItems: 'center',
    
  },
  title: {
    marginTop: windowHeight * 0.1,
    marginBottom: windowHeight * 0.0174,
  },
  smallTitle: {
    color: Theme.primaryColor.color,
  },
  inputsContainer: {
    // marginTop: VerticalScale(44),
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    direction: 'rtl',
  },
  labelContainer: {
    minWidth: '90%',
    maxWidth: '90%',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'flex-start', // Center the content horizontally
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
  },
  text: {
    paddingVertical: 10,
    color: 'gray',
    marginHorizontal: 0,
  },
  button: {
    marginTop: 10,
  },
  avatarContainer: {
    marginTop: windowHeight * 0.1,
    marginBottom: windowHeight * 0.0174,
    alignItems: 'center',
    marginVertical: windowHeight * 0.05,
  },
})
