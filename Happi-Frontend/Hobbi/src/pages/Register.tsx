import { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Button,
  Pressable,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { type StackNavigation } from "../../App";
import { signup } from "../services/auth";
import { styles } from "../styles";
import { type FirebaseError } from "firebase/app";
import { saveUserData } from "../services/firebaseDatabase";
import { MaterialCommunityIcons, Ionicons, FontAwesome6 } from "@expo/vector-icons";

const Register = () => {
  const { navigate } = useNavigation<StackNavigation>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const happi_logo = require("../../assets/happi_logo.png");

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      const user = await signup(email, password);
      if (user) {
        const id = user.uid;
        await saveUserData(id, firstName, lastName, email);
        navigate("Preferences");
      }
    } catch (error) {
      setIsLoading(false);
      if ((error as FirebaseError).code === "auth/email-already-in-use") {
        alert("Email already in use. Please use a different email.");
      } else if ((error as FirebaseError).code === "auth/weak-password") {
        alert("Password is too weak. Please use a stronger password.");
      } else {
        console.log("Signup error", error);
        alert("Signup error");
      }
      console.log(error);
    }
  };

  const handleLogin = () => {
    navigate("Login");
  };

  return (
    <View style={styles.centeredContainer}>
      <Text style={styles.loginTitle}>Sign up</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="person" size={24} color="#ccc" style={styles.icon} />
        <TextInput
          placeholder="First Name"
          autoCapitalize="words"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.loginTextInput}
        ></TextInput>
      </View>
      <View style={styles.inputContainer}>
        <FontAwesome6 name="signature" size={24} color="#ccc" style={styles.icon} />
        <TextInput
          placeholder="Last Name"
          autoCapitalize="words"
          value={lastName}
          onChangeText={setLastName}
          style={styles.loginTextInput}
        ></TextInput>
      </View>
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
      <Pressable onPress={() => handleSignUp()} style={styles.loginButton}>
          <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>
      <TouchableOpacity onPress={handleLogin}>
        <Text style={styles.signUpSmallText}>Already have an account? <Text style={{textDecorationLine: 'underline'}}>Login</Text></Text>
      </TouchableOpacity>
    </View>
  );
};

export default Register;
