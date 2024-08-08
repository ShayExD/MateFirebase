import React, { useState, useContext, useEffect } from 'react'
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
} from 'react-native'
import Theme from '../../../assets/styles/theme'
import { VerticalScale, windowHeight, HorizontalScale } from '../../utils'
import { TextInput, Button } from 'react-native-paper'
import axios from 'axios'
import { AuthContext } from '../../../AuthContext'
import { Alert } from 'react-native'
import Header from '../../components/Header/header'
import SingleTrip from '../../components/SingleTrip/singleTrip'
import SingleProfile from '../../components/SingleProfile/singleProfile'
import Spinner from 'react-native-loading-spinner-overlay'
import AntDesign from 'react-native-vector-icons/AntDesign'

export default function Home({ navigation }) {
  const { loggedInUser, logoutAndNavigate } = useContext(AuthContext)
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const userPostsPageSize = 2
  const [userPostsCurretPage, setuserPostsCurretPage] = useState(1)
  const [userPostsRenderData, setuserPostsRenderData] = useState([])
  const [isLoadinguserPosts, setisLoadinguserPosts] = useState(false)

  const [tripData, setTripData] = useState([])
  const tripsPageSize = 2
  const [tripsCurrentPage, setTripsCurrentPage] = useState(1)
  const [tripsRenderData, setTripsRenderData] = useState([])
  const [isLoadingTrips, setIsLoadingTrips] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log("Home component mounted or loggedInUser changed")
    const checkAuthStatus = async () => {
      console.log("Checking auth status...")
      console.log("Current loggedInUser:", loggedInUser)

      if (!loggedInUser) {
        console.log("User is not logged in, navigating to Login screen")
        navigation.navigate('Login')
      } else {
        console.log("User is logged in, fetching data")
        try {
          await Promise.all([getAllUsers(), getAllTrips()])
          setIsLoading(false)
          console.log("Loading complete, ready to render")
        } catch (error) {
          console.error("Error fetching data:", error)
          setError("Failed to load data. Please try again.")
          setIsLoading(false)
        }
      }
    }

    checkAuthStatus()
  }, [loggedInUser, navigation])

  const pagination = (database, currentPage, pageSize) => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    if (startIndex >= database.length) {
      return []
    }
    return database.slice(startIndex, endIndex)
  }

  function calculateUserMatchingScore(user1, user2) {
    let ageScore = 100 - Math.abs((user1.age || 0) - (user2.age || 0))
    let interestsScore =
      (user1.tripInterests || []).filter((interest) =>
        (user2.tripInterests || []).includes(interest),
      ).length * 10
    let travelPlanScore =
      (user1.travelPlan || []).filter((plan) => (user2.travelPlan || []).includes(plan))
        .length * 10
    return ageScore + interestsScore + travelPlanScore
  }

  function calculateTripMatchingScore(user, trip) {
    let interestsScore =
      (user.tripInterests || []).filter((interest) =>
        (trip.tripInterests || []).includes(interest),
      ).length * 10
    let destinationsScore =
      (user.travelPlan || []).filter((plan) => (trip.destinations || []).includes(plan))
        .length * 10
    return interestsScore + destinationsScore
  }

  function getRecommendedUsers(loggedInUser, allUsers) {
    const recommendedUsers = allUsers
      .filter((user) => (user.age || 0) !== 0)
      .filter((user) => user.uid !== (loggedInUser?.uid || ''))
      .map((user) => {
        const matchingScore = calculateUserMatchingScore(loggedInUser || {}, user)
        return { ...user, matchingScore }
      })
    recommendedUsers.sort((a, b) => b.matchingScore - a.matchingScore)
    return recommendedUsers
  }

  const logOut = () => {
    console.log("Logout initiated")
    logoutAndNavigate(navigation)
  }

  const getAllUsers = async () => {
    try {
      const response = await axios.get(
        `https://us-central1-mateapiconnection.cloudfunctions.net/mateapi/getAllUsers`,
      )
      const updatedUserData = getRecommendedUsers(loggedInUser || {}, response.data)
      setData(updatedUserData)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const getAllTrips = async () => {
    try {
      const response = await axios.get(
        `https://us-central1-mateapiconnection.cloudfunctions.net/mateapi/getAllTrips`,
      )
      const updatedTrips = response.data.map((trip) => {
        const matchingScore = calculateTripMatchingScore(loggedInUser || {}, trip)
        return { ...trip, matchingScore }
      })
      updatedTrips.sort((a, b) => b.matchingScore - a.matchingScore)
      setTripData(updatedTrips)
    } catch (error) {
      console.error('Error fetching trips:', error)
    }
  }

  useEffect(() => {
    setisLoadinguserPosts(true)
    const getInitPostData = pagination(data, 1, userPostsPageSize)
    setuserPostsRenderData(getInitPostData)
    setisLoadinguserPosts(false)
  }, [data])

  useEffect(() => {
    setIsLoadingTrips(true)
    const getInitTripData = pagination(tripData, 1, tripsPageSize)
    setTripsRenderData(getInitTripData)
    setIsLoadingTrips(false)
  }, [tripData])

  const handleHeaderPress = () => {
    console.log("Header pressed");
    
    navigation.navigate('ViewProfile');
  };
  if (!loggedInUser) {
    console.log("No logged-in user, rendering null")
    return null
  }

  if (isLoading) {
    return (
      <SafeAreaView style={[Theme.screen, styles.screen]}>
        <Spinner
          visible={true}
          textContent={'Loading...'}
          textStyle={styles.spinnerText}
          overlayColor='rgba(0, 0, 0, 0.6)'
        />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[Theme.screen, styles.screen]}>
      <View style={styles.topBar}>
        <Header
          onPress={handleHeaderPress}
          nickName={loggedInUser.fullname || 'Guest'}
          picUri={loggedInUser.profileImage || 'https://example.com/default-avatar.png'}
        />
        <Pressable style={styles.icon} onPress={logOut}>
          <AntDesign name='logout' size={30} color='#e6824a' />
          <Text>התנתק</Text>
        </Pressable>
      </View>
      <View style={styles.content}>
        <Text style={[Theme.primaryTitle, styles.title]}>
          טיולים מומלצים עבורך
        </Text>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={tripsRenderData}
          renderItem={({ item }) => (
            <SingleTrip
              handlePress={() => {
                navigation.navigate('ViewTrip', { trip: item })
              }}
              picUrl={{ uri: item.tripPictureUrl || 'https://example.com/default-trip.png' }}
              title={item.tripName || 'Unnamed Trip'}
              destination={item.destinations || []}
              numOfPeople={item.limitUsers || 0}
            />
          )}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (isLoadingTrips) return
            setIsLoadingTrips(true)
            const contentToAppend = pagination(
              tripData,
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
      <View style={styles.content}>
        <Text style={[Theme.primaryTitle, styles.title]}>
          פרופילים מומלצים עבורך
        </Text>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={userPostsRenderData}
          renderItem={({ item }) => (
            <SingleProfile
              handlePress={() => {
                navigation.navigate('ViewProfile', { profile: item })
              }}
              name={item.fullname || 'Anonymous'}
              details={item.introduction || 'No introduction'}
              profileImg={{ uri: item.profileImage || 'https://example.com/default-avatar.png' }}
              age={item.age || 'N/A'}
              city={item.city || 'Unknown'}
              ig={item.instagram || 'N/A'}
            />
          )}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (isLoadinguserPosts) return
            setisLoadinguserPosts(true)
            const contentToAppend = pagination(
              data,
              userPostsCurretPage + 1,
              userPostsPageSize,
            )
            if (contentToAppend.length > 0) {
              setuserPostsCurretPage(userPostsCurretPage + 1)
              setuserPostsRenderData((prev) => [...prev, ...contentToAppend])
            }
            setisLoadinguserPosts(false)
          }}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: { alignItems: 'center' },
  topBar: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginTop: VerticalScale(20),
  },
  spinnerText: {
    color: '#FFF',
  },
  content: {
    marginTop: VerticalScale(30),
    width: '90%',
  },
  title: { textAlign: 'right' },
  icon: {
    position: 'absolute',
    left: '0%',
    paddingHorizontal: HorizontalScale(5),
    borderRadius: '50%',
    textAlign: 'center',
    alignItems: 'center',
  },
})