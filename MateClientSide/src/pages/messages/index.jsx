import React, { useState, useEffect, useContext } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native'
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  deleteDoc,
} from 'firebase/firestore'
import { db } from '../../../firebase'
import { AuthContext } from '../../../AuthContext'
import BackArrow from '../../components/BackArrow/backArrow'
import { Avatar } from 'react-native-paper'
import Theme from '../../../assets/styles/theme'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Swipeable } from 'react-native-gesture-handler'

const DEFAULT_PROFILE_IMAGE = 'https://example.com/default-profile-image.png'

const MessagesPage = ({ navigation }) => {
  const [conversations, setConversations] = useState([])
  const { loggedInUser } = useContext(AuthContext)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'conversations'),
        where('participantIds', 'array-contains', loggedInUser.uid),
        orderBy('lastMessageTimestamp', 'desc'),
      ),
      (snapshot) => {
        const conversationsData = snapshot.docs.map((doc) => {
          const data = doc.data()
          const otherUser = data.participants.find(
            (p) => p.id !== loggedInUser.uid,
          )

          return {
            id: doc.id,
            ...data,
            otherUser: otherUser,
            lastMessage: data.lastMessage || 'No messages yet',
            lastMessageTimestamp: data.lastMessageTimestamp
              ? data.lastMessageTimestamp.toDate()
              : null,
            unreadCount: data.unreadCount?.[loggedInUser.uid] || 0, // Add this line
          }
        })
        console.log('השיחות', conversationsData)
        setConversations(conversationsData)
      },
      (error) => {
        console.error('Error fetching conversations:', error)
      },
    )

    return () => unsubscribe()
  }, [loggedInUser.uid])

  const renderConversation = ({ item }) => {
    return (
      <Swipeable renderLeftActions={() => renderRightActions(item.id)}>
        <Pressable
          onPress={() =>
            navigation.navigate('Chat', {
              conversationId: item.id,
              otherUserId: item.otherUser.id,
              otherUser: item.otherUser,
            })
          }
        >
          <View style={styles.conversationItem}>
            <Avatar.Image
              size={50}
              source={{
                uri: item.otherUser?.profileImage || DEFAULT_PROFILE_IMAGE,
              }}
            />
            <View style={styles.conversationInfo}>
              <Text style={styles.conversationName}>
                {item.otherUser?.fullname || 'Unknown User'}
              </Text>
              <Text
                style={[
                  styles.lastMessage,
                  item.unreadCount > 0 && styles.unreadMessage,
                ]}
                numberOfLines={1}
                ellipsizeMode='tail'
              >
                {item.lastMessage || 'No messages yet'}
              </Text>
            </View>
            <View style={styles.rightContainer}>
              {item.lastMessageTimestamp && (
                <Text style={styles.timestamp}>
                  {formatTimestamp(item.lastMessageTimestamp)}
                </Text>
              )}
              {item.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadCount}>{item.unreadCount}</Text>
                </View>
              )}
            </View>
          </View>
        </Pressable>
      </Swipeable>
    )
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
      return messageDate.toLocaleDateString()
    }
  }

  const deleteConversation = async (conversationId) => {
    try {
      await deleteDoc(doc(db, 'conversations', conversationId))
    } catch (error) {
      console.error('Error deleting conversation:', error)
    }
  }

  const renderRightActions = (conversationId) => {
    return (
      <Pressable
        onPress={() => deleteConversation(conversationId)}
        style={styles.deleteButton}
      >
        <Ionicons name='trash' size={24} color='#fff' />
      </Pressable>
    )
  }

  return (
    <View style={styles.container}>
      <BackArrow />
      <Text style={styles.title}>השיחות שלי</Text>
      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
      />
    </View>
  )
}

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
    textAlign: 'right',
    marginBottom: 20,
    color: Theme.primaryColor.color,
  },
  conversationItem: {
    flexDirection: 'row-reverse',
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
    marginRight: 10,
    textAlign: 'right',
  },
  lastMessage: {
    fontSize: 14,
    marginRight: 10,
    color: '#888',
    marginTop: 4,
    textAlign: 'right',
  },
  unreadMessage: {
    fontWeight: 'bold',
    color: '#000',
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  unreadBadge: {
    backgroundColor: Theme.primaryColor.color,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    borderRadius: 10,
    marginTop: 10,
  },
})

export default MessagesPage
