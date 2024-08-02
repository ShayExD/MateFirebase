import React, { useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { VerticalScale } from '../../utils'

const data = [
  { label: 'להלהלהל', value: '1' },
  { label: 'Item 2', value: '2' },
  { label: 'Item 3', value: '3' },
  { label: 'Item 4', value: '4' },
  { label: 'Item 5', value: '5' },
  { label: 'Item 6', value: '6' },
  { label: 'Item 7', value: '7' },
  { label: 'Item 8', value: '8' },
]

const DropDown = ({ header }) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)

  const handleDropdownPress = () => {
    setIsDropdownVisible(!isDropdownVisible)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.dropdown} onPress={handleDropdownPress}>
        <Text style={styles.selectedTextStyle}>{header}</Text>
        <FontAwesome
          name={isDropdownVisible ? 'angle-up' : 'angle-down'}
          size={20}
          color='#000'
        />
      </TouchableOpacity>
      {isDropdownVisible && (
        <ScrollView style={styles.dropdownContent} nestedScrollEnabled={true}>
          {data.map((item) => (
            <View key={item.value} style={styles.dropdownItem}>
              <Text style={styles.dropdownItemText}>{item.label}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  )
}

export default DropDown

const styles = StyleSheet.create({
  container: {
    marginBottom: VerticalScale(10),
    width: '80%',
  },
  dropdown: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 8,
    borderColor: '#ccc',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row-reverse', // כיוון מימין לשמאל
  },
  selectedTextStyle: {
    fontSize: 16,
    textAlign: 'right', // יישור לימין
    writingDirection: 'rtl', // כיוון כתיבה מימין לשמאל
  },
  dropdownContent: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 8,
    maxHeight: 150, 
    marginBottom: VerticalScale(20),
  },
  dropdownItem: {
    padding: 10,
    flexDirection: 'row-reverse', // כיוון מימין לשמאל עבור הפריטים
    justifyContent: 'flex-start', // יישור הפריטים לימין
  },
  dropdownItemText: {
    fontSize: 16,
    textAlign: 'right', // יישור לימין
    writingDirection: 'rtl', // כיוון כתיבה מימין לשמאל
  },
})
