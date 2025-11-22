import { MapContainer, Marker, Popup, TileLayer, useMapEvents, useMap } from 'react-leaflet'
import styles from './styles.module.scss'
import { useEffect, useRef, useState } from 'react'
import type { LatLng, LatLngTuple } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './styles.scss'
import LocateUser from '../LocateUser'
import Api from '../../utils/api'
import { useAllStore } from '../../store/useAllStore'

const InnerComponent = ({ setBoundaries }: { setBoundaries: (set: { southWest: { lat: number, lon: number }, northEast: { lat: number, lon: number } }) => void }) => {
	const map = useMap()

	const setBounds = (set: typeof setBoundaries) => {
		const { _southWest, _northEast } = map.getBounds() as unknown as { _southWest: LatLng, _northEast: LatLng }
					
		set({ southWest: { lat: _southWest.lat, lon: _southWest.lng }, northEast: { lat: _northEast.lat, lon: _northEast.lng }})
	}

	useMapEvents({
		moveend: () => {
			if (map) setBounds(setBoundaries)
		},
		dragend: () => {
			if (map) setBounds(setBoundaries)
		}
	})

	return null
}

const Map = ({ markers, center, disableLocation }: { markers: { coords: LatLngTuple, text: string }[], center: LatLngTuple, disableLocation?: boolean }) => {
	const mapRef = useRef(null)
	const [currentBoundaries, setCurrentBoundaries] = useState<{ southWest: { lat: number, lon: number }, northEast: { lat: number, lon: number } }|null>(null)
	const setCommerces = useAllStore(state => state.setCommerces)

	useEffect(() => {
		if (!currentBoundaries) return

		Api.getCommerces({ lat: [currentBoundaries.southWest.lat, currentBoundaries.northEast.lat], lon: [currentBoundaries.southWest.lon, currentBoundaries.northEast.lon] })
		.then(data => {
			setCommerces(data.data)
		})
	}, [currentBoundaries])
	
	return (
		<div className={styles.map}>
			<MapContainer center={center} zoom={13} scrollWheelZoom={true} ref={mapRef} touchZoom={true} className={styles.leafletContainer} zoomControl={false}>
				{!disableLocation && <LocateUser />}
				<InnerComponent setBoundaries={setCurrentBoundaries} />
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{markers.length > 0 && markers.map(({ coords, text }) => (
					<Marker position={coords} key={`${coords[0]} ${coords[1]}`}>
						<Popup>{text}</Popup>
					</Marker>
				))}
				{/* <Routing origin={markerCoords} destination={destCoords} /> */}
			</MapContainer>
		</div>
	)
}

export default Map