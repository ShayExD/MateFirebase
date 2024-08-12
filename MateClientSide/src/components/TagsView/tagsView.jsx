import React from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native'
import Theme from '../../../assets/styles/theme'

const TagsView = ({ title, list }) => {
  return (
    <View style={styles.labelContainer}>
      <Text style={styles.smallTitle}>{title}</Text>
      <View style={styles.tagsContainer}>
        {list.map((item, index) => (
          <View key={index} style={styles.tagContainer}>
            <Text style={styles.tagText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  smallTitle: {
    color: Theme.primaryColor.color,
    marginBottom: 10,
    textAlign: Platform.OS === 'ios' ? 'left' : 'right',
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
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  tagText: {
    color: 'black',
    fontSize: 14,
  },
})

export default TagsView
