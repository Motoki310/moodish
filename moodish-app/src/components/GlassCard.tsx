import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { BlurView } from "expo-blur";
import { colors, radius, shadow } from "../theme/theme";

type Props = ViewProps & {
  strong?: boolean;
  radiusSize?: keyof typeof radius;
};

/** グラスモーフィズム風のカード(元CSSの .card / .glass 系スタイルを移植) */
export default function GlassCard({ style, strong, radiusSize = "lg", children, ...rest }: Props) {
  return (
    <View
      style={[
        styles.wrap,
        { borderRadius: radius[radiusSize] },
        shadow.crystal,
        style,
      ]}
      {...rest}
    >
      <BlurView
        intensity={40}
        tint="light"
        style={[
          StyleSheet.absoluteFill,
          { borderRadius: radius[radiusSize] },
        ]}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius: radius[radiusSize],
            backgroundColor: strong ? colors.glassBgStrong : colors.glassBg,
            borderWidth: 1,
            borderColor: colors.glassBorder,
          },
        ]}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: "hidden",
  },
  content: {
    padding: 20,
  },
});
