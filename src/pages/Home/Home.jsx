import style from './Home.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { useContext } from 'react'
import { AppContext } from '../../AppContext'

export default function Home() {
  const { userLocation, setUserLocation } = useContext(AppContext)
  const [weatherData, setWeatherData] = useState([])
  const [weatherStation, setWeatherStation] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const apiKey = process.env.REACT_APP_OPEN_WEATHER_API_KEY

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          setError(error.message)
          setIsLoading(false)
        }
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetch(
      `https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0001-001?Authorization=${apiKey}&format=JSON`,
      {
        method: 'GET', // Explicitly setting the HTTP method to GET
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        if (data.success === 'true' && data.records && data.records.Station) {
          setWeatherData(data.records.Station)
        } else {
          throw new Error('No stations data found')
        }
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Failed to fetch weather data:', error)
        setError(error.message)
        setIsLoading(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (
      weatherData &&
      userLocation.latitude &&
      userLocation.longitude &&
      weatherData.length > 0
    ) {
      const closestStation = findClosestStation(userLocation, weatherData)
      setWeatherStation(closestStation)
      console.log(closestStation)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation, weatherData])

  function findClosestStation(userLocation, stations) {
    let minDistance = Infinity
    let closestStation = null

    stations.forEach((station) => {
      const lat = station.GeoInfo.Coordinates[0].StationLatitude
      const long = station.GeoInfo.Coordinates[0].StationLongitude
      const distance = getDistanceFromLatLonInKm(
        userLocation.latitude,
        userLocation.longitude,
        lat,
        long
      )
      if (distance < minDistance) {
        minDistance = distance
        closestStation = station
      }
    })

    return closestStation
  }

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distance in km
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

  return (
    <div className={style.view}>
      <div className={style.container}>
        <div className={style.search_view}>
          <div className={style.header}>
            <img src="/feather_icon_noborder_64.png" alt="" />
            <h1>Feather</h1>
          </div>
        </div>
        {isLoading && (!weatherStation || !weatherStation.length > 0) ? (
          <p>Loading...</p>
        ) : (
          <div className={style.content}>
            <h1>
              <FontAwesomeIcon icon={faLocationDot} />
              {weatherStation?.GeoInfo.CountyName} {weatherStation?.StationName}
            </h1>
            <p className={style.weather}>
              {weatherStation?.WeatherElement.Weather}
            </p>
            <div className={style.values}>
              <p>溫度 {weatherStation?.WeatherElement.AirTemperature} ℃</p>
              <p>
                相對濕度 {weatherStation?.WeatherElement.RelativeHumidity} %
              </p>
              <p>風速 {weatherStation?.WeatherElement.WindSpeed} km/s</p>
              <p>大氣壓力 {weatherStation?.WeatherElement.AirPressure} hPa</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
