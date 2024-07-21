// Import the functions you need from the SDKs you need
// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth,initializeAuth,getReactNativePersistence  } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
const firebaseConfig = {
  apiKey: "AIzaSyCJDHSB1JrXvJGqYotX2vGKemnyer2CMrM",
  authDomain: "mate-ae891.firebaseapp.com",
  databaseURL: "https://mate-ae891-default-rtdb.firebaseio.com",
  projectId: "mate-ae891",
  storageBucket: "mate-ae891.appspot.com",
  messagingSenderId: "521732835791",
  appId: "1:521732835791:web:00216b6e6cbf095a962aba",
  measurementId: "G-QSF3HFPX15"
};



// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };


