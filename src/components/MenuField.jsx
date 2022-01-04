import React from "react";
import styles from './MenuField.module.scss'

export const MenuField = ({ lastGameScore, toggleGameModeToGame }) => {

  return (
    <div className={styles.menuScreen}>
      <div className={styles.afterGameScore}>
        { lastGameScore && `your score is ${lastGameScore}`}
      </div>
      <div
        className={styles.startTitle}
        onClick={toggleGameModeToGame}
        tabIndex="0"
      >
        { lastGameScore ? `Let's try again` : `Let's go`}
      </div>
    </div>
  )
}