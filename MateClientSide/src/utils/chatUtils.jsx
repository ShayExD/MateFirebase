// src/utils/chatUtils.js
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

export const startNewConversation = async (currentUserId, otherUserId) => {
  try {
    const conversationRef = await addDoc(collection(db, 'conversations'), {
      participants: [currentUserId, otherUserId],
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