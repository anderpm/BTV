import { View, StyleSheet } from "react-native";

import { Link } from "expo-router";

export default function Main() {
  return (
    <View style={styles.container}>
      <Link href="/service">Servicio</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
