import React, { useState, useEffect, useContext } from 'react'
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native'
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from 'firebase/firestore'
import { db } from '../../../firebase'
import { AuthContext } from '../../../AuthContext'
import BackArrow from '../../components/BackArrow/backArrow'
import { Avatar } from 'react-native-paper'
import Theme from '../../../assets/styles/theme'

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
          // console.log('Conversation data:', data); // Debug log
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
          }
        })
        // console.log('Processed conversations:', conversationsData); // Debug log
        setConversations(conversationsData)
      },
      (error) => {
        console.error('Error fetching conversations:', error)
      },
    )

    return () => unsubscribe()
  }, [loggedInUser.uid])

  const renderConversation = ({ item }) => {
    // console.log('Rendering conversation item:', item); // Debug log
    return (
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
              {item.otherUser?.name || 'Unknown User'}
            </Text>
            <Text
              style={styles.lastMessage}
              numberOfLines={1}
              ellipsizeMode='tail'
            >
              {item.lastMessage || 'No messages yet'}
            </Text>
          </View>
          {item.lastMessageTimestamp && (
            <Text style={styles.timestamp}>
              {formatTimestamp(item.lastMessageTimestamp)}
            </Text>
          )}
        </View>
      </Pressable>
    )
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
      // If the message is from a different day, show the date
      return messageDate.toLocaleDateString()
    }
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
    // alignItems: 'left',
  },
  lastMessage: {
    fontSize: 14,
    marginRight: 10,
    color: '#888',
    marginTop: 4,
    textAlign: 'right',
  },
})

export default MessagesPage
