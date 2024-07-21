import { StyleSheet, Image, Text, View } from 'react-native'
import React from 'react'
import { windowHeight, windowWidth } from '../../utils'
import Theme from '../../../assets/styles/theme'
import ButtonLower from '../../components/ButtonLower/buttonLower'

export default function ComingSoon({ navigation }) {
  return (
    <View style={[Theme.screen, styles.screen]}>
      <View style={styles.DivComingSoon}>
        <Image
          source={require('../../../assets/images/comingSoon.png')}
          style={styles.ComingSoon}
          resizeMode='contain'
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  DivComingSoon: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: windowHeight * 0.25,
  },
  ComingSoon: {
    width: windowWidth * 0.759,
    height: windowHeight * 0.254,
    // marginTop:windowHeight*0.1,
  },
})