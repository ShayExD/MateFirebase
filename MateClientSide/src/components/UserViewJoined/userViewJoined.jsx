import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native'
import Theme from '../../../assets/styles/theme'
import { Avatar } from 'react-native-paper'

const UserViewJoined = ({ title, content, avatar, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.labelContainer}>
        <Text style={styles.smallTitle}></Text>
        <View style={styles.contentContainer}>
          <Avatar.Image
            size={40}
            source={{ uri: avatar }}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.textAttributes}>{content}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  labelContainer: {
    width: '100%',
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center', // Align items to the right
  },
  smallTitle: {
    color: Theme.primaryColor.color,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  contentContainer: {
    flexDirection: Platform.OS === 'ios' ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'center', // Align content to the right
  },
  avatar: {
  },
  textAttributes: {
    color: 'black',
    fontSize: 12,
    textAlign: 'center',
  }
})

export default UserViewJoined
