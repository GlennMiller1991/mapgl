import React, {useCallback, useEffect, useState} from 'react';
import {EventData, MapboxEvent} from "mapbox-gl";
import {tState} from "./types/types";
import {initialState} from "./constants/initialState";
import {Map} from './components/Map/Map'
import {ControlPanel} from "./components/ControlPanel/ControlPanel";

function App() {
    const [state, setState] = useState<tState>({
        map: null,
        currentPosition: initialState.coords,
        mode: null,
    })

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

    useEffect(() => {
        if (state.map) {
            state.map.on('move', onMapMove)
        }
    }, [state.map])
  return (
      <div className={'appContainer allScreen'}>
          <ControlPanel mode={state.mode}/>
          <Map onMount={onMapMount}/>
          <div className={'btnContainer'}>
              <button>line</button>
              <button>point</button>
          </div>
      </div>
  );
}

export default App;