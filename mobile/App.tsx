import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from 'styled-components/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { theme } from './src/theme';

import DiscoveryScreen from './src/screens/DiscoveryScreen';
import RestaurantListScreen from './src/screens/RestaurantListScreen';
import BookingScreen from './src/screens/BookingScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.background,
                elevation: 0,
                shadowOpacity: 0,
              },
              headerTintColor: theme.colors.text,
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen 
              name="Home" 
              component={DiscoveryScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Restaurants" 
              component={RestaurantListScreen} 
              options={{ title: 'Seattle Spots' }}
            />
            <Stack.Screen 
              name="Booking" 
              component={BookingScreen} 
              options={{ title: 'Reserve Table' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;
