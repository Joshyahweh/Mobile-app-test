import "dotenv/config";
import { ExpoConfig, ConfigContext } from "expo/config";
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Mobile App Test",
  slug: "mobile-app-test",
  version: "1.0.0",
  scheme: "mobile-app-test",
  extra: {
    authApiUrl: process.env.AUTH_API_URL,
    entrepriseApiUrl: process.env.ENTREPRISE_API_URL,
    geolocalisationBaseUrl: process.env.GEOLOCALISATION_BASE_URL,
    eas: {
      projectId: "fc7e8044-c633-4217-85a8-76f7f20c632f",
    },
  },
  android: {
    package: "com.EnetAfrica.mobileAppTest",
  },
  ios: {
    bundleIdentifier: "com.EnetAfrica.mobileAppTest",
  },

  updates: {
    url: "https://u.expo.dev/fc7e8044-c633-4217-85a8-76f7f20c632f",
  },
  runtimeVersion: {
    policy: "appVersion",
  },
});
