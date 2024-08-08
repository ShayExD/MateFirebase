import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../../firebase';
import { AuthContext } from '../../../AuthContext';
import BackArrow from '../../components/BackArrow/backArrow';
import { Avatar } from 'react-native-paper';
import Theme from '../../../assets/styles/theme';

const DEFAULT_PROFILE_IMAGE = 'https://example.com/default-profile-image.png';

const MessagesPage = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const { loggedInUser } = useContext(AuthContext);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'conversations'),
        where('participantIds', 'array-contains', loggedInUser.uid),
        orderBy('lastMessageTimestamp', 'desc')
      ),
      (snapshot) => {
        const conversationsData = snapshot.docs.map(doc => {
          const data = doc.data();
          const otherUser = data.participants.find(p => p.id !== loggedInUser.uid);
          
          return {
            id: doc.id,
            ...data,
            otherUser: otherUser,
            lastMessage: data.lastMessage || 'No messages yet',
            lastMessageTimestamp: data.lastMessageTimestamp ? data.lastMessageTimestamp.toDate() : null
          };
        });
        setConversations(conversationsData);
      }
    );

    return () => unsubscribe();
  }, [loggedInUser.uid]);

  const renderConversation = ({ item }) => {
    return (
      <Pressable onPress={() => navigation.navigate('Chat', { conversationId: item.id, otherUserId: item.otherUser.id })}>
        <View style={styles.conversationItem}>
          <Avatar.Image 
            size={50} 
            source={{ uri: item.otherUser.profileImage || DEFAULT_PROFILE_IMAGE }}
          />
          <View style={styles.conversationInfo}>
            <Text style={styles.conversationName}>{item.otherUser.name}</Text>
            <Text style={styles.lastMessage} numberOfLines={1} ellipsizeMode="tail">
              {item.lastMessage}
            </Text>
          </View>
          {item.lastMessageTimestamp && (
            <Text style={styles.timestamp}>
              {formatTimestamp(item.lastMessageTimestamp)}
            </Text>
          )}
        </View>
      </Pressable>
    );
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const now = new Date();
    const messageDate = new Date(timestamp);
    
    if (now.toDateString() === messageDate.toDateString()) {
      // If the message is from today, show the time
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      // If the message is from a different day, show the date
      return messageDate.toLocaleDateString();
    }
  };

  return (
    <View style={styles.container}>
      <BackArrow />
      <Text style={styles.title}>Messages</Text>
      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    
    padding: 20,
  },
  title: {
    marginTop: 90,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Theme.primaryColor.color,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  conversationInfo: {
    marginLeft: 10,
    flex: 1,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
});

export default MessagesPage;