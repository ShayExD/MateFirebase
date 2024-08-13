import React, { useState, useContext, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  I18nManager,
  Platform,
} from 'react-native'
import axios from 'axios'
import Theme from '../../../assets/styles/theme'
import { VerticalScale, windowHeight } from '../../utils'
import BackArrow from '../../components/BackArrow/backArrow'
import { Button, Avatar } from 'react-native-paper'
import TextView from '../../components/TextView/textView'
import TagsView from '../../components/TagsView/tagsView'
import { SingleCharToString } from '../../utils'
import { useRoute } from '@react-navigation/native'
import DropDown from '../../components/DropDown/DropDown'
import { AuthContext } from '../../../AuthContext'
import { startNewConversation } from '../../utils/chatUtils.jsx' // Assuming you have this utility function
import SingleTrip from '../../components/SingleTrip/singleTrip' // Assuming SingleTrip is another component
import Spinner from 'react-native-loading-spinner-overlay'

export default function ViewProfile({ navigation }) {
  const route = useRoute()
  const { loggedInUser } = useContext(AuthContext)
  const isOwnProfile = !route.params?.profile

  const [tripsRenderData, setTripsRenderData] = useState([])
  const [tripsCurrentPage, setTripsCurrentPage] = useState(1)
  const [tripsPageSize] = useState(10)
  const [isLoadingTrips, setIsLoadingTrips] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Call getAllUserTrips when the component mounts
    getAllUserTrips()
    // I18nManager.forceRTL(true);
  }, [])

  const getAllUserTrips = async () => {
    try {
      const response = await axios.post(
        `https://us-central1-mateapiconnection.cloudfunctions.net/mateapi/getUserTrips`,
        {
          uid: profile.uid,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      setTripsRenderData(response.data)
    } catch (error) {
      console.error('Error', error.message)
    }
  }

  const handleEditProfile = () => {
    navigation.navigate('myTabs', { screen: 'EditProfile' })
  }

  const handleMyTrips = () => {
    navigation.navigate('MyTrips')
  }

  const handleStartChat = async () => {
    setIsLoading(true)
    if (isOwnProfile) return // Don't start a chat with yourself
    const conversationId = await startNewConversation(
      loggedInUser.uid,
      profile.uid,
    )
    if (conversationId) {
      navigation.navigate('myTabs', {
        screen: 'Chat',
        params: {
          conversationId,
          otherUserId: profile.uid,
          otherUser: profile,
        },
      });
    } else {
      console.error('Failed to start conversation')
      // You might want to show an error message to the user here
    }
    setIsLoading(false)

  }

  const profile = route.params?.profile || loggedInUser

  if (!profile) {
    return (
      <View style={styles.screen}>
        <Text>No profile data available</Text>
      </View>
    )
  }

  const pagination = (database, currentPage, pageSize) => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    if (startIndex >= database.length) {
      return []
    }
    return database.slice(startIndex, endIndex)
  }

  return (
    <ScrollView
      contentContainerStyle={styles.screen}
      showsVerticalScrollIndicator={false}
    >
      <BackArrow />
      <Spinner
        visible={isLoading}
        textContent={'Loading Chat...'}
        textStyle={styles.spinnerText}
        overlayColor='rgba(0, 0, 0, 0.6)'
      />
      <View style={styles.avatarContainer}>
        <Avatar.Image size={150} source={{ uri: profile.profileImage }} />
        <Text style={[Theme.primaryTitle, styles.text]}>
          {profile.fullname.split(' ')[0]}, {profile.age}
        </Text>
        {isOwnProfile ? (
          <View style={styles.buttonContainer}>
            <Button
              mode='contained'
              onPress={handleEditProfile}
              style={styles.button}
            >
              ערוך פרופיל
            </Button>
            <Button
              mode='contained'
              onPress={handleMyTrips}
              style={[styles.button, { backgroundColor: 'orange' }]}
            >
              מעבר לטיולים שלי
            </Button>
          </View>
        ) : (
          <Button
            mode='contained'
            onPress={handleStartChat}
            style={styles.button}
          >
            התחל צ'אט
          </Button>
        )}
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
          style={{ textAlign: Platform.OS === 'ios' ? 'left' : 'right' }}
        />
        <TextView title={'קצת עלי'} content={profile.introduction} />
        <TagsView title={'תחומי עניין בטיול'} list={profile.tripInterests} />
        <TagsView title={'יעדים לטיול'} list={profile.travelPlan} />
        <TextView
          iconName={'logo-instagram'}
          title={'אנסטגרם'}
          content={profile.instagram}
          allowCopy={true}
        />
        <View style={styles.tripsContainer}>
          <Text style={styles.tripsTitle}>טיולים</Text>
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={tripsRenderData}
            renderItem={({ item }) => (
              <SingleTrip
                handlePress={() => {
                  navigation.navigate('ViewTrip', { trip: item })
                }}
                picUrl={{
                  uri:
                    item.tripPictureUrl ||
                    'https://example.com/default-trip.png',
                }}
                title={item.tripName || 'Unnamed Trip'}
                destination={item.destinations || []}
                numOfPeople={item.joinedUsers.length || 0}
                endDate={item.endDate}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.flatListContent}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              if (isLoadingTrips) return
              setIsLoadingTrips(true)
              const contentToAppend = pagination(
                tripsRenderData,
                tripsCurrentPage + 1,
                tripsPageSize,
              )
              if (contentToAppend.length > 0) {
                setTripsCurrentPage(tripsCurrentPage + 1)
                setTripsRenderData((prev) => [...prev, ...contentToAppend])
              }
              setIsLoadingTrips(false)
            }}
          />
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
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
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    direction: 'rtl',
  },
  buttonContainer: {
    flexDirection: Platform.OS === 'ios' ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  labelContainer: {
    minWidth: '90%',
    maxWidth: '90%',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'flex-end',
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
    marginHorizontal: 5,
  },
  editButton: {
    marginVertical: 10,
    backgroundColor: Theme.primaryColor.color,
    borderRadius: 10,
  },
  avatarContainer: {
    marginTop: windowHeight * 0.1,
    marginBottom: windowHeight * 0.0174,
    alignItems: 'center',
    marginVertical: windowHeight * 0.05,
  },
  tripsContainer: {
    width: '90%',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  tripsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Theme.primaryColor.color,
    textAlign: 'left',
  },
  flatListContent: {
    paddingRight: 10, // Add some padding to the right side of the FlatList
  },
  spinnerText: {
    color: '#FFF',
  },
})
