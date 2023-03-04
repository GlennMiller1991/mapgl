export type tState = {
    map: mapboxgl.Map | null,
    currentPosition: tPosition,
    mode: tMode
}

export type tMode = null | 'point' | 'line'
export type tPosition = {
    lat: number,
    lng: number,
    zoom: number,
}