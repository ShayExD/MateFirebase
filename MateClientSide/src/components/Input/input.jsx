import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native-paper';
import { VerticalScale, windowHeight } from '../../utils'



const Input = (props) => {

    

  return (
    <View>
    <TextInput
        label= {props.placeholder}
        value={props.value}
        onChangeText={props.setValue}
        style={styles.input}
        mode="outlined"
        secureTextEntry={props.secureTextEntry}
        activeOutlineColor='#E6824A'
        selectionColor='gray'
      />  
    </View>
  )
}

Input.defaultProps = {
    secureTextEntry: false,
  };

export default Input

const styles = StyleSheet.create({
    input: {
        marginBottom: VerticalScale(24),
        paddingHorizontal: 10,
      },
})