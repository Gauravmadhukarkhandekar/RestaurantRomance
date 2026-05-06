import React from 'react';
import { StyleSheet, Dimensions, Image, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import { theme } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

const CardContainer = styled(View)`
  width: ${SCREEN_WIDTH * 0.9}px;
  height: ${SCREEN_WIDTH * 1.3}px;
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg}px;
  overflow: hidden;
  position: absolute;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

const InfoSection = styled(View)`
  padding: ${theme.spacing.md}px;
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  bottom: 0;
  width: 100%;
`;

const Name = styled(Text)`
  color: ${theme.colors.text};
  font-size: 24px;
  font-weight: bold;
`;

const Bio = styled(Text)`
  color: ${theme.colors.textSecondary};
  font-size: 16px;
  margin-top: 4px;
`;

interface CardProps {
  user: {
    id: string;
    name: string;
    age: number;
    bio: string;
    image: string;
    preferredRestaurant?: {
      name: string;
      cuisine: string;
      neighborhood: string;
    };
  };
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

const Card: React.FC<CardProps> = ({ user, onSwipeLeft, onSwipeRight }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateX.value = startX.value + event.translationX;
      translateY.value = startY.value + event.translationY;
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        if (event.translationX > 0) {
          translateX.value = withSpring(SCREEN_WIDTH * 1.5);
          onSwipeRight();
        } else {
          translateX.value = withSpring(-SCREEN_WIDTH * 1.5);
          onSwipeLeft();
        }
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-10, 0, 10],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={animatedStyle}>
        <CardContainer>
          <Image
            source={{ uri: user.image }}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
          />
          <View style={{ position: 'absolute', top: 16, right: 16, backgroundColor: 'rgba(184, 115, 51, 0.9)', padding: 8, borderRadius: 12 }}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>PIKE PLACE PAIR</Text>
          </View>
          
          <InfoSection>
            <Name>{user.name}, {user.age}</Name>
            <Bio>{user.bio}</Bio>
            
            {user.preferredRestaurant && (
              <View style={{ marginTop: 12, padding: 12, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, borderLeftWidth: 4, borderLeftColor: theme.colors.secondary }}>
                <Text style={{ color: theme.colors.secondary, fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' }}>Wants to go to:</Text>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>{user.preferredRestaurant.name}</Text>
                <Text style={{ color: '#A0A0B0', fontSize: 12 }}>{user.preferredRestaurant.cuisine} • {user.preferredRestaurant.neighborhood}</Text>
              </View>
            )}
          </InfoSection>
        </CardContainer>
      </Animated.View>
    </GestureDetector>
  );
};

export default Card;
