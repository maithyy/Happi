import React from "react";
import { ActivityIndicator, View } from "react-native";
import { styles } from "../styles";

const LoadingScreen = () => (
  <View style={styles.centeredContainer}>
    <ActivityIndicator size="large" />
  </View>
);

export default LoadingScreen;
