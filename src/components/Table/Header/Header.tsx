import React, {MouseEvent} from "react";
import {tStateArrays} from "../../../types/types";
import styles from "./Header.module.css";

type tHeader = {
    onTabClick: (event: MouseEvent<HTMLDivElement>) => void,
    activeTab: tStateArrays,
}
export const Header: React.FC<tHeader> = React.memo(({
                                                         onTabClick,
                                                         activeTab,
                                                     }) => {
    return (
        <div className={styles.header}>
            <div data-name={'points'}
                 className={`flexCenter btn ${activeTab === 'points' ? styles.active : ''}`}
                 onClick={onTabClick}>
                Points
            </div>
            <div data-name={'lines'}
                 className={`flexCenter btn ${activeTab === 'lines' ? styles.active : ''}`}
                 onClick={onTabClick}>
                Lines
            </div>
        </div>
    )
})