import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { 
  getAuth, 
  initializeAuth, 
  getReactNativePersistence 
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBd4fQppD6VQMPGcD1v_9iZd7a0l3IPd_U",
  authDomain: "mateapiconnection.firebaseapp.com",
  projectId: "mateapiconnection",
  storageBucket: "mateapiconnection.appspot.com",
  messagingSenderId: "473194708391",
  appId: "1:473194708391:web:ae959a3cfb1c6b25a3ca82",
  databaseURL: "https://mateapiconnection-default-rtdb.firebaseio.com",
    //  measurementId: "G-QSF3HFPX15"
};

let app;
let auth;
let db;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} else {
  app = getApps()[0];
  auth = getAuth(app);
}


db = getFirestore(app);

export { app, auth, db };


