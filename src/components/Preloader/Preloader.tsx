import React from "react";
import styles from './Preloader.module.css'
export const Preloader: React.FC = React.memo(() => {
    return (
        <div className={'allContainer ' + styles.preloader + ' flexCenter'}>
            Loading...
        </div>
    )
})