import { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

interface SwipeableCardProps {
  children: ReactNode;
  onSwipeLeft?: () => void;  // Archive
  onSwipeRight?: () => void; // Memo/Tags
}

const SWIPE_THRESHOLD = 100;

export default function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
}: SwipeableCardProps) {
  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      const shouldSwipeLeft = event.translationX < -SWIPE_THRESHOLD;
      const shouldSwipeRight = event.translationX > SWIPE_THRESHOLD;

      if (shouldSwipeLeft && onSwipeLeft) {
        translateX.value = withSpring(-500, {}, () => {
          runOnJS(onSwipeLeft)();
        });
      } else if (shouldSwipeRight && onSwipeRight) {
        translateX.value = withSpring(500, {}, () => {
          runOnJS(onSwipeRight)();
        });
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const leftActionStyle = useAnimatedStyle(() => {
    const opacity = translateX.value > 0 ? translateX.value / SWIPE_THRESHOLD : 0;
    return {
      opacity: Math.min(opacity, 1),
    };
  });

  const rightActionStyle = useAnimatedStyle(() => {
    const opacity = translateX.value < 0 ? -translateX.value / SWIPE_THRESHOLD : 0;
    return {
      opacity: Math.min(opacity, 1),
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.actionContainer, styles.leftAction, leftActionStyle]}>
        <Text style={styles.actionText}>메모 추가</Text>
      </Animated.View>

      <Animated.View style={[styles.actionContainer, styles.rightAction, rightActionStyle]}>
        <Text style={styles.actionText}>아카이브</Text>
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={animatedStyle}>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  actionContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    zIndex: 0,
  },
  leftAction: {
    left: 0,
    backgroundColor: '#10b981',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    marginLeft: 16,
    marginVertical: 8,
  },
  rightAction: {
    right: 0,
    backgroundColor: '#ef4444',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    marginRight: 16,
    marginVertical: 8,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
