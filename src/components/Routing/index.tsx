import type { LatLngTuple } from 'leaflet'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import 'leaflet-routing-machine'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import { useEffect } from 'react'
import './styles.scss'

const Routing = ({ origin, destination }: { origin: LatLngTuple, destination: LatLngTuple }) => {
	const map = useMap()
	
	
	useEffect(() => {
		if (!map) return

		L.Routing.control({
			waypoints: [L.latLng(...origin), L.latLng(...destination)],
			routeWhileDragging: false,
			show: false,
			router: L.routing.osrmv1({
				serviceUrl: 'http://router.project-osrm.org/route/v1/',
				profile: 'foot'
			}),
			lineOptions: {
				extendToWaypoints: true,
				missingRouteTolerance: 1,
				styles: [
					{ color: 'white', opacity: 0.5, weight: 3 },
					{ color: 'lightblue', opacity: 0.8, weight: 6 }
				]
			}
		}).addTo(map)
	}, [map])
	
	return null
}

export default Routing