import style from './Home.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLocationDot,
  faCircleExclamation,
} from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { useContext } from 'react'
import { AppContext } from '../../AppContext'

import Map from '../../wedgets/Map/Map'

export default function Home() {
  const { userLocation, setUserLocation } = useContext(AppContext)
  const [locationPermissionDenied, setLocationPermissionDenied] =
    useState(false)
  const [weatherData, setWeatherData] = useState()
  const [weatherStationLocation, setWeatherStationLocation] = useState()
  const [weatherStation, setWeatherStation] = useState(null)
  const [error, setError] = useState(null)

  const apiKey = process.env.REACT_APP_OPEN_WEATHER_API_KEY

  // 位置及權限獲取
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation([latitude, longitude])
          console.log([latitude, longitude])

          setLocationPermissionDenied(false)
          setError('')
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setLocationPermissionDenied(true)
          }
          setError(
            '無法訪問您的位置，請同意我們取用您的位置，以提供在地天氣的服務。'
          )
        }
      )
    } else {
      setError('此瀏覽器不支持地理定位。')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 天氣資料獲取
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
      })
      .catch((error) => {
        console.error('Failed to fetch weather data:', error)
        setError(error.message)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 將尋找與當前位置最近的天氣資料
  useEffect(() => {
    if (weatherData && userLocation && weatherData.length > 0) {
      const closestStation = findClosestStation(userLocation, weatherData)
      setWeatherStation(closestStation)
      setWeatherStationLocation([
        closestStation.GeoInfo.Coordinates[0].StationLatitude,
        closestStation.GeoInfo.Coordinates[0].StationLongitude,
      ])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation, weatherData])

  /**
   * 篩選出距離使用者最近的氣象站資料
   * @param {Array} userLocation - 使用者位置
   * @param {Array} stations - 天氣資料
   * @returns
   */
  function findClosestStation(userLocation, stations) {
    let minDistance = Infinity
    let closestStation = null

    stations.forEach((station, index) => {
      const lat = station.GeoInfo.Coordinates[0].StationLatitude
      const long = station.GeoInfo.Coordinates[0].StationLongitude
      const distance = getDistanceFromLatLonInKm(
        userLocation[0],
        userLocation[1],
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

  /**
   * 計算使用者與氣象站的距離（此計算方法由AI撰寫）
   * @param {Number} lat1 - 使用者位置緯度
   * @param {Number} lon1 - 使用者位置經度
   * @param {Number} lat2 - 氣象站位置緯度
   * @param {Number} lon2 - 氣象站位置經度
   * @returns
   */
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
    return R * c // 距離（公里）
  }
  function deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

  // 判斷天氣資料是否準備好
  function checkDataReady() {
    if (weatherData?.length > 0 && userLocation) {
      return true
    } else {
      return false
    }
  }

  return (
    <div className={style.view}>
      <Map
        userPosition={userLocation}
        stationPostion={weatherStationLocation}
        positionReady={checkDataReady()}
      />
      <div className={style.container}>
        <div className={style.search_view}>
          <div className={style.header}>
            <img src="/feather_icon_noborder_64.png" alt="" />
            <h1>Feather</h1>
          </div>
        </div>
        <p className={style.error}>{error}</p>
        {checkDataReady() ? (
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
        ) : locationPermissionDenied ? (
          <p className={style.locationPermissionDenied}>
            <FontAwesomeIcon icon={faCircleExclamation} />
            位置存取遭拒
          </p>
        ) : (
          <p>加載中...</p>
        )}
      </div>
    </div>
  )
}
