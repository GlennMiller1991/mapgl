import {AnyLayer, LineLayer} from "mapbox-gl";
import {tLineFeature, tPointFeature} from "../types/types";

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
        'line-width': 10,
    }
}

export const linePointConfig: AnyLayer = {
    id: 'linePoints',
    type: 'circle',
    source: 'linePointSource',
    paint: {
        "circle-radius": 10,
        'circle-color': '#888',
    }
}

export const linePointSource = {
    type: 'geojson',
    data: {
        type: 'FeatureCollection',
        features: [] as tPointFeature[]
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
export const linePointSourceName: string = 'linePointSource'