import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { VerticalScale } from '../../utils'
import Theme from '../../../assets/styles/theme'
const GenderPicker = ({ selectedGender, onGenderChange }) => {
  const [modalVisible, setModalVisible] = useState(false)

  const genders = ['גבר', 'אישה', 'אחר']

  const openPicker = () => {
    setModalVisible(true)
  }

  const closePicker = () => {
    setModalVisible(false)
  }

  

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.touchableArea} onPress={openPicker}>
        <Text style={styles.selectedGender}>
          {selectedGender
            ? `${selectedGender}`
            : 'בחר מין'}
        </Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType='slide' transparent>
        <View style={styles.modalContainer}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedGender}
              onValueChange={(itemValue) => {
                onGenderChange(itemValue)
                closePicker()
              }}
            >
              {genders.map((gender) => (
                <Picker.Item key={gender} label={gender} value={gender} />
              ))}
            </Picker>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={closePicker}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: VerticalScale(24),

  },
  touchableArea: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: 'black',
    paddingHorizontal: 10,
    textAlign: 'left',
    direction: 'rtl',
  },
  selectedGender: {
    fontFamily:Theme.primaryText.fontFamily,
    fontSize: 16,
    textAlign: 'center', // Center the text horizontally
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  closeButton: {
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center', // Center the content horizontally
  },
  closeButtonText: {
    marginBottom: 10,
    fontSize: 18,
    color: 'blue',
    textAlign: 'center', // Center the text horizontally
  },
})

export default GenderPicker
