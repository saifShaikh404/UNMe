import { ViewStyle } from 'react-native';

/**
 * Creates a boxy style with borders on all sides
 * Bottom and right borders are thicker (3px), top and left are thinner (1px)
 * This gives a retro/neomorphic look with depth
 */
export const createBoxyStyle = (
  backgroundColor: string,
  borderBottomColor: string,
  borderRightColor: string,
  borderRadius: number = 8,
  borderTopColor?: string,
  borderLeftColor?: string,
): ViewStyle => {
  return {
    backgroundColor,
    borderRadius,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderBottomColor,
    borderRightColor,
    borderTopColor: borderTopColor || borderBottomColor,
    borderLeftColor: borderLeftColor || borderRightColor,
  };
};

/**
 * Creates a pressed/active boxy style (inverted borders)
 */
export const createPressedBoxyStyle = (
  backgroundColor: string,
  borderTopColor: string,
  borderLeftColor: string,
  borderRadius: number = 8,
): ViewStyle => {
  return {
    backgroundColor,
    borderRadius,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopColor,
    borderLeftColor,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  };
};

