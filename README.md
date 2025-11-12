# WeatherNow - Professional Weather App

A modern, responsive weather application built with React.js, TailwindCSS, and Zustand. Get real-time weather updates with a beautiful glassmorphism UI design.

## 🌟 Features

- **Real-time Weather Data**: Current weather conditions and 5-day forecast
- **Location Services**: Automatic location detection and city search
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Theme**: Toggle between themes with smooth transitions
- **Temperature Units**: Switch between Celsius and Fahrenheit
- **Glassmorphism UI**: Modern, elegant design with blur effects
- **Professional UX**: Loading states, error handling, and smooth animations

## 🛠️ Technologies Used

- **React.js** - Frontend framework
- **TailwindCSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **Axios** - HTTP client for API calls
- **React Icons** - Beautiful icon library
- **Date-fns** - Date formatting utilities
- **OpenWeatherMap API** - Weather data provider

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- OpenWeatherMap API key

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Get your OpenWeatherMap API key**
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Generate an API key

3. **Configure environment variables**
   - Update `.env` file with your API key:
   ```env
   VITE_OPENWEATHER_API_KEY=your_actual_api_key_here
   VITE_APP_NAME=WeatherNow
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:5173`
   - Allow location access for the best experience

## 🎨 Features Overview

### Weather Display
- Current temperature with "feels like" indicator
- Weather condition with emoji and description
- Humidity, wind speed, pressure, and visibility
- Sunrise and sunset times

### 5-Day Forecast
- Daily weather predictions
- Temperature ranges with visual indicators
- Precipitation probability
- Weather condition icons

### User Interface
- Dynamic backgrounds based on weather conditions
- Glassmorphism design with backdrop blur effects
- Responsive grid layout
- Smooth animations and transitions

### Settings & Controls
- Theme toggle (light/dark mode)
- Temperature unit switching (°C/°F)
- Current location detection
- City search with autocomplete

## 📱 Responsive Design

The app is fully responsive and optimized for:
- **Mobile**: Single column layout, touch-friendly buttons
- **Tablet**: Adjusted spacing and component sizes
- **Desktop**: Full grid layout with optimal use of screen space

---

**Built with ❤️ using React.js, TailwindCSS, and Zustand**

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
