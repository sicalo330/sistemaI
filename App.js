import React,{useContext} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AuthContextProvider,{AuthContext } from "./context/auth-context.js"


import Ventas from './Screen/Ventas';
import Ordenes from './Screen/Ordenes';
import Inventario from './Screen/Inventario';
import Cuenta from './Screen/Cuenta';
import Configuration from './Screen/Configuration';
import Login from './Screen/Login.js'; // Importa tu pantalla de Login

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Define tu Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'VentasStack') {
            iconName = 'sale';
          } else if (route.name === 'Ordenes') {
            iconName = 'application-edit-outline';  
          } else if (route.name === 'Inventario') {
            iconName = 'archive';
          } else if (route.name === 'CuentaStack') {
            iconName = 'account';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'orange',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 80,
          paddingHorizontal: 20,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarItemStyle: {
          marginHorizontal: 10,
          paddingVertical: 5,
        },
        tabBarLabelStyle: {
          fontSize: 14,
        },
      })}
    >
      <Tab.Screen name='VentasStack' component={VentasStack}></Tab.Screen>
      <Tab.Screen name='Ordenes' component={Ordenes}></Tab.Screen>
      <Tab.Screen name='Inventario' component={Inventario}></Tab.Screen>
      <Tab.Screen name='CuentaStack' component={CuentaStack}></Tab.Screen>
    </Tab.Navigator>
  );
}

// Define los stacks individuales
function VentasStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Ventas' component={Ventas}></Stack.Screen>
    </Stack.Navigator>
  );
}

function CuentaStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Cuenta' component={Cuenta}></Stack.Screen>
      <Stack.Screen name='Configuration' component={Configuration}></Stack.Screen>
    </Stack.Navigator>
  );
}

// Define tu Stack principal que incluirá el login y las tabs
export default function App() {
  const authCtx = useContext(AuthContext);
  return (
    <AuthContextProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={authCtx? "Main":"Login"} screenOptions={{ headerShown: false }}>
          {/* La pantalla de Login estará fuera de las tabs */}
          <Stack.Screen name="Login" component={Login} />
          {/* Las pestañas estarán disponibles después del login */}
          <Stack.Screen name="Main" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContextProvider>
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