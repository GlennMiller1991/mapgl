import React, {useCallback, useEffect, useState, MouseEvent, useRef} from 'react';
import {EventData, GeoJSONSource, GeoJSONSourceRaw, MapboxEvent} from "mapbox-gl";
import {tMode, tState} from "./types/types";
import {initialState} from "./constants/initialState";
import {Map} from './components/Map/Map'
import {ControlPanel} from "./components/ControlPanel/ControlPanel";
import mapboxgl from 'mapbox-gl';
import {pointConfig, pointSource, pointSourceName} from "./constants/pointConfig";
import {lineConfig, lineSource, lineSourceName} from "./constants/lineConfig";

function App() {
    const [state, setState] = useState<tState>({
        map: null,
        currentPosition: initialState.coords,
        mode: 'point',
        points: [],
        lines: [{
            id: 'asdf',
            visible: true,
            coords: [[initialState.coords.lng, initialState.coords.lat]]
        }],
    })
    const mode = useRef<tMode>('none')


    const onMapMount = useCallback((map: mapboxgl.Map) => {
        setState(prev => ({...prev, map}))
    }, [])
    const onMapMove = useCallback((e: MapboxEvent  & EventData) => {
        let coords = e.target.getCenter()
        let zoom = e.target.getZoom()
        setState(prev => ({...prev, currentPosition: {
            lat: coords.lat, lng: coords.lng, zoom: zoom
            }}))
    }, [])
    const onControlButtonClick = useCallback((e: MouseEvent<HTMLButtonElement>) => {
        let target = e.currentTarget
        let newMode = target.dataset.mode as tMode
        mode.current = newMode
    }, [])
    const onMapClick = useCallback(( e:mapboxgl.MapMouseEvent & EventData) => {
        if (state.map && !e.defaultPrevented) {
            const latLng = new mapboxgl.LngLat(e.lngLat.lng, e.lngLat.lat)
            if (mode.current === 'point') {
                setState(prev => ({...prev, points: [...prev.points, {
                        id: new Date().toString(),
                        visible: true,
                        coords: latLng,
                    }]}))
                mode.current = 'none'
            } else if (mode.current === 'line') {
                //@ts-ignore
                setState((prev) => {
                    const lines = [{
                        ...prev.lines[0],
                        coords: [...prev.lines[0].coords, [latLng.lng, latLng.lat]]
                    }]
                    console.log(lines)
                    return {...prev, lines}
                })
            }
        }
    }, [state.map])
    const onPointClick = useCallback((e:mapboxgl.MapMouseEvent & EventData) => {
        e.preventDefault()
        let obj = e.features && e.features[0]
        if (obj) {
            const coordinates = (obj.geometry as unknown as {coordinates: mapboxgl.LngLat}).coordinates
            const id = obj.properties?.id
            if (coordinates && id) {
                new mapboxgl.Popup({anchor: 'top'})
                    .setText(id)
                    .setLngLat(coordinates)
                    .addTo(e.target)
            }
        }
    }, [])
    const onLineClick = useCallback((e:mapboxgl.MapMouseEvent & EventData) => {
        console.log(e)
    }, [])

    useEffect(() => {
        if (state.map) {

            // point config
            state.map.addSource(pointSourceName, pointSource as GeoJSONSourceRaw)
            state.map.addLayer(pointConfig)
            state.map.on('click', pointConfig.id, onPointClick)

            // line config
            state.map.addSource(lineSourceName, lineSource as GeoJSONSourceRaw)
            state.map.addLayer(lineConfig)
            state.map.on('click', lineConfig.id, onPointClick)

            state.map.on('move', onMapMove)
            state.map.on('click', onMapClick)
        }
    }, [state.map])
    useEffect(() => {
        if (state.map) {
            (state.map.getSource(pointSourceName) as GeoJSONSource)
                .setData({
                    "type": "FeatureCollection",
                    "features": state.points.map((point) => {
                        return {
                            "type": "Feature",
                            "properties": {
                                "id": point.id
                            },
                            "geometry": {
                                "type": "Point",
                                "coordinates": [point.coords.lng, point.coords.lat]
                            }
                        }
                    })
                })
        }
    },[state.points])
    useEffect(() => {
        if (state.map) {
            (state.map.getSource(pointSourceName) as GeoJSONSource)
                .setData({
                    "type": "FeatureCollection",
                    "features": state.lines.map((line) => {
                        return {
                            "type": "Feature",
                            "properties": {},
                            "geometry": {
                                "type": "LineString",
                                "coordinates": line.coords
                            }
                        }
                    })
                })
        }
    }, [state.lines])
  return (
      <div className={'appContainer allScreen'}>
          {/*<ControlPanel mode={state.mode}/>*/}
          <Map onMount={onMapMount}/>
          <div className={'btnContainer'}>
              <button className={'controlButton'}
                      onClick={onControlButtonClick}
                      data-mode={'line'}>line</button>
              <button className={'controlButton'}
                      onClick={onControlButtonClick}
                      data-mode={'point'}>point</button>
          </div>
      </div>
  );
}

export default App;