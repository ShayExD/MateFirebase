import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useStat,useContext } from 'react'
import Theme from '../../../assets/styles/theme'
import { VerticalScale, windowHeight } from '../../utils'
import BackArrow from '../../components/BackArrow/backArrow'
import { TextInput, Button } from 'react-native-paper'
import Input from '../../components/Input/input'
import { AuthContext } from '../../../AuthContext' // Adjust the import path as needed
import ButtonLower from '../../components/ButtonLower/buttonLower'
import { Avatar } from 'react-native-paper'
import TextView from '../../components/TextView/textView'
import TagsView from '../../components/TagsView/tagsView'
import { SingleCharToString } from '../../utils'
import { useRoute } from '@react-navigation/native'

export default function ViewProfile({navigation}) {
  const route = useRoute();
  // const navigation = useNavigation();
  const { loggedInUser } = useContext(AuthContext);
  const isOwnProfile = !route.params?.profile;

  const handleEditProfile = () => {
    navigation.navigate('EditProfile', { profile: loggedInUser });
    console.log("edit progfile");
    
    // Navigate to the EditProfile screen
    // You'll need to create this screen and set up the navigation
  };
  // Use route params if available, otherwise use context
  const profile = route.params?.profile || loggedInUser;

  if (!profile) {
    return (
      <View style={styles.screen}>
        <Text>No profile data available</Text>
      </View>
    );
  }
  
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
        {isOwnProfile && (
          <Button 
            mode="contained" 
            onPress={handleEditProfile}
            style={styles.editButton}
          >
            ערוך פרופיל
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
