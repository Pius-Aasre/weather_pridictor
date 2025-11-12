import axios from 'axios';
import { createCurrentWeather, createForecastItem, createSearchResult } from '../types/weather.js';

const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1';
const GEO_BASE_URL = 'https://geocoding-api.open-meteo.com/v1';

// Create axios instance with default config
const weatherAPI = axios.create({
  timeout: 10000
});

// Weather code mapping for Open-Meteo
const getWeatherDescription = (code) => {
  const weatherCodes = {
    0: { main: 'Clear', description: 'Clear sky', icon: '01' },
    1: { main: 'Clouds', description: 'Mainly clear', icon: '02' },
    2: { main: 'Clouds', description: 'Partly cloudy', icon: '02' },
    3: { main: 'Clouds', description: 'Overcast', icon: '04' },
    45: { main: 'Mist', description: 'Fog', icon: '50' },
    48: { main: 'Mist', description: 'Depositing rime fog', icon: '50' },
    51: { main: 'Drizzle', description: 'Light drizzle', icon: '09' },
    53: { main: 'Drizzle', description: 'Moderate drizzle', icon: '09' },
    55: { main: 'Drizzle', description: 'Dense drizzle', icon: '09' },
    61: { main: 'Rain', description: 'Slight rain', icon: '10' },
    63: { main: 'Rain', description: 'Moderate rain', icon: '10' },
    65: { main: 'Rain', description: 'Heavy rain', icon: '10' },
    71: { main: 'Snow', description: 'Slight snow fall', icon: '13' },
    73: { main: 'Snow', description: 'Moderate snow fall', icon: '13' },
    75: { main: 'Snow', description: 'Heavy snow fall', icon: '13' },
    80: { main: 'Rain', description: 'Slight rain showers', icon: '09' },
    81: { main: 'Rain', description: 'Moderate rain showers', icon: '09' },
    82: { main: 'Rain', description: 'Violent rain showers', icon: '09' },
    95: { main: 'Thunderstorm', description: 'Thunderstorm', icon: '11' },
    96: { main: 'Thunderstorm', description: 'Thunderstorm with slight hail', icon: '11' },
    99: { main: 'Thunderstorm', description: 'Thunderstorm with heavy hail', icon: '11' }
  };
  return weatherCodes[code] || { main: 'Unknown', description: 'Unknown weather', icon: '01' };
};

// Error handler
const handleAPIError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    switch (status) {
      case 400:
        throw new Error('Invalid request. Please check your location.');
      case 429:
        throw new Error('Too many requests. Please try again later.');
      default:
        throw new Error(data?.reason || 'Something went wrong. Please try again.');
    }
  } else if (error.request) {
    throw new Error('Network error. Please check your internet connection.');
  } else {
    throw new Error('An unexpected error occurred.');
  }
};

// Get current weather by coordinates
export const getCurrentWeatherByCoords = async (lat, lon) => {
  try {
    const response = await weatherAPI.get(`${WEATHER_BASE_URL}/forecast`, {
      params: {
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m',
        timezone: 'auto'
      }
    });
    
    const data = response.data;
    const weather = getWeatherDescription(data.current.weather_code);
    const isDay = data.current.is_day;
    
    // Transform to match your existing structure
    const transformedData = {
      coord: { lat: data.latitude, lon: data.longitude },
      weather: [{
        id: data.current.weather_code,
        main: weather.main,
        description: weather.description,
        icon: `${weather.icon}${isDay ? 'd' : 'n'}`
      }],
      main: {
        temp: data.current.temperature_2m,
        feels_like: data.current.apparent_temperature,
        humidity: data.current.relative_humidity_2m,
        pressure: data.current.pressure_msl
      },
      wind: {
        speed: data.current.wind_speed_10m,
        deg: data.current.wind_direction_10m
      },
      clouds: {
        all: data.current.cloud_cover
      },
      dt: Math.floor(Date.now() / 1000),
      name: 'Location'
    };
    
    return createCurrentWeather(transformedData);
  } catch (error) {
    handleAPIError(error);
  }
};

// Get current weather by city name
export const getCurrentWeatherByCity = async (cityName) => {
  try {
    // First, get coordinates for the city
    const geoResponse = await weatherAPI.get(`${GEO_BASE_URL}/search`, {
      params: {
        name: cityName,
        count: 1,
        language: 'en',
        format: 'json'
      }
    });
    
    if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
      throw new Error('City not found');
    }
    
    const location = geoResponse.data.results[0];
    return await getCurrentWeatherByCoords(location.latitude, location.longitude);
  } catch (error) {
    handleAPIError(error);
  }
};

// Get 5-day weather forecast by coordinates
export const getForecastByCoords = async (lat, lon) => {
  try {
    const response = await weatherAPI.get(`${WEATHER_BASE_URL}/forecast`, {
      params: {
        latitude: lat,
        longitude: lon,
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,wind_speed_10m_max',
        timezone: 'auto'
      }
    });
    
    const data = response.data;
    
    // Transform daily forecast data
    const forecast = data.daily.time.slice(0, 5).map((date, index) => {
      const weather = getWeatherDescription(data.daily.weather_code[index]);
      
      return createForecastItem({
        dt: Math.floor(new Date(date).getTime() / 1000),
        main: {
          temp: (data.daily.temperature_2m_max[index] + data.daily.temperature_2m_min[index]) / 2,
          temp_min: data.daily.temperature_2m_min[index],
          temp_max: data.daily.temperature_2m_max[index],
          feels_like: (data.daily.apparent_temperature_max[index] + data.daily.apparent_temperature_min[index]) / 2,
          humidity: 50 // Open-Meteo doesn't provide daily humidity, using reasonable default
        },
        weather: [{
          id: data.daily.weather_code[index],
          main: weather.main,
          description: weather.description,
          icon: `${weather.icon}d`
        }],
        wind: {
          speed: data.daily.wind_speed_10m_max[index]
        },
        rain: {
          '1h': data.daily.precipitation_sum[index]
        }
      });
    });
    
    return forecast;
  } catch (error) {
    handleAPIError(error);
  }
};

// Get forecast by city name
export const getForecastByCity = async (cityName) => {
  try {
    // First, get coordinates for the city
    const geoResponse = await weatherAPI.get(`${GEO_BASE_URL}/search`, {
      params: {
        name: cityName,
        count: 1,
        language: 'en',
        format: 'json'
      }
    });
    
    if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
      throw new Error('City not found');
    }
    
    const location = geoResponse.data.results[0];
    return await getForecastByCoords(location.latitude, location.longitude);
  } catch (error) {
    handleAPIError(error);
  }
};

// Search for cities
export const searchCities = async (query) => {
  try {
    const response = await weatherAPI.get(`${GEO_BASE_URL}/search`, {
      params: {
        name: query,
        count: 5,
        language: 'en',
        format: 'json'
      }
    });
    
    if (!response.data.results) {
      return [];
    }
    
    return response.data.results.map(location => createSearchResult({
      name: location.name,
      country: location.country,
      state: location.admin1,
      lat: location.latitude,
      lon: location.longitude
    }));
  } catch (error) {
    handleAPIError(error);
  }
};

// Get city name from coordinates (reverse geocoding)
export const getCityFromCoords = async (lat, lon) => {
  try {
    // Open-Meteo geocoding API doesn't have reverse geocoding,
    // so we'll use a simple approach with nearest city search
    const response = await weatherAPI.get(`${GEO_BASE_URL}/search`, {
      params: {
        name: `${lat.toFixed(2)},${lon.toFixed(2)}`,
        count: 1,
        language: 'en',
        format: 'json'
      }
    });
    
    if (response.data.results && response.data.results.length > 0) {
      const location = response.data.results[0];
      return createSearchResult({
        name: location.name,
        country: location.country,
        state: location.admin1,
        lat: location.latitude,
        lon: location.longitude
      });
    }
    
    // Fallback: return coordinates as location name
    return createSearchResult({
      name: `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
      country: 'Unknown',
      lat,
      lon
    });
  } catch (error) {
    // Fallback: return coordinates as location name
    return createSearchResult({
      name: `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
      country: 'Unknown',
      lat,
      lon
    });
  }
};

// Get user's current location
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('Location access denied by user'));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error('Location information is unavailable'));
            break;
          case error.TIMEOUT:
            reject(new Error('Location request timed out'));
            break;
          default:
            reject(new Error('An unknown error occurred while retrieving location'));
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
};

export default {
  getCurrentWeatherByCoords,
  getCurrentWeatherByCity,
  getForecastByCoords,
  getForecastByCity,
  searchCities,
  getCityFromCoords,
  getCurrentLocation
};
