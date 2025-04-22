import { View, Text, StyleSheet } from "react-native";

import { Stack } from "expo-router";

import { TextProvider } from "../components/TextContext";

export default function Layout() {
  return (
    <TextProvider>
      <View style={styles.container}>
        <Stack
          screenOptions={{
            headerTitle: "",
            headerLeft: () => <Text style={styles.logo}>BTV</Text>,
          }}
        />
      </View>
    </TextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    fontSize: 24,
    color: "orange",
  },
});
