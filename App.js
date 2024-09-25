import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import Ventas from './Screen/Ventas';

export default function App() {
  const Tab = createBottomTabNavigator()
  const Stack = createStackNavigator()

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <View style={styles.container}>
          <Text>Open up App.js to start working on your app!</Text>
          <StatusBar style="auto" />
        </View>
      </Tab.Navigator>
      <Tab.Screen name='Ventas' component={Ventas}></Tab.Screen>
      <Tab.Screen name='Ordenes'></Tab.Screen>
      <Tab.Screen name='Inventario'></Tab.Screen>
      <Tab.Screen name='Cuenta'></Tab.Screen>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
