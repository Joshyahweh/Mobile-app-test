import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, useColorScheme } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Constants from "expo-constants";
import { useSession } from "@/context/app-context";
import { useRoute } from "@react-navigation/native";
import { companyGeolocation } from "@/data/company-geolocation";

interface Props {
  route: {
    params: {
      companyId: number;
      companyName: string;
    };
  };
}

interface Location {
  latitude: number;
  longitude: number;
}

const CompanyMapScreen: React.FC<Props> = () => {
  const route = useRoute();
  const { companyId, companyName } = route.params as {
    companyId: number;
    companyName: string;
  };

  const colorScheme = useColorScheme();

  const location = companyGeolocation.find(
    (geo) => geo.id === Number(companyId)
  );

  if (!location) {
    return (
      <View
        style={[
          styles.container,
          colorScheme === "dark" && styles.darkContainer,
        ]}
      >
        <Text
          style={[
            styles.loadingText,
            colorScheme === "dark" && styles.darkText,
          ]}
        >
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title={companyName}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkContainer: {
    backgroundColor: "#000",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingText: {
    color: "#000",
  },
  darkText: {
    color: "#fff",
  },
});

export default CompanyMapScreen;
