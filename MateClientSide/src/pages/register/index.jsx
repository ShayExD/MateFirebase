import { StyleSheet, Text, View,Alert } from 'react-native'
import React,{useState,useContext,useEffect} from 'react'
import Theme from '../../../assets/styles/theme'
import { HorizontalScale, VerticalScale, windowHeight } from '../../utils'
import BackArrow from '../../components/BackArrow/backArrow'
import { TextInput, Button } from 'react-native-paper';
import ButtonLower from '../../components/ButtonLower/buttonLower'
import axios from 'axios';
import { AuthContext } from '../../../AuthContext'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from '../../../firebase'

export default function Register({navigation}) {
  const [data, setData] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { loginUser,loggedInUser } = useContext(AuthContext);
  const [showError,setShowError] = useState(false);

  const emailRegex = /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]).{8,}$/;


  const handleSignUp = () =>{
    const auth = getAuth(app);
    createUserWithEmailAndPassword(auth,email,password)
    .then((userCredential)=>{
        const user = userCredential.user;
        console.log("signUp user",user);
    })
    .catch((error)=>{
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("ERROR",error)
    });

    }



  useEffect(() => {
    const validateEmail = () => {
      if (!emailRegex.test(email)) {
        setEmailError('Please enter a valid email address.');
      } else {
        setEmailError('');
      }
    };

    const validatePassword = () => {
      if (!passwordRegex.test(password)) {
        setPasswordError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.');
      } else {
        setPasswordError('');
      }
    };

    validateEmail();
    validatePassword();
  }, [email, password]);

  const handleRegister = async () => {
    setShowError(true);
    if (emailError != '' || passwordError != '') {
      return;
    }
    try {
      const lowercaseEmail = email.toLowerCase(); // Convert email to lowercase
      const response = await axios.post(
        `https://proj.ruppin.ac.il/cgroup72/test2/tar1/api/User/Register?email=${encodeURIComponent(lowercaseEmail)}`,
        password.toString(),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      // console.log('User registered successfully:', response.data);
      loginUser(response.data);
      // console.log(loggedInUser);
      Alert.alert(
        'Registration Successful',
        'You have successfully registered!',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('myTabs', { screen: 'EditProfile' });
            },
          },
        ]
      );
    } catch (error) {
      if (error.response) {
        Alert.alert('Email already exists', 'Please enter a different email address.');
        setShowError(false);
        setEmail('');
        setPassword('');
      }
    }
  };



  return (
    <View style={[Theme.screen,styles.screen]}>
      <BackArrow/>
      <Text style={[Theme.primaryTitle,styles.title]}>הרשמה</Text>
      <Text  style={[Theme.primaryText,styles.text]}>מלא את השדות הבאים על מנת להירשם</Text>
      <View style={styles.inputsContainer}>
        {showError&&emailError!='' ?  <Text style={{color:'red'}}>{emailError}</Text> : null}

      <TextInput
        label= {"אימייל"}
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        mode="outlined"
        activeOutlineColor='#E6824A'
        selectionColor='gray'
        textAlign='right'
      />  
       <TextInput
        label= {"סיסמה"}
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        mode="outlined"
        secureTextEntry
        activeOutlineColor='#E6824A'
        selectionColor='gray'
        textAlign='right'
        />
        {showError&&passwordError!='' ?  <Text style={{color:'red'}}>{passwordError}</Text> : null}

      </View>
      <ButtonLower textContent={"הירשם"} handlePress={handleSignUp}/>
      <Text style={Theme.primaryText}> כבר יש לך חשבון? <Text style={Theme.primaryColor} onPress={()=>navigation.navigate('Login')}>כניסה לחשבון</Text></Text>
     
    </View>
  )
}

const styles = StyleSheet.create({
screen:{
alignItems:'center',
},
title:{
marginTop:windowHeight*0.175,
marginBottom:windowHeight*0.0174

},
inputsContainer:{
marginTop:VerticalScale(44),
width:'90%',

},
text:{
color:'gray',
marginHorizontal:0,
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