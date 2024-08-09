import React, { useState, useEffect, useContext } from 'react'
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  Pressable,
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
  writeBatch
} from 'firebase/firestore'
import { db } from '../../../firebase'
import { AuthContext } from '../../../AuthContext'
import BackArrow from '../../components/BackArrow/backArrow'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Theme from '../../../assets/styles/theme'
import { VerticalScale } from '../../utils'

const DEFAULT_AVATAR = 'https://example.com/default-avatar.png'

const ChatPage = ({ route, navigation }) => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const { loggedInUser } = useContext(AuthContext)
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
        markMessagesAsSeen(messagesData)
      },
      (error) => {
        console.error("Error fetching messages:", error)
        setIsLoading(false)
      }
    )

    return () => unsubscribe()
  }, [conversationId])

  const markMessagesAsSeen = async (messagesData) => {
    const batch = writeBatch(db)
    const unseenMessages = messagesData.filter(
      msg => msg.senderId !== loggedInUser.uid && !msg.seen
    )

    unseenMessages.forEach(msg => {
      const messageRef = doc(db, 'conversations', conversationId, 'messages', msg.id)
      batch.update(messageRef, { seen: true })
    })

    if (unseenMessages.length > 0) {
      try {
        await batch.commit()
      } catch (error) {
        console.error("Error marking messages as seen:", error)
      }
    }
  }

  const sendMessage = async () => {
    if (inputMessage.trim() === '') return

    const messageData = {
      text: inputMessage,
      senderId: loggedInUser.uid,
      timestamp: serverTimestamp(),
      seen: false
    }

    try {
      const messageRef = await addDoc(
        collection(db, 'conversations', conversationId, 'messages'),
        messageData,
      )

      await updateDoc(doc(db, 'conversations', conversationId), {
        lastMessage: inputMessage,
        lastMessageTimestamp: serverTimestamp(),
      })

      setInputMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return ''
    const now = new Date()
    const messageDate = new Date(timestamp)

    if (now.toDateString() === messageDate.toDateString()) {
      return messageDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    } else {
      return messageDate.toLocaleString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const renderMessage = ({ item }) => {
    const isOwnMessage = item.senderId === loggedInUser.uid
    return (
      <View
        style={[
          styles.messageContainer,
          isOwnMessage ? styles.ownMessageContainer : styles.otherMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isOwnMessage ? styles.ownMessage : styles.otherMessage,
          ]}
        >
          <Text style={[styles.messageText, isOwnMessage && styles.ownMessageText]}>
            {item.text}
          </Text>
        </View>
        <View style={styles.messageFooter}>
          <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
          {isOwnMessage && (
            <Ionicons
              name={item.seen ? "checkmark-done" : "checkmark"}
              size={16}
              color={item.seen ? Theme.primaryColor.color : "#888"}
            />
          )}
        </View>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <View style={styles.container}>
        <BackArrow />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: VerticalScale(50),
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
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 2,
  },
  timestamp: {
    fontSize: 10,
    color: '#888',
    marginRight: 5,
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
})

export default ChatPage