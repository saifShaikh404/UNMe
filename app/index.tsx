import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function App() {
  const colorScheme = useColorScheme();
  const theme = colorScheme ?? "light";
  const colors = Colors[theme];

  const router = useRouter();

  const [name, setName] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // 🔥 CHECK STORAGE ON LOAD
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const storedName = await AsyncStorage.getItem("name");

      if (storedName) {
        // redirect to tabs
        router.replace("/(tabs)");
      }
    } catch (err) {
      console.log("Storage error:", err);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;

    try {
      await AsyncStorage.setItem("name", name);

      // redirect after saving
      router.replace("/(tabs)");
    } catch (err) {
      console.log("Save error:", err);
    }
  };

  return (
    <ThemedView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.cardBackground || "#fff",
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.text }]}>
          Welcome 👋
        </Text>

        <Text style={[styles.label, { color: colors.icon }]}>
          Enter your name
        </Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="John Doe"
          placeholderTextColor={colors.icon}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.input,
            {
              color: colors.text,
              borderColor: isFocused ? colors.primary : colors.border,
              backgroundColor: colors.background,
            },
          ]}
        />

        <TouchableOpacity
          onPress={handleSubmit}
          activeOpacity={0.8}
          style={[
            styles.button,
            {
              backgroundColor: colors.primary,
            },
          ]}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    borderRadius: 20,
    padding: 24,
    gap: 16,
    elevation: 6,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },

  label: {
    fontSize: 14,
    marginTop: 4,
  },

  input: {
    width: "100%",
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },

  button: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    elevation: 4,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});