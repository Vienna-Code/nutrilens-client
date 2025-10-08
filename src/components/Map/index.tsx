import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import styles from './styles.module.scss'
import { useRef } from 'react'
import type { LatLngTuple } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './styles.scss'
// import Routing from '../Routing'

const Map = ({ coords, text }: { coords: LatLngTuple, text: string }) => {
	const mapRef = useRef(null)
	
	return (
		<div className={styles.map}>
			<MapContainer center={coords} zoom={13} scrollWheelZoom={true} ref={mapRef} touchZoom={true} className={styles.leafletContainer} zoomControl={false}>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<Marker position={coords}>
					<Popup>{text}</Popup>
				</Marker>
				{/* <Routing origin={markerCoords} destination={destCoords} /> */}
			</MapContainer>
		</div>
	)
}

export default Map