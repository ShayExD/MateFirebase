import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Theme from '../../../assets/styles/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';

const TextView = ({ title, content, iconName, allowCopy }) => {
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(content);
    Alert.alert('Text Copied', 'The text has been copied to the clipboard.', [
      { text: 'OK' },
    ]);
  };

  return (
    <View style={styles.labelContainer}>
      <Text style={styles.smallTitle}>{title}</Text>
      <View style={styles.titleContainer}>
        {iconName && <Icon name={iconName} size={20} style={styles.icon} />}
        <Text style={styles.textAttributes}>{content}</Text>
        {allowCopy && (
          <TouchableOpacity onPress={copyToClipboard}>
            <Icon name="copy-outline" size={20} style={styles.copyIcon} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  smallTitle: {
    textAlign: 'right',
    color: Theme.primaryColor.color,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  labelContainer: {
    minWidth: '90%',
    maxWidth: '90%',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    // borderWidth: 1,
    // borderColor: 'gray',
    marginBottom: 10,
    direction: 'rtl',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  textAttributes: {
    textAlign: 'left',
    color: 'black',
    fontSize: 18,
    flex: 1,
  },
  icon: {
    marginRight: 5,
  },
  copyIcon: {
    color: 'gray',
    marginLeft: 5,
  },
});

export default TextView;