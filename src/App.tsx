import React, {useCallback, useEffect, useRef, useState} from 'react';
import mapboxgl, {EventData, GeoJSONSource, GeoJSONSourceRaw, MapboxEvent, MapboxGeoJSONFeature} from "mapbox-gl";
import {tLine, tMode, tPoint, tState, tStateArrays} from "./types/types";
import {initialState} from "./constants/initialState";
import {Map} from './components/Map/Map'
import {pointConfig, pointSource, pointSourceName} from "./constants/pointConfig";
import {
    lineConfig,
    linePointConfig,
    linePointSource,
    linePointSourceName,
    lineSource,
    lineSourceName
} from "./constants/lineConfig";
import {Preloader} from "./components/Preloader/Preloader";
import {Table} from "./components/Table/Table";
import {getIdByDate} from "./utils/getIdByDate";
import {BtnContainer} from "./components/BtnContainer/BtnContainer";

function App() {
    const mode = useRef<tMode>('none')
    const map = useRef<mapboxgl.Map | null>(null)
    const [state, setState] = useState<tState>({
        map,
        currentPosition: initialState.coords,
        mode,
        points: [],
        lines: [],
        unCompleteLine: null,
        popup: null,
    })


    const onMapMove = useCallback((e: MapboxEvent  & EventData) => {
        let coords = e.target.getCenter()
        let zoom = e.target.getZoom()
        setState(prev => ({...prev, currentPosition: {
            lat: coords.lat, lng: coords.lng, zoom: zoom
            }}))
    }, [])
    const onLineCreateClick = useCallback(() => {
            setState(prev => {
                prev.mode.current = 'line'
                return {
                    ...prev,
                    unCompleteLine: {
                        type: 'line',
                        id: '',
                        visible: true,
                        coords: []
                    }
                }
            })
    }, [])
    const onExitClick = useCallback(() => {
        setState(prev => {
            prev.mode.current = 'none'
            return {
                ...prev
            }
        })
    }, [])
    const onPointCreateClick = useCallback(() => {
        if (mode.current !== 'point') {
            setState(prev => {
                prev.mode.current = 'point'
                return {
                    ...prev
                }
            })
        }
    }, [])
    const onMapClick = useCallback(( e:mapboxgl.MapMouseEvent & EventData) => {
        if (map.current && !e.defaultPrevented) {
            const latLng = new mapboxgl.LngLat(e.lngLat.lng, e.lngLat.lat)
            if (mode.current === 'point') {
                setState(prev => ({...prev, points: [...prev.points, {
                    type: 'point',
                        id: getIdByDate(),
                        visible: true,
                        coords: latLng,
                    }]}))
                mode.current = 'none'
            } else if (mode.current === 'line') {
                setState((prev) => {
                    if (prev.unCompleteLine) {
                        return {
                            ...prev,
                            lines: [...prev.lines, {
                                type: 'line',
                                id: getIdByDate(),
                                visible: true,
                                coords: [[latLng.lng, latLng.lat]]}],
                            unCompleteLine: null
                        }
                    } else {
                        const lines = [...prev.lines]
                        lines[lines.length - 1]
                            .coords
                            .push([latLng.lng, latLng.lat])
                        return {...prev, lines}
                    }
                })
            }
        }
    }, [])
    const onElementClick = useCallback((e:mapboxgl.MapMouseEvent & EventData) => {
        e.preventDefault()
        let obj = e.features && e.features[0]
        if (obj) {
            const coordinates = obj.layer.id === 'lines' ? e.lngLat : (obj.geometry as unknown as {coordinates: mapboxgl.LngLat}).coordinates
            const id = obj.properties?.id
            if (coordinates && id) {
                const popup = new mapboxgl.Popup({anchor: 'top'})
                    .setText(id)
                    .setLngLat(coordinates)
                    .addTo(e.target)
                setState(prev => ({...prev, popup}))
            }
        }
    }, [])

    /**
     * Карта убрана в отдельную компоненту, куда передается только функция
     * дальнейших действий. Это она
     * @param map {mapboxgl.Map}
     * Добавляем необходимые уровни, источники, обработчики
     */
    const onMapMount = useCallback((map: mapboxgl.Map) => {
        map.addSource(pointSourceName, pointSource as GeoJSONSourceRaw)
        map.addLayer(pointConfig)
        map.on('click', pointConfig.id, onElementClick)

        // line config
        map.addSource(lineSourceName, lineSource as GeoJSONSourceRaw)
        map.addLayer(lineConfig)
        map.on('click', lineConfig.id, onElementClick)

        // linePoint config
        map.addSource(linePointSourceName, linePointSource as GeoJSONSourceRaw)
        map.addLayer(linePointConfig)
        map.on('click', linePointConfig.id, onElementClick)

        map.on('move', onMapMove)
        map.on('click', onMapClick)
        setState(prev => {
            prev.map.current = map
            return {
                ...prev
            }})
    }, [])

    /**
     * Фуекция удаления объекта
     * @param element {tPoint | tLine} линия или точка, типы схожи
     */
    const onDelete = useCallback((element: tPoint | tLine) => {
        setState(prev => {
            // если попап висит, то закрываем. Так как может остаться после удаления
            // Дальше обнуляем
            prev.popup && prev.popup.remove()

            // массив филтруем по айди
            return {
                ...prev,
                popup: null,
                [element.type + 's' as 'lines' | 'points']:
                    (prev[element.type + 's' as 'lines' | 'points'] as Array<tLine | tPoint>)
                        .filter((elem) => elem.id !== element.id)
            }
        })
    }, [])

    /**
     * Фуекция смены видимости одного объекта
     * @param element {tPoint | tLine} линия или точка, типы схожи
     */
    const onChangeVisibility = useCallback((element: tPoint | tLine) => {
        setState(prev => {
            prev.popup && prev.popup.remove()
            return {
                ...prev,
                popup: null,
                [element.type + 's' as 'lines' | 'points']:
                    (prev[element.type + 's' as 'lines' | 'points'] as Array<tLine | tPoint>)
                        .map((elem) => {
                            if (elem.id !== element.id) return elem
                            return {
                                ...element,
                                visible: !element.visible
                            }
                        })
            }
        })
    }, [])

    /**
     * Перейти к объекту
     * @param element {tPoint | tLine} линия или точка, типы схожи
     */
    const onGoTo = useCallback((element: tPoint | tLine) => {
        map.current?.flyTo({center: element.type === 'point' ?
                (element as tPoint).coords :
                (element as tLine).coords[0]
        })
    }, [])

    /**
     * Удалить все объекты данного типа
     * @param type {tStateArrays} вкладка, по которой кликнули, она же наименвание массива
     */
    const onDeleteAll = useCallback((type: tStateArrays) => {
        // выходим из любого режима создания объекта
        // иначе червато ошибкой доступа по несуществующему индексу
        mode.current = 'none'
        setState(prev => {
            prev.popup && prev.popup.remove()
            return {
                ...prev,
                popup: null,
                [type]: []
            }
        })
    }, [])

    /**
     * Сменить видимость всех объектов данного типа на отличную от видимости первого элемента
     * данного типа
     * @param type {tStateArrays} вкладка, по которой кликнули, она же наименвание массива
     */
    const onChangeVisibilityAll = useCallback((type: tStateArrays) => {
        // выходим из режима создания, так как пользователь может сменить видимость линии
        // которую сейчас и создает
        mode.current = 'none'
        setState(prev => {
            prev.popup && prev.popup.remove()
            let visibility = prev[type as 'lines' | 'points'][0].visible
            return {
                ...prev,
                popup: null,
                [type]: prev[type as 'lines' | 'points']
                    .map((element) => ({...element, visible: !visibility}))
            }
        })
    }, [])

    useEffect(() => {
        if (state.map.current) {
            (state.map.current.getSource(pointSourceName) as GeoJSONSource)
                .setData({
                    "type": "FeatureCollection",
                    "features": state.points.reduce((accum, point) => {
                        if (point.visible) {
                            const feature = {
                                "type": "Feature",
                                "properties": {
                                    "id": point.id
                                },
                                "geometry": {
                                    "type": "Point",
                                    "coordinates": [point.coords.lng, point.coords.lat]
                                }
                            }
                            accum.push(feature as unknown as MapboxGeoJSONFeature)
                        }
                        return accum
                    }, [] as Array<MapboxGeoJSONFeature>)
                })
        }
    },[state.points])
    useEffect(() => {
        if (state.map.current) {
            const [lineFeatures, pointFeatures] = state.lines.reduce((accum, line) => {
                if (line.visible) {
                    if (line.coords.length > 1) {
                        const feature = {
                            "type": "Feature",
                            "properties": {id: line.id},
                            "geometry": {
                                "type": "LineString",
                                "coordinates": line.coords
                            }
                        }
                        accum[0].push(feature as unknown as MapboxGeoJSONFeature)
                    } else {
                        const feature = {
                            "type": "Feature",
                            "properties": {"id": line.id},
                            "geometry": {
                                "type": "Point",
                                "coordinates": line.coords[0]
                            }
                        }
                        accum[1].push(feature as unknown as MapboxGeoJSONFeature)
                    }
                }
                return accum
            }, [[], []] as [MapboxGeoJSONFeature[], MapboxGeoJSONFeature[]])
            if (state.map.current) {
                (state.map.current.getSource(lineSourceName) as GeoJSONSource)
                    .setData({
                        "type": "FeatureCollection",
                        "features": lineFeatures,
                    });
                (state.map.current.getSource(linePointSourceName) as GeoJSONSource)
                    .setData({
                        "type": "FeatureCollection",
                        "features": pointFeatures,
                    })
            }
        }
    }, [state.lines])


  return (
      <div className={'allContainer'}>
          <Map onMount={onMapMount}/>
          {
              !state.map.current &&
              <Preloader/>
          }
          {
              state.map.current &&
              <>
                  <BtnContainer onLineCreateClick={onLineCreateClick}
                                onPointCreateClick={onPointCreateClick}
                                onExitClick={onExitClick}
                                mode={mode.current}/>
                  <Table lines={state.lines}
                         points={state.points}
                         onDeleteClick={onDelete}
                         onDeleteAll={onDeleteAll}
                        onChangeVisibility={onChangeVisibility}
                         onChangeVisibilityAll={onChangeVisibilityAll}
                        onGoTo={onGoTo}
                  />
              </>
          }
      </div>
  );
}

export default App;

