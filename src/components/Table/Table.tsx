import {tLine, tPoint, tStateArrays} from "../../types/types";
import React, {MouseEvent, useCallback, useState} from "react";
import styles from './Table.module.css'
import {Row} from "./Row/Row";
import {Header} from "./Header/Header";
import {AllRow} from "./AllRow/AllRow";

type tTableState = {
    currentTab: tStateArrays
}
type tTable = {
    lines: tLine[],
    points: tPoint[],
    onDeleteClick: (element: tPoint | tLine) => void,
    onGoTo: (element: tPoint | tLine) => void,
    onChangeVisibility: (element: tPoint | tLine) => void,
    onDeleteAll: (type: tStateArrays) => void,
    onChangeVisibilityAll: (type: tStateArrays) => void,
}
export const Table: React.FC<tTable> = React.memo((props) => {
    const [tableState, setTableState] = useState<tTableState>({
        currentTab: 'points'
    })
    const onTabClick = useCallback((event: MouseEvent<HTMLDivElement>) => {
        const currentTab = event.currentTarget.dataset.name as tStateArrays
        setTableState(prev => ({...prev, currentTab}))
    }, [])
    const onDeleteAllClick = useCallback(() => {
        props.onDeleteAll(tableState.currentTab)
    }, [tableState.currentTab])
    const onChangeVisibilityAllClick = useCallback(() => {
        props.onChangeVisibilityAll(tableState.currentTab)
    }, [])
    return (
        <div className={styles.table}>
            <Header activeTab={tableState.currentTab} onTabClick={onTabClick}/>
            <div className={styles.body}>
                {
                    !!props[tableState.currentTab].length &&
                    <AllRow onDeleteAll={onDeleteAllClick}
                            onChangeVisibilityAll={onChangeVisibilityAllClick}
                    />
                }
                {
                    props[tableState.currentTab].map((element: tLine | tPoint) => {
                        return (
                            <Row key={element.id}
                                 element={element}
                                 onGoTo={props.onGoTo}
                                 onChangeVisibility={props.onChangeVisibility}
                                 onDeleteClick={props.onDeleteClick}
                            />
                        )
                    })
                }
            </div>
        </div>
    )
})

