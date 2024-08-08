import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-paper';
import { HorizontalScale, VerticalScale } from '../../utils';
import { AuthContext } from '../../../AuthContext';

const Header = ({ nickName, onPress }) => {
  const { loggedInUser } = useContext(AuthContext);

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={styles.text}>{nickName}</Text>
      <Avatar.Image 
        size={40} 
        source={{ uri: loggedInUser?.profileImage || 'https://example.com/default-avatar.png' }} 
        style={styles.image} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: '30%',
    maxWidth: '40%',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#E3E3E3',
    height: VerticalScale(50),
    paddingHorizontal: HorizontalScale(5),
    borderRadius: HorizontalScale(50),
    justifyContent: 'space-between',
  },
  text: {
    marginLeft: HorizontalScale(10),
    marginRight: HorizontalScale(10),
    color: 'black',
    fontFamily: 'OpenSans',
    fontSize: 16,
  },
  image: {
    marginLeft: 0,
    paddingLeft: 0,
  },
});

export default Header;