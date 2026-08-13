import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import ProposalScreen from "./src/screens/ProposalScreen";
import AdminScreen from "./src/screens/AdminScreen";
import { colors } from "./src/theme/theme";

const Tab = createBottomTabNavigator();

function Header({ title }: { title: string }) {
  return (
    <View style={styles.header}>
      <Text style={styles.logo}>🌸 デートスポット提案 <Text style={styles.beta}>β</Text></Text>
      <Text style={styles.headerSubtitle}>{title}</Text>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={[colors.gradientTop, colors.gradientMid, colors.gradientBottom]}
        style={styles.root}
      >
        <View pointerEvents="none" style={[styles.blob, styles.blobTop]} />
        <View pointerEvents="none" style={[styles.blob, styles.blobBottom]} />
        <SafeAreaView style={styles.flexFill} edges={["top"]}>
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                header: () => (
                  <Header title={route.name === "提案" ? "お店を提案してもらう" : "管理者用"} />
                ),
                tabBarActiveTintColor: colors.primaryDarker,
                tabBarInactiveTintColor: colors.textSub,
                tabBarStyle: styles.tabBar,
                sceneContainerStyle: styles.transparentBg,
              })}
            >
              <Tab.Screen name="提案" component={ProposalScreen} />
              <Tab.Screen name="管理者用" component={AdminScreen} />
            </Tab.Navigator>
          </NavigationContainer>
          <StatusBar style="dark" />
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flexFill: {
    flex: 1,
  },
  transparentBg: {
    backgroundColor: "transparent",
  },
  blob: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 999,
    opacity: 0.35,
  },
  blobTop: {
    top: -120,
    left: -100,
    backgroundColor: colors.blobTopMid,
  },
  blobBottom: {
    bottom: -120,
    right: -100,
    backgroundColor: colors.blobBottomMid,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.glassBgStrong,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logo: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  beta: {
    fontSize: 11,
    color: colors.primaryDarker,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSub,
    marginTop: 2,
  },
  tabBar: {
    backgroundColor: colors.glassBgStrong,
    borderTopColor: colors.border,
  },
});
