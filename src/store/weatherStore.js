import { create } from 'zustand';

const useWeatherStore = create((set, get) => ({
  // Current weather data
  currentWeather: null,
  forecast: [],
  
  // Location data
  currentLocation: null,
  searchResults: [],
  
  // UI state
  isLoading: false,
  error: null,
  unit: 'celsius', // 'celsius' or 'fahrenheit'
  theme: 'light', // 'light' or 'dark'
  
  // Search state
  isSearching: false,
  searchQuery: '',
  
  // Actions
  setCurrentWeather: (weather) => set({ currentWeather: weather }),
  
  setForecast: (forecast) => set({ forecast }),
  
  setCurrentLocation: (location) => set({ currentLocation: location }),
  
  setSearchResults: (results) => set({ searchResults: results }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  setSearching: (isSearching) => set({ isSearching }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  toggleUnit: () => set((state) => ({ 
    unit: state.unit === 'celsius' ? 'fahrenheit' : 'celsius' 
  })),
  
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  })),
  
  clearError: () => set({ error: null }),
  
  clearSearchResults: () => set({ searchResults: [] }),
  
  // Reset all data
  reset: () => set({
    currentWeather: null,
    forecast: [],
    currentLocation: null,
    searchResults: [],
    isLoading: false,
    error: null,
    isSearching: false,
    searchQuery: ''
  }),
  
  // Helper functions
  getTemperatureUnit: () => {
    const state = get();
    return state.unit === 'celsius' ? '°C' : '°F';
  },
  
  convertTemperature: (temp) => {
    const state = get();
    if (state.unit === 'fahrenheit') {
      return Math.round((temp * 9/5) + 32);
    }
    return Math.round(temp);
  },
  
  getWindSpeedUnit: () => {
    const state = get();
    return state.unit === 'celsius' ? 'm/s' : 'mph';
  },
  
  convertWindSpeed: (speed) => {
    const state = get();
    if (state.unit === 'fahrenheit') {
      return Math.round(speed * 2.237); // Convert m/s to mph
    }
    return Math.round(speed * 10) / 10; // Keep m/s, round to 1 decimal
  }
}));

export default useWeatherStore;
