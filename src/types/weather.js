// Weather data types for our application

export const WeatherConditions = {
  CLEAR: 'Clear',
  CLOUDS: 'Clouds',
  RAIN: 'Rain',
  DRIZZLE: 'Drizzle',
  THUNDERSTORM: 'Thunderstorm',
  SNOW: 'Snow',
  MIST: 'Mist',
  FOG: 'Fog',
  HAZE: 'Haze'
};

// Current weather data structure
export const createCurrentWeather = (data) => ({
  temperature: data?.main?.temp || 0,
  feelsLike: data?.main?.feels_like || 0,
  humidity: data?.main?.humidity || 0,
  pressure: data?.main?.pressure || 0,
  windSpeed: data?.wind?.speed || 0,
  windDirection: data?.wind?.deg || 0,
  visibility: data?.visibility || 0,
  cloudCover: data?.clouds?.all || 0,
  condition: data?.weather?.[0]?.main || 'Clear',
  description: data?.weather?.[0]?.description || '',
  icon: data?.weather?.[0]?.icon || '01d',
  sunrise: data?.sys?.sunrise || 0,
  sunset: data?.sys?.sunset || 0,
  timezone: data?.timezone || 0,
  name: data?.name || '',
  country: data?.sys?.country || ''
});

// Forecast data structure
export const createForecastItem = (data) => ({
  date: data?.dt || 0,
  temperature: {
    min: data?.main?.temp_min || 0,
    max: data?.main?.temp_max || 0,
    day: data?.main?.temp || 0
  },
  condition: data?.weather?.[0]?.main || 'Clear',
  description: data?.weather?.[0]?.description || '',
  icon: data?.weather?.[0]?.icon || '01d',
  humidity: data?.main?.humidity || 0,
  windSpeed: data?.wind?.speed || 0,
  pop: data?.pop || 0 // probability of precipitation
});

// Location data structure
export const createLocation = (lat, lon, name, country) => ({
  latitude: lat || 0,
  longitude: lon || 0,
  name: name || '',
  country: country || ''
});

// Search result structure
export const createSearchResult = (data) => ({
  name: data?.name || '',
  country: data?.country || '',
  state: data?.state || '',
  lat: data?.lat || 0,
  lon: data?.lon || 0
});
