import mapboxgl from "mapbox-gl";
import {MutableRefObject} from "react";

/**
 * Главынй стейт приложения
 */
export type tState = {

    /**
     * Иногда нужна доступность рефа, но обновляемость стейта, поэтому такое решение
     */
    map: MutableRefObject<mapboxgl.Map | null>,

    /**
     * текущая позиция карты. Думал понадобится, в итоге - нет
     */
    currentPosition: tPosition,

    /**
     * аналогично свойству map
     */
    mode: MutableRefObject<tMode> ,

    /**
     * массив точек
     */
    points: tPoint[],

    /**
     * массив линий
     * Точка считается линией
     */
    lines: tLine[],

    /**
     * отслеживаем начало построения линий
     */
    unCompleteLine: tLine | null,

    /**
     * сохраняем попап, чтобы собственноручно закрыть при выполнении некоторых функций
     */
    popup: mapboxgl.Popup | null
}

/**
 * объект линий
 * @param type {'line'} для отличия от обхекта точки
 * @param id {string} строка в формате даты, используется и как айди и как тест для попапа
 * @param visible {boolean} флаг видимости
 * @param coords {Array<[number, number]>>} Массив массивов из двух чисел как широта и долгота
 */
export type tLine = {
    type: 'line'
    id: string //date
    visible: boolean,
    coords: [number, number][]
}

/**
 * @param type {'point'} для отличия от линий
 * @param id {string} строка в формате даты, используется и как айди и как тест для попапа
 * @param visible {boolean} флаг видимости
 * @param coords {mapboxgl.LngLat} широта долгота
 */
export type tPoint = {
    type: 'point'
    id: string //date
    visible: boolean,
    coords: mapboxgl.LngLat,
}

/**
 * Режим создания объектов
 */
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

/**
 * наименования массивов объектов, а так же вкладок
 */
export type tStateArrays = 'points' | 'lines'