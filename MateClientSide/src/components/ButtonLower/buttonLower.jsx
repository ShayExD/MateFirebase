import React from 'react';
import {StyleSheet,Pressable,Text,View ,Dimensions} from 'react-native';
import Theme from '../../../assets/styles/theme';
import { windowHeight, windowWidth } from '../../utils';

const ButtonLower = ({textContent,handlePress}) =>{  

return(
<View style={styles.containerButtonLower}>
<Pressable onPress={handlePress} style={styles.Lower}>
 <Text style={styles.text}>{textContent}</Text>
</Pressable>
</View> 
)
}

const styles = StyleSheet.create({
Lower:{
position:'relative',
borderRadius: 10,
},
containerButtonLower:{
width:windowWidth*0.85,
backgroundColor:'#e6824a',
borderRadius: 10,
marginVertical:windowHeight*0.0500

},
text:{
    color:'white',
    fontFamily:'OpenSans-ExtraBold',
    fontSize:16,
    textAlign:'center',
    paddingVertical:windowHeight*0.020
}

})

export default ButtonLower;
