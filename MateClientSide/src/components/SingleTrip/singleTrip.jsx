import React from 'react'
import { View, Text, StyleSheet, Pressable, Image } from 'react-native'
import { HorizontalScale, VerticalScale } from '../../utils'
import Ionicons from 'react-native-vector-icons/Ionicons'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Theme from '../../../assets/styles/theme'
const SingleTrip = ({ picUrl, title, destination, numOfPeople }) => {
  return (
    <Pressable>
      <View style={styles.shadowContainer}>
        <View style={styles.container}>
          <Image
            resizeMode={'cover'}
            // source={require('../../../assets/images/TripPhoto.jpg')}
            source={picUrl}
            style={styles.image}
          />
          <View style={styles.information}>
            <Text style={styles.text}>{title}</Text>
            <View style={styles.bottom}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name='person-outline'
                  size={15}
                  color='#e6824a'
                  style={styles.icon}
                />
                <Text style={styles.iconText}>{numOfPeople}</Text>
              </View>
              <View style={styles.iconContainer}>
                <EvilIcons
                  name='location'
                  size={15}
                  color='#e6824a'
                  style={styles.icon}
                />
                <Text style={styles.iconText}>{destination[0]}</Text>
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
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
  container: {
    marginTop: VerticalScale(20),
    marginHorizontal: HorizontalScale(5),
    marginBottom: VerticalScale(20),
    width: HorizontalScale(220),
    height: VerticalScale(220),
    borderRadius: HorizontalScale(20),
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '60%', // Adjust the height as needed
    borderTopLeftRadius: HorizontalScale(20),
    borderTopRightRadius: HorizontalScale(20),
  },
  information: {
    paddingHorizontal: HorizontalScale(10),
    paddingVertical: VerticalScale(10),
    borderBottomLeftRadius: HorizontalScale(20),
    borderBottomRightRadius: HorizontalScale(20),
  },
  text: {
    textAlign: 'right',
    color: 'black',
    fontFamily: 'OpenSans-Bold',
    fontSize: 14,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Adjust as needed
    marginTop: VerticalScale(20),
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconText: {
    textAlign: 'left',
    color: 'black',
    fontFamily: 'OpenSans-Bold',
    fontSize: 10,
  },
})

export default SingleTrip
