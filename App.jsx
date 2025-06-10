import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/routes/AppNavigator';
import {Provider, useSelector} from 'react-redux';
import store from './src/redux/store.jsx';

const App = () => {
  const AppContent = () => {
    const user = useSelector(state => state.user.user);
    const isLoggedIn = useSelector(state => state.user.isLoggedIn);

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