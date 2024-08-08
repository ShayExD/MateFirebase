import {
    Pressable,
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    FlatList,
  } from 'react-native'
  import React, { useState, useContext, useEffect } from 'react'
  import Theme from '../../../assets/styles/theme'
  import { VerticalScale, windowHeight, HorizontalScale } from '../../utils'
  import BackArrow from '../../components/BackArrow/backArrow'
  import { TextInput, Button } from 'react-native-paper'
  import Input from '../../components/Input/input'
  import ButtonLower from '../../components/ButtonLower/buttonLower'
  import axios from 'axios'
  import { AuthContext } from '../../../AuthContext'
  import { Alert } from 'react-native'
  import Header from '../../components/Header/header'
  import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
  import Trip from '../../components/SingleTrip/singleTrip'
  import SingleTrip from '../../components/SingleTrip/singleTrip'
  import SingleProfile from '../../components/SingleProfile/singleProfile'
  import Spinner from 'react-native-loading-spinner-overlay'
  import AntDesign from 'react-native-vector-icons/AntDesign'
  
  export default function MyTrips({ navigation }) {
    const { loginUser, loggedInUser, setLoggedInUser, logoutUser } =
      useContext(AuthContext)
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
  
    const pagination = (database, currentPage, pageSize) => {
      // console.log('currentPage' + currentPage)
      const startIndex = (currentPage - 1) * pageSize
      const endIndex = startIndex + pageSize
      if (startIndex >= database.length) {
        return []
      }
      return database.slice(startIndex, endIndex)
    }
  
    function calculateUserMatchingScore(user1, user2) {
      let ageScore = 100 - Math.abs(user1.age - user2.age)
      let interestsScore =
        user1.tripInterests.filter((interest) =>
          user2.tripInterests.includes(interest),
        ).length * 10
      let travelPlanScore =
        user1.travelPlan.filter((plan) => user2.travelPlan.includes(plan))
          .length * 10
      return ageScore + interestsScore + travelPlanScore
    }
  
    function calculateTripMatchingScore(user, trip) {
      // console.log(trip.tripInterests)
      let interestsScore =
        user.tripInterests.filter((interest) =>
          trip.tripInterests.includes(interest),
        ).length * 10
      let destinationsScore =
        user.travelPlan.filter((plan) => trip.destinations.includes(plan))
          .length * 10
      return interestsScore + destinationsScore
    }
  
    function getRecommendedUsers(loggedInUser, allUsers) {
      const recommendedUsers = allUsers
        .filter((user) => user.age !== 0)
        .filter((user) => user.uid !== loggedInUser.uid)
        .map((user) => {
          const matchingScore = calculateUserMatchingScore(loggedInUser, user)
          return { ...user, matchingScore }
        })
      recommendedUsers.sort((a, b) => b.matchingScore - a.matchingScore)
      return recommendedUsers
    }
  
    const logOut = () => {
      logoutUser()
      navigation.navigate('Login')
      // console.log('logOut')
    }
  
    const getAllUsers = async () => {
      try {
        const response = await axios.get(
          `https://us-central1-mateapiconnection.cloudfunctions.net/mateapi/getAllUsers`,
        )
  
        // const updatedUserData = response.data.filter(user => user.id !== loggedInUser.id);
        updatedUserData = getRecommendedUsers(loggedInUser, response.data)
        // console.log(response.data)
  
        // console.log(updatedUserData)
        setData(updatedUserData)
  
        // console.log('Data fetched successfully:', response.data);
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }
  
    const getAllTrips = async () => {
      try {
        const response = await axios.get(
          `https://us-central1-mateapiconnection.cloudfunctions.net/mateapi/getAllTrips`,
        )
        // console.log(response.data);
        const updatedTrips = response.data.map((trip) => {
          // console.log(trip);
          const matchingScore = calculateTripMatchingScore(loggedInUser, trip)
          return { ...trip, matchingScore }
        })
        updatedTrips.sort((a, b) => b.matchingScore - a.matchingScore)
        setTripData(updatedTrips)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
  
    useEffect(() => {
      getAllUsers()
      getAllTrips()
      // setTripsCurrentPage(1);
      setuserPostsCurretPage(1)
    }, [loggedInUser])
  
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
  
    return (
      <SafeAreaView style={[Theme.screen, styles.screen]}>
        <Spinner
          visible={isLoading}
          textContent={'Loading...'}
          textStyle={styles.spinnerText}
          overlayColor='rgba(0, 0, 0, 0.6)'
        />
  
        <View style={styles.topBar}>
          <Header
            nickName={loggedInUser.fullname}
            picUri={loggedInUser.profileImage}
          ></Header>
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
                picUrl={{ uri: item.tripPictureUrl }}
                title={item.tripName}
                destination={item.destinations}
                numOfPeople={item.limitUsers}
              ></SingleTrip>
            )}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              console.log('fetch page number' + tripsCurrentPage )
              console.log(tripsRenderData.length)
              if (isLoadingTrips) {
                return
              }
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
                name={item.fullname}
                details={item.introduction}
                profileImg={{ uri: item.profileImage }}
                age={item.age}
                city={item.city}
                ig={item.instagram}
              ></SingleProfile>
            )}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              // console.log('fetch page number' + userPostsCurretPage + 1)
              // console.log(userPostsRenderData)
              if (isLoadinguserPosts) {
                return
              }
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
      // flexDirection: 'row-reverse',
    },
    title: { textAlign: 'right' },
    bell: {
      backgroundColor: '#E3E3E3',
      borderRadius: '50%',
      height: VerticalScale(50),
      width: HorizontalScale(50),
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      position: 'absolute',
      left: '0%',
      paddingHorizontal: HorizontalScale(5),
      // top: VerticalScale(10),
      borderRadius: '50%',
      textAlign: 'center',
      alignItems: 'center',
    },
  })
  