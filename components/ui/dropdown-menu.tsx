import React, { useState, useRef } from 'react';
import { Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View, Platform, Animated, Text, Dimensions } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { createBoxyStyle } from '@/utils/boxy-styles';

type MenuItem = {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
};

type DropdownMenuProps = {
  items: MenuItem[];
  trigger: React.ReactNode;
  position?: 'top-right' | 'bottom-right' | 'bottom-left';
};

export function DropdownMenu({ items, trigger, position = 'top-right' }: DropdownMenuProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(0));
  const [triggerLayout, setTriggerLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const triggerRef = useRef<View>(null);
  const colorScheme = useColorScheme();
  const theme = colorScheme ?? 'light';
  const colors = Colors[theme];

  const handleToggle = () => {
    if (!isVisible) {
      // Measure trigger position
      triggerRef.current?.measureInWindow((x, y, width, height) => {
        setTriggerLayout({ x, y, width, height });
        setIsVisible(true);
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 65,
          friction: 8,
        }).start();
      });
    } else {
      closeMenu();
    }
  };

  const closeMenu = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setIsVisible(false);
    });
  };

  const handleItemPress = (onPress: () => void) => {
    onPress();
    closeMenu();
  };

  const animatedStyle = {
    transform: [
      { scale: scaleAnim },
      {
        translateY: scaleAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-10, 0],
        }),
      },
    ],
    opacity: scaleAnim,
  };

  const getMenuPosition = () => {
    if (position === 'bottom-right' || position === 'bottom-left') {
      // Position below the trigger
      const screenWidth = Dimensions.get('window').width;
      const menuWidth = 200;
      
      if (position === 'bottom-right') {
        // Align right edge of menu with right edge of trigger
        const right = screenWidth - triggerLayout.x - triggerLayout.width;
        return {
          top: triggerLayout.y + triggerLayout.height - 32,
          right: right,
        };
      } else {
        // bottom-left - align left edge of menu with left edge of trigger
        return {
          top: triggerLayout.y + triggerLayout.height + 8,
          left: triggerLayout.x,
        };
      }
    } else {
      // Default: top-right (for header menu)
      return {
        top: Platform.OS === 'ios' ? 60 : 50,
        right: 20,
      };
    }
  };

  return (
    <>
      <View ref={triggerRef} collapsable={false}>
        <TouchableOpacity onPress={handleToggle} activeOpacity={0.6}>
          {trigger}
        </TouchableOpacity>
      </View>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={closeMenu}>
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={styles.modalOverlay}>
            <Animated.View 
              style={[
                animatedStyle,
                position === 'bottom-right' || position === 'bottom-left' 
                  ? { position: 'absolute', ...getMenuPosition() }
                  : styles.menuPosition,
              ]}>
              <ThemedView
                style={[
                  styles.menuContainer,
                  createBoxyStyle(colors.cardBackground, colors.borderBottom, colors.borderRight, 8, colors.borderTop, colors.borderLeft),
                ]}>
                {items.map((item, index) => {
                  const itemColors = [
                    colors.primary,
                    colors.success,
                    colors.secondary,
                    colors.info,
                  ];
                  const itemColor = itemColors[index % itemColors.length];
                  
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.menuItem,
                        index < items.length - 1 && {
                          borderBottomWidth: StyleSheet.hairlineWidth,
                          borderBottomColor: colors.border,
                        },
                      ]}
                      onPress={() => handleItemPress(item.onPress)}
                      activeOpacity={0.5}>
                      <View style={[styles.menuItemIndicator, { backgroundColor: itemColor }]} />
                      {item.icon && <View style={styles.menuItemIcon}>{item.icon}</View>}
                      <Text 
                        style={[styles.menuItemText, { color: itemColor }]}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ThemedView>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  menuPosition: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 50,
    right: 20,
  },
  menuContainer: {
    minWidth: 200,
    paddingVertical: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  menuItemIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: 12,
  },
  menuItemIcon: {
    marginRight: 12,
    width: 20,
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    letterSpacing: 0.2,
  },
});

