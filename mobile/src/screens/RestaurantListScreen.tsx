import React from 'react';
import { FlatList, TouchableOpacity, Image } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../theme';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Header = styled.View`
  padding: ${theme.spacing.lg}px;
`;

const Title = styled.Text`
  color: ${theme.colors.text};
  font-size: 24px;
  font-weight: bold;
`;

const Subtitle = styled.Text`
  color: ${theme.colors.secondary};
  font-size: 16px;
  margin-top: 4px;
`;

const RestaurantCard = styled.TouchableOpacity`
  background-color: ${theme.colors.surface};
  margin: ${theme.spacing.md}px;
  border-radius: ${theme.borderRadius.md}px;
  overflow: hidden;
`;

const RestaurantImage = styled.Image`
  width: 100%;
  height: 200px;
`;

const Info = styled.View`
  padding: ${theme.spacing.md}px;
`;

const Name = styled.Text`
  color: ${theme.colors.text};
  font-size: 18px;
  font-weight: bold;
`;

const Cuisine = styled.Text`
  color: ${theme.colors.textSecondary};
  font-size: 14px;
  margin-top: 2px;
`;

const DiscountBadge = styled.View`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${theme.colors.secondary};
  padding: 4px 8px;
  border-radius: ${theme.borderRadius.sm}px;
`;

const DiscountText = styled.Text`
  color: ${theme.colors.text};
  font-size: 12px;
  font-weight: bold;
`;

const MOCK_RESTAURANTS = [
  {
    id: '1',
    name: 'The Pink Door',
    cuisine: 'Italian & Burlesque',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000',
    discount: '10% OFF',
  },
  {
    id: '2',
    name: 'Canlis',
    cuisine: 'Modern American',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1000',
    discount: '10% OFF',
  },
  {
    id: '3',
    name: 'Taylor Shellfish Farms',
    cuisine: 'Seafood',
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&q=80&w=1000',
    discount: '10% OFF',
  },
];

const RestaurantListScreen = ({ navigation }: any) => {
  return (
    <Container>
      <Header>
        <Title>Curated for You</Title>
        <Subtitle>Unlock 10% off your first date</Subtitle>
      </Header>

      <FlatList
        data={MOCK_RESTAURANTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RestaurantCard onPress={() => navigation.navigate('Booking', { restaurant: item })}>
            <RestaurantImage source={{ uri: item.image }} />
            <DiscountBadge>
              <DiscountText>{item.discount}</DiscountText>
            </DiscountBadge>
            <Info>
              <Name>{item.name}</Name>
              <Cuisine>{item.cuisine} • Seattle</Cuisine>
            </Info>
          </RestaurantCard>
        )}
      />
    </Container>
  );
};

export default RestaurantListScreen;
