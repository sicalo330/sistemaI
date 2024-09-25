import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Ventas from './Screen/Ventas';
import Ordenes from './Screen/Ordenes';
import Inventario from './Screen/Inventario';
import Cuenta from './Screen/Cuenta';
import Configuration from './Screen/Configuration';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function VentasStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Ventas' component={Ventas}></Stack.Screen>
    </Stack.Navigator>
  );
}

function CuentaStack(){
  return(
  <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Cuenta' component={Cuenta}></Stack.Screen>
      <Stack.Screen name='Configuration' component={Configuration}></Stack.Screen>
  </Stack.Navigator>
  )
}

export default function App() {

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            //Se declara el nombre del ícono
            let iconName;

            // Aquí seleccionamos el ícono basado en el nombre de la ruta
            if (route.name === 'VentasStack') {
              iconName = 'sale';
            } else if (route.name === 'Ordenes') {
              iconName = 'application-edit-outline';  
            } else if (route.name === 'Inventario') {
              iconName = 'archive';
            }else if (route.name === 'CuentaStack') {
              iconName = 'account';
            }

            // Retornamos el ícono de MaterialCommunityIcons con su color y tamaño
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'orange',  // Color de íconos activos
          tabBarInactiveTintColor: 'gray',  // Color de íconos inactivos
          tabBarStyle: {
            height: 80, // Ajusta la altura total de la barra de pestañas
            paddingHorizontal: 20, // Espaciado interior horizontal de la barra de pestañas
            paddingBottom: 10, // Espaciado inferior de la barra de pestañas
            paddingTop: 10, // Espaciado superior de la barra de pestañas
          },
          tabBarItemStyle: {
            marginHorizontal: 10, // Margen entre los botones
            paddingVertical: 5, // Espaciado vertical dentro de cada botón
          },
          tabBarLabelStyle: {
            fontSize: 14, // Tamaño del texto de la etiqueta
          },
        })}
      
      >
        <Tab.Screen name='VentasStack' component={VentasStack}></Tab.Screen>
        <Tab.Screen name='Ordenes' component={Ordenes}></Tab.Screen>
        <Tab.Screen name='Inventario' component={Inventario}></Tab.Screen>
        <Tab.Screen name='CuentaStack' component={CuentaStack}></Tab.Screen>
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
