
import {windowWidth,windowHeight} from '../../utils'
import React, {useEffect,useState } from 'react';
import { StyleSheet,Image,Dimensions ,View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Theme from '../../../assets/styles/theme';
import axios from 'axios';
import * as Font from 'expo-font';
export default function Splash({navigation}) {






    const [loadFont,setLoadFont]= useState(false)
    const [loadCountries,setLoadCountries]= useState(false)

    useEffect(() => {

      const fetchCountries = async () => {
        try {
          // Check if the country data is already stored in Async Storage
          const storedCountryData = await AsyncStorage.getItem('countryData');
          // console.log(storedCountryData);
          if (storedCountryData) {
            setLoadCountries(true)

            // If data is already stored, don't fetch again
            return;
          }
  
          const config = {
            method: 'get',
            url: 'https://api.countrystatecity.in/v1/countries',
            headers: {
              'X-CSCAPI-KEY': 'RHRXUkhPTXl1aUlKTEk5WlFua1lwR01xVDE2b3U3R2NCUndPM01hTg==',
            },
          };
  
          const response = await axios(config);
          const count = Object.keys(response.data).length;
          const countryArray = [];
  
          for (let i = 0; i < count; i++) {
            countryArray.push({
              value: response.data[i].name,
              label: response.data[i].name,
            });
          }
  
          // Store the country data in Async Storage
          await AsyncStorage.setItem('countryData', JSON.stringify(countryArray));
          setLoadCountries(true)
        } catch (error) {
          // console.log(error);
        }
      };
  
      fetchCountries();
    }, []);
    useEffect(() => {

        async function loadFonts() {
        try{
        await Font.loadAsync({
          'OpenSans-Bold': require('../../../assets/fonts/OpenSans-Bold.ttf'),
          'OpenSans': require('../../../assets/fonts/OpenSans-Regular.ttf'),
          'OpenSans-ExtraBold': require('../../../assets/fonts/OpenSans-Bold.ttf'),

        });
        setLoadFont(true);
      }
      catch(error){
        console.error('Error loading fonts:', error);
      }
      }
      loadFonts();
      }, []);
   
   
       useEffect(()=>{
         if(loadFont&&loadCountries){
            setTimeout(() => {
                navigation.navigate('Intro');
            }, 4000);
          }
        },[loadFont,loadCountries]);

           
   return (
      <View style={[Theme.screen,styles.screen]}>
       <Image
       source={{uri:"https://proj.ruppin.ac.il/cgroup72/test2/tar1/images/logo.png"}}
       resizeMode="contain"
       style = {styles.image}/>
       </View>
        )
}


const styles = StyleSheet.create({
screen:
{

    justifyContent: 'center',
    alignItems:'center',
},
image:
{
        width:  windowWidth,
        height: windowHeight*0.56
},
});