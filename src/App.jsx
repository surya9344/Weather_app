import { useEffect, useState } from 'react';
import './App.css';
import searchIcon from "./assets/search.png";
import clearIcon from "./assets/clear.png";
import cloudIcon from "./assets/cloud.png";
import drizzleIcon from "./assets/drizzle.png";
import snowIcon from "./assets/snow.png";
import windPng from "./assets/wind.png";
import humidityPng from "./assets/humidity.png";
import rainIcon from "./assets/rain.png";

const Weather=({icon, city, temp, country, lat, lon, humidity, wind})=> {
  return(
    <>
    <div className="image">
      <img src={icon} alt="image"/>
    </div>
    <div className="temp">{temp}°C</div>
    <div className="location">{city}</div>
    <div className="country">{country}</div>
    <div className="lat-lon">
      <div className="l-block">
        <span className="l">latitude</span>
        <span className="l">{lat}</span>
      </div>
      <div className="l-block">
        <span className="l">longitude</span>
        <span className="l">{lon}</span>
      </div>
    </div>
    <div>
      <div className="container-data">
        <div className="element">
          <img src={humidityPng} alt="humidity"  />
          <div className="humidity"> {humidity}%</div>
          <div className="text">Humidity</div>
        </div>
        <div className="data">
          <img src={windPng} alt="wind"  />
          <div className="wind">{wind} Km/h</div>
          <div className="text">Wind</div>
        </div>
      </div>
    </div>
    </>
  );
};

function App() {
  let api_key = "2a6d779091ae5417ed9f5578d2fa5413";

  const[text,setText] = useState("London")
  const[icon,setIcon] = useState(snowIcon);
  const[city,setCity] = useState();
  const[country,setCountry] = useState()
  const[temp,setTemp] = useState(2);
  const[lat,setLat] = useState(0);
  const[lon,setLon] = useState(0);
  const[humidity,setHumidity] = useState(0);
  const[wind,setWind] = useState(0);

  const[cityNotFound, setCityNotFound] = useState(false);
  const[loading,setLoading] = useState(false);
  const[error,setError] = useState(false);

  const weatherIconMap ={
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  };

  const search = async ()=> {
  
    let url =`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`

    try{
      let res = await fetch(url);
      let data = await res.json();
      if (data.cod === "404"){
        console.error("City Not Found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setCountry(data.sys.country);
      setCity(data.name);
      setTemp(Math.floor(data.main.temp));
      setLat(data.coord.lat);
      setLon(data.coord.lon);
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearIcon);
      setCityNotFound(false);
    }catch(error){
      console.error("An error Occured:", error.message);
      setError("Error found in fetching data");
    }finally{}
  };

  const handleCity = (e) =>{
    setText(e.target.value);
  };
  const handleKeyDown =(e) => {
    if(e.key === "Enter"){
      search();
    };
  };

  useEffect(function(){
  search();
  },[])
  return (
    <>
    <div className="container">
      <div className="input-container">
        <input type="text" className="cityInput" placeholder="Search City"
          onChange={handleCity} value={text} onKeyDown={handleKeyDown} />
        <div className="search-icon">
          <img className="search" src={searchIcon} alt="Search" onClick= {() => search()} />
        </div>
      </div>
      { !loading && !error && !cityNotFound && <Weather icon={icon} city={city} temp={temp} lat={lat} lon={lon} country={country} humidity={humidity} wind={wind} />}
      
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error"> {error}</div>}
      {cityNotFound && <div className="found">City Not Found</div>}
      <div className="author">Designed by Surya</div>
    </div>
    </>
  );
};

export default App;
