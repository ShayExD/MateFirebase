import { StyleSheet } from 'react-native'
import { windowHeight, windowWidth } from '../../src/utils'

const Theme = StyleSheet.create({
  backgroundWhite: {
    backgroundColor: 'white',
  },
  flex: {
    flex: 1,
  },
  flexGrow: {
    flexGrow: 1,
  },
  primaryText: {
    color: 'black',
    fontFamily: 'OpenSans',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: windowHeight * 0.0281,
    marginHorizontal: windowWidth * 0.1,
  },
  primaryTitle: {
    color: 'black',
    fontFamily: 'OpenSans-ExtraBold',
    fontSize: 20,
    textAlign: 'center',
  },
  primaryColor: {
    color: '#e6824a',
  },
  screen: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  errorMessage: {
    color: 'red',
    fontFamily: 'OpenSans',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: windowHeight * 0.0281,
    marginHorizontal: windowWidth * 0.1,
  },
})

export default Theme
