import React, { useState, useContext, useEffect } from 'react'
import {
  View,
  Image,
  Button,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { VerticalScale, HorizontalScale } from '../../utils'
import Theme from '../../../assets/styles/theme'
import axios from 'axios'
import { AuthContext } from '../../../AuthContext'
// import * as Permissions from 'expo-permissions' 
import { Camera } from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'
import Spinner from 'react-native-loading-spinner-overlay'

const AvatarComponent = ({ setProfilePicture ,uploadImage}) => {
  const { loggedInUser, setLoggedInUser } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false)

  const [avatar, setAvatar] = useState(
    loggedInUser.profileImage !== ''
      ? loggedInUser.profileImage
      : 'https://i.imgur.com/LBIwlSy.png',
  )
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    requestPermissions()
  }, [])

  const requestPermissions = async () => {
    const { status: cameraStatus } =
      await Camera.requestCameraPermissionsAsync()

    // Handle permissions
    if (cameraStatus !== 'granted') {
      console.log('Camera or media library permissions not granted')
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })
    if (result.canceled) {
      return
    }

    if (!result.cancelled) {
      setIsLoading(true)
      setModalVisible(false)
      setAvatar(result.assets[0].uri)
      uploadImage(result.assets[0].uri)
      // setProfilePicture(result.assets[0].uri)
      // uploadImage(result.assets[0].uri)
    }
  }

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (result.canceled) {
      return
    }

    // console.log(result.assets[0].uri)

    if (!result.cancelled) {
      setIsLoading(true)
      setModalVisible(false)
      setAvatar(result.assets[0].uri)
      uploadImage(result.assets[0].uri)
      // setProfilePicture(result.assets[0].uri)
      // uploadImage(result.assets[0].uri)
    }
  }



  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      
      {avatar && (
        <Image
          source={{ uri: avatar }}
          style={{ width: 150, height: 150, borderRadius: 75 }}
        />
      )}
      <Button
        title='העלאת תמונת פרופיל'
        onPress={() => setModalVisible(true)}
      />
      <Modal animationType='slide' transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.optionButton} onPress={pickImage}>
              <Text style={styles.optionText}>בחירה מתוך המדיה</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={takePhoto}>
              <Text style={styles.optionText}>צילום תמונה</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.optionText}>ביטול</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  optionButton: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'OpenSans',
  },
  spinnerText: {
    color: '#FFF',
  },
})

export default AvatarComponent
