import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import Ventas from './Screen/Ventas';
import Ordenes from './Screen/Ordenes';
import Inventario from './Screen/Inventario';
import Cuenta from './Screen/Cuenta';

export default function App() {
  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();

  function VentasStack() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Ventas' component={Ventas}></Stack.Screen>
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name='VentasStack' component={VentasStack}></Tab.Screen>
        <Tab.Screen name='Ordenes' component={Ordenes}></Tab.Screen>
        <Tab.Screen name='Inventario' component={Inventario}></Tab.Screen>
        <Tab.Screen name='Cuenta' component={Cuenta}></Tab.Screen>
      </Tab.Navigator>
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
