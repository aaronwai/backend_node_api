import NodeGeocoder from "node-geocoder";
import dotenv from "dotenv";
// load env variables
dotenv.config({ path: "./config/config.env" });
if (!process.env.GEOCODER_PROVIDER || !process.env.GEOCODER_API_KEY) {
  console.error(
    "Geocoder provider or API key is not set in environment variables."
  );
  process.exit(1); // Exit the process with an error code
}

const options = {
  provider: process.env.GEOCODER_PROVIDER,
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null,
};

export const geocoder = NodeGeocoder(options);
