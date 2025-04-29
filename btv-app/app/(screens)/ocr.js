import { useState, useContext } from "react";
import {
  SafeAreaView,
  View,
  Button,
  Image,
  ActivityIndicator,
  Text,
  StyleSheet,
} from "react-native";

import { Stack } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import { TextContext } from "../../components/TextContext";

export default function Ocr() {
  // State to hold the selected image
  const [image, setImage] = useState(null);
  // State to hold extracted text
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const { setIsDataCaptured } = useContext(TextContext);
  const { setBuscadores } = useContext(TextContext);

  // Function to pick an image from the device's gallery
  const pickImageGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      base64: true,
      allowsMultipleSelection: false,
    });
    if (!result.canceled) {
      // Perform OCR on the selected image
      performOCR(result.assets[0]);
      // Set the selected image in state
      setImage(result.assets[0].uri);
    }
  };

  // Function to capture an image using the device's camera
  const pickImageCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      base64: true,
      allowsMultipleSelection: false,
    });
    if (!result.canceled) {
      // Perform OCR on the captured image
      performOCR(result.assets[0]);
      // Set the captured image in state
      setImage(result.assets[0].uri);
    }
  };

  // Function to perform OCR on an image and extract text
  const performOCR = (file) => {
    // Enable loading indicator
    setLoading(true);
    const myHeaders = {
      apikey: "FEmvQr5uj99ZUvk3essuYb6P5lLLBS20",
      "Content-Type": "multipart/form-data",
    };

    let raw = file;
    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    // Send a POST request to the OCR API
    fetch("https://api.apilayer.com/image_to_text/upload", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (!result || !result["all_text"]) {
          throw new Error("No text extracted from image");
        }

        // Set the extracted text in state
        setExtractedText(result["all_text"]);
        setIsDataCaptured(true);

        const buscadores = Array.from(
          result["all_text"].matchAll(/BUSCADOR:\s*(\w+)/g),
          (match) => match[1] // Capture only the group with the "buscador" value
        );
        setBuscadores(buscadores);
      })
      .catch((error) => {
        setError(true);
        console.error("Error:", error);
        setExtractedText("");
      })
      .finally(() => setLoading(false)); // Disable loading indicator
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => {},
          headerTitle: "OCR",
          headerRight: () => {},
        }}
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.topSection}>
          <Button
            title="Seleccionar una imagen de la galería"
            onPress={pickImageGallery}
          />
          <Button title="Tomar una foto con la cámara" onPress={pickImageCamera} />
        </View>
        <View style={styles.middleSection}>
          {image && (
            <Image
              source={{ uri: image }}
              style={{
                width: 400,
                height: 300,
                objectFit: "contain",
              }}
            />
          )}
        </View>
        <View style={styles.bottomSection}>
          {loading ? (
            <ActivityIndicator color="orange" />
          ) : error ? (
            <Text style={styles.errorText}>Error al capturar los datos</Text>
          ) : extractedText.trim() !== "" ? (
            <Text style={styles.successText}>Datos capturados con éxito</Text>
          ) : null}
        </View>
      </SafeAreaView>
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
  middleSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  successText: {
    color: "green",
  },
  errorText: {
    color: "red",
  },
});
