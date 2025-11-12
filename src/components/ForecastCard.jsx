import React from 'react';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { WiRaindrop } from 'react-icons/wi';
import { getWeatherIcon, getDayName, getWeatherEmoji } from '../utils/helpers.js';
import useWeatherStore from '../store/weatherStore.js';

const ForecastCard = ({ forecast, className = '' }) => {
  const { convertTemperature, getTemperatureUnit } = useWeatherStore();

  if (!forecast || forecast.length === 0) return null;

  const tempUnit = getTemperatureUnit();

  return (
    <div className={`weather-card p-6 animate-slide-up ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          5-Day Forecast
        </h3>
        <MdKeyboardArrowRight className="w-6 h-6 text-gray-400" />
      </div>

      <div className="space-y-4">
        {forecast.map((day, index) => {
          const minTemp = convertTemperature(day.temperature.min);
          const maxTemp = convertTemperature(day.temperature.max);
          const dayName = getDayName(day.date);

          return (
            <div 
              key={index}
              className="flex items-center justify-between p-3 bg-white/10 dark:bg-black/10 rounded-lg hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-200"
            >
              {/* Day and Weather Icon */}
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-16">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {dayName}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {day.description}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <img
                    src={getWeatherIcon(day.icon)}
                    alt={day.description}
                    className="w-10 h-10"
                  />
                  <span className="text-lg">
                    {getWeatherEmoji(day.condition)}
                  </span>
                </div>
              </div>

              {/* Weather Details */}
              <div className="flex items-center space-x-4">
                {/* Precipitation Probability */}
                {day.pop > 0 && (
                  <div className="flex items-center space-x-1">
                    <WiRaindrop className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-blue-600 dark:text-blue-400">
                      {Math.round(day.pop * 100)}%
                    </span>
                  </div>
                )}

                {/* Temperature Range */}
                <div className="flex items-center space-x-2 min-w-20">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">
                    {minTemp}{tempUnit}
                  </span>
                  <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-orange-400 rounded-full"></div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {maxTemp}{tempUnit}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Weather updates every hour
          </span>
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            View Details →
          </span>
        </div>
      </div>
    </div>
  );
};

export default ForecastCard;
