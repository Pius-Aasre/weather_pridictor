import React, { useEffect } from 'react';
import Header from './components/Header.jsx';
import SearchBox from './components/SearchBox.jsx';
import CurrentWeatherCard from './components/CurrentWeatherCard.jsx';
import ForecastCard from './components/ForecastCard.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import ErrorMessage from './components/ErrorMessage.jsx';
import useWeatherStore from './store/weatherStore.js';
import { getCurrentWeatherByCoords, getForecastByCoords, getCurrentLocation } from './services/weatherAPI.js';
import { getBackgroundGradient, isDaytime } from './utils/helpers.js';

function App() {
  const {
    currentWeather,
    forecast,
    isLoading,
    error,
    theme,
    setCurrentWeather,
    setForecast,
    setLoading,
    setError,
    clearError
  } = useWeatherStore();

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Load weather data on app start
  useEffect(() => {
    const loadInitialWeather = async () => {
      clearError();
      setLoading(true);
      
      try {
        // Try to get user's location first
        const location = await getCurrentLocation();
        const [weather, forecastData] = await Promise.all([
          getCurrentWeatherByCoords(location.latitude, location.longitude),
          getForecastByCoords(location.latitude, location.longitude)
        ]);
        
        setCurrentWeather(weather);
        setForecast(forecastData);
      } catch {
        // If location fails, load default city weather (London)
        try {
          const [weather, forecastData] = await Promise.all([
            getCurrentWeatherByCoords(51.5074, -0.1278), // London coordinates
            getForecastByCoords(51.5074, -0.1278)
          ]);
          
          setCurrentWeather(weather);
          setForecast(forecastData);
        } catch {
          setError('Failed to load weather data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadInitialWeather();
  }, [clearError, setCurrentWeather, setError, setForecast, setLoading]);

  const handleLocationSelect = async (location) => {
    clearError();
    setLoading(true);
    
    try {
      const [weather, forecastData] = await Promise.all([
        getCurrentWeatherByCoords(location.lat, location.lon),
        getForecastByCoords(location.lat, location.lon)
      ]);
      
      setCurrentWeather(weather);
      setForecast(forecastData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  // Get dynamic background based on weather
  const getBackgroundClass = () => {
    if (!currentWeather) {
      return 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600';
    }
    
    const isDay = isDaytime(
      Date.now() / 1000, 
      currentWeather.sunrise, 
      currentWeather.sunset
    );
    
    return `bg-gradient-to-br ${getBackgroundGradient(currentWeather.condition, isDay)}`;
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${getBackgroundClass()}`}>
{/* Background Pattern */}
{/* <div className="absolute inset-0 ..."></div> */}
<div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2760%27%20height%3D%2760%27%20viewBox%3D%270%200%2060%2060%27%20xmlns%3D%27http://www.w3.org/2000/svg%27%3E%3Cg%20fill%3D%27none%27%20fill-rule%3D%27evenodd%27%3E%3Cg%20fill%3D%27%23ffffff%27%20fill-opacity%3D%270.05%27%3E%3Cpath%20d%3D%27M30%2030c0-11.046-8.954-20-20-20s-20%208.954-20%2020%208.954%2020%2020%2020%2020-8.954%2020-20zm2%200c0%2012.15-9.85%2022-22%2022S-10%2042.15-10%2030s9.85-22%2022-22%2022%209.85%2022%2022z%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
{/* End Background Pattern */}
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <Header />

        {/* Main Container */}
        <main className="container mx-auto px-4 pb-8 " >
          {/* Search Box */}
          <div className="mb-8 mt-4 ">
            <SearchBox 
              onLocationSelect={handleLocationSelect}
              className="max-w-md mx-auto "
            />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="glass rounded-2xl p-8">
                <LoadingSpinner size="xl" />
                <p className="text-gray-700 dark:text-gray-300 mt-4 text-center">
                  Loading weather data...
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="max-w-lg mx-auto">
              <ErrorMessage 
                message={error} 
                onRetry={handleRetry}
              />
            </div>
          )}

          {/* Weather Content */}
          {!isLoading && !error && currentWeather && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {/* Current Weather - Takes full width on mobile, 2 cols on xl */}
              <div className="xl:col-span-2">
                <CurrentWeatherCard 
                  weather={currentWeather}
                  className="h-full"
                />
              </div>

              {/* Forecast */}
              <div className="xl:col-span-1">
                <ForecastCard 
                  forecast={forecast}
                  className="h-full"
                />
              </div>
            </div>
          )}

          {/* Welcome Message for First Time Users */}
          {!isLoading && !error && !currentWeather && (
            <div className="text-center py-20">
              <div className="glass rounded-2xl p-8 max-w-lg mx-auto">
                <div className="text-6xl mb-4">🌤️</div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Welcome to WeatherNow
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Get real-time weather updates for any city around the world.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Search for a city above or allow location access for local weather.
                </p>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="text-center py-6 text-gray-600 dark:text-gray-400">
          <p className="text-sm">
            Weather data provided by OpenWeatherMap • Built with React & TailwindCSS
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
