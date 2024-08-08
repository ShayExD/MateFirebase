import React, { useState, useContext, useEffect } from 'react'
import { StyleSheet, Text, View, ActivityIndicator, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Theme from '../../../assets/styles/theme'
import { VerticalScale, windowHeight, HorizontalScale } from '../../utils'
import BackArrow from '../../components/BackArrow/backArrow'
import { TextInput, Button } from 'react-native-paper'
import ButtonLower from '../../components/ButtonLower/buttonLower'
import axios from 'axios'
import { AuthContext } from '../../../AuthContext'
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { app } from '../../../firebase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { loginUser, loggedInUser } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const navigation = useNavigation()

  useEffect(() => {
    const auth = getAuth(app)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, fetch user data and navigate
        fetchUserData(user.uid)
      } else {
        // No user is signed in, stop loading
        setLoading(false)
      }
    })

    return () => unsubscribe() // Cleanup subscription on unmount
  }, [])

  const fetchUserData = (uid) => {
    axios.post(
      'https://us-central1-mateapiconnection.cloudfunctions.net/mateapi/loginUser',
      { uid },
      { headers: { 'Content-Type': 'application/json' } }
    )
      .then((response) => {
        const userData = response.data.userData
        loginUser(userData)
        resetNavigation()
      })
      .catch((error) => {
        console.error('Error fetching user data:', error)
        setLoading(false)
        Alert.alert(
          'Error',
          'Failed to fetch user data. Please try again.',
          [{ text: 'OK' }]
        )
      })
  }

  const resetNavigation = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'myTabs', params: { screen: 'Home' } }],
    })
  }

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(
        'Input Error',
        'Please enter both email and password',
        [{ text: 'OK' }]
      );
      return;
    }
  
    setLoading(true);
    const auth = getAuth(app);
  
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Login successful for user:', user.uid);
        fetchUserData(user.uid);
      })
      .catch((error) => {
        console.error('Authentication error:', error);
        console.log('Error code:', error.code);
        console.log('Error message:', error.message);
  
        let errorMessage = 'An error occurred during login. Please try again.';
        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage = 'No user found with this email address.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password. Please try again.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address format.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'This user account has been disabled.';
            break;
          case 'auth/operation-not-allowed':
            errorMessage = 'This login method is not allowed. Please contact support.';
            console.error('Email/password sign-in is not enabled in Firebase console.');
            break;
          // Add more cases as needed
        }
  
        Alert.alert(
          'Authentication Error',
          errorMessage,
          [{ text: 'OK', onPress: () => console.log('Auth error acknowledged') }]
        );
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <View style={[Theme.screen, styles.screen, styles.centerContent]}>
        <ActivityIndicator size="large" color="#E6824A" />
      </View>
    )
  }

  return (
    <View style={[Theme.screen, styles.screen]}>
      <BackArrow />
      <Text style={[Theme.primaryTitle, styles.title]}>התחברות</Text>
      <Text style={[Theme.primaryText, styles.text]}>אנא הרשם לאפליקציה על מנת להתחיל להכיר מטיילים</Text>
      <View style={styles.inputsContainer}>
        <TextInput
          label="אימייל"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          mode="outlined"
          activeOutlineColor='#E6824A'
          selectionColor='gray'
          textAlign='right'
        />  
        <TextInput
          label="סיסמה"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          mode="outlined"
          secureTextEntry
          activeOutlineColor='#E6824A'
          selectionColor='gray'
          textAlign='right'
        />
      </View>
      <Text style={Theme.primaryText}> עדיין אין לך חשבון? <Text style={Theme.primaryColor} onPress={() => navigation.navigate('Register')}>להרשמה</Text></Text>
      <ButtonLower textContent="התחבר" handlePress={handleLogin} />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
  },
  centerContent: {
    justifyContent: 'center',
  },
  title: {
    marginTop: windowHeight * 0.175,
    marginBottom: windowHeight * 0.0174
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
})