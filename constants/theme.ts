/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#6366F1";
const tintColorDark = "#818CF8";

// Modern boxy color palette
export const AccentColors = {
  primary: "#6366F1",
  secondary: "#8B5CF6",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",
  purple: "#A855F7",
  pink: "#EC4899",
  orange: "#F97316",
  teal: "#14B8A6",
  indigo: "#6366F1",
  gradient: {
    start: "#6366F1",
    end: "#8B5CF6",
  },
};

export const Colors = {
  light: {
    text: "#F9FAFB",
    background: "#111827",
    tint: tintColorDark,
    icon: "#9CA3AF",
    tabIconDefault: "#6B7280",
    tabIconSelected: tintColorDark,
    headerBackground: "#1F2937",
    border: "#374151",
    borderDark: "#6B7280",
    cardBackground: "#1F2937",
    shadow: "rgba(0, 0, 0, 0.4)",
    // Accent colors (slightly brighter for dark mode)
    primary: "#818CF8",
    secondary: "#A78BFA",
    success: "#34D399",
    warning: "#FBBF24",
    error: "#F87171",
    info: "#60A5FA",
    purple: "#C084FC",
    pink: "#F472B6",
    // Gradient colors
    gradientStart: "#818CF8",
    gradientEnd: "#A78BFA",
    // Dark mode specific
    accentLight: "rgba(129, 140, 248, 0.15)",
    accentMedium: "rgba(129, 140, 248, 0.25)",
    // Border colors for boxy design (darker)
    borderBottom: "#6B7280",
    borderRight: "#6B7280",
    borderTop: "#374151",
    borderLeft: "#374151",
  },
  dark: {
    text: "#F9FAFB",
    background: "#111827",
    tint: tintColorDark,
    icon: "#9CA3AF",
    tabIconDefault: "#6B7280",
    tabIconSelected: tintColorDark,
    headerBackground: "#1F2937",
    border: "#374151",
    borderDark: "#6B7280",
    cardBackground: "#1F2937",
    shadow: "rgba(0, 0, 0, 0.4)",
    // Accent colors (slightly brighter for dark mode)
    primary: "#818CF8",
    secondary: "#A78BFA",
    success: "#34D399",
    warning: "#FBBF24",
    error: "#F87171",
    info: "#60A5FA",
    purple: "#C084FC",
    pink: "#F472B6",
    // Gradient colors
    gradientStart: "#818CF8",
    gradientEnd: "#A78BFA",
    // Dark mode specific
    accentLight: "rgba(129, 140, 248, 0.15)",
    accentMedium: "rgba(129, 140, 248, 0.25)",
    // Border colors for boxy design (darker)
    borderBottom: "#6B7280",
    borderRight: "#6B7280",
    borderTop: "#374151",
    borderLeft: "#374151",
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
