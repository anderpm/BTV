import { useRef, useContext } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  Button,
  Alert,
  Vibration,
  StyleSheet,
} from "react-native";

import { Stack } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";

import { TextContext } from "../../components/TextContext";

export default function Scan() {
  const { buscadores } = useContext(TextContext);

  const [permission, requestPermission] = useCameraPermissions();

  const scanCooldown = useRef(false);
  const scannedCodes = useRef(new Set());

  if (!permission) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="orange" />
        <Text>Checking camera permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Camera access is required to scan tickets.</Text>
        <Button title="Allow Camera Access" onPress={requestPermission} />
      </View>
    );
  }

  async function onBarcodeScanned({ data }) {
    if (scanCooldown.current) return;

    Vibration.vibrate();

    scanCooldown.current = true;

    try {
      if (scannedCodes.current.has(data)) {
        Alert.alert("Error", "This code has already been scanned.", [
          {
            text: "Ok",
            onPress: () => {
              scanCooldown.current = false;
            },
          },
        ]);
        return;
      }

      // Extract the part before the dash from the QR code
      const codePart = data.split("-")[0];

      if (buscadores.includes(codePart)) {
        // If the code exists in the list of "buscadores"
        scannedCodes.current.add(data);
        Alert.alert("Success", "The code is valid!", [
          {
            text: "Ok",
            onPress: () => {
              scanCooldown.current = false;
            },
          },
        ]);
      } else {
        // If the code is not in the list of "buscadores"
        Alert.alert("Error", "The code is not valid.", [
          {
            text: "Ok",
            onPress: () => {
              scanCooldown.current = false;
            },
          },
        ]);
      }
    } catch (_error) {
      Alert.alert("Error", "Failed to validate ticket. Please try again.", [
        {
          text: "Ok",
          onPress: () => {
            scanCooldown.current = false;
          },
        },
      ]);
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => {},
          headerTitle: "Scan ticket",
          headerRight: () => {},
        }}
      />
      <CameraView
        style={styles.cameraView}
        facing="back"
        onBarcodeScanned={onBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraView: {
    flex: 1,
  },
});
