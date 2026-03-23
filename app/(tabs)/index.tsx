import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { createBoxyStyle } from "@/utils/boxy-styles";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Video } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme ?? "light";
  const colors = Colors[theme];

  const flatListRef = useRef<FlatList>(null);

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      type: "text",
      text: "Hello 👋",
      sender: "receiver",
    },
    {
      type: "text",
      text: "Welcome to the chat interface.",
      sender: "receiver",
    },

    // IMAGE MESSAGE
    {
      type: "image",
      uri: "https://picsum.photos/400/400",
      sender: "receiver",
    },

    {
      type: "text",
      text: "Here is an image example.",
      sender: "receiver",
    },

    // VIDEO MESSAGE
    {
      type: "video",
      uri: "https://www.w3schools.com/html/mov_bbb.mp4",
      sender: "sender",
    },

    {
      type: "text",
      text: "Nice UI!",
      sender: "sender",
    },
  ]);

  const [loadingMore, setLoadingMore] = useState(false);

  /* DOWNLOAD MEDIA */

  const downloadMedia = async (uri: string) => {
    try {
      const permission = await MediaLibrary.requestPermissionsAsync();

      if (!permission.granted) {
        alert("Permission required to save media.");
        return;
      }

      const filename = uri.split("/").pop();
      const fileUri = FileSystem.documentDirectory + filename;

      const download = await FileSystem.downloadAsync(uri, fileUri);

      await MediaLibrary.saveToLibraryAsync(download.uri);

      alert("Saved to gallery");
    } catch (err) {
      console.log(err);
      alert("Download failed");
    }
  };

  /* SEND TEXT MESSAGE */

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessages = [
      { type: "text", text: message, sender: "sender" },
      ...messages,
    ];

    setMessages(newMessages);
    setMessage("");

    setTimeout(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 50);
  };

  /* PICK MEDIA */

  const pickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];

      const type = asset.type === "video" ? "video" : "image";

      const newMessage = {
        type,
        uri: asset.uri,
        sender: "sender",
      };

      setMessages((prev) => [newMessage, ...prev]);

      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }, 50);
    }
  };

  /* LOAD MORE MESSAGES */

  const loadMoreMessages = async () => {
    if (loadingMore) return;

    setLoadingMore(true);

    setTimeout(() => {
      const olderMessages = [
        { type: "text", text: "Older message 1", sender: "receiver" },
        { type: "text", text: "Older message 2", sender: "sender" },
      ];

      setMessages((prev) => [...prev, ...olderMessages]);

      setLoadingMore(false);
    }, 1000);
  };

  /* RENDER MESSAGE */

  const renderMessage = ({ item }: any) => {
    const isSender = item.sender === "sender";

    return (
      <View
        style={[
          styles.messageRow,
          isSender ? styles.rowRight : styles.rowLeft,
        ]}>
        {/* MEDIA OR TEXT */}

        <View
          style={[
            styles.messageBubble,
            isSender
              ? { backgroundColor: colors.primary }
              : { backgroundColor: colors.accentLight },
          ]}>
          {item.type === "text" && (
            <Text style={{ color: isSender ? "#fff" : colors.text }}>
              {item.text}
            </Text>
          )}

          {item.type === "image" && (
            <Image source={{ uri: item.uri }} style={styles.chatImage} />
          )}

          {item.type === "video" && (
            <Video
              source={{ uri: item.uri }}
              style={styles.chatVideo}
              useNativeControls
              resizeMode="contain"
            />
          )}
        </View>

        {/* DOWNLOAD BUTTON */}

        {(item.type === "image" || item.type === "video") && (
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={() => downloadMedia(item.uri)}>
            <Ionicons name="download-outline" size={20} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}>
      {/* TOP BOXES */}

      <View style={styles.topContainer}>
        <View
          style={[
            styles.topBox,
            createBoxyStyle(
              colors.cardBackground,
              colors.borderBottom,
              colors.borderRight,
              10,
              colors.borderTop,
              colors.borderLeft,
            ),
          ]}>
          <View style={styles.boxHeader}>
            <Text style={[styles.boxLabel, { color: colors.text }]}>
              Feature A
            </Text>

            <TouchableOpacity
              style={[
                styles.smallButton,
                createBoxyStyle(
                  colors.primary,
                  colors.borderDark,
                  colors.borderDark,
                  6,
                  colors.borderTop,
                  colors.borderLeft,
                ),
              ]}>
              <Text style={styles.buttonText}>Go</Text>
            </TouchableOpacity>
          </View>

          <Image
            source={{ uri: "https://via.placeholder.com/120" }}
            style={styles.boxImage}
          />

          <Text style={[styles.imageLabel, { color: colors.icon }]}>
            Quick Access
          </Text>
        </View>

        <View
          style={[
            styles.topBox,
            createBoxyStyle(
              colors.cardBackground,
              colors.borderBottom,
              colors.borderRight,
              10,
              colors.borderTop,
              colors.borderLeft,
            ),
          ]}>
          <View style={styles.boxHeader}>
            <Text style={[styles.boxLabel, { color: colors.text }]}>
              Feature B
            </Text>

            <TouchableOpacity
              style={[
                styles.smallButton,
                createBoxyStyle(
                  colors.primary,
                  colors.borderDark,
                  colors.borderDark,
                  6,
                  colors.borderTop,
                  colors.borderLeft,
                ),
              ]}>
              <Text style={styles.buttonText}>Open</Text>
            </TouchableOpacity>
          </View>

          <Image
            source={{ uri: "https://via.placeholder.com/120" }}
            style={styles.boxImage}
          />

          <Text style={[styles.imageLabel, { color: colors.icon }]}>
            Dashboard
          </Text>
        </View>
      </View>

      {/* CHAT */}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.chatContainer}>
        <View
          style={[
            styles.chatBox,
            createBoxyStyle(
              colors.cardBackground,
              colors.borderBottom,
              colors.borderRight,
              10,
              colors.borderTop,
              colors.borderLeft,
            ),
          ]}>
          <FlatList
            ref={flatListRef}
            data={messages}
            inverted
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderMessage}
            style={styles.messages}
            onEndReached={loadMoreMessages}
            onEndReachedThreshold={0.2}
          />

          {/* INPUT */}

          <View style={styles.inputContainer}>
            <TouchableOpacity
              onPress={pickMedia}
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
              <Ionicons name="attach" size={20} color={colors.text} />
            </TouchableOpacity>

            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Type message..."
              placeholderTextColor={colors.icon}
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                },
              ]}
            />

            <TouchableOpacity
              onPress={handleSend}
              style={[
                styles.iconButton,
                createBoxyStyle(
                  colors.primary,
                  colors.borderDark,
                  colors.borderDark,
                  6,
                  colors.borderTop,
                  colors.borderLeft,
                ),
              ]}>
              <Ionicons name="send" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },

  topContainer: { height: "35%", flexDirection: "row", gap: 12 },

  topBox: { flex: 1, padding: 12, justifyContent: "space-between" },

  boxHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  boxLabel: { fontSize: 14, fontWeight: "600" },

  smallButton: { paddingHorizontal: 10, paddingVertical: 4 },

  buttonText: { color: "#fff", fontWeight: "600" },

  boxImage: { width: 110, height: 110, alignSelf: "center" },

  imageLabel: { textAlign: "center", fontSize: 13, marginTop: 6 },

  chatContainer: { flex: 1, marginTop: 12 },

  chatBox: { flex: 1, padding: 12 },

  messages: { flex: 1 },

  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  rowLeft: {
    justifyContent: "flex-start",
  },

  rowRight: {
    justifyContent: "flex-end",
  },

  messageBubble: {
    padding: 10,
    borderRadius: 8,
    maxWidth: "75%",
  },

  chatImage: {
    width: 220,
    height: 220,
    borderRadius: 10,
  },

  chatVideo: {
    width: 220,
    height: 220,
    borderRadius: 10,
  },

  downloadButton: {
    marginHorizontal: 8,
  },

  inputContainer: { flexDirection: "row", alignItems: "center", gap: 8 },

  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
