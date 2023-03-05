import mapboxgl from "mapbox-gl";
import {MutableRefObject} from "react";

export type tState = {
    map: MutableRefObject<mapboxgl.Map | null>,
    currentPosition: tPosition,
    mode: MutableRefObject<tMode> ,
    points: tPoint[],
    lines: tLine[],
    unCompleteLine: tLine | null,
    popup: mapboxgl.Popup | null
}

export type tLine = {
    type: 'line'
    id: string //date
    visible: boolean,
    coords: [number, number][]
}

export type tPoint = {
    type: 'point'
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
export type tStateArrays = 'points' | 'lines'