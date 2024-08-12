import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { useState, useContext } from 'react'
import Theme from '../../../assets/styles/theme'
import { VerticalScale, windowHeight, HorizontalScale } from '../../utils'
import BackArrow from '../../components/BackArrow/backArrow'
import { TextInput, Button } from 'react-native-paper'
import Input from '../../components/Input/input'
import ButtonLower from '../../components/ButtonLower/buttonLower'
import axios from 'axios'
import { AuthContext } from '../../../AuthContext'
import { Alert } from 'react-native'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { app } from '../../../firebase'

export default function Login({ navigation }) {
  const [data, setData] = useState([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { loginUser, loggedInUser } = useContext(AuthContext)
  const [loading, setLoading] = useState(false) // State for loading status

  const handleLogin = () => {
    const auth = getAuth(app)
    setLoading(true) // Start loading indicator

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user
        console.log('Login user', user.uid)

        // Send a request to the server to fetch the user data from Firestore
        axios
          .post(
            'https://us-central1-mateapiconnection.cloudfunctions.net/mateapi/loginUser',
            {
              uid: user.uid, // Send the UID of the logged-in user
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
          .then((response) => {
            const userData = response.data.userData
            console.log('User data from Firestore:', userData)

            loginUser(userData) // Log in the user using the context or appropriate method

            Alert.alert(
              'Login Successful',
              'You have successfully logged in!',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    // Navigate to the desired screen
                    navigation.navigate('myTabs', { screen: 'Home' })
                  },
                },
              ],
            )
            setEmail('')
            setPassword('')
            setLoading(false) // End loading on success
          })
          .catch((error) => {
            console.error('Error fetching user data:', error)

            Alert.alert(
              'Login Error',
              error.response?.data?.error || error.message,
              [
                {
                  text: 'OK',
                  onPress: () => {
                    console.log('Error acknowledged')
                  },
                },
              ],
            )

            setLoading(false) // End loading on error
          })
      })
      .catch((error) => {
        const errorMessage = error.message
        // console.error('Firebase Auth Error:', errorMessage);

        Alert.alert('Authentication Error', 'User not exists', [
          {
            text: 'OK',
            onPress: () => {
              console.log('Auth error acknowledged')
            },
          },
        ])

        setLoading(false) // End loading on Firebase Auth error
      })
  }

  // const handleLogin = async () => {
  //   try {
  //     const lowercaseEmail = email.toLowerCase(); // Convert email to lowercase
  //     const response = await axios.post(
  //       `https://proj.ruppin.ac.il/cgroup72/test2/tar1/api/User/Login?email=${encodeURIComponent(lowercaseEmail)}`,
  //       password.toString(),
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );
  //     loginUser(response.data);
  //     navigation.navigate("myTabs");
  //     // console.log(loggedInUser);
  //     // console.log('User logged in successfully:', response.data);
  //   } catch (error) {
  //     if (error.response) {
  //       Alert.alert(
  //         'Incorrect Details',
  //         'Please enter the correct email and password.',
  //         [{ text: 'OK' }],
  //         { cancelable: false }
  //       );

  //     }
  //   }
  //   finally{
  //     setEmail('');
  //     setPassword('');
  //   }
  // };

  return (
    <View style={[Theme.screen, styles.screen]}>
      <BackArrow />
      <Text style={[Theme.primaryTitle, styles.title]}>התחברות</Text>
      <Text style={[Theme.primaryText, styles.text]}>
        אנא הרשם לאפליקציה על מנת להתחיל להכיר מטיילים
      </Text>
      <View style={styles.inputsContainer}>
        <TextInput
          label={'אימייל'}
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          mode='outlined'
          activeOutlineColor='#E6824A'
          selectionColor='gray'
          textAlign='right'
        />
        <TextInput
          label={'סיסמה'}
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          mode='outlined'
          secureTextEntry
          activeOutlineColor='#E6824A'
          selectionColor='gray'
          textAlign='right'
        />
      </View>
      <Text style={Theme.primaryText}>
        {' '}
        עדיין אין לך חשבון?{' '}
        <Text
          style={Theme.primaryColor}
          onPress={() => navigation.navigate('Register')}
        >
          להרשמה
        </Text>
      </Text>
      {loading && (
        <ActivityIndicator size='small' color='#0000ff' style={styles.loader} />
      )}
      <ButtonLower textContent={'התחבר'} handlePress={handleLogin} />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
  },
  title: {
    marginTop: windowHeight * 0.175,
    marginBottom: windowHeight * 0.0174,
  },
  inputsContainer: {
    marginTop: VerticalScale(44),
    width: '90%',
  },
  text: {
    color: 'gray',
    marginHorizontal: 0,
  },
  input: {
    marginBottom: VerticalScale(24),
    paddingHorizontal: 10,
    textAlign: 'left',
    direction: 'rtl',
  },
  button: {
    marginTop: 10,
  },
  loader: {
    alignItems: 'center',
    textAlign: 'center',
  },
})
