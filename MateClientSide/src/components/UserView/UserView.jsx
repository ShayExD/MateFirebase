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

const UserView = ({ title, content, avatar, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.labelContainer}>
        <Text style={styles.smallTitle}>{title}</Text>
        <View style={styles.contentContainer}>
          <Text style={styles.textAttributes}>{content}</Text>
          <Avatar.Image
            size={40}
            source={{ uri: avatar }}
            style={styles.avatar}
          />
        </View>
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
    alignItems: Platform.OS === 'ios' ? 'flex-end' : 'flex-start', // Align items to the right
  },
  smallTitle: {
    color: Theme.primaryColor.color,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'right',
  },
  contentContainer: {
    flexDirection: Platform.OS === 'ios' ? 'row' : 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align content to the right
  },
  avatar: {
    ...(Platform.OS === 'ios' && {
      marginLeft: 20,
    }),
    ...(Platform.OS === 'android' && {
      marginRight: 20,
    }),
  },
  textAttributes: {
    color: 'black',
    fontSize: 18,
    textAlign: 'right',
  },
})

export default UserView
