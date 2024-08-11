import { StyleSheet,Image, Text, View } from 'react-native'
import React from 'react'
import { windowHeight, windowWidth } from '../../utils';
import Theme from '../../../assets/styles/theme';
import ButtonLower from '../../components/ButtonLower/buttonLower';

export default function Intro({navigation}) {
  return (
    <View style={[Theme.screen,styles.screen]}>
    <View>
      <Image
       source={{uri:"https://proj.ruppin.ac.il/cgroup72/test2/tar1/images/IntroImage.png"}}
       resizeMode="contain"
       style = {styles.image}/>
       </View>
       <Text style={[Theme.primaryTitle,styles.title]}>
       <Text style={styles.span}> אנשים מרתקים </Text>מחכים להכיר אותך, בכל פינה של העולם.
       </Text>
       <Text style={Theme.primaryText}>העולם מלא באנשים מרתקים, ותמיד מחפשים חברים חדשים, חוויות משותפות והזדמנויות חדשות. טיול גדול הוא הזדמנות נהדרת לפגוש אנשים מכל העולם, ללמוד על תרבויות שונות וליצור קשרים חדשים.</Text>
       <ButtonLower textContent={"מתחילים לטייל ביחד"} handlePress={()=>{navigation.navigate('Login')}}/>
    </View>
  )
}

const styles = StyleSheet.create({
    screen:{
        justifyContent: 'flex-start',
        alignItems:'center',
        
    },
    image:{
        width:windowWidth,
        height:windowHeight*0.67,
        top: windowHeight*-0.079,
        borderRadius: 30,
        // marginBottom:windowHeight*0.0234
    },

    title:{
        marginTop:windowHeight*-0.079,
        marginHorizontal:windowWidth*0.100,
        textAlign:'center',
        lineHeight:windowHeight*0.0422,
        marginBottom:windowHeight*0.0234
    },
    span:{
        color:'#e6824a'
    }
})




