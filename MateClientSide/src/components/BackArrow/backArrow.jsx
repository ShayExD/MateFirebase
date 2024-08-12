import {
  StyleSheet,
  Image,
  Text,
  View,
  Pressable,
  Platform,
} from 'react-native'
import React from 'react'
import { IconButton } from 'react-native-paper'
import Theme from '../../../assets/styles/theme'
import { VerticalScale } from '../../utils'
import { useNavigation } from '@react-navigation/native'

const BackArrow = ({ onPress }) => {
  const navigation = useNavigation()

  const handlePress = () => {
    navigation.goBack()
  }
  return (
    <View style={styles.container}>
      <Pressable onPress={onPress || handlePress}>
        <IconButton icon='arrow-left' background={'F7F7F9'} />
      </Pressable>
    </View>
  )
}

export default BackArrow

const styles = StyleSheet.create({
  container: {
    zIndex: 999,
    position: 'absolute',
    top: VerticalScale(56),
    backgroundColor: '#F7F7F9',
    borderRadius: 50,
    ...(Platform.OS === 'ios' && {
      left: '5%',
    }),
    ...(Platform.OS === 'android' && {
      right: '5%',
    }),
  },
})
