import React, { useState, useEffect, useContext } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StyleSheet, View, Text } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase'
import { AuthContext } from '../../AuthContext'
import { HorizontalScale, VerticalScale } from '../utils'
import Theme from '../../assets/styles/theme'

// Import your components
import Home from '../pages/home'
import PlanTrip from '../pages/plan_trip'
import CreateTrip from '../pages/createTrip'
import MapPage from '../pages/map'
import MessagesPage from '../pages/messages'
import MyTrips from '../pages/my_trips'
import ChatPage from '../pages/chat'
import EditProfile from '../pages/edit_profile'

const Tab = createBottomTabNavigator()

const MessageTabIcon = ({ focused, color, size }) => {
  const [unreadCount, setUnreadCount] = useState(0)
  const { loggedInUser } = useContext(AuthContext)

  useEffect(() => {
    if (!loggedInUser) return

    const q = query(
      collection(db, 'conversations'),
      where('participantIds', 'array-contains', loggedInUser.uid)
    )

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let count = 0
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        count += data.unreadCount?.[loggedInUser.uid] || 0
      })
      setUnreadCount(count)
    })

    return () => unsubscribe()
  }, [loggedInUser])

  return (
    <View style={styles.tabItem}>
      <FontAwesome
        name='commenting'
        size={size}
        color={color}
      />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unreadCount}</Text>
        </View>
      )}
      <Text style={[styles.tabText, { color }]}>
        הודעות שלי
      </Text>
    </View>
  )
}

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          elevation: 0,
          backgroundColor: 'white',
          borderRadius: VerticalScale(150),
          height: VerticalScale(85),
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: '0',
          ...styles.shadowContainer,
        },
        tabBarLabelStyle: {
          display: 'none',
        },
      }}
    >
      {/* Home Tab */}
      <Tab.Screen
        name='Home'
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              <AntDesign
                name='home'
                size={30}
                color={focused ? '#e6824a' : '#7D848D'}
              />
              <Text style={[styles.tabText, { color: focused ? '#e6824a' : '#7D848D' }]}>
                ראשי
              </Text>
            </View>
          ),
        }}
      />

      {/* AI Consultation Tab */}
      <Tab.Screen
        name='התייעץ עם AI'
        component={PlanTrip}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              <FontAwesome
                name='magic'
                size={30}
                color={focused ? '#e6824a' : '#7D848D'}
              />
              <Text style={[styles.tabText, { color: focused ? '#e6824a' : '#7D848D' }]}>
                התייעץ עם AI
              </Text>
            </View>
          ),
        }}
      />

      {/* Create Trip Tab */}
      <Tab.Screen
        name='יצירת טיול'
        component={CreateTrip}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabItem, styles.plus]}>
              <AntDesign
                name='pluscircle'
                size={50}
                color={focused ? '#e6824a' : '#7D848D'}
                style={styles.icon}
              />
            </View>
          ),
        }}
      />

      {/* Map Tab */}
      <Tab.Screen
        name='MapPage'
        component={MapPage}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              <Entypo
                name='map'
                size={30}
                color={focused ? '#e6824a' : '#7D848D'}
              />
              <Text style={[styles.tabText, { color: focused ? '#e6824a' : '#7D848D' }]}>
                מפה
              </Text>
            </View>
          ),
        }}
      />

      {/* Messages Tab */}
      <Tab.Screen
        name='Messages'
        component={MessagesPage}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <MessageTabIcon 
              focused={focused} 
              color={focused ? '#e6824a' : '#7D848D'} 
              size={30} 
            />
          ),
        }}
      />

      {/* Hidden Tabs */}
      <Tab.Screen
        name='MyTrips'
        component={MyTrips}
        options={{
          tabBarVisible: false, 
          headerShown: false,
          tabBarButton: () => null
        }}
      />

      <Tab.Screen
        name="Chat"
        component={ChatPage}
        options={{
          headerShown: false,
          tabBarButton: () => null,
          tabBarVisible: false,
        }}
      />

      <Tab.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          headerShown: false,
          tabBarButton: () => null,
          tabBarVisible: false,
        }}
      />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  shadowContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.5,
    elevation: 5,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    color: '#7D848D',
    fontFamily: 'OpenSans',
    fontSize: 10,
    textAlign: 'center',
  },
  plus: {
    marginBottom: VerticalScale(12),
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: 'red',
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
})

export default Tabs