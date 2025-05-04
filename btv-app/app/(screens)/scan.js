import { useRef, useContext, useState } from "react";
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
  const [overlayColor, setOverlayColor] = useState("transparent");

  const scanCooldown = useRef(false);
  const scannedCodes = useRef(new Set());

  if (!permission) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="orange" />
        <Text>Comprobando permisos de la cámara...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Se requiere acceso a la cámara para escanear los billetes.</Text>
        <Button
          title="Permitir acceso a la cámara"
          onPress={requestPermission}
        />
      </View>
    );
  }

  async function onBarcodeScanned({ data }) {
    if (scanCooldown.current) return;

    Vibration.vibrate();

    scanCooldown.current = true;

    try {
      if (scannedCodes.current.has(data)) {
        setOverlayColor("rgba(255, 0, 0, 0.6)");
        Alert.alert("Error", "Este billete ya ha sido escaneado.", [
          {
            text: "Ok",
            onPress: () => {
              setOverlayColor("transparent");
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
        setOverlayColor("rgba(0, 255, 0, 0.6)");
        Alert.alert("Success", "El billete es válido", [
          {
            text: "Ok",
            onPress: () => {
              setOverlayColor("transparent");
              scanCooldown.current = false;
            },
          },
        ]);
      } else {
        // If the code is not in the list of "buscadores"
        setOverlayColor("rgba(255, 0, 0, 0.6)");
        Alert.alert("Error", "El código no es válido.", [
          {
            text: "Ok",
            onPress: () => {
              setOverlayColor("transparent");
              scanCooldown.current = false;
            },
          },
        ]);
      }
    } catch (_error) {
      setOverlayColor("rgba(255, 0, 0, 0.6)");
      Alert.alert(
        "Error",
        "Falló la validación del billete. Inténtalo de nuevo.",
        [
          {
            text: "Ok",
            onPress: () => {
              setOverlayColor("transparent");
              scanCooldown.current = false;
            },
          },
        ]
      );
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => {},
          headerTitle: "Escanear billete",
          headerRight: () => {},
        }}
      />
      <View style={styles.container}>
        <CameraView
          style={styles.cameraView}
          facing="back"
          onBarcodeScanned={onBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
        />
        <View
          pointerEvents="none"
          style={[styles.overlay, { backgroundColor: overlayColor }]}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  cameraView: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
