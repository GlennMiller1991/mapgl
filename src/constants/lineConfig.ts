import {LineLayer} from "mapbox-gl";
import {tLineFeature} from "../types/types";

export const lineConfig: LineLayer = {
    'id': 'lines',
    'type': 'line',
    'source': 'lineSource',
    'layout': {
        'line-join': 'round',
        'line-cap': 'round'
    },
    'paint': {
        'line-color': '#888',
        'line-width': 10
    }
}

export const lineSource = {
    type: 'geojson',
    data: {
        type: 'FeatureCollection',
        features: [] as tLineFeature[]
    }
}



export const lineSourceName: string = 'lineSource'