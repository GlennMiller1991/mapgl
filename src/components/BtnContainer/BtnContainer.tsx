import {tMode} from "../../types/types";
import React from "react";
import styles from './BtnContainer.module.css'

type tBtnContainer = {
    onLineCreateClick: () => void,
    onPointCreateClick: () => void,
    onExitClick: () => void,
    mode: tMode,
}
export const BtnContainer: React.FC<tBtnContainer> = React.memo(({
                                                                     onLineCreateClick,
                                                                     onPointCreateClick,
                                                                     onExitClick,
                                                                     mode
                                                                 }) => {
    return (
        <div className={styles.btnContainer}>
            <button className={styles.controlButton}
                    onClick={onLineCreateClick}>
                line
            </button>
            <button className={styles.controlButton}
                    onClick={onPointCreateClick}>
                point
            </button>
            {
                mode !== 'none' &&
                <button className={styles.controlButton}
                        onClick={onExitClick}>
                    exit
                </button>
            }
        </div>
    )
})