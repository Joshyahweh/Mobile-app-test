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
    geolocalisationBaseUrl: process.env.GEOLOCALISATION_BASE_URL
  },
});
