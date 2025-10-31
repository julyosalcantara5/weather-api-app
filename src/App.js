import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [dateTime, setDateTime] = useState("");
  const apiKey = "2504699812c526523ad75172c66d1fdd";

  // 🌍 Automatically detect user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          if (data.cod === 200) {
            setWeather(data);
            setCity(data.name);
          }
        } catch (error) {
          console.error("Geolocation fetch error:", error);
        }
      });
    }
  }, []);

  // 🕓 Real-time Philippine date & time (GMT+8)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: "Asia/Manila",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      setDateTime(now.toLocaleString("en-PH", options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 🌈 Weather emoji based on condition
  const getWeatherIcon = (description) => {
    if (!description) return "🌈";
    description = description.toLowerCase();
    if (description.includes("cloud")) return "☁️";
    if (description.includes("rain")) return "🌧️";
    if (description.includes("clear")) return "☀️";
    if (description.includes("snow")) return "❄️";
    if (description.includes("thunder")) return "⛈️";
    if (description.includes("mist") || description.includes("fog"))
      return "🌫️";
    return "🌈";
  };

  // 🔍 Fetch weather by city (Philippines only)
  const getWeather = async () => {
    if (!city) return;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},PH&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod === 200) {
        setWeather(data);
        setError("");
      } else {
        setError("City not found. Please try again.");
        setWeather(null);
      }
    } catch (err) {
      setError("An error occurred while fetching the data.");
      setWeather(null);
    }
  };

  return (
    <div className="app">
      <h1>React Weather App - Philippines</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter Philippine city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={getWeather}>Get Weather</button>

        {error && <p className="error">{error}</p>}

        {weather && (
          <div className="weather-card">
            <h2>
              {getWeatherIcon(weather.weather[0].description)}{" "}
              {weather.name}, PH
            </h2>
            <p>
              <strong>Temperature:</strong> {weather.main.temp} °C
            </p>
            <p>
              <strong>Weather:</strong> {weather.weather[0].description}
            </p>
            <p>
              <strong>Humidity:</strong> {weather.main.humidity}%
            </p>
            <p>
              <strong>Wind Speed:</strong> {weather.wind.speed} m/s
            </p>
            <p>
              <strong>🕓 Philippine Time:</strong> {dateTime}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;