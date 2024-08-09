import React, { useState, useEffect, useContext } from 'react'
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  keyboardVerticalOffset,
  Keyboard,
  KeyboardAvoidingView,
  Image,
  Platform,
  ActivityIndicator
} from 'react-native'
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../../../firebase'
import { AuthContext } from '../../../AuthContext'
import BackArrow from '../../components/BackArrow/backArrow'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Theme from '../../../assets/styles/theme'
import { VerticalScale } from '../../utils'

const ChatPage = ({ route, navigation }) => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const { loggedInUser } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(true)
  const { conversationId, otherUserId, otherUser } = route.params
  useEffect(() => {
    setIsLoading(true)
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'conversations', conversationId, 'messages'),
        orderBy('timestamp', 'desc'),
      ),
      (snapshot) => {
        const messagesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate(),
        }))
        setMessages(messagesData)
        setIsLoading(false)
      },
      (error) => {
        console.error("Error fetching messages:", error)
        setIsLoading(false)
      }
    )

    return () => unsubscribe()
  }, [conversationId])
  const sendMessage = async () => {
    if (inputMessage.trim() === '') return

    const messageData = {
      text: inputMessage,
      senderId: loggedInUser.uid,
      timestamp: serverTimestamp(),
    }

    try {
      // Add the message to the messages subcollection
      const messageRef = await addDoc(
        collection(db, 'conversations', conversationId, 'messages'),
        messageData,
      )

      // Update the conversation document with the last message
      await updateDoc(doc(db, 'conversations', conversationId), {
        lastMessage: inputMessage,
        lastMessageTimestamp: serverTimestamp(),
      })

      setInputMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      // You might want to show an error message to the user here
    }
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return ''
    const now = new Date()
    const messageDate = new Date(timestamp)

    if (now.toDateString() === messageDate.toDateString()) {
      // If the message is from today, show the time
      return messageDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    } else {
      // If the message is from a different day, show the date and time
      return messageDate.toLocaleString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    }
  }

  const renderMessage = ({ item }) => {
    const isOwnMessage = item.senderId === loggedInUser.uid
    return (
      <View
        style={[
          styles.messageContainer,
          isOwnMessage
            ? styles.ownMessageContainer
            : styles.otherMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isOwnMessage ? styles.ownMessage : styles.otherMessage,
          ]}
        >
          <Text
            style={[styles.messageText, isOwnMessage && styles.ownMessageText]}
          >
            {item.text}
          </Text>
        </View>
        <Text
          style={[
            styles.timestamp,
            isOwnMessage ? styles.ownTimestamp : styles.otherTimestamp,
          ]}
        >
          {formatTimestamp(item.timestamp)}
        </Text>
      </View>
    )
  }

  const customHandlePress = () => {
    navigation.navigate('myTabs', { screen: 'Messages' });
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0} // Adjust this offset if needed
    >
      <View style={styles.container}>
        <BackArrow onPress={customHandlePress}/>
        <View style={styles.header}>
          <Image
            source={{ uri: otherUser.profileImage || DEFAULT_AVATAR }}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{otherUser.name}</Text>
        </View>
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Theme.primaryColor.color} />
          </View>
        ) : (
          <FlatList
            inverted
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesContainer}
          />
        )}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputMessage}
            onChangeText={setInputMessage}
            placeholder='Type a message...'
          />
          <Pressable onPress={sendMessage} style={styles.sendButton}>
            <Ionicons name='send' size={24} color={Theme.primaryColor.color} />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 10,
    color: 'black',
    flex: 1,
  },
  messagesContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    flexGrow: 1,
  },
  messageContainer: {
    marginVertical: 5,
    maxWidth: '80%',
  },
  ownMessageContainer: {
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 10,
    borderRadius: 20,
  },
  ownMessage: {
    backgroundColor: Theme.primaryColor.color,
  },
  otherMessage: {
    backgroundColor: '#eee',
  },
  messageText: {
    color: '#333',
  },
  ownMessageText: {
    color: '#fff',
  },
  timestamp: {
    fontSize: 10,
    color: '#888',
    marginTop: 2,
  },
  ownTimestamp: {
    textAlign: 'right',
  },
  otherTimestamp: {
    textAlign: 'left',
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop:VerticalScale(50),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    justifyContent: 'center',
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default ChatPage
