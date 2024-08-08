// src/utils/chatUtils.js
import { collection, addDoc, serverTimestamp, getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export const startNewConversation = async (currentUserId, otherUserId) => {
  try {
    // Fetch current user data
    const currentUserDoc = await getDoc(doc(db, 'users', currentUserId));
    const currentUserData = currentUserDoc.data();

    // Fetch other user data
    const otherUserDoc = await getDoc(doc(db, 'users', otherUserId));
    const otherUserData = otherUserDoc.data();

    // Prepare participant data
    const participants = [
      {
        id: currentUserId,
        name: currentUserData.fullname || 'Unknown User',
        profileImage: currentUserData.profileImage || null
      },
      {
        id: otherUserId,
        name: otherUserData.fullname || 'Unknown User',
        profileImage: otherUserData.profileImage || null
      }
    ];

    // Create the conversation document
    const conversationRef = await addDoc(collection(db, 'conversations'), {
      participants: participants,
      participantIds: [currentUserId, otherUserId], // This array is useful for querying
      createdAt: serverTimestamp(),
      lastMessage: '',
      lastMessageTimestamp: serverTimestamp(),
    });

    return conversationRef.id;
  } catch (error) {
    console.error('Error starting new conversation:', error);
    return null;
  }
};
export const sendMessage = async (conversationId, senderId, messageText) => {
  try {
    // Add the message to the messages subcollection
    const messageRef = await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
      senderId,
      text: messageText,
      timestamp: serverTimestamp()
    });

    // Update the conversation document with the last message
    await updateDoc(doc(db, 'conversations', conversationId), {
      lastMessage: messageText,
      lastMessageTimestamp: serverTimestamp()
    });

    return messageRef.id;
  } catch (error) {
    console.error('Error sending message:', error);
    return null;
  }
};
// You can add more chat-related utility functions here in the future