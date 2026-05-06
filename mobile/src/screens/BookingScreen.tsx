import React, { useState } from 'react';
import { ScrollView, Alert, View, Text, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import styled from 'styled-components/native';
import { theme } from '../theme';

const Container = styled(ScrollView)`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Header = styled(View)`
  padding: ${theme.spacing.lg}px;
`;

const RestaurantName = styled(Text)`
  color: ${theme.colors.text};
  font-size: 28px;
  font-weight: bold;
`;

const Section = styled(View)`
  padding: ${theme.spacing.lg}px;
`;

const SectionTitle = styled(Text)`
  color: ${theme.colors.secondary};
  font-size: 18px;
  font-weight: bold;
  margin-bottom: ${theme.spacing.md}px;
`;

const Input = styled(TextInput)`
  background-color: ${theme.colors.surface};
  color: ${theme.colors.text};
  padding: ${theme.spacing.md}px;
  border-radius: ${theme.borderRadius.sm}px;
  margin-bottom: ${theme.spacing.md}px;
`;

const BookButton = styled(TouchableOpacity)`
  background-color: ${theme.colors.secondary};
  padding: ${theme.spacing.lg}px;
  border-radius: ${theme.borderRadius.md}px;
  align-items: center;
  margin: ${theme.spacing.lg}px;
`;

const BookButtonText = styled(Text)`
  color: ${theme.colors.text};
  font-size: 18px;
  font-weight: bold;
`;

const BookingScreen = ({ route, navigation }: any) => {
  const { restaurant } = route.params;
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleBooking = async () => {
    if (!date || !time) {
      Alert.alert("Error", "Please pick a date and time.");
      return;
    }

    try {
      await axios.post('http://localhost:4000/api/bookings', {
        matchId: `demo-user_matched-user`,   // real matchId in production
        restaurantId: restaurant.id || restaurant.restaurantId,
        dateTime: `${date} ${time}`,
        userIds: ['demo-user', 'matched-user'],
      });

      Alert.alert(
        "Booking Confirmed!",
        `Your table at ${restaurant.name} is reserved. Use code PIKE-PAIR-X10 for 10% off.`,
        [{ text: "Awesome", onPress: () => navigation.navigate('Home') }]
      );
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Could not save booking. Is the backend running?");
    }
  };

  return (
    <Container>
      <Header>
        <RestaurantName>{restaurant.name}</RestaurantName>
      </Header>

      <Section>
        <SectionTitle>Pick a Date & Time</SectionTitle>
        <Input
          placeholder="e.g. Tomorrow"
          placeholderTextColor={theme.colors.textSecondary}
          value={date}
          onChangeText={setDate}
        />
        <Input
          placeholder="e.g. 7:00 PM"
          placeholderTextColor={theme.colors.textSecondary}
          value={time}
          onChangeText={setTime}
        />
      </Section>

      <Section>
        <SectionTitle>Couple Details</SectionTitle>
        <Input
          placeholder="Match Name"
          placeholderTextColor={theme.colors.textSecondary}
          editable={false}
          value="Matched with Elena"
        />
      </Section>

      <BookButton onPress={handleBooking}>
        <BookButtonText>Confirm Reservation</BookButtonText>
      </BookButton>
    </Container>
  );
};

export default BookingScreen;
