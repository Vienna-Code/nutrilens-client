import type { LatLngTuple } from 'leaflet'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import 'leaflet-routing-machine'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import { useEffect } from 'react'
import './styles.scss'
import { useAllStore } from '../../store/useAllStore'

const OSRM_URL = import.meta.env.VITE_OSRM_URL

const Routing = ({ origin, destination }: { origin: LatLngTuple, destination: LatLngTuple }) => {
	const map = useMap()
	const routeTo = useAllStore(state => state.routeTo)
	const setSummary = useAllStore(state => state.setSummary)
	
	useEffect(() => {
		if (!map) return

		const routingControl = L.Routing.control({
			waypoints: [L.latLng(...origin), L.latLng(...destination)],
			routeWhileDragging: false,
			show: false,
			router: L.routing.osrmv1({
				serviceUrl: `${OSRM_URL}/route/v1`,
				profile: 'foot'
			}),
			lineOptions: {
				extendToWaypoints: true,
				missingRouteTolerance: 1,
				styles: [
					{ color: 'var(--pr-color)', opacity: 1, weight: 3 },
					{ color: 'var(--ac-color)', opacity: 0.8, weight: 6 }
				]
			},
			plan: new L.Routing.Plan([L.latLng(...origin), L.latLng(...destination)], {
				createMarker: () => false
			})
		}).addTo(map)

		routingControl.on('routesfound', e => {
			const { totalDistance, totalTime } = e.routes[0].summary

			setSummary({ totalDistance, totalTime })
		})

		return () => {
			map.removeControl(routingControl)
		}
	}, [map, routeTo])

	return null
}

export default Routing