import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  useColorScheme,
} from "react-native";
import Constants from "expo-constants";
import { router } from "expo-router";
import { useSession } from "@/context/app-context";

interface Company {
  id: number;
  nom: string;
}

const CompaniesScreen = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const apiUrl = Constants.expoConfig?.extra?.entrepriseApiUrl;
  const { session, userId } = useSession();
  const colorScheme = useColorScheme();



  useEffect(() => {
    const fetchCompanies = async () => {
      if (!apiUrl) {
        Alert.alert("Configuration Error", "API URL is not set.");
        return;
      }
      try {
        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        });
        const data = await response.json();
       
        setCompanies(data._embedded.entrepriseDTOModelList);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch companies.");
        console.error(error);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={companies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/company-map",
                params: { companyId: item.id, companyName: item.nom },
              })
            }
          >
            <View
              style={[
                styles.companyItem,
                colorScheme === "dark" && styles.darkCompanyItem,
              ]}
            >
              <Text
                style={[
                  styles.companyName,
                  colorScheme === "dark" && styles.darkText,
                ]}
              >
                {item.nom}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  greeting: {
    fontSize: 24,
    marginBottom: 16,
    color: "#000",
  },
  darkText: {
    color: "#fff",
  },
  companyItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  darkCompanyItem: {
    borderBottomColor: "#555",
  },
  companyName: {
    fontSize: 18,
    color: "#000",
  },
});

export default CompaniesScreen;
