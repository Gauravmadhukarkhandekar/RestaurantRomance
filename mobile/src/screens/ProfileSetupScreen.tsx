import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { db, auth } from '../utils/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { theme } from '../theme';

const ProfileSetupScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');

  const handleSaveProfile = async () => {
    if (!auth.currentUser) return;
    
    try {
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        name,
        age: parseInt(age),
        bio,
        interests: interests.split(',').map(i => i.trim()),
        images: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'], // Placeholder
        createdAt: new Date()
      });
      navigation.navigate('Home');
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Your Profile</Text>
        <Text style={styles.subtitle}>Help others in Seattle get to know you.</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.imagePlaceholder}>
            <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' }} 
                style={styles.profileImage}
            />
            <View style={styles.addIcon}><Text style={{color: 'white'}}>+</Text></View>
        </View>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Elena Fisher"
          placeholderTextColor="#666"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          placeholder="28"
          placeholderTextColor="#666"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Coffee lover, hiker, and looking for the best oysters in Pike Place..."
          placeholderTextColor="#666"
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Interests (comma separated)</Text>
        <TextInput
          style={styles.input}
          placeholder="Hiking, Wine, Jazz"
          placeholderTextColor="#666"
          value={interests}
          onChangeText={setInterests}
        />

        <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
          <Text style={styles.buttonText}>Complete Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1B',
  },
  header: {
    padding: 32,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: '#A0A0B0',
    marginTop: 8,
  },
  form: {
    padding: 32,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignSelf: 'center',
    marginBottom: 32,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  addIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#B87333',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#0F0F1B'
  },
  label: {
    color: '#B87333',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    color: 'white',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#B87333',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileSetupScreen;
