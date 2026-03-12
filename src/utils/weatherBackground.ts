export interface WeatherVisual {
  video: string;
  bgColor: string;
}
export const getWeatherVisual = (description: string, isDay: boolean): WeatherVisual => {
  const desc = description.toLowerCase();
  if (desc.includes('thunder')) {
    return { video: '/videos/thunderstorm.mp4', bgColor: 'rgba(105, 105, 105, 0.5)' };
  } else if (desc.includes('snow')) {
    return {
      video: isDay ? '/videos/day-snow.mp4' : '/videos/night-snow.mp4',
      bgColor: 'rgba(105, 105, 105, 0.5)',
    };
  } else if (desc.includes('rain') || desc.includes('drizzle')) {
    return {
      video: isDay ? '/videos/day-rain.mp4' : '/videos/night-rain.mp4',
      bgColor: 'rgba(105, 105, 105, 0.5)',
    };
  } else if (desc.includes('cloud') || desc.includes('overcast')) {
    return {
      video: isDay ? '/videos/day-clouds.mp4' : '/videos/night-clouds.mp4',
      bgColor: isDay ? 'rgba(0, 0, 0, 0.5)' : 'rgba(105, 105, 105, 0.5)',
    };
  } else if (desc.includes('fog') || desc.includes('smoke')) {
    return {
      video: isDay ? '/videos/day-smoke.mp4' : '/videos/night-smoke.mp4',
      bgColor: 'rgba(0, 0, 0, 0.5)',
    };
  } else {
    return {
      video: isDay ? '/videos/day.mp4' : '/videos/night.mp4',
      bgColor: isDay ? 'rgba(0, 0, 0, 0.5)' : 'rgba(105, 105, 105, 0.5)',
    };
  }
};