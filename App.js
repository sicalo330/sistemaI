import React,{useContext} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AuthContextProvider,{AuthContext } from "./context/auth-context.js"
import { ActivityIndicator } from "react-native";


import Ventas from './Screen/Ventas';
import Ordenes from './Screen/Ordenes';
import Inventario from './Screen/Inventario';
import Cuenta from './Screen/Cuenta';
import Configuration from './Screen/Configuration';
import Login from './Screen/Login.js'; // Importa tu pantalla de Login
import FormularioProducto from './Screen/FormularioProducto.js';
import Historial from './Screen/Historial.js';
import Detail from './Screen/Detail.js';
import Pedidos from './Screen/Pedidos.js';
import DetailFactura from './Screen/DetailFactura.js';
import FormularioActualizacionPedido from './Screen/FormularioActualizacionPedido.js';

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
      <Tab.Screen name='PedidosStack' component={PedidosStack}></Tab.Screen>
      <Tab.Screen name='CuentaStack' component={CuentaStack}></Tab.Screen>
    </Tab.Navigator>
  );
}

// Define los stacks individuales
function VentasStack() {
  return (
    <Stack.Navigator initialRouteName="Ventas">
      <Stack.Screen name='Ventas' component={Ventas}></Stack.Screen>
      <Stack.Screen name='Historial' component={Historial}></Stack.Screen>
      <Stack.Screen name='DetailFactura' component={DetailFactura}></Stack.Screen>
    </Stack.Navigator>
  );
}

function OrdenesStack() {
  return (
    <Stack.Navigator initialRouteName='Ordenes'>
      <Stack.Screen name='Ordenes' component={Ordenes}></Stack.Screen>
      <Stack.Screen name='FormularioActualizacionPedido' component={FormularioActualizacionPedido}></Stack.Screen>
    </Stack.Navigator>
  );
}

function PedidosStack() {
  return (
    <Stack.Navigator initialRouteName='Pedidos'>
      <Stack.Screen name='Pedidos' component={Pedidos}></Stack.Screen>
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
      <Stack.Screen name='Detail' component={Detail}></Stack.Screen>
      <Stack.Screen name='FormularioProducto' component={FormularioProducto}></Stack.Screen>
    </Stack.Navigator>
  );
}

function AppContent() {
  const authCtx = useContext(AuthContext);

  if (authCtx.isLoading) {
      // Muestra un indicador de carga mientras se verifica el token
      return (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size="large" color="#0000ff" />
          </View>
      );
  }

  return (
      <NavigationContainer>
          <Stack.Navigator initialRouteName={authCtx.isLogged ? "Main" : "Login"} screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Main" component={TabNavigator} />
          </Stack.Navigator>
      </NavigationContainer>
  );
}

export default function App() {
  return (
      <AuthContextProvider>
          <AppContent />
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
