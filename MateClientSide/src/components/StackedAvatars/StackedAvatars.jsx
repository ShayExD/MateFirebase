import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-paper';
import Theme from '../../../assets/styles/theme';

const StackedAvatars = ({ members, maxDisplay = 3 }) => {
  const displayedMembers = members.slice(0, maxDisplay);
  const remainingCount = Math.max(members.length - maxDisplay, 0);

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        {displayedMembers.map((member, index) => (
          <View key={member.id} style={[styles.avatarWrapper, { zIndex: maxDisplay - index }]}>
            <Avatar.Image
              size={40}
              source={{ uri: member.profileImage }}
            />
          </View>
        ))}
        {remainingCount > 0 && (
          <View style={[styles.avatarWrapper, styles.countWrapper, { zIndex: 0 }]}>
            <Text style={styles.countText}>+{remainingCount}</Text>
          </View>
        )}
      </View>
      <Text style={styles.membersText}>{members.length} חברים בקבוצה</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
  },
  avatarContainer: {
    flexDirection: 'row-reverse', // For RTL layout
    alignItems: 'center',
  },
  avatarWrapper: {
    marginLeft: -15, // Negative margin for overlap
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 20, // Half of the avatar size
  },
  countWrapper: {
    width: 40,
    height: 40,
    backgroundColor: Theme.primaryColor.color,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    color: 'white',
    fontWeight: 'bold',
  },
  membersText: {
    marginTop: 5,
    color: Theme.primaryColor.color,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default StackedAvatars;