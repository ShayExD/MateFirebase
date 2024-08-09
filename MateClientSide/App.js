import React from 'react';
import { useContext } from 'react';
import { StyleSheet, TouchableWithoutFeedback, Keyboard,KeyboardAvoidingView, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider,AuthContext } from './AuthContext';
import { Provider as PaperProvider } from 'react-native-paper';
import MainNavigation from './src/navigation/Navigation';
import Tabs from './src/navigation/tabs';
import Theme from './assets/styles/theme';

const AppContent = () => {
  const { loggedInUser } = useContext(AuthContext);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {/* <KeyboardAvoidingView
  style={{ flex: 1 ,    backgroundColor: '#fff'  }}
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  keyboardVerticalOffset={0}
> */}
      <NavigationContainer style={styles.container}>
        <PaperProvider>
        <MainNavigation />
        </PaperProvider>
      </NavigationContainer>
      {/* </KeyboardAvoidingView> */}
    </TouchableWithoutFeedback>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
});