import cron from "node-cron";
import axios from "axios";
import { connectToDatabase } from "@/utils/dbConnect";
import axiosInstance from "@/lib/axios";
import CronLog from "@/models/CronLog";
import Country from "@/models/Country";
import Coin from "@/models/Coin";

console.log("Cron activated");

const saveLogToDB = async (message) => {
  try {
    // Create a new log entry
    const log = new CronLog({ message });
    // Save the log entry
    await log.save();
  } catch (error) {
    console.error('Error saving log to database:', error);
  }
};

const fetchCountries = async () => {
  try {
    const response = await axiosInstance.get('/api/v1/countries');
    return response.data;
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
};

const saveCountriesToDB = async () => {
  try {
    // Fetch countries data
    const countries = await fetchCountries();

    // Save each country to the database
    for (const country of countries) {
      const { name, url, coinCount } = country;

      // Create a new document based on the Country model
      const newCountry = new Country({
        name,
        url,
        coinCount
      });

      // Save the country document to the database
      await newCountry.save();
    }

    console.log('Countries saved to database successfully.');
  } catch (error) {
    console.error('Error saving countries to database:', error);
  }
};

// Call the function to save countries to the database


const fetchAndSaveCoins = async (countryData) => {
  try {

    const response = await axiosInstance.get(`/api/v1/coins?country=${countryData.url}`);
    const coins = response.data;
    for (const coin of coins) {
      console.log('coin---',coin)
      // Save coin to database
      const newCoin = new Coin({
        name: coin.name,
        image: coin.image,
        Country: coin.details.Country,
        "#KM": coin.details['#KM'],
        Shape: coin.details.Shape,
        Composition: coin.details.Composition,
        Weight: coin.details.Weight,
        Diameter: coin.details.Diameter,
        Edge: coin.details.Edge,
        Year: coin.details.Year,
        Value: coin.details.Value,
        Rarity: coin.details.Rarity,
        anchorLink: coin.anchorLink
      });
      await newCoin.save();
    }
  } catch (error) {
    console.error(`Error fetching and saving coins for ${countryData.name}:`, error);
    await saveLogToDB(`Error fetching and saving coins for ${countryData.name}: ${error.message}`);
  }
};

// Main function to execute cron job
const main = async () => {
  try {
    // Connect to the database
    await connectToDatabase();

    // Fetch and save menu items if CRON_ON environment variable is set
    if (process.env.CRON_ON) {
      // const countries = await saveCountriesToDB();
      let countries = await Country.find();
      let donecountriesdata = [
        {
          "name": "Afghanistan",
          "url": "afghanistan",
          "coinCount": 69
      },
      {
          "name": "Albania",
          "url": "albania",
          "coinCount": 98
      },
      {
          "name": "Alderney",
          "url": "alderney",
          "coinCount": 5
      },
      {
          "name": "Algeria",
          "url": "algeria",
          "coinCount": 59
      },
      {
          "name": "American Samoa",
          "url": "american-samoa",
          "coinCount": 6
      },
      {
          "name": "Andaman & Nicobar",
          "url": "andaman-nicobar",
          "coinCount": 7
      },
      {
          "name": "Andorra",
          "url": "andorra",
          "coinCount": 127
      },
      {
          "name": "Angola",
          "url": "angola",
          "coinCount": 53
      },
      {
          "name": "Anguilla",
          "url": "anguilla",
          "coinCount": 39
      },
      {
          "name": "Antigua and Barbuda",
          "url": "antigua-and-barbuda",
          "coinCount": 28
      },
      {
          "name": "Argentina",
          "url": "argentina",
          "coinCount": 184
      },
      {
          "name": "Argentina-Provinces",
          "url": "argentina-provinces",
          "coinCount": 17
      },
      {
          "name": "Armenia",
          "url": "armenia",
          "coinCount": 43
      },
      {
          "name": "Aruba",
          "url": "aruba",
          "coinCount": 24
      },
      {
          "name": "Australia",
          "url": "australia",
          "coinCount": 174
      },
      {
          "name": "Austria",
          "url": "austria",
          "coinCount": 184
      },
      {
          "name": "Azerbaijan",
          "url": "azerbaijan",
          "coinCount": 20
      },
      {
          "name": "Azores",
          "url": "azores",
          "coinCount": 35
      },
      {
          "name": "Bahamas",
          "url": "bahamas",
          "coinCount": 45
      },
      {
          "name": "Bahrain",
          "url": "bahrein",
          "coinCount": 47
      },
      {
          "name": "Bangladesh",
          "url": "bangladesh",
          "coinCount": 49
      },
      {
          "name": "Barbados",
          "url": "barbados",
          "coinCount": 20
      },
      {
          "name": "Belarus",
          "url": "belarus",
          "coinCount": 48
      },
      {
          "name": "Belgian Congo",
          "url": "belgian-congo",
          "coinCount": 21
      },
      {
          "name": "Belgium",
          "url": "belgium",
          "coinCount": 233
      },
      {
          "name": "Belize",
          "url": "belize",
          "coinCount": 13
      },
      {
          "name": "Benin",
          "url": "benin",
          "coinCount": 36
      },
      {
          "name": "Bermuda",
          "url": "bermuda",
          "coinCount": 28
      },
      {
          "name": "Bhutan",
          "url": "bhutan",
          "coinCount": 28
      },
      {
          "name": "Biafra",
          "url": "biafra",
          "coinCount": 12
      },
      {
          "name": "Bikanir",
          "url": "bikanir",
          "coinCount": 4
      },
      {
          "name": "Bohemia",
          "url": "bohemia",
          "coinCount": 0
      },
    ];

    const donecountries = donecountriesdata.map(country => country.name);
      for (const countryData of countries) {
        if (countryData.coinCount === 0 ) {
          console.log(`Skipping ${countryData.name} because coin count is 0`);
          continue; // Skip to the next iteration of the loop
        }
        if (donecountries.includes(countryData.name)) {
          console.log(`Skipping ${countryData.name} because it's already done`);
          continue; // Skip to the next iteration of the loop
        }
        await fetchAndSaveCoins(countryData);
        // Add a delay of 3 seconds after processing each country
        await new Promise(resolve => setTimeout(resolve, 3000));
      }

    }

  } catch (error) {
    console.error("Error in cron job:", error);
    await saveLogToDB('Error in cron job: ' + error.message);
  }
};

// Call the main function to start the cron job
main();
for (const countryData of countries) {
  await fetchAndSaveCoins(countryData);
  // Add a delay of 5 minutes (300,000 milliseconds) after processing each country
  await new Promise(resolve => setTimeout(resolve, 3000)); // 3 seconds delay
}

