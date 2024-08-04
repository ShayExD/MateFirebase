import { StyleSheet, Image, Text, View, ScrollView } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import DatePicker from '../../components/DatePicker/datePicker'
import MultiSelectDropdown from '../../components/MultiSelectDropdown/multiSelectDropdown'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ButtonLower from '../../components/ButtonLower/buttonLower'
import DateRangePicker from '../../components/DateRangePicker/DateRangePicker'
import { interests } from '../../utils'
import UploadImage from '../../components/UploadImage/uploadImage'
import { AuthContext } from '../../../AuthContext'

import { TextInput } from 'react-native-paper'
import {
  HorizontalScale,
  VerticalScale,
  windowHeight,
  windowWidth,
} from '../../utils'
import Theme from '../../../assets/styles/theme'
export default function CreateTrip({ navigation }) {
  const [tripName, setTripName] = useState('')
  const [tripImg, setTripImg] = useState('')
  const [numOfPeople, setNumOfPeople] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedInterests, setSelectedInterests] = useState([])
  const [countryData, setCountryData] = useState([])
  const [destination, setDestination] = useState([])
  const [tripPhoto, setTripPhoto] = useState([])
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
    console.log('Trip Name:', tripName)
    console.log('Number of People:', numOfPeople)
    console.log('Start Date:', startDate)
    console.log('End Date:', endDate)
    console.log('Selected Interests:', selectedInterests)
    console.log('destination:', destination)
    console.log('הטיול נוצר')
  }
  return (
    <ScrollView
      contentContainerStyle={[styles.screen]}
      showsVerticalScrollIndicator={false}
    >
      <UploadImage />
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
      />
      <TextInput
        label='מספר אנשים'
        value={numOfPeople}
        onChangeText={setNumOfPeople}
        style={[styles.input, { textAlign: 'right' }]}
        mode='outlined'
        keyboardType='phone-pad'
        activeOutlineColor='#E6824A'
        selectionColor='gray'
      />
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />
      <MultiSelectDropdown
        data={interests}
        title={'בחירת תחומי עניין בטיול'}
        onSelectionsChange={handleSelectedInterests}
        selectedItems={selectedInterests}
      ></MultiSelectDropdown>
      <MultiSelectDropdown
        data={countryData}
        title={'בחירת יעדים'}
        onSelectionsChange={handleSelectedDestinations}
        selectedItems={destination}
      ></MultiSelectDropdown>
      <ButtonLower textContent={'יצירת הטיול'} handlePress={createTrip} />
    </ScrollView>
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
})
