import React from 'react';
import { StyleSheet, Dimensions, Image, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedGestureHandler,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import { theme } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

const CardContainer = styled(Animated.View)`
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

const InfoSection = styled.View`
  padding: ${theme.spacing.md}px;
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  bottom: 0;
  width: 100%;
`;

const Name = styled.Text`
  color: ${theme.colors.text};
  font-size: 24px;
  font-weight: bold;
`;

const Bio = styled.Text`
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
  };
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

const Card: React.FC<CardProps> = ({ user, onSwipeLeft, onSwipeRight }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: (event) => {
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
    },
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
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <CardContainer style={animatedStyle}>
        <Image
          source={{ uri: user.image }}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
        <InfoSection>
          <Name>{user.name}, {user.age}</Name>
          <Bio>{user.bio}</Bio>
        </InfoSection>
      </CardContainer>
    </PanGestureHandler>
  );
};

export default Card;
