import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, Pressable } from 'react-native';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import { AuthContext } from '../../../AuthContext';
import BackArrow from '../../components/BackArrow/backArrow';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Theme from '../../../assets/styles/theme';

const ChatPage = ({ route, navigation }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const { loggedInUser } = useContext(AuthContext);
  const { conversationId, otherUserId } = route.params;

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'conversations', conversationId, 'messages'), orderBy('timestamp', 'desc')),
      (snapshot) => {
        const messagesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesData);
      }
    );

    return () => unsubscribe();
  }, [conversationId]);

  const sendMessage = async () => {
    if (inputMessage.trim() === '') return;

    await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
      text: inputMessage,
      senderId: loggedInUser.uid,
      timestamp: serverTimestamp(),
    });

    setInputMessage('');
  };

  const renderMessage = ({ item }) => {
    const isOwnMessage = item.senderId === loggedInUser.uid;
    return (
      <View style={[styles.messageBubble, isOwnMessage ? styles.ownMessage : styles.otherMessage]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <BackArrow />
      <FlatList
        inverted
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Type a message..."
        />
        <Pressable onPress={sendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={24} color={Theme.primaryColor.color} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messagesContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Theme.primaryColor.color,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#eee',
  },
  messageText: {
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatPage;