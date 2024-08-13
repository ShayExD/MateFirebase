import React, { useState, useContext, useEffect } from 'react'
import { useFocusEffect } from '@react-navigation/native'

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
import Theme from '../../../assets/styles/theme'
import axios from 'axios'
import * as Permissions from 'expo-permissions'
import { Camera } from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'
import Spinner from 'react-native-loading-spinner-overlay'
import {
  HorizontalScale,
  VerticalScale,
  windowHeight,
  windowWidth,
} from '../../utils'

const UploadImage = ({ setuUploadImage, uploadImage }) => {
  // const { loggedInUser, setLoggedInUser } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false)
  const [tripPhoto, setTripPhoto] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [avatar, setAvatar] = useState(
    tripPhoto !== ''
      ? tripPhoto
      : 'https://proj.ruppin.ac.il/cgroup72/test2/tar1/images/TripImage_%D7%91%D7%93%D7%99%D7%A7%D7%94%20%D7%91%D7%91%D7%95%D7%93%D7%A4%D7%A9%D7%98_e2o7id.jpg',
  )

  useFocusEffect(
    React.useCallback(() => {
      setTripPhoto('')
    }, []),
  )

  useEffect(() => {
    if (tripPhoto === '') {
      setAvatar(
        'https://proj.ruppin.ac.il/cgroup72/test2/tar1/images/TripImage_%D7%91%D7%93%D7%99%D7%A7%D7%94%20%D7%91%D7%91%D7%95%D7%93%D7%A4%D7%A9%D7%98_e2o7id.jpg',
      )
    } else {
      setAvatar(tripPhoto)
    }
  }, [tripPhoto])

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
      setTripPhoto(result.assets[0].uri)
      uploadImage(result.assets[0].uri)
      setuUploadImage(result.assets[0].uri)
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
      setuUploadImage(result.assets[0].uri)
      // uploadImage(result.assets[0].uri)
    }
  }

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      {avatar && (
        <Image
          source={{ uri: avatar }}
          style={{
            width: windowWidth * 0.65,
            height: windowHeight * 0.2,
            borderRadius: 30,
            marginBottom: windowHeight * 0.0234,
            marginTop: windowHeight * 0.1,
          }}
        />
      )}
      <Button title=' העלאת תמונה ' onPress={() => {
        setModalVisible(true)
      }} />
      
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

export default UploadImage
