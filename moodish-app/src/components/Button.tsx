import React from "react";
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { colors, radius, shadow } from "../theme/theme";

interface Props {
  title: string;
  onPress: (e: GestureResponderEvent) => void;
  variant?: "primary" | "secondary" | "danger";
  style?: ViewStyle;
  disabled?: boolean;
}

export default function Button({ title, onPress, variant = "primary", style, disabled }: Props) {
  const variantStyle =
    variant === "primary" ? styles.primary : variant === "danger" ? styles.danger : styles.secondary;
  const textVariantStyle =
    variant === "secondary" ? styles.secondaryText : styles.lightText;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      style={[styles.base, variantStyle, shadow.soft, disabled && styles.disabled, style]}
    >
      <Text style={[styles.text, textVariantStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: colors.primaryDark,
  },
  secondary: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 15,
    fontWeight: "700",
  },
  lightText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.text,
  },
});
