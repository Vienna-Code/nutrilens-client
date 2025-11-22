import { useEffect } from 'react'
import { useMapEvents, CircleMarker } from 'react-leaflet'
import { useAllStore } from '../../store/useAllStore'

const LocateUser = () => {
	const userLocation = useAllStore(state => state.userLocation)
	const setUserLocation = useAllStore(state => state.setUserLocation)
	const locate = useAllStore(state => state.locate)
	
	const map = useMapEvents({
		locationfound: (e) => {
			const zoom = map.getZoom()
			
			map.setView(e.latlng, zoom < 14 ? 16 : zoom)
			setUserLocation(e.latlng)

			sessionStorage.setItem('userLocation', JSON.stringify(e.latlng))
			localStorage.setItem('userLocation', JSON.stringify(e.latlng))
		}
	})

	useEffect(() => {
		map.locate()
	}, [map, locate])
	
	if (!userLocation) return null

	return <>
		<CircleMarker center={userLocation} radius={8} fillOpacity={1} color='white' fillColor='#3388ff' />
		<CircleMarker center={userLocation} radius={150} stroke={false} />
	</>
}

export default LocateUser