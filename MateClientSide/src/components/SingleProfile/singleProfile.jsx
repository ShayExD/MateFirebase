import React from 'react'
import { View, Text, StyleSheet, Pressable, Image,Platform } from 'react-native'
import { HorizontalScale, VerticalScale } from '../../utils'
import Ionicons from 'react-native-vector-icons/Ionicons'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Theme from '../../../assets/styles/theme'
const SingleProfile = ({
  name,
  details,
  profileImg,
  age,
  city,
  ig,
  handlePress,
}) => {
  return (
    <Pressable onPress={handlePress}>
      <View style={styles.shadowContainer}>
        <View style={styles.container}>
          <Image
            resizeMode={'cover'}
            source={profileImg}
            style={styles.image}
          />
          <View style={styles.bottomContainer} >
            <View style={styles.information}>
              </View>
              <Text style={styles.title}>
                {name},{age}
              </Text>
              {/* <Text style={styles.text}>{details} </Text> */}
            <View style={styles.bottom}>
              {/* <View style={styles.profileDetail}>
              <Text style={[styles.profileText]}></Text>
            </View> */}
              <View style={styles.profileDetail}>
                <Text style={[styles.profileText]}>{city}</Text>
              </View>
              <View style={styles.profileDetail}>
                <Text style={[styles.profileText]}>{ig}</Text>
              </View>
            </View>
            </View>
          </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  shadowContainer: {
    borderRadius: HorizontalScale(20),
    // overflow: 'hidden',
    ...(Platform.OS === 'ios' && {
      shadowColor: '#c4c4c4',
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.3,
      shadowRadius: 3.84,
      elevation: 5
    }),
    ...(Platform.OS === 'android' && {
      elevation: 0, // Ensure no elevation on Android
    })    
    
  },
  container: {
    marginTop: VerticalScale(20),
    marginHorizontal: HorizontalScale(5),
    marginBottom: VerticalScale(20),
    width: HorizontalScale(220),
    height: VerticalScale(220),
    borderRadius: HorizontalScale(20),
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: 'rgba(243, 243, 243, 0.9)',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
    // objectFit: 'cover',
    // objectPosition: 'center',

    // marginTop: VerticalScale(5),
  },
  bottomContainer: {
    width: '100%',
    // height: '%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom:VerticalScale(5),
     marginTop: VerticalScale(-47),
    backgroundColor: Theme.primaryColor.color,
    // opacity: 0.7,
    zIndex: 999,
  },
  information: {
    width: '100%',
    height: '5%',
    alignItems: 'center',
    // justifyContent: 'flex-end',
    // paddingBottom: 10,
    // marginTop: 5,
    // marginTop: VerticalScale(10),
    // paddingHorizontal: HorizontalScale(10),
    // paddingVertical: VerticalScale(10),
  },
  title: {
    textAlign: 'right',
    color: 'white',
    fontFamily: 'OpenSans-Bold',
    fontSize: 12,
    maxWidth: '100%',
    paddingBottom:VerticalScale(1)
    // maxHeight:'30%'
  },
  text: {
    marginTop: VerticalScale(10),
    textAlign: 'center',
    color: 'black',
    fontFamily: 'OpenSans',
    fontSize: 8,
  },
  profileText: {
    color: 'black',
    fontFamily: 'OpenSans',
    fontSize: 8,
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    // height: '15%',
    // marginTop: VerticalScale(5),
    marginBottom: VerticalScale(0),
  },
  profileDetail: {
    minWidth: '25%',
    maxWidth: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.primaryColor.color,
    height: VerticalScale(15),
    paddingHorizontal: HorizontalScale(5),
    borderRadius: HorizontalScale(50),
    marginHorizontal: HorizontalScale(5),

    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    // paddingHorizontal: 10,
    // paddingVertical: 5,
    // marginRight: 10,
    // marginBottom: 10,
    color: 'black',
    fontSize: 14,
  },
})

export default SingleProfile
