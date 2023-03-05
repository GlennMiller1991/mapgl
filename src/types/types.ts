import mapboxgl from "mapbox-gl";

export type tState = {
    map: mapboxgl.Map | null,
    currentPosition: tPosition,
    mode: tMode,
    points: tPoint[],
    lines: tLine[],
}

export type tLine = {
    id: string //date
    visible: boolean,
    coords: [number, number][]
}

export type tPoint = {
    id: string //date
    visible: boolean,
    coords: mapboxgl.LngLat,
}
export type tMode = 'none' | 'point' | 'line'
export type tPosition = {
    lat: number,
    lng: number,
    zoom: number,
}
export type tPointFeature = {
    type: 'Feature',
    properties: {},
    geometry: {
        type: 'Point',
        coordinates: number[],
    }
}

export type tLineFeature = {
    type: 'Feature',
    properties: {},
    geometry: {
        type: 'LineString',
        coordinates: [number, number][]
    }
}