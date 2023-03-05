import React from "react";
import rowStyles from "../Row/Row.module.css";
import styles from './AllRow.module.css'

type tAllRow = {
    onDeleteAll: () => void,
    onChangeVisibilityAll: () => void,
}
export const AllRow: React.FC<tAllRow> = React.memo(({
                                                         onDeleteAll, onChangeVisibilityAll,
                                                     }) => {
    return (
        <div className={rowStyles.row + ' ' + styles.allRow}>
            <div className={'btn'}
                 onClick={onDeleteAll}>Удалить все</div>
            <div  className={'btn'}
                  onClick={onChangeVisibilityAll}>видимость</div>
        </div>
    )
})