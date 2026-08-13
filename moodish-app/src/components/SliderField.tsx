import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import { colors } from "../theme/theme";

interface Props {
  label: string;
  value: number;
  minimumValue: number;
  maximumValue: number;
  step: number;
  onValueChange: (v: number) => void;
  valueLabel: string;
}

/** 予算スライダー・雰囲気スライダー共通の単一レンジスライダー */
export default function SliderField({
  label,
  value,
  minimumValue,
  maximumValue,
  step,
  onValueChange,
  valueLabel,
}: Props) {
  return (
    <View style={styles.field}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{valueLabel}</Text>
      </View>
      <Slider
        value={value}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        onValueChange={onValueChange}
        minimumTrackTintColor={colors.primaryDark}
        maximumTrackTintColor={colors.primaryLight}
        thumbTintColor={colors.primaryDarker}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    color: colors.textSub,
  },
  value: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primaryDarker,
  },
});
