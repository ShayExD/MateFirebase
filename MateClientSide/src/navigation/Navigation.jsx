import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Register from '../pages/register'
import Login from '../pages/login'
import Splash from '../pages/splash'
import Intro from '../pages/intro'
import EditProfile from '../pages/edit_profile'
import PlanTrip from '../pages/plan_trip'
import ViewProfile from '../pages/view_profile'
import Home from '../pages/home'
import Tabs from './tabs'
import Trip from '../pages/trip'
const MainNavigation = () => {
  const Stack = createStackNavigator()

  return (
    <Stack.Navigator
      initialRouteName='Loading'
      screenOptions={{ header: () => null, headerShown: false }}
    >
      <Stack.Screen name='Trip' component={Trip} />
      <Stack.Screen name='Splash' component={Splash} />
      <Stack.Screen name='Intro' component={Intro} />
      <Stack.Screen name='Login' component={Login} />
      <Stack.Screen name='Register' component={Register} />
      <Stack.Screen name='EditProfile' component={EditProfile} />
      <Stack.Screen name='ViewProfile' component={ViewProfile} />
      <Stack.Screen name='Home' component={Home} />
      <Stack.Screen name='myTabs' component={Tabs} />

      {/* <Stack.Screen name="PlanTrip" component={PlanTrip} /> */}
      {/* <Stack.Screen name="MyTabs" component={MyTabs} /> */}
    </Stack.Navigator>
  )
}

export default MainNavigation
