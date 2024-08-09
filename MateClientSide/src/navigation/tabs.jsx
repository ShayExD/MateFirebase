import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Register from '../pages/register'
import Login from '../pages/login'
import Splash from '../pages/splash'
import Intro from '../pages/intro'
import EditProfile from '../pages/edit_profile'
import PlanTrip from '../pages/plan_trip'
import Home from '../pages/home'
import { HorizontalScale, VerticalScale } from '../utils'
import { StyleSheet, View, Text } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Theme from '../../assets/styles/theme'
import ComingSoon from '../pages/comingSoon'
import MapPage from '../pages/map'
import CreateTrip from '../pages/createTrip'
import ViewProfile from '../pages/view_profile'
import MyTrips from '../pages/my_trips'
import MessagesPage from '../pages/messages'
import ChatPage from '../pages/chat'

const Tab = createBottomTabNavigator()

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
              <Text
                style={[
                  styles.tabText,
                  { color: focused ? '#e6824a' : '#7D848D' },
                ]}
              >
                ראשי
              </Text>
            </View>
          ),
        }}
      />
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
              <Text
                style={[
                  styles.tabText,
                  { color: focused ? '#e6824a' : '#7D848D' },
                ]}
              >
                התייעץ עם AI
              </Text>
            </View>
          ),
        }}
      />
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
              <Text
                style={[
                  styles.tabText,
                  { color: focused ? '#e6824a' : '#7D848D' },
                ]}
              >
                מפה
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name='Messages'
        component={MessagesPage}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              <FontAwesome
                name='commenting'
                size={30}
                color={focused ? '#e6824a' : '#7D848D'}
              />
              <Text
                style={[
                  styles.tabText,
                  { color: focused ? '#e6824a' : '#7D848D' },
                ]}
              >
                הודעות שלי
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name='MyTrips'
        component={MyTrips}
        options={{
          tabBarVisible: false, 
          headerShown: false,
          tabBarButton: () => null
          // tabBarIcon: ({ focused }) => (
          //   <View style={styles.tabItem}>
          //     <AntDesign
          //       name='pushpino'
          //       size={30}
          //       color={focused ? '#e6824a' : '#7D848D'}
          //     />
          //     <Text
          //       style={[
          //         styles.tabText,
          //         { color: focused ? '#e6824a' : '#7D848D' },
          //       ]}
          //     >
          //       טיולים שלי
          //     </Text>
          //   </View>
          // ),
        }}
      />
      <Tab.Screen
  name="Chat"
  
  component={ChatPage}
  options={{
    headerShown: false,
    tabBarButton: () => null, // This hides the tab button for Chat
    tabBarVisible: false, // This should hide the tab bar on the Chat screen
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
})
export default Tabs
