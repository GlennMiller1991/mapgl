import React from 'react'
import {tMode} from "../../types/types";

type tControlPanel = {
    mode: tMode
}
export const ControlPanel: React.FC<tControlPanel> = React.memo(({
    mode,
                                                                 }) => {
    return (
        <div className={'controlPanel'}>
            <div>
                {
                    mode === 'point' &&
                    <>
                        <h1>
                            Добавление точки
                        </h1>
                        <p>
                            Кликните по карте, чтобы поставить точку
                        </p>
                    </>
                }
                {
                    mode === 'line' &&
                    <>
                        <h1>
                            Добавление линии
                        </h1>
                        <p>
                            Поставьте две точки на карте
                        </p>
                    </>
                }
            </div>
        </div>
    )
})