import React, {useEffect, useRef} from 'react'
import mapboxgl from "mapbox-gl";
import {initialState} from "../../constants/initialState";
import {accessToken} from "../../constants/accessToken";

type tMap = {
    onMount: (map: mapboxgl.Map) => void,
}
export const Map: React.FC<tMap> = React.memo(({onMount}) => {

    const mapContainer = useRef<null>(null)

    useEffect(() => {
        if (mapContainer.current) {
            let map = new mapboxgl.Map({
                container: mapContainer.current,
                center: [initialState.coords.lng, initialState.coords.lat],
                zoom: initialState.coords.zoom,
                accessToken,
                style: 'mapbox://styles/mapbox/streets-v12',
            })
            onMount && onMount(map)
        }
    }, [])
    return (
        <div className={'mapContainer allScreen'} ref={mapContainer}/>
    )
})