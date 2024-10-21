// components/LoginScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [saveLogin, setSaveLogin] = useState(false);
  const [savedUsers, setSavedUsers] = useState([]);

  useEffect(() => {
    const checkSavedLogin = async () => {
      try {
        const savedUsersData = JSON.parse(await AsyncStorage.getItem('savedUsers')) || [];
        setSavedUsers(savedUsersData);
      } catch (e) {
        console.error(e);
      }
    };

    checkSavedLogin();
  }, []);

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(?:\+84|0)(?:\d{9}|\d{10})$/;
    return phoneRegex.test(phone);
  };

  const handleLogin = async () => {
    if (!phoneNumber || !username || !password) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert('Error', 'Invalid phone number format. Please use +84 or 0 followed by 9-10 digits.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long.');
      return;
    }

    const userInfo = { phoneNumber, username, password };

    try {
      if (saveLogin) {
        await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
      }

      const updatedUsers = [...savedUsers, userInfo];
      await AsyncStorage.setItem('savedUsers', JSON.stringify(updatedUsers));

      navigation.navigate('Home', { userInfo });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Phone Number"
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <View style={styles.switchContainer}>
        <Text>Save login info?</Text>
        <Switch value={saveLogin} onValueChange={setSaveLogin} />
      </View>
      <Button title="Login" onPress={handleLogin} color="#007BFF" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  input: {
    height: 50,
    borderColor: '#007BFF',
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
    color: '#007BFF',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
});

export default LoginScreen;
