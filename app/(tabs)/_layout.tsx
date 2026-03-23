import { Tabs, useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { ThemedText } from "@/components/themed-text";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { createBoxyStyle } from "@/utils/boxy-styles";

export default function TabLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = colorScheme ?? "light";
  const colors = Colors[theme];

  const menuItems = [
    {
      label: "Settings",
      onPress: () => {
        console.log("Settings pressed");
      },
    },
    {
      label: "About",
      onPress: () => {
        console.log("About pressed");
      },
    },
    {
      label: "Help",
      onPress: () => {
        console.log("Help pressed");
      },
    },
  ];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: colors.headerBackground,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border,
          height: Platform.OS === "ios" ? 94 : 80,
          paddingBottom: Platform.OS === "ios" ? 28 : 8,
          paddingTop: 8,
          ...Platform.select({
            ios: {
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
            },
            android: {
              elevation: 8,
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
          marginBottom: 4,
        },
        headerStyle: {
          backgroundColor: colors.headerBackground,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
          ...Platform.select({
            ios: {
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
            android: {
              elevation: 4,
            },
          }),
        },
        headerTintColor: colors.text,
        headerTitle: () => null,
        headerRight: ({ tintColor }) => (
          <View style={styles.headerRight}>
            <View
              style={[
                styles.iconButton,
                createBoxyStyle(
                  colors.accentLight,
                  colors.borderBottom,
                  colors.borderRight,
                  6,
                  colors.borderTop,
                  colors.borderLeft,
                ),
              ]}>
              <DropdownMenu
                items={menuItems}
                trigger={
                  <IconSymbol
                    name="ellipsis"
                    size={22}
                    color={colors.primary}
                  />
                }
              />
            </View>
          </View>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Me",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconContainerFocused,
              ]}>
              <IconSymbol size={24} name="face.smiling.fill" color={color} />
            </View>
          ),
          headerLeft: ({ tintColor }) => (
            <View style={styles.headerLeft}>
              <ThemedText
                type="title"
                style={[styles.headerTitle, { color: tintColor }]}>
                Me
              </ThemedText>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="jokes"
        options={{
          title: "Admin",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconContainerFocused,
              ]}>
              <IconSymbol size={24} name="person.fill" color={color} />
            </View>
          ),
          headerLeft: ({ tintColor }) => (
            <View style={styles.headerLeft}>
              <ThemedText
                type="title"
                style={[styles.headerTitle, { color: tintColor }]}>
                Admin
              </ThemedText>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerLeft: {
    marginLeft: 20,
    justifyContent: "center",
  },
  headerRight: {
    marginRight: 20,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  iconButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  iconContainerFocused: {
    backgroundColor: "rgba(0, 122, 255, 0.15)",
  },
});
