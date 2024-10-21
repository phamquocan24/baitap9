// components/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ route, navigation }) => {
  const { userInfo } = route.params;
  const [savedUsers, setSavedUsers] = useState([]);

  useEffect(() => {
    const fetchSavedUsers = async () => {
      const users = JSON.parse(await AsyncStorage.getItem('savedUsers')) || [];
      setSavedUsers(users);
    };

    fetchSavedUsers();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userInfo');
      Alert.alert('Logged out successfully!');
      navigation.navigate('Login');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {userInfo.username}!</Text>
      <Text>Phone Number: {userInfo.phoneNumber}</Text>
      <Text>Password: {userInfo.password}</Text>

      <FlatList
        data={savedUsers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userCard}
            onPress={() => Alert.alert('User Info', `Username: ${item.username}\nPhone: ${item.phoneNumber}`)}
          >
            <Text style={styles.itemTitle}>User: {item.username}</Text>
            <Text style={styles.itemPhone}>Phone: {item.phoneNumber}</Text>
          </TouchableOpacity>
        )}
      />

      <Button title="Logout" onPress={handleLogout} color="#FF3D00" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
    color: '#007BFF',
  },
  userCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemPhone: {
    fontSize: 16,
    color: 'gray',
  },
});

export default HomeScreen;
