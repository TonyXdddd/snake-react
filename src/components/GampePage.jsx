import React, { useCallback, useState} from 'react';
import styles from './GamePage.module.scss'
import { GameField } from "./GameField";
import { MenuField } from "./MenuField";

export const GamePage = () => {
  const [gameData, setGameData] = useState({
    mode: 'menu',
    lastGameScore: null,
  });

  const toggleGameModeToMenu = useCallback((lastGameScore) => setGameData({mode: 'menu', lastGameScore}), []);
  const toggleGameModeToGame = useCallback(() => setGameData({mode: 'game'}), []);

  return (
    <div
      className={styles.page}
    >
      <div className={styles.backgroundCarrier}>
        { gameData.mode === 'game'
            ? <GameField squaresCount={20} toggleGameModeToMenu={toggleGameModeToMenu} />
            : <MenuField lastGameScore={gameData.lastGameScore} toggleGameModeToGame={toggleGameModeToGame} />
        }
      </div>
    </div>
    )
};
