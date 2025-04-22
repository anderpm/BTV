import { useContext } from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";

import { Stack, Link } from "expo-router";

import { TextContext } from "../../components/TextContext";

export default function Service() {
  const { isDataCaptured, buscadores } = useContext(TextContext);

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => {},
          headerTitle: "Service",
          headerRight: () => {},
        }}
      />
      <View style={styles.container}>
        <View style={styles.topSection}>
          <Link href="/ocr" style={styles.link}>
            Capture Data
          </Link>
          {isDataCaptured && <Link href="/scan">Scan</Link>}
        </View>
        <View style={styles.bottomSection}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            style={styles.fullWidth}
          >
            {buscadores.length > 0 ? (
              buscadores.map((buscador, index) => (
                <Text key={index}>{buscador}</Text>
              ))
            ) : (
              <Text>No data captured yet.</Text>
            )}
          </ScrollView>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  topSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSection: {
    flex: 3,
    width: "100%",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  fullWidth: {
    width: "100%",
    alignSelf: "stretch",
  },
});
