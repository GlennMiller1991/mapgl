import {AnyLayer} from "mapbox-gl";
import {tPointFeature} from "../types/types";

export const pointConfig: AnyLayer = {
    id: 'points',
    type: 'circle',
    source: 'pointSource',
    paint: {
        "circle-radius": 10,
        'circle-color': 'red',
    }
}


export const pointSource = {
    type: 'geojson',
    data: {
        type: 'FeatureCollection',
        features: [] as tPointFeature[]
    }
}

export const pointSourceName: string = 'pointSource'