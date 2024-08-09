import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Button,
  Image,
  Linking,
  StyleSheet,
  Pressable,
} from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { VerticalScale } from '../../utils'
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
} from 'expo-location'
import Theme from '../../../assets/styles/theme'
import Fontisto from 'react-native-vector-icons/Fontisto'
import Spinner from 'react-native-loading-spinner-overlay'

const MapPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [location, setLocation] = useState(null)
  const [hotels, setHotels] = useState([])
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [selectedHotelPhoto, setSelectedHotelPhoto] = useState(null)
  const [visible, SetVisible] = useState(true)
  const GOOGLE_PLACES_API_KEY = 'AIzaSyDcsjFGoylFJsjZNk5w0nWygHg1JWsyifE'
  const getLocation = async () => {
    try {
      // Request permission to access the device's location
      const { status } = await requestForegroundPermissionsAsync()

      if (status !== 'granted') {
        console.log('Permission to access location was denied')
        return
      }

      // Get the current position
      const { coords } = await getCurrentPositionAsync({})
      setLocation(coords)
    } catch (error) {
      console.error('Error getting location:', error)
    }
  }

  const handleMarkerPress = async (place) => {
    try {
      setSelectedHotel(place)
      if (place.photos && place.photos.length > 0) {
        // Get the first photo for the place
        const photoReference = place.photos[0].photo_reference
        const photoUrl = await getPhotoUrl(photoReference)
        setSelectedHotelPhoto(photoUrl)
      } else {
        setSelectedHotelPhoto(null)
      }
    } catch (error) {
      console.error('Error getting hotel photo:', error)
    } finally {
      SetVisible(true)
    }
  }

  const getPhotoUrl = async (photoReference) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`,
    )
    if (!response.ok) {
      throw new Error('Failed to fetch hotel photo')
    }
    return response.url
  }

  const navigateToHotel = () => {
    if (
      selectedHotel &&
      selectedHotel.geometry &&
      selectedHotel.geometry.location
    ) {
      const { lat, lng } = selectedHotel.geometry.location
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
      Linking.openURL(url)
    }
  }

  const searchNearbyHotels = async () => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.latitude},${location.longitude}&radius=5000&type=lodging&key=${GOOGLE_PLACES_API_KEY}`,
      )

      if (!response.ok) {
        throw new Error('Failed to fetch nearby hotels')
      }

      const data = await response.json()
      setHotels(data.results)
    } catch (error) {
      console.error('Error searching nearby hotels:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (location) {
      searchNearbyHotels()
    }
  }, [location])

  useEffect(() => {
    // Fetch the user's location when the component mounts
    getLocation()
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <Spinner
        visible={isLoading}
        textContent={'Loading...'}
        textStyle={styles.spinnerText}
        overlayColor='rgba(0, 0, 0, 0.6)'
      />
      {location ? (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title='Your Location'
            pinColor='green' // Set the color of the pin for the user's location
          />
          {hotels.map((hotel, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: hotel.geometry.location.lat,
                longitude: hotel.geometry.location.lng,
              }}
              title={hotel.name}
              onPress={() => handleMarkerPress(hotel)}
              pinColor='blue'
            />
          ))}
        </MapView>
      ) : (
        <Text style={{ justifyContent: 'center' }}>Loading location...</Text>
      )}

      {visible && selectedHotel && (
        <View
          style={{
            alignItems: 'center',
            backgroundColor: 'white',
            padding: 20,
          }}
          accessibilityElementsHidden={visible}
        >
          <Pressable
            style={[styles.icon, { right: '5%', left: 'auto' }]}
            onPress={() => {
              SetVisible(false)
            }}
          >
            <Fontisto name='close' size={30} color='#46A2FF' />
          </Pressable>

          <Pressable style={[styles.icon]} onPress={navigateToHotel}>
            <Fontisto name='navigate' size={30} color='#46A2FF' />
            <Text
              style={[Theme.primaryText, { marginHorizontal: 0, fontSize: 14 }]}
            >
              ניווט
            </Text>
          </Pressable>

          {selectedHotel.name && (
            <Text
              style={[Theme.primaryTitle, { marginTop: VerticalScale(40) }]}
            >
              {selectedHotel.name}
            </Text>
          )}
          {selectedHotelPhoto && (
            <Image
              source={{ uri: selectedHotelPhoto }}
              style={{
                width: '80%',
                height: 200,
                marginTop: 20,
                borderRadius: 20,
              }}
              resizeMode='cover'
            />
          )}
          {selectedHotel.rating && (
            <Text style={Theme.primaryText}>
              Rating: {selectedHotel.rating}
            </Text>
          )}
          {selectedHotel.vicinity && (
            <Text style={Theme.primaryText}>
              Address: {selectedHotel.vicinity}
            </Text>
          )}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  spinnerText: {
    color: '#FFF',
  },
  icon: {
    position: 'absolute',
    left: '5%',
    top: VerticalScale(15),
    // backgroundColor: 'red',
    textAlign: 'center',
    alignItems: 'center',
  },
})

export default MapPage
