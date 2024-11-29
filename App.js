import React,{useContext,useState} from 'react';
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
import CambiarIdioma from './Screen/CambiarIdioma.js';
import Info from './Screen/Info.js';


//Lenguajes
import enMessages from './translations/en/globalEn.json';
import esMessages from './translations/es/globalEs.json';
import { IntlProvider } from 'react-intl';
import { LanguageProvider,useLanguage } from './Screen/LanguageProvider.js';
import { useIntl } from 'react-intl';

const messages = {
  en: enMessages,
  es: esMessages,
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Define tu Tab Navigator
function TabNavigator() {
  const intl = useIntl();
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        let iconName;

        if (route.name === 'Ventas') {
          iconName = 'sale';
        } else if (route.name === 'Ordenes') {
          iconName = 'application-edit-outline';
        } else if (route.name === 'Inventario') {
          iconName = 'archive';
        } else if (route.name === 'Pedidos') {
          iconName = 'bucket';
        } else if (route.name === 'Cuenta') {
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
    <Tab.Screen
      name="Ventas"
      component={VentasStack}
      options={{
        tabBarLabel: intl.formatMessage({ id: 'tabs.sales', defaultMessage: 'Ventas' }),
      }}
    />
    <Tab.Screen
      name="Ordenes"
      component={OrdenesStack}
      options={{
        tabBarLabel: intl.formatMessage({ id: 'tabs.orders', defaultMessage: 'Órdenes' }),
      }}
    />
    <Tab.Screen
      name="Inventario"
      component={InventarioStack}
      options={{
        tabBarLabel: intl.formatMessage({ id: 'tabs.inventory', defaultMessage: 'Inventario' }),
      }}
    />
    <Tab.Screen
      name="Pedidos"
      component={PedidosStack}
      options={{
        tabBarLabel: intl.formatMessage({ id: 'tabs.ask', defaultMessage: 'Pedidos' }),
      }}
    />
    <Tab.Screen
      name="Cuenta"
      component={CuentaStack}
      options={{
        tabBarLabel: intl.formatMessage({ id: 'tabs.account', defaultMessage: 'Cuenta' }),
      }}
    />
  </Tab.Navigator>
  );
}

// Define los stacks individuales
function VentasStack() {
  return (
    <Stack.Navigator initialRouteName="VentasStack">
      <Stack.Screen name='VentasStack' component={Ventas} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='Historial' component={Historial}></Stack.Screen>
      <Stack.Screen name='DetailFactura' component={DetailFactura}></Stack.Screen>
    </Stack.Navigator>
  );
}

function OrdenesStack() {
  return (
    <Stack.Navigator initialRouteName='OrdenesStack'>
      <Stack.Screen name='OrdenesStack' component={Ordenes} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='FormularioActualizacionPedido' component={FormularioActualizacionPedido}></Stack.Screen>
    </Stack.Navigator>
  );
}

function PedidosStack() {
  return (
    <Stack.Navigator initialRouteName='PedidosStack'>
      <Stack.Screen name='PedidosStack' component={Pedidos} options={{ headerShown: false }}></Stack.Screen>
    </Stack.Navigator>
  );
}

function CuentaStack() {
  return (
    <Stack.Navigator initialRouteName='CuentaStack'>
      <Stack.Screen name='CuentaStack' component={Cuenta} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='Configuration' component={Configuration}></Stack.Screen>
      <Stack.Screen name='Info' component={Info}></Stack.Screen>
      <Stack.Screen name='CambiarIdioma' component={CambiarIdioma}></Stack.Screen>
    </Stack.Navigator>
  );
}

function InventarioStack() {
  return (
    <Stack.Navigator initialRouteName='InventarioStack'>
      <Stack.Screen name='InventarioStack' component={Inventario} options={{ headerShown: false }}></Stack.Screen>
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
    <LanguageProvider>
      <LanguageApp />
    </LanguageProvider>
  );
}

// Desglosar la lógica dentro de un componente que está dentro del contexto
function LanguageApp() {
  const { locale } = useLanguage(); // Ahora puedes usar el hook porque está dentro del contexto

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <AuthContextProvider>
        <AppContent />
      </AuthContextProvider>
    </IntlProvider>
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
