import React from 'react';
import { MdDarkMode, MdLightMode, MdMyLocation, MdThermostat } from 'react-icons/md';
import useWeatherStore from '../store/weatherStore.js';
import { getCurrentLocation, getCurrentWeatherByCoords, getForecastByCoords } from '../services/weatherAPI.js';

const Header = ({ onGetCurrentLocation, className = '' }) => {
  const { 
    theme, 
    unit, 
    toggleTheme, 
    toggleUnit, 
    setLoading, 
    setError, 
    setCurrentWeather, 
    setForecast,
    clearError 
  } = useWeatherStore();

  const handleGetCurrentLocation = async () => {
    clearError();
    setLoading(true);
    
    try {
      const location = await getCurrentLocation();
      const [weather, forecast] = await Promise.all([
        getCurrentWeatherByCoords(location.latitude, location.longitude),
        getForecastByCoords(location.latitude, location.longitude)
      ]);
      
      setCurrentWeather(weather);
      setForecast(forecast);
      
      if (onGetCurrentLocation) {
        onGetCurrentLocation(location);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className={`flex items-center justify-between p-4 md:p-6 ${className}`}>
      {/* Logo/Title */}
      <div className="flex items-center space-x-2">
        <div className="text-2xl">🌤️</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          WeatherNow
        </h1>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-2">
        {/* Get Current Location */}
        <button
          onClick={handleGetCurrentLocation}
          className="p-2 glass rounded-lg hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-200 group"
          title="Get current location weather"
        >
          <MdMyLocation className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-blue-500" />
        </button>

        {/* Temperature Unit Toggle */}
        <button
          onClick={toggleUnit}
          className="p-2 glass rounded-lg hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-200 group flex items-center space-x-1"
          title={`Switch to ${unit === 'celsius' ? 'Fahrenheit' : 'Celsius'}`}
        >
          <MdThermostat className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-blue-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-500">
            {unit === 'celsius' ? '°C' : '°F'}
          </span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 glass rounded-lg hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-200 group"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <MdDarkMode className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-blue-500" />
          ) : (
            <MdLightMode className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-yellow-500" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
