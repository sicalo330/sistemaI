import React, { useContext, useState } from "react";
import { Text, Button, Alert, View, SafeAreaView, TextInput, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/auth-context";
import { login } from "../utils/auth";
import { FormattedMessage } from "react-intl";

function Login() {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const authCtx = useContext(AuthContext);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password', [{ text: 'OK' }]);
      return;
    }

    try {
      const token = await login(email, password); //Este login tomará las credenciales dadas para buscarlo en la base de datos de firebase
      //Si todo sale bien, se devolverá un token
      authCtx.login(token);//Ese token va a ser usado en la función login de context(Ver carpeta context)
      //Esto hace que el token se guarde en el asyncStorage
      navigation.navigate('Main');
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text><FormattedMessage id="login" /></Text>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="something@mail.com"
        />
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          secureTextEntry={true}
        />
        <Button title="Login" onPress={handleLogin} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  innerContainer: {
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: '100%',
    marginVertical: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
});

export default Login;
