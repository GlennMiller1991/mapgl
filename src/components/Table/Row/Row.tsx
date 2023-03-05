import React from "react";
import styles from "./Row.module.css";
import {AiFillDelete, AiFillEye, AiFillEyeInvisible} from "react-icons/ai";
import {BiCurrentLocation} from "react-icons/bi";
import {tLine, tPoint} from "../../../types/types";

type tRow = {
    element: tPoint | tLine
    onChangeVisibility: (element: tPoint | tLine) => void,
    onDeleteClick: (element: tPoint | tLine) => void,
    onGoTo: (element: tPoint | tLine) => void,
}
export const Row: React.FC<tRow> = React.memo(({
                                                   element, onChangeVisibility, onDeleteClick, onGoTo,
                                               }) => {
    return (
        <div key={element.id} className={styles.row}>
            <div className={'flexCenter'}>{element.id}</div>
            <div  className={'flexCenter btn'}
                  onClick={() => onChangeVisibility(element)}>{element.visible ?
                <AiFillEyeInvisible/> : <AiFillEye/>}</div>
            <div  className={'flexCenter btn'}
                  onClick={() => onGoTo(element)}><BiCurrentLocation/></div>
            <div  className={'flexCenter btn'}
                  onClick={() => onDeleteClick(element)}><AiFillDelete/></div>
        </div>
    )
})