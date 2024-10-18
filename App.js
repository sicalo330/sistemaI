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
import FormularioProducto from './Screen/FormularioProducto.js';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Define tu Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown:false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'VentasStack') {
            iconName = 'sale';
          } else if (route.name === 'OrdenesStack') {
            iconName = 'application-edit-outline';  
          } else if (route.name === 'InventarioStack') {
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
      <Tab.Screen name='OrdenesStack' component={OrdenesStack}></Tab.Screen>
      <Tab.Screen name='InventarioStack' component={InventarioStack}></Tab.Screen>
      <Tab.Screen name='CuentaStack' component={CuentaStack}></Tab.Screen>
    </Tab.Navigator>
  );
}

// Define los stacks individuales
function VentasStack() {
  return (
    <Stack.Navigator initialRouteName='Ventas'>
      <Stack.Screen name='Ventas' component={Ventas}></Stack.Screen>
    </Stack.Navigator>
  );
}

function OrdenesStack() {
  return (
    <Stack.Navigator initialRouteName='Ordenes'>
      <Stack.Screen name='Ordenes' component={Ordenes}></Stack.Screen>
    </Stack.Navigator>
  );
}

function CuentaStack() {
  return (
    <Stack.Navigator initialRouteName='Cuenta'>
      <Stack.Screen name='Cuenta' component={Cuenta}></Stack.Screen>
      <Stack.Screen name='Configuration' component={Configuration}></Stack.Screen>
    </Stack.Navigator>
  );
}

function InventarioStack() {
  return (
    <Stack.Navigator initialRouteName='Inventario'>
      <Stack.Screen name='Inventario' component={Inventario}></Stack.Screen>
      <Stack.Screen name='FormularioProducto' component={FormularioProducto}></Stack.Screen>
    </Stack.Navigator>
  );
}

// Define tu Stack principal que incluirá el login y las tabs
export default function App() {
  const authCtx = useContext(AuthContext);
  return (
    <AuthContextProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={authCtx.isLogged ? "Login":"Main"} screenOptions={{ headerShown: false }}>
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
