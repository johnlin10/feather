import { useEffect, useState } from 'react'
import style from './Map.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'

import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { useMap } from 'react-leaflet/hooks'
import { Marker } from 'react-leaflet/Marker'
import { Popup } from 'react-leaflet/Popup'
import { Tooltip, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const svgIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="#ffffffd1"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>'

const stationSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="#5a98ee"><path d="M32 32C32 14.3 46.3 0 64 0H320c17.7 0 32 14.3 32 32s-14.3 32-32 32H290.5l11.4 148.2c36.7 19.9 65.7 53.2 79.5 94.7l1 3c3.3 9.8 1.6 20.5-4.4 28.8s-15.7 13.3-26 13.3H32c-10.3 0-19.9-4.9-26-13.3s-7.7-19.1-4.4-28.8l1-3c13.8-41.5 42.8-74.8 79.5-94.7L93.5 64H64C46.3 64 32 49.7 32 32zM160 384h64v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V384z"/></svg>'

const stationsSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="#ffffffd1"><path d="M32 32C32 14.3 46.3 0 64 0H320c17.7 0 32 14.3 32 32s-14.3 32-32 32H290.5l11.4 148.2c36.7 19.9 65.7 53.2 79.5 94.7l1 3c3.3 9.8 1.6 20.5-4.4 28.8s-15.7 13.3-26 13.3H32c-10.3 0-19.9-4.9-26-13.3s-7.7-19.1-4.4-28.8l1-3c13.8-41.5 42.8-74.8 79.5-94.7L93.5 64H64C46.3 64 32 49.7 32 32zM160 384h64v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V384z"/></svg>'

const customIcon = L.divIcon({
  html: svgIcon,
  className: 'custom-div-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
})
const stationIcon = L.divIcon({
  html: stationSvg,
  className: 'station-div-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
})
const stationsIcon = L.divIcon({
  html: stationsSvg,
  className: 'station-div-icon',
  iconSize: [12, 12],
  iconAnchor: [6, 12],
  popupAnchor: [0, -12],
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
        <FontAwesomeIcon icon={faLocationDot} />
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
        // scrollWheelZoom={false}
        doubleClickZoom={false}
        // dragging={false}
      >
        <LocationButton bounds={bounds} />
        {positionReady && (
          <>
            {subPosition && (
              <Marker position={subPosition} icon={customIcon}>
                <Tooltip
                  direction="top"
                  offset={[0, -32]}
                  className="custom-tooltip"
                >
                  <p>您的位置</p>
                </Tooltip>
              </Marker>
            )}
            {mainPosition && (
              <Marker position={mainPosition} icon={stationIcon}>
                <Tooltip
                  direction="top"
                  offset={[0, -32]}
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
              const weather = station.WeatherElement.Weather
              const airTemperature = station.WeatherElement.AirTemperature
              const relativeHumidity = station.WeatherElement.RelativeHumidity
              return (
                <>
                  <Marker key={index} position={position} icon={stationsIcon}>
                    <Tooltip
                      direction="top"
                      offset={[0, -20]}
                      className="custom-tooltip"
                    >
                      <h3>{weather ? weather : ''}</h3>
                      <p>
                        溫度 {airTemperature > 30 ? `${airTemperature}℃` : '--'}
                      </p>
                      <p>
                        濕度{' '}
                        {relativeHumidity > 0 ? `${relativeHumidity}%` : '--'}
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
