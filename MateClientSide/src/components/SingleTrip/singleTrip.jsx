import React, {useEffect,useState} from 'react'
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Platform,
} from 'react-native'
import { HorizontalScale, VerticalScale } from '../../utils'
import Ionicons from 'react-native-vector-icons/Ionicons'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Theme from '../../../assets/styles/theme'

const SingleTrip = ({
  picUrl,
  title,
  destination,
  numOfPeople,
  handlePress,
  max,
  endDate,
}) => {

  // const [isOver, setIsOver] = useState(false)

  const isOver = new Date(endDate) < new Date()

  // useEffect(() => {
  //   if ( new Date(endDate) < new Date()) {
  //     setIsOver(true);
  //   }
  // }, [])

  return (
    <Pressable onPress={handlePress}>
      <View style={styles.shadowContainer}>
        <View style={[styles.container, isOver && styles.containerOver]}>
          <Image resizeMode={'cover'} source={picUrl} style={styles.image} />
          {isOver && <View style={styles.overlay} />}
          <View style={styles.information}>
            <Text style={[styles.text, isOver && styles.textOver]}>
              {title}
            </Text>
            <View style={styles.bottom}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name='person-outline'
                  size={15}
                  color={isOver ? '#888' : '#e6824a'}
                  style={styles.icon}
                />
                <Text style={[styles.iconText, isOver && styles.textOver]}>
                  {numOfPeople}
                  {max}
                </Text>
              </View>
              <View style={styles.iconContainer}>
                <EvilIcons
                  name='location'
                  size={15}
                  color={isOver ? '#888' : '#e6824a'}
                  style={styles.icon}
                />
                <Text style={[styles.iconText, isOver && styles.textOver]}>
                  {destination[0]}
                </Text>
              </View>
            </View>
          </View>
          {isOver && (
            <View style={styles.endedBadge}>
              <Text style={styles.endedText}>הסתיים</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  shadowContainer: {
    borderRadius: HorizontalScale(20),
    overflow: 'hidden',
    ...(Platform.OS === 'ios' && {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.5,
      shadowRadius: 3.84,
      elevation: 5,
    }),
    ...(Platform.OS === 'android' && {
      elevation: 0, // Ensure no elevation on Android
    }),
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 5,
    // },
    // shadowOpacity: 0.5,
    // shadowRadius: 3.84,
    // elevation: 5,
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
  containerOver: {
    opacity: 0.7,
  },
  image: {
    width: '100%',
    height: '60%',
    borderTopLeftRadius: HorizontalScale(20),
    borderTopRightRadius: HorizontalScale(20),
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1,
  },
  information: {
    paddingHorizontal: HorizontalScale(10),
    paddingVertical: VerticalScale(10),
    borderBottomLeftRadius: HorizontalScale(20),
    borderBottomRightRadius: HorizontalScale(20),
  },
  text: {
    textAlign: Platform.OS === 'ios' ? 'right' : 'left',
    color: 'black',
    fontFamily: 'OpenSans-Bold',
    fontSize: 14,
  },
  textOver: {
    color: '#888',
  },
  bottom: {
    flexDirection: Platform.OS === 'ios' ? 'row' : 'row-reverse',
    justifyContent: 'space-between',
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
  endedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 2,
  },
  endedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
})

export default SingleTrip
