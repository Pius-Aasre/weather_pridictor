import { format } from 'date-fns';

// Format temperature with unit
export const formatTemperature = (temp, unit = 'celsius') => {
  if (unit === 'fahrenheit') {
    return `${Math.round((temp * 9/5) + 32)}°F`;
  }
  return `${Math.round(temp)}°C`;
};

// Format wind speed with unit
export const formatWindSpeed = (speed, unit = 'celsius') => {
  if (unit === 'fahrenheit') {
    return `${Math.round(speed * 2.237)} mph`;
  }
  return `${Math.round(speed * 10) / 10} m/s`;
};

// Get weather icon URL
export const getWeatherIcon = (icon, size = '2x') => {
  return `https://openweathermap.org/img/wn/${icon}@${size}.png`;
};

// Format date for display
export const formatDate = (timestamp, formatStr = 'EEEE, MMMM d') => {
  const date = new Date(timestamp * 1000);
  return format(date, formatStr);
};

// Format time for display
export const formatTime = (timestamp, formatStr = 'HH:mm') => {
  const date = new Date(timestamp * 1000);
  return format(date, formatStr);
};

// Get day name from timestamp
export const getDayName = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return format(date, 'EEEE');
  }
};

// Convert wind direction from degrees to cardinal direction
export const getWindDirection = (degrees) => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

// Get UV Index description
export const getUVDescription = (uv) => {
  if (uv <= 2) return 'Low';
  if (uv <= 5) return 'Moderate';
  if (uv <= 7) return 'High';
  if (uv <= 10) return 'Very High';
  return 'Extreme';
};

// Get air quality description
export const getAirQualityDescription = (aqi) => {
  switch (aqi) {
    case 1: return 'Good';
    case 2: return 'Fair';
    case 3: return 'Moderate';
    case 4: return 'Poor';
    case 5: return 'Very Poor';
    default: return 'Unknown';
  }
};

// Format visibility
export const formatVisibility = (visibility) => {
  if (visibility >= 1000) {
    return `${Math.round(visibility / 1000)} km`;
  }
  return `${visibility} m`;
};

// Format pressure
export const formatPressure = (pressure) => {
  return `${pressure} hPa`;
};

// Format humidity
export const formatHumidity = (humidity) => {
  return `${humidity}%`;
};

// Get weather condition emoji
export const getWeatherEmoji = (condition) => {
  const emojiMap = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '🌨️',
    'Mist': '🌫️',
    'Fog': '🌫️',
    'Haze': '🌫️',
    'Smoke': '💨',
    'Dust': '💨',
    'Sand': '💨',
    'Tornado': '🌪️'
  };
  return emojiMap[condition] || '🌤️';
};

// Check if it's daytime based on sunrise/sunset
export const isDaytime = (currentTime, sunrise, sunset) => {
  return currentTime >= sunrise && currentTime <= sunset;
};

// Get background gradient based on weather condition and time
export const getBackgroundGradient = (condition, isDaytime) => {
  const gradients = {
    Clear: {
      day: 'from-blue-400 via-blue-500 to-blue-600',
      night: 'from-indigo-900 via-purple-900 to-blue-900'
    },
    Clouds: {
      day: 'from-gray-400 via-gray-500 to-gray-600',
      night: 'from-gray-700 via-gray-800 to-gray-900'
    },
    Rain: {
      day: 'from-gray-500 via-blue-600 to-blue-700',
      night: 'from-gray-800 via-blue-900 to-indigo-900'
    },
    Snow: {
      day: 'from-blue-200 via-blue-300 to-blue-400',
      night: 'from-blue-800 via-indigo-800 to-purple-900'
    },
    Thunderstorm: {
      day: 'from-gray-600 via-gray-700 to-gray-800',
      night: 'from-gray-900 via-black to-gray-900'
    }
  };
  
  const timeOfDay = isDaytime ? 'day' : 'night';
  return gradients[condition]?.[timeOfDay] || gradients.Clear[timeOfDay];
};

// Debounce function for search
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Check if browser supports geolocation
export const supportsGeolocation = () => {
  return 'geolocation' in navigator;
};

// Convert meters to kilometers
export const metersToKilometers = (meters) => {
  return Math.round(meters / 1000);
};

// Convert temperature between units
export const convertTemperature = (temp, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return temp;
  
  if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
    return (temp * 9/5) + 32;
  } else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') {
    return (temp - 32) * 5/9;
  }
  
  return temp;
};
