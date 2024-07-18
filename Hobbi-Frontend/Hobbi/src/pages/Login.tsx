import { useState } from "react";
import {
  Text,
  View,
  Button,
  Pressable,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { type StackNavigation } from "../../App";
import { login } from "../services/auth";
import { styles } from "../styles";
import { MaterialCommunityIcons, FontAwesome6 } from "@expo/vector-icons";

const Login = () => {
  const { navigate } = useNavigation<StackNavigation>();

  const happi_logo = require("../../assets/happi_logo.png");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailMessage, setShowEmailMessage] = useState(false);

  const handleSignup = () => {
    navigate("Register");
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      console.log(email, password);
      const user = await login(email, password);
      if (user) {
        // if (!user.emailVerified) {
        //   console.log("Email not verified");
        //   setShowEmailMessage(true);
        //   await emailVerification();
        //   await logout();
        //   setIsLoading(false);
        // }
        console.log("Logged in", user);
        navigate("Main");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.centeredContainer}>
        <Image source={happi_logo}></Image>
        <Text style={styles.loginTitle}>Happi</Text>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="email-outline" size={24} color="#ccc" style={styles.icon} />
          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            style={styles.loginTextInput}
          ></TextInput>
        </View>
        <View style={styles.inputContainer}>
          <FontAwesome6 name="lock" size={24} color="#ccc" style={styles.icon} />
          <TextInput
            secureTextEntry={true}
            placeholder="Password"
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
            style={styles.loginTextInput}
          ></TextInput>
        </View>

        <Pressable onPress={() => handleLogin()} style={styles.loginButton}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
        <TouchableOpacity onPress={handleSignup}>
          <Text style={styles.signUpSmallText}>Don't have an account? <Text style={{textDecorationLine: 'underline'}}>Sign Up</Text></Text>
        </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default Login;
