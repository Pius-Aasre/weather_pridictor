import React from 'react';
import { MdLocationOn, MdVisibility, MdCompress, MdOpacity } from 'react-icons/md';
import { WiHumidity, WiStrongWind, WiSunrise, WiSunset } from 'react-icons/wi';
import { getWeatherIcon, formatTime, getWindDirection, formatVisibility, getWeatherEmoji } from '../utils/helpers.js';
import useWeatherStore from '../store/weatherStore.js';

const CurrentWeatherCard = ({ weather, className = '' }) => {
  const { convertTemperature, getTemperatureUnit, convertWindSpeed, getWindSpeedUnit } = useWeatherStore();

  if (!weather) return null;

  const displayTemp = convertTemperature(weather.temperature);
  const displayFeelsLike = convertTemperature(weather.feelsLike);
  const displayWindSpeed = convertWindSpeed(weather.windSpeed);
  const tempUnit = getTemperatureUnit();
  const windUnit = getWindSpeedUnit();
  
  const sunrise = formatTime(weather.sunrise);
  const sunset = formatTime(weather.sunset);

  return (
    <div className={`weather-card p-6 animate-fade-in ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <MdLocationOn className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {weather.name}
            {weather.country && (
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                {weather.country}
              </span>
            )}
          </h2>
        </div>
        <div className="text-2xl">
          {getWeatherEmoji(weather.condition)}
        </div>
      </div>

      {/* Main Temperature Display */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <img
            src={getWeatherIcon(weather.icon, '4x')}
            alt={weather.description}
            className="w-20 h-20"
          />
          <div>
            <div className="text-5xl font-bold text-gray-900 dark:text-white">
              {displayTemp}
              <span className="text-2xl text-gray-600 dark:text-gray-400">
                {tempUnit}
              </span>
            </div>
            <div className="text-lg text-gray-600 dark:text-gray-400 capitalize">
              {weather.description}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-500">
              Feels like {displayFeelsLike}{tempUnit}
            </div>
          </div>
        </div>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Humidity */}
        <div className="flex flex-col items-center p-3 bg-white/10 dark:bg-black/10 rounded-lg">
          <WiHumidity className="w-8 h-8 text-blue-500 mb-1" />
          <div className="text-sm text-gray-600 dark:text-gray-400">Humidity</div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {weather.humidity}%
          </div>
        </div>

        {/* Wind Speed */}
        <div className="flex flex-col items-center p-3 bg-white/10 dark:bg-black/10 rounded-lg">
          <WiStrongWind className="w-8 h-8 text-blue-500 mb-1" />
          <div className="text-sm text-gray-600 dark:text-gray-400">Wind</div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {displayWindSpeed} {windUnit}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            {getWindDirection(weather.windDirection)}
          </div>
        </div>

        {/* Pressure */}
        <div className="flex flex-col items-center p-3 bg-white/10 dark:bg-black/10 rounded-lg">
          <MdCompress className="w-6 h-6 text-blue-500 mb-2" />
          <div className="text-sm text-gray-600 dark:text-gray-400">Pressure</div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {weather.pressure}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">hPa</div>
        </div>

        {/* Visibility */}
        <div className="flex flex-col items-center p-3 bg-white/10 dark:bg-black/10 rounded-lg">
          <MdVisibility className="w-6 h-6 text-blue-500 mb-2" />
          <div className="text-sm text-gray-600 dark:text-gray-400">Visibility</div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatVisibility(weather.visibility)}
          </div>
        </div>
      </div>

      {/* Sunrise/Sunset */}
      {(weather.sunrise || weather.sunset) && (
        <div className="flex justify-around mt-6 pt-6 border-t border-white/20 dark:border-white/10">
          {weather.sunrise && (
            <div className="flex items-center space-x-2">
              <WiSunrise className="w-6 h-6 text-yellow-500" />
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Sunrise</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {sunrise}
                </div>
              </div>
            </div>
          )}
          
          {weather.sunset && (
            <div className="flex items-center space-x-2">
              <WiSunset className="w-6 h-6 text-orange-500" />
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Sunset</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {sunset}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CurrentWeatherCard;
