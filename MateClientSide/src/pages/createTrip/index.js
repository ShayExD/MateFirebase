import {
  StyleSheet,
  Image,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  keyboardVerticalOffset,
  Platform,Keyboard
} from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import DatePicker from '../../components/DatePicker/datePicker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ButtonLower from '../../components/ButtonLower/buttonLower'
import DateRangePicker from '../../components/DateRangePicker/DateRangePicker'
import { interests } from '../../utils'
import UploadImage from '../../components/UploadImage/uploadImage'
import { AuthContext } from '../../../AuthContext'
import DropdownComponent from '../../components/DropdownCountryCityComponents/dropdownCountryCityComponents'
import axios from 'axios'
import MultiSelectDropdownReset from '../../components/MultiSelectDropdownReset/multiSelectDropdownReset'
import { TextInput } from 'react-native-paper'
import {
  HorizontalScale,
  VerticalScale,
  windowHeight,
  windowWidth,
} from '../../utils'
import Theme from '../../../assets/styles/theme'
export default function CreateTrip({ navigation }) {
  const { loginUser, loggedInUser, setLoggedInUser, logoutUser } =
    useContext(AuthContext)

  const [tripName, setTripName] = useState('')
  const [aboutTrip, setAboutTrip] = useState('')
  const [tripImg, setTripImg] = useState('')
  const [numOfPeople, setNumOfPeople] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedInterests, setSelectedInterests] = useState([])
  const [countryData, setCountryData] = useState([])
  const [destination, setDestination] = useState([])
  const [tripPhoto, setTripPhoto] = useState('')
  const [isImageUpload, setIsImageUpload] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resetDropdowns, setResetDropdowns] = useState(false) // Add this state

  useEffect(() => {
    const fetchData = async () => {
      const storedCountryData = await AsyncStorage.getItem('countryData')
      setCountryData(JSON.parse(storedCountryData))
    }
    fetchData()
  }, [])
  const handleSelectedInterests = (selectedItems) => {
    setSelectedInterests(selectedItems)
    // console.log(selectedInterests)
  }

  const handleSelectedDestinations = (selectedItems) => {
    setDestination(selectedItems)
    // console.log(destination)
  }

  const resetFields = async () => {
    setTripName('')
    setAboutTrip('')
    setTripImg('')
    setTripPhoto('')
    setNumOfPeople('')
    setStartDate('')
    setEndDate('')
    setSelectedInterests([])
    setDestination([])
    setResetDropdowns((prev) => !prev) // Trigger a re-render for dropdowns
    console.log('Reset fields called')
  }

  const logAllFields = () => {
    const fields = {
      tripName,
      aboutTrip,
      tripImg,
      numOfPeople,
      startDate,
      endDate,
      selectedInterests,
      destination,
    }

    console.log('Field Values:', fields)
  }

  const validateFields = () => {
    logAllFields()
    if (
      tripName === '' ||
      aboutTrip === '' ||
      tripImg === '' ||
      numOfPeople === '' ||
      numOfPeople > 30 ||
      startDate === '' ||
      endDate === '' ||
      selectedInterests.length === 0 ||
      destination.length === 0
    ) {
      return false
    }
    return true
  }

  const uploadImage = async (uri) => {
    try {
      const formData = new FormData()
      const randomKey = Math.random().toString(36).substring(7)
      formData.append('files', {
        uri,
        name: `TripImage_${tripName}_${randomKey}.jpg`,
        type: 'image/jpeg',
      })
      const response = await axios.post(
        'https://proj.ruppin.ac.il/cgroup72/test2/tar1/api/Upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )

      // console.log('Upload successful:', response.data)
      if (Array.isArray(response.data) && response.data.length > 0) {
        const uploadedFileName = response.data[0]
        const uploadedImageURI = `https://proj.ruppin.ac.il/cgroup72/test2/tar1/images/${uploadedFileName}`
        setTripImg(uploadedImageURI)
        setIsImageUpload(true)
      }
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      // setIsLoading(false)
    }
  }
  const createTrip = async () => {
    setLoading(true)
    if (!validateFields()) {
      setLoading(false)
      Alert.alert(
        'Error',
        'Please fill out all fields before creating the trip and enter correct values.',
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('Validation error acknowledged')
            },
          },
        ],
      )
      return
    }
    try {
      const tripData = {
        tripName,
        aboutTrip,
        tripPictureUrl: tripImg,
        limitUsers: parseInt(numOfPeople),
        startDate,
        endDate,
        tripInterests: selectedInterests,
        destinations: destination,
        manageByUid: loggedInUser.uid,
        joinedUsers: [loggedInUser],
      }
      // console.log(tripData)
      const response = await axios.post(
        'https://us-central1-mateapiconnection.cloudfunctions.net/mateapi/createTrip',
        tripData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      setLoading(false)
      Alert.alert('Trip Created Successfully', 'Your trip has been created!', [
        {
          text: 'OK',
          onPress: () => {
            console.log('Trip creation acknowledged')
            navigation.navigate('myTabs', { screen: 'Home' })
          },
        },
      ])
      await resetFields()
      console.log('Success:', response.data.message)
    } catch (error) {
      setLoading(false)
      Alert.alert('Error', error.response?.data?.error || error.message, [
        {
          text: 'OK',
          onPress: () => {
            console.log('Error acknowledged')
          },
        },
      ])
      console.error('Error:', error)
    }
  }
  return (
    <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={10} // Adjust this offset if needed
    >
    <ScrollView
      contentContainerStyle={[styles.screen]}
      showsVerticalScrollIndicator={false}
    >
      <UploadImage setuUploadImage={setTripPhoto} uploadImage={uploadImage} />
      {/* <Image
        source={require('../../../assets/images/IntroImage.png')}
        resizeMode='cover'
        style={styles.image}
      /> */}
      <TextInput
        label={'שם הטיול'}
        value={tripName}
        onChangeText={setTripName}
        style={[styles.input, { textAlign: 'right' }]}
        mode='outlined'
        activeOutlineColor='#E6824A'
        selectionColor='gray'
        maxLength={100} // הגבלת מספר האותיות
      />
      <TextInput
        label={'תאור הטיול'}
        value={aboutTrip}
        onChangeText={setAboutTrip}
        maxLength={200} // הגבלת מספר האותיות
        style={[
          styles.input,
          { textAlign: 'right', height: VerticalScale(100) },
        ]}
        mode='outlined'
        activeOutlineColor='#E6824A'
        selectionColor='gray'
        multiline // תכונה זו מאפשרת לטקסט לרדת שורה אוטומטית
        numberOfLines={4}
      />
      <TextInput
        label='מספר אנשים (מוגבל עד 30)'
        value={numOfPeople}
        onChangeText={setNumOfPeople}
        style={[styles.input, { textAlign: 'right' }]}
        mode='outlined'
        keyboardType='phone-pad'
        activeOutlineColor={numOfPeople > 30 ? 'red' : '#E6824A'}
        selectionColor='gray'
      />
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />
      <MultiSelectDropdownReset
        data={interests}
        title={'בחירת תחומי עניין בטיול'}
        onSelectionsChange={handleSelectedInterests}
        selectedItems={selectedInterests}
        reset={resetDropdowns}
      ></MultiSelectDropdownReset>
      <MultiSelectDropdownReset
        data={countryData}
        title={'בחירת יעדים'}
        onSelectionsChange={handleSelectedDestinations}
        selectedItems={destination}
        reset={resetDropdowns}
      ></MultiSelectDropdownReset>
      {loading && (
        <ActivityIndicator size='small' color='#0000ff' style={styles.loader} />
      )}
      <ButtonLower textContent={'יצירת הטיול'} handlePress={createTrip} />
    </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: '1',
    width: '100%',
    marginVertical: 30,
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'pink',
    width: '90%',
    alignItems: 'center',
  },
  image: {
    width: windowWidth * 0.65,
    height: windowHeight * 0.2,
    borderRadius: 30,
    marginBottom: windowHeight * 0.0234,
    marginTop: windowHeight * 0.1,
  },
  input: {
    width: '90%',
    marginBottom: VerticalScale(24),
    direction: 'rtl',
    textAlign: 'right',
    fontFamily: Theme.primaryText.fontFamily,
  },
  loader: {
    alignItems: 'center',
    textAlign: 'center',
  },
})
