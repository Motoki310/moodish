import React from "react";
import { StyleSheet, Text, View } from "react-native";
import GlassCard from "./GlassCard";
import { colors } from "../theme/theme";
import type { Restaurant } from "../types";

export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <GlassCard style={styles.card} radiusSize="md">
      <Text style={styles.name}>{restaurant.name}</Text>
      <Text style={styles.meta}>
        {restaurant.genre} ・ {restaurant.area} ・ {restaurant.budget}
      </Text>
      <Text style={styles.meta}>
        {restaurant.seat} ・ {restaurant.mood}
      </Text>
      <Text style={styles.catch}>{restaurant.catch}</Text>
      <View style={styles.tagRow}>
        {restaurant.tags.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 14,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  meta: {
    fontSize: 13,
    color: colors.textSub,
    marginBottom: 2,
  },
  catch: {
    fontSize: 13,
    color: colors.text,
    marginTop: 8,
    lineHeight: 20,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10,
  },
  tag: {
    backgroundColor: colors.primaryLight,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  tagText: {
    fontSize: 11,
    color: colors.primaryDarker,
    fontWeight: "600",
  },
});
