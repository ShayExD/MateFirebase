import { StyleSheet, Image, Text, View, ScrollView } from 'react-native'
import React,{useEffect,useState,useContext} from 'react'
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
import { useRoute } from '@react-navigation/native'
import StackedAvatars from '../../components/StackedAvatars/StackedAvatars'
import  UserView  from '../../components/UserView/UserView'
import axios from 'axios'
import { AuthContext } from '../../../AuthContext'
import BackArrow from '../../components/BackArrow/backArrow'

export default function ViewTrip({ navigation }) {
const route = useRoute();
const { trip } = route.params;
const [tripData, setTripData] = useState(trip)
const { loginUser, loggedInUser, setLoggedInUser, logoutUser } =
useContext(AuthContext)


const getTrip = async () =>{


  try {
    const response = await axios.get(
      `https://us-central1-mateapiconnection.cloudfunctions.net/mateapi/getTrip/${trip.id}`,
    )
    setTripData(response.data);
  } 
  catch (error) {
    console.error('Error fetching data:', error)
  } 
  finally {
  }

}

const joinTrip = async () =>{

try {
  const response = await axios.post(
    `https://us-central1-mateapiconnection.cloudfunctions.net/mateapi/joinTrip`,
    {
      tripId: tripData.id,
      uid: loggedInUser.uid
    },
    {
      headers: {
        'Content-Type': 'application/json',
      }
    }
  )
  console.log(response);

} 
catch (error) {
  console.error('Error', error.message)
} 
finally {
}
}

useEffect(() => {
  getTrip();

}, [])

  return (
    <ScrollView
      contentContainerStyle={[styles.screen]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[Theme.screen, styles.screen]}>
        <View>
          <Image
            source={{ uri: tripData.tripPictureUrl }}
            resizeMode='cover'
            style={styles.image}
          />
         <BackArrow></BackArrow>
 
        </View>
        <View style={styles.wrap}>
          <View style={styles.header}>
            <View style={styles.place}>
              <Text style={[styles.primaryText, { fontWeight: 'bold' }]}>
                {trip.aboutTrip}
              </Text>
              <MaterialIcons
                name='place'
                size={20}
                color='#1C9FE2'
                style={[styles.icon]}
              />
            </View>
            <Text style={[styles.primaryTitle]}>{tripData.tripName}</Text>
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
                {new Date(tripData.startDate).toLocaleDateString()} -{' '}
                {new Date(tripData.endDate).toLocaleDateString()}
              </Text>
            </View>
            
            <View style={styles.iconText}>
              <Ionicons
                name='person-outline'
                size={20}
                color='#1C9FE2'
                style={styles.icon}
              />
              <Text style={[styles.primaryText]}>
                {tripData.joinedUsers.length} נרשמו לטיול{' '}
              </Text>
            </View>
            <StackedAvatars members={tripData.joinedUsers} maxDisplay={4} />
            <Text style={[styles.text, styles.details]}>
              {tripData.aboutTrip}
            </Text>
          </View>
          
        </View>
        
        <DropDown header={'יעדים'} content={tripData.destinations}></DropDown>
        <DropDown
          header={'תחומי עניין'}
          content={tripData.tripInterests}
        ></DropDown>
        <DropDown
          header={'מנוהל ע"י'}
          content={<UserView  content={tripData.joinedUsers[0].fullname} avatar={tripData.joinedUsers[0].profileImage} onPress={() => navigation.navigate('ViewProfile', { profile: tripData.joinedUsers[0]})} />}
        />
        <Button
          textContent={'הצטרף לקבוצה'}
          handlePress={() => {
            joinTrip();
          }}
        />
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
  },
  icon: {
    marginLeft: HorizontalScale(8),
  },
  place: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconText: {
    marginTop: VerticalScale(10),
    flexDirection: 'row',
    alignItems: 'center',
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
  content: {
    alignItems: 'flex-end',
  },
  text: {
    textAlign: 'right',
    writingDirection: 'rtl',
    fontSize: Theme.primaryText.fontSize,
    color: 'gray',
  },
  details: {
    marginTop: VerticalScale(10),
    marginBottom: VerticalScale(20),
    
  },
  primaryText: {
    color: '#1C9FE2',
    fontFamily: 'OpenSans',
    fontSize: 16,
    textAlign: 'right',
    lineHeight: windowHeight * 0.0281,
  },
  primaryTitle: {
    color: 'black',
    fontFamily: 'OpenSans-ExtraBold',
    fontSize: 20,
    textAlign: 'right',
    fontWeight: 'bold',
  },
})
