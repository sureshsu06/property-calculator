// data/indian-cities.ts

export interface CityData {
    city: string;
    state: string;
    averageLandPrice: number;  // price per sq ft in INR
    priceRange: {
      low: number;
      high: number;
    };
  }
  
  export const indianCities: CityData[] = [
    {
      city: "Mumbai",
      state: "Maharashtra",
      averageLandPrice: 15000,
      priceRange: {
        low: 10000,
        high: 20000
      }
    },
    {
      city: "Delhi",
      state: "Delhi",
      averageLandPrice: 12000,
      priceRange: {
        low: 8000,
        high: 16000
      }
    },
    {
      city: "Bangalore",
      state: "Karnataka",
      averageLandPrice: 8000,
      priceRange: {
        low: 5000,
        high: 11000
      }
    },
    {
      city: "Chennai",
      state: "Tamil Nadu",
      averageLandPrice: 6000,
      priceRange: {
        low: 4000,
        high: 8000
      }
    },
    // Add more cities as needed
  ];