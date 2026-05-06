import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, ActivityIndicator, Text } from 'react-native';
import axios from 'axios';
import styled from 'styled-components/native';
import { theme } from '../theme';
import Card from '../components/Card';

const API_URL = 'http://localhost:4000/api';

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.background};
  align-items: center;
  justify-content: center;
`;

const Header = styled(View)`
  position: absolute;
  top: 60px;
  width: 100%;
  padding: 0 ${theme.spacing.lg}px;
`;

const Title = styled(Text)`
  color: ${theme.colors.secondary};
  font-size: 28px;
  font-weight: bold;
  text-align: center;
`;

const MOCK_USERS = [
  {
    id: '1',
    name: 'Elena',
    age: 28,
    bio: 'Coffee lover & hiker. Looking for someone to share Pike Place mornings with.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=687',
  },
  {
    id: '2',
    name: 'James',
    age: 31,
    bio: 'Software engineer by day, amateur chef by night. Seattle native.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=687',
  },
  {
    id: '3',
    name: 'Sophie',
    age: 26,
    bio: 'Artist living in Capitol Hill. Let\'s go to a gallery and then get Thai food.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=687',
  },
];

const DiscoveryScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/discover`, {
        params: { userId: 'demo-user' } // Use real userId in production
      });
      // Fall back to mock data if API returns empty or fails
      const data = response.data && response.data.length > 0 ? response.data : MOCK_USERS;
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users, using mock data:', error);
      setUsers(MOCK_USERS);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipeLeft = async (id: string) => {
    console.log('Swiped Left on', id);
    try {
      await axios.post(`${API_URL}/matches/swipe`, {
        userId: 'demo-user',
        targetUserId: id,
        direction: 'left'
      });
    } catch (e) {
      console.log('Backend offline or swipe failed');
    }
  };

  const handleSwipeRight = async (id: string) => {
    console.log('Swiped Right on', id);
    try {
      const response = await axios.post(`${API_URL}/matches/swipe`, {
        userId: 'demo-user',
        targetUserId: id,
        direction: 'right'
      });
      if (response.data.isMatch) {
        alert("It's a Match! Seattle is calling.");
      }
    } catch (e) {
      console.log('Backend offline or swipe failed');
    }
  };

  if (loading) {
    return (
      <Container>
        <ActivityIndicator size="large" color={theme.colors.secondary} />
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Pike Place Pair</Title>
      </Header>
      
      <View style={styles.cardStack}>
        {users.map((user, index) => (
          <Card
            key={user.id}
            user={user}
            onSwipeLeft={() => handleSwipeLeft(user.id)}
            onSwipeRight={() => handleSwipeRight(user.id)}
          />
        )).reverse()}
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  cardStack: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DiscoveryScreen;
