import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/routes/AppNavigator';
import { Provider, useSelector, useDispatch } from 'react-redux';
import store from './src/redux/store.jsx';
import { restoreUser } from './src/redux/actions/userActions';
import { Alert } from 'react-native';

const App = () => {
  const AppContent = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.user);
    const isLoggedIn = useSelector(state => state.user.isLoggedIn);

    useEffect(() => {
      // Attempt to restore user session on app start
      const initializeApp = async () => {
        try {
          await dispatch(restoreUser());
        } catch (error) {
          console.error('Error restoring user session:', error);
          Alert.alert(
            'Session Error',
            'There was a problem restoring your session. Please log in again.'
          );
        }
      };
      
      initializeApp();
    }, [dispatch]);

    useEffect(() => {
      console.log("Redux User State:", user);
      console.log("Redux Is Logged In:", isLoggedIn);
    }, [user, isLoggedIn]);

    return (
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    );
  };

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </SafeAreaProvider>
  );
};

export default App; 