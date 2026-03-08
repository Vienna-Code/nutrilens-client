import { MapContainer, Marker, TileLayer, useMapEvents, useMap } from 'react-leaflet'
import styles from './styles.module.scss'
import { useEffect, useRef, useState } from 'react'
import { type LatLng, type LatLngTuple, icon, type Map as MapType } from 'leaflet'
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

const PanTo = ({ coords, zoom }: { coords?: LatLngTuple, zoom?: number }) => {
	const map = useMap()
	
	useEffect(() => {
		if (!coords || !map) return

		map.setView(coords, zoom || 16)
	}, [coords, map])
	
	return null
}

const MarkerBlank = icon({ iconUrl: '/marker_blank.svg', iconSize: [30, 52], iconAnchor: [15, 52] })
const MarkerBlankSelected = icon({ iconUrl: '/marker_blank.svg', iconSize: [40, 62], iconAnchor: [20, 62] })
const MarkerKiosk = icon({ iconUrl: '/marker_kiosk_1.svg', iconSize: [30, 52], iconAnchor: [15, 52] })
const MarkerKioskSelected = icon({ iconUrl: '/marker_kiosk_1.svg', iconSize: [40, 62], iconAnchor: [20, 62] })
const MarkerSupermarket = icon({ iconUrl: '/marker_supermarket_1.svg', iconSize: [30, 52], iconAnchor: [15, 52] })
const MarkerSupermarketSelected = icon({ iconUrl: '/marker_supermarket_1.svg', iconSize: [40, 62], iconAnchor: [20, 62] })
const MarkerBakery = icon({ iconUrl: '/marker_bakery_1.svg', iconSize: [30, 52], iconAnchor: [15, 52] })
const MarkerBakerySelected = icon({ iconUrl: '/marker_bakery_1.svg', iconSize: [40, 62], iconAnchor: [20, 62] })
const MarkerRestaurant = icon({ iconUrl: '/marker_restaurant_1.svg', iconSize: [30, 52], iconAnchor: [15, 52] })
const MarkerRestaurantSelected = icon({ iconUrl: '/marker_restaurant_1.svg', iconSize: [40, 62], iconAnchor: [20, 62] })

const mapMarkers = {
	'kiosk': {
		regular: MarkerKiosk,
		selected: MarkerKioskSelected
	},
	'supermarket': {
		regular: MarkerSupermarket,
		selected: MarkerSupermarketSelected
	},
	'bakery': {
		regular: MarkerBakery,
		selected: MarkerBakerySelected
	},
	'restaurant': {
		regular: MarkerRestaurant,
		selected: MarkerRestaurantSelected
	}
}

const Map = ({ markers, center, disableLocation, panTo }: { markers?: { coords: LatLngTuple, text: string, verified?: boolean, id?: string, type?: keyof typeof mapMarkers }[], center?: LatLngTuple, disableLocation?: boolean, panTo?: LatLngTuple }) => {
	const mapRef = useRef<MapType>(null)
	const [currentBoundaries, setCurrentBoundaries] = useState<{ southWest: { lat: number, lon: number }, northEast: { lat: number, lon: number } }|null>(null)
	const setCommerces = useAllStore(state => state.setCommerces)
	const selectedCommerce = useAllStore(state => state.selectedCommerce)
	const setSelectedCommerce = useAllStore(state => state.setSelectedCommerce)
	const unverifiedCommerces = useAllStore(state => state.unverifiedCommerces)
	const [localPan, setLocalPan] = useState<LatLngTuple>()
	const [zoom, setZoom] = useState<number>()
	
	useEffect(() => {
		if (!currentBoundaries) return
		if (mapRef.current && mapRef.current.getZoom() < 13) return setCommerces([])
		if (mapRef.current) setZoom(mapRef.current.getZoom())

		Api.getCommerces({ lat: [currentBoundaries.southWest.lat, currentBoundaries.northEast.lat], lon: [currentBoundaries.southWest.lon, currentBoundaries.northEast.lon], unverified: unverifiedCommerces })
		.then(data => {
			setCommerces(data.data)
		})
	}, [currentBoundaries])

	const handleMarkerClick = (id: string) => {
		setSelectedCommerce(id)

		const findCommerce = markers?.find(x => x.id == id)

		if (findCommerce) setLocalPan(findCommerce.coords)
	}

	return (
		<div className={styles.map}>
			<MapContainer center={center} zoom={13} scrollWheelZoom={true} ref={mapRef} touchZoom={true} className={styles.leafletContainer} zoomControl={false} maxZoom={19} minZoom={6}>
				{!disableLocation && <LocateUser />}
				<InnerComponent setBoundaries={setCurrentBoundaries} />
				<TileLayer maxZoom={19}
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{markers && markers.map(({ coords, id, type }) => {
					return <Marker position={coords} key={`${coords[0]} ${coords[1]}`} eventHandlers={{ click: () => id && handleMarkerClick(id) }} icon={!type ? (id === selectedCommerce ? MarkerBlankSelected : MarkerBlank) : (id === selectedCommerce ? mapMarkers[type].selected : mapMarkers[type].regular)} />
					
				})}
				<PanTo coords={localPan || panTo} zoom={localPan && zoom} />
				{/* <Routing origin={markerCoords} destination={destCoords} /> */}
			</MapContainer>
		</div>
	)
}

export default Map