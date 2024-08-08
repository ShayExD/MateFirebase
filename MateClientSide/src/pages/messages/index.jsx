import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase';
import { AuthContext } from '../../../AuthContext';
import BackArrow from '../../components/BackArrow/backArrow';
import { Avatar } from 'react-native-paper';
import Theme from '../../../assets/styles/theme';

const MessagesPage = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const { loggedInUser } = useContext(AuthContext);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'conversations'), where('participants', 'array-contains', loggedInUser.uid)),
      (snapshot) => {
        const conversationsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setConversations(conversationsData);
      }
    );

    return () => unsubscribe();
  }, [loggedInUser.uid]);

  const renderConversation = ({ item }) => {
    const otherUser = item.participants.find(id => id !== loggedInUser.uid);
    return (
      <Pressable onPress={() => navigation.navigate('Chat', { conversationId: item.id, otherUserId: otherUser })}>
        <View style={styles.conversationItem}>
          <Avatar.Image size={50} source={{ uri: item.profileImage }} />
          <View style={styles.conversationInfo}>
            <Text style={styles.conversationName}>{item.name}</Text>
            <Text style={styles.lastMessage}>{item.lastMessage}</Text>
          </View>
        </View>
      </Pressable>
    );
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
  },
  conversationName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: '#888',
  },
});

export default MessagesPage;