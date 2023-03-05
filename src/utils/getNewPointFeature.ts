import {pointTemplate} from "../constants/pointConfig";

export const getNewPointFeature = (lng: number, lat: number) => {
    return {
        ...pointTemplate,
        geometry: {
            ...pointTemplate.geometry,
            coordinates: [lng, lat]
        }
    }
}