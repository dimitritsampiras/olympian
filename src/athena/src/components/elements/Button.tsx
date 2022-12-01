import * as Haptics from 'expo-haptics';
import React, { ReactNode } from 'react';
import {
  StyleSheet,
  Pressable,
  Text,
  ViewStyle,
  PressableProps,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import theme from '../../theme';

const FULL_GRADIENT = [theme.blue[600], theme.blue[700]];
// const FLAT_GRADIENT = [theme.blue[100], theme.blue[200]];
// const GHOST_GRADIENT = [theme.gray[50], theme.blue[100]];

type ButtonVariant =
  | { full?: true; flat?: never; ghost?: never }
  | { full?: never; flat?: true; ghost?: never }
  | { full?: never; flat?: never; ghost?: true };

interface ButtonProps extends PressableProps {
  // button can't be pressed
  disabled?: boolean;
  // fit-content instead of full width
  auto?: boolean;
  // is button loading
  loading?: boolean;
  // disable button animations or now
  animated?: boolean;
  // show shadow
  shadow?: boolean;
  // container styles
  style?: ViewStyle;
  // single react node i.e. text or icon
  children: ReactNode;
}

/**
 * Button Element
 * @param ButtonProps properties of a button element
 * @returns JSX element
 */
export const Button: React.FC<ButtonProps & ButtonVariant> = ({
  full = true,
  flat,
  ghost,
  auto,
  style,
  disabled,
  loading,
  animated = true,
  shadow = false,
  children,
  onPress,
  ...props
}) => {
  // value for scale animation accessible by js & ui thread
  const scale = useSharedValue(1);
  const color = useSharedValue(1);

  // handle the press in event
  const handleOnPressIn = () => {
    // guard press in if button is disabled
    if (disabled || loading) return;
    // haptic feedback
    Haptics.selectionAsync();
    scale.value = withSpring(0, { mass: 0.1, velocity: 10 });
    color.value = withSpring(0, { mass: 0.1, velocity: 10 });
  };

  // handle the press out event
  const handleOnPressOut: PressableProps['onPressOut'] = (event) => {
    // guard press out if button is disabled
    if (disabled || loading) return;
    if (!onPress) return;
    scale.value = withSpring(1, { mass: 0.1 });
    color.value = withSpring(1, { mass: 0.1 });

    // fire onPress property
    onPress(event);
  };

  const animatedScaleStyle = useAnimatedStyle(() => {
    const gradient = FULL_GRADIENT;

    return {
      transform: [{ scale: interpolate(scale.value, [1, 0], [1, 0.98]) }],
      backgroundColor:
        disabled || loading
          ? interpolateColor(color.value, [1, 0], [theme.blue[300], theme.blue[300]])
          : interpolateColor(color.value, [1, 0], gradient),
    };
  });

  return (
    <Pressable
      style={[auto && styles.auto, { ...style }]}
      onPressIn={handleOnPressIn}
      onPressOut={handleOnPressOut}
      {...props}>
      {({ pressed }) => (
        <Animated.View style={[styles.button, animatedScaleStyle]}>
          {!loading ? (
            <Text style={[styles.text, full && styles.fullText]}>{children}</Text>
          ) : (
            <ActivityIndicator color={'white'} />
          )}
        </Animated.View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  text: {
    fontSize: 17,
    fontWeight: '400',
    letterSpacing: 0.1,
  },
  full: {
    backgroundColor: theme.blue[600],
  },
  fullDisabled: {
    backgroundColor: theme.blue[300],
  },
  fullText: {
    color: '#fff',
  },
  ghost: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  ghostText: {
    color: theme.blue[700],
  },
  flat: {
    backgroundColor: theme.blue[100],
  },
  flatDisabled: {
    backgroundColor: theme.blue[50],
  },
  flatText: {
    color: theme.blue[700],
  },
  flatTextDisabled: {
    color: theme.blue[300],
  },
  buttonShadowBase: {
    shadowColor: theme.blue[600],
    shadowRadius: 6,
    shadowOpacity: 0.35,
    shadowOffset: { height: 10, width: 0 },
  },
  disabled: {
    backgroundColor: theme.gray[200],
  },
  auto: {
    alignSelf: 'flex-start',
  },
});
