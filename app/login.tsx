import React from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  useColorScheme,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import Constants from "expo-constants";
import { useSession } from "@/context/app-context";
import { useRouter } from "expo-router";

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginScreen: React.FC = () => {
  const { signIn } = useSession();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const loginValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Please enter a valid email")
      .required("Email Address is Required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleLogin = async (values: LoginFormValues) => {
    const apiUrl = Constants.expoConfig?.extra?.authApiUrl;
    if (!apiUrl) {
      Alert.alert("Configuration Error", "API URL is not set.");
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.token && data.user.id) {
          signIn({ token: data.token, userId: data.user.id.toString() });
          Alert.alert("Login Successful", `Welcome, ${data.user.nom}!`);
          router.replace("/");
        } else {
          Alert.alert("Login Error", "Invalid response from server.");
          console.error("Invalid response data:", data);
        }
      } else {
        Alert.alert("Login Failed", "Invalid email or password.");
      }
    } catch (error) {
      Alert.alert("Login Error", "An error occurred. Please try again.");
     
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, colorScheme === "dark" && styles.darkText]}>
        Login
      </Text>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginValidationSchema}
        onSubmit={handleLogin}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View>
            <TextInput
              placeholder="Email Address"
              placeholderTextColor={colorScheme === "dark" ? "#ccc" : "#666"}
              style={[styles.input, colorScheme === "dark" && styles.darkInput]}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              keyboardType="email-address"
            />
            {errors.email && touched.email && (
              <Text
                style={[
                  styles.errorText,
                  colorScheme === "dark" && styles.darkErrorText,
                ]}
              >
                {errors.email}
              </Text>
            )}
            <TextInput
              placeholder="Password"
              placeholderTextColor={colorScheme === "dark" ? "#ccc" : "#666"}
              style={[styles.input, colorScheme === "dark" && styles.darkInput]}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              secureTextEntry
            />
            {errors.password && touched.password && (
              <Text
                style={[
                  styles.errorText,
                  colorScheme === "dark" && styles.darkErrorText,
                ]}
              >
                {errors.password}
              </Text>
            )}
            <Button onPress={() => handleSubmit()} title="Login" />
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    marginBottom: 24,
    textAlign: "center",
    color: "#000",
  },
  darkText: {
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
    color: "#000",
  },
  darkInput: {
    borderColor: "#555",
    color: "#fff",
  },
  errorText: {
    fontSize: 14,
    color: "red",
    marginBottom: 16,
  },
  darkErrorText: {
    color: "lightcoral",
  },
});

export default LoginScreen;
