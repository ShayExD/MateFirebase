import { StyleSheet, Text, View, Alert,ActivityIndicator} from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import Theme from '../../../assets/styles/theme'
import { HorizontalScale, VerticalScale, windowHeight } from '../../utils'
import BackArrow from '../../components/BackArrow/backArrow'
import { TextInput, Button } from 'react-native-paper'
import ButtonLower from '../../components/ButtonLower/buttonLower'
import axios from 'axios'
import { AuthContext } from '../../../AuthContext'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { app } from '../../../firebase'

export default function Register({ navigation }) {
  // const [data, setData] = useState([])
    // const [emailError, setEmailError] = useState('')
  // const [passwordError, setPasswordError] = useState('')
    // const [showError, setShowError] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {loginUser, loggedInUser} = useContext(AuthContext)
  const [loading, setLoading] = useState(false); // State for loading status

  const [errorFirebase, setErrorFirebase] = useState('')

  // const emailRegex = /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/
  // const passwordRegex =
  //   /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]).{8,}$/

 // useEffect(() => {
  //   const validateEmail = () => {
  //     if (!emailRegex.test(email)) {
  //       setEmailError('Please enter a valid email address.')
  //     } else {
  //       setEmailError('')
  //     }
  //   }

  //   const validatePassword = () => {
  //     if (!passwordRegex.test(password)) {
  //       setPasswordError(
  //         'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.',
  //       )
  //     } else {
  //       setPasswordError('')
  //     }
  //   }

  //   validateEmail()
  //   validatePassword()
  // }, [email, password])

  // const handleRegister = async () => {
  //   setShowError(true)
  //   if (emailError != '' || passwordError != '') {
  //     return
  //   }
  //   try {
  //     const lowercaseEmail = email.toLowerCase() // Convert email to lowercase
  //     const response = await axios.post(
  //       `https://proj.ruppin.ac.il/cgroup72/test2/tar1/api/User/Register?email=${encodeURIComponent(
  //         lowercaseEmail,
  //       )}`,
  //       password.toString(),
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       },
  //     )
  //     // console.log('User registered successfully:', response.data);
  //     loginUser(response.data)
  //     // console.log(loggedInUser);
  //     Alert.alert(
  //       'Registration Successful',
  //       'You have successfully registered!',
  //       [
  //         {
  //           text: 'OK',
  //           onPress: () => {
  //             navigation.navigate('myTabs', { screen: 'EditProfile' })
  //           },
  //         },
  //       ],
  //     )
  //   } catch (error) {
  //     if (error.response) {
  //       Alert.alert(
  //         'Email already exists',
  //         'Please enter a different email address.',
  //       )
  //       setShowError(false)
  //       setEmail('')
  //       setPassword('')
  //     }
  //   }
  // }


  const handleSignUp = () => {
    const auth = getAuth(app);
    setLoading(true); 
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // console.log('signUp user', user);
        setErrorFirebase('');
  
        // Send a request to the server to add the user to the Firestore users collection
        axios
          .post(
            'https://us-central1-mateapiconnection.cloudfunctions.net/mateapi/createUser',
            {
              uid: user.uid, // Send the UID of the created user
              attributes: {
              email: email,
              password: password,
              },
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
          .then((response) => {
            console.log(response.data.userData)
            loginUser(response.data.userData)
            setErrorFirebase(false)
            setEmail('')
            setPassword('')
            Alert.alert(
              'Registration Successful', // Title of the alert
              'You have successfully registered!', // Default message if no message is returned from server
              [
                {
                  text: 'OK',
                  onPress: () => {
                    // Navigate only if necessary; otherwise, just close the alert
                    console.log('User creation acknowledged');
                    navigation.navigate('myTabs', { screen: 'EditProfile' }); // Uncomment if you actually want to navigate
                    // navigation.navigate( 'EditProfile'); // Uncomment if you actually want to navigate

                  },
                },
              ]
            );
            console.log('Success:', response.data.message); // Log success message
          })
          .catch((error) => {
            Alert.alert(
              'Error', // Title of the alert
              error.response?.data?.error || error.message, // Show detailed error if available
              [
                {
                  text: 'OK',
                  onPress: () => {
                    // Handle the alert dismissal
                    console.log('Error acknowledged');
                  },
                },
              ]
            );
            console.error('Error:', error); // Log the error for debugging
          }
        )
        .finally(() => {
          setLoading(false); // End loading regardless of success or failure
        });
      })
      .catch((error) => {
        const errorMessage = error.message;
        setErrorFirebase(errorMessage); // Set Firebase error message
        console.log('Firebase Auth Error:', error); 
        setLoading(false); // Log Firebase Auth error
      })
      
      
  };



  return (
      <View style={[Theme.screen, styles.screen]}>
        <BackArrow />
        <Text style={[Theme.primaryTitle, styles.title]}>הרשמה</Text>
        <Text style={[Theme.primaryText, styles.text]}>
          מלא את השדות הבאים על מנת להירשם
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
          <Text style={{ color: 'red' }}>{errorFirebase}</Text>
          {loading && (
            <ActivityIndicator
              size="small"
              color="#0000ff"
              style={styles.loader}
            />
          )}
        </View>
        <View style={styles.buttonContainer}>
          <ButtonLower
            textContent={'הירשם'}
            handlePress={handleSignUp}
          />
         
        </View>
        <Text style={Theme.primaryText}>
          {' '}
          כבר יש לך חשבון?{' '}
          <Text
            style={Theme.primaryColor}
            onPress={() => navigation.navigate('Login')}
          >
            כניסה לחשבון
          </Text>
        </Text>
      </View>
    );
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
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: VerticalScale(20),
    },
    loader: {
      alignItems: 'center',
      textAlign: 'center',

    },
  });