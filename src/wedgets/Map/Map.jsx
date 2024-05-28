import { useEffect, useState, useRef } from 'react'
import style from './Map.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons'

import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { useMap } from 'react-leaflet/hooks'
import { Marker } from 'react-leaflet/Marker'
import { Popup } from 'react-leaflet/Popup'
import { Tooltip, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const userLocationSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="#ffd43b"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>'

const closestStationLocationSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="var(--accent_color_L2)"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M16 144a144 144 0 1 1 288 0A144 144 0 1 1 16 144zM160 80c8.8 0 16-7.2 16-16s-7.2-16-16-16c-53 0-96 43-96 96c0 8.8 7.2 16 16 16s16-7.2 16-16c0-35.3 28.7-64 64-64zM128 480V317.1c10.4 1.9 21.1 2.9 32 2.9s21.6-1 32-2.9V480c0 17.7-14.3 32-32 32s-32-14.3-32-32z"/></svg>'

const stationLocationSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="#ffffffd1"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M16 144a144 144 0 1 1 288 0A144 144 0 1 1 16 144zM160 80c8.8 0 16-7.2 16-16s-7.2-16-16-16c-53 0-96 43-96 96c0 8.8 7.2 16 16 16s16-7.2 16-16c0-35.3 28.7-64 64-64zM128 480V317.1c10.4 1.9 21.1 2.9 32 2.9s21.6-1 32-2.9V480c0 17.7-14.3 32-32 32s-32-14.3-32-32z"/></svg>'

const ULIconSize = 28
const userLocationIcon = L.divIcon({
  html: userLocationSvg,
  className: 'user-location-icon',
  iconSize: [ULIconSize, ULIconSize],
  iconAnchor: [ULIconSize / 2, ULIconSize],
  popupAnchor: [0, 0 - ULIconSize],
})
const CSLIconSize = 36
const closestStationLocationIcon = L.divIcon({
  html: closestStationLocationSvg,
  className: 'station-closest-location-icon',
  iconSize: [CSLIconSize, CSLIconSize],
  iconAnchor: [CSLIconSize / 2, CSLIconSize],
  popupAnchor: [0, 0 - CSLIconSize],
})
const SLIconSize = 18
const stationLocationIcon = L.divIcon({
  html: stationLocationSvg,
  className: 'station-location-icon',
  iconSize: [SLIconSize, SLIconSize],
  iconAnchor: [SLIconSize / 2, SLIconSize],
  popupAnchor: [0, 0 - SLIconSize],
})

/**
 *
 * @param {*} param0
 * @returns
 */
const FitBounds = ({ bounds, minZoom = 13, maxZoom = 13 }) => {
  const map = useMap()

  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { minZoom, maxZoom })
    }
  }, [bounds, map, maxZoom, minZoom])

  return null
}

const RecenterMap = ({ position }) => {
  const map = useMap()
  useEffect(() => {
    map.setView(position, map.getZoom())
  }, [position, map])
  return null
}

const LocationButton = ({ bounds }) => {
  const [showButton, setShowButton] = useState(false)
  const map = useMap()
  const minZoom = 13
  const maxZoom = 13

  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { minZoom, maxZoom })
    }
  }, [bounds, map])

  useMapEvents({
    moveend: () => {
      const mapBounds = map.getBounds()
      let outOfBounds = false
      bounds.forEach((bound) => {
        if (!mapBounds.contains(bound)) {
          outOfBounds = true
        }
      })
      setShowButton(outOfBounds)
    },
  })

  const handleClick = () => {
    map.fitBounds(bounds, { minZoom, maxZoom })
    setShowButton(false)
  }

  return (
    showButton && (
      <button className={style.locationButton} onClick={handleClick}>
        <FontAwesomeIcon icon={faLocationArrow} />
      </button>
    )
  )
}

export default function WeatherMap({
  mainPosition,
  subPosition,
  otherPositions,
  positionReady,
}) {
  const defaultPotision = [51.505, -0.09]

  const bounds = []
  if (mainPosition) bounds.push(mainPosition)
  if (subPosition) bounds.push(subPosition)

  return (
    <div className={style.mapContainer}>
      <MapContainer
        className={style.map}
        center={defaultPotision}
        zoom={12}
        zoomControl={false}
        scrollWheelZoom={true}
        // doubleClickZoom={false}
        // dragging={false}
      >
        <LocationButton bounds={bounds} />
        {positionReady && (
          <>
            {subPosition && (
              <Marker position={subPosition} icon={userLocationIcon}>
                <Tooltip
                  direction="top"
                  offset={[0, -40]}
                  className="custom-tooltip"
                >
                  <p>您的位置</p>
                </Tooltip>
              </Marker>
            )}
            {mainPosition && (
              <Marker position={mainPosition} icon={closestStationLocationIcon}>
                <Tooltip
                  direction="top"
                  offset={[0, -50]}
                  className="custom-tooltip"
                >
                  <p>離您最近的氣象站</p>
                </Tooltip>
              </Marker>
            )}
            {otherPositions.map((station, index) => {
              const position = [
                station.GeoInfo.Coordinates[0].StationLatitude,
                station.GeoInfo.Coordinates[0].StationLongitude,
              ]

              const locationName = `${station.GeoInfo.CountyName} ${station.StationName}`
              const weather = station.WeatherElement.Weather
              const airTemperature = station.WeatherElement.AirTemperature
              const relativeHumidity = station.WeatherElement.RelativeHumidity
              const windSpeed = station.WeatherElement.WindSpeed
              const airPressure = station.WeatherElement.AirPressure

              return (
                <>
                  <Marker
                    key={index}
                    position={position}
                    icon={stationLocationIcon}
                  >
                    <Tooltip
                      direction="top"
                      offset={[0, -28]}
                      className="custom-tooltip"
                    >
                      <h2>{locationName}</h2>
                      <h3>{weather ? weather : ''}</h3>
                      <p>
                        溫度 |{' '}
                        {airTemperature > 30 ? `${airTemperature}℃` : '--'}
                      </p>
                      <p>
                        濕度 |{' '}
                        {relativeHumidity > 0 ? `${relativeHumidity}%` : '--'}
                      </p>
                      <p>風速 | {windSpeed > 0 ? `${windSpeed} km/s` : '--'}</p>
                      <p>
                        大氣壓力 |{' '}
                        {airPressure > 0 ? `${airPressure} hPa` : '--'}
                      </p>
                    </Tooltip>
                  </Marker>
                </>
              )
            })}
            <RecenterMap
              position={mainPosition ? mainPosition : defaultPotision}
            />
            <FitBounds bounds={bounds} />
          </>
        )}

        <TileLayer
          dragging={false}
          touchZoom={false}
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  )
}
