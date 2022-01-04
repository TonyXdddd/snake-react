import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  snakeNewSquareDetect,
  difficulty,
  randomBootyPositionGeneration,
  randomBootyColorGeneration
} from "./snake_additionals";
import classNames from "classnames";
import styles from './GameField.module.scss';

export const GameField = ({ squaresCount, toggleGameModeToMenu }) => {
  const [snakeDirection, setSnakeDirection] = useState('up');
  //first frame snake state(position);
  const [snakeProps, setSnakeProps] = useState({
    layout: [
      [squaresCount - 3, 0],
      [squaresCount - 2, 0],
      [squaresCount - 1, 0],
    ],
  });

  //Ref assignment on game field div for key press handling activation;
  const forFocusOnFieldRef = useRef(null);

  useEffect(() => {
    if (forFocusOnFieldRef) {
      forFocusOnFieldRef.current.focus();
    }
  }, [forFocusOnFieldRef]);

  //difficulty level;
  const difficultyTimeout = difficulty.normal;

  //mockup array for mapping(based on squaresCount);
  const mapArrTemplate = useMemo(() => Array(squaresCount).fill('_'), [squaresCount]);

  //Assignment square size based on screen size and squares count(in percentage);
  const squareSize = 100 / squaresCount;

  //creation once for saving field state between renders(mutable field);
  const memorizedField = useMemo(() => {
    return mapArrTemplate.map(() => (
      mapArrTemplate.map((_, i) => <Square key={'square' + i} squareSize={squareSize} />)
    ))
  }, [squaresCount, mapArrTemplate]);

  //Called per first rendering for creation first booty and trigger every time
  //after 'take' next booty(one out - on in);
  const randomBootyGeneration = () => {
    //random booty location and color gen
    const randomBootyColor = randomBootyColorGeneration();
    let currentRandomCoordinates = [randomBootyPositionGeneration(squaresCount), randomBootyPositionGeneration(squaresCount)];

    if (memorizedField[currentRandomCoordinates[0]][currentRandomCoordinates[1]].props.isSnakePart
      || memorizedField[currentRandomCoordinates[0]][currentRandomCoordinates[1]].props.isBooty) return randomBootyGeneration();

    return memorizedField[currentRandomCoordinates[0]][currentRandomCoordinates[1]] =
      <Square
        colorStyle={{backgroundColor: `#${randomBootyColor}`, boxShadow: `0 0 2vw #${randomBootyColor}`}}
        key={`${Math.random()}`}
        squareSize={squareSize}
        isBooty
      />
  };

  //Every render called function, that implementing update snake squares based on current state(look for :'snakeProps');
  const snakeIntoFieldImplement = () => {
    //useless surface copy.:D
    let emptyFieldCopy = [...memorizedField];
    const firstSquare = snakeProps.layout[0];

    //detection snakeProps.lastSquareToModify === not first render, cause we don't have this key initially.
    //this is > 1 Render
    if (snakeProps.lastSquareToModify) {
      //assignment new snake square
      emptyFieldCopy[firstSquare[0]][firstSquare[1]] =
        <Square key={`${Math.random()}`} squareSize={squareSize} isSnakePart />
      //snakeProps.isLastSquareAdd
      // ? 'snake eat the booty' and have new additional square on tail
      // : clear last square( for 'mowing effect while simple mowing)
      emptyFieldCopy[snakeProps.lastSquareToModify[0]][snakeProps.lastSquareToModify[1]] =
        <Square key={`${Math.random()}`} squareSize={squareSize} isSnakePart={snakeProps.isLastSquareAdd} />
    } else {
      //this is 1 Render
      //snake creation
      snakeProps.layout.forEach(prop =>
        emptyFieldCopy[prop[0]][prop[1]] = <Square key={`${Math.random()}`} squareSize={squareSize} isSnakePart />
      )
      //adding the first booty
      randomBootyGeneration()
    }

    // mapping [[Component, Component...],[Component, Component...]...]. Adding Squares into rows.
    // maybe need to see html layout in browser for understanding.

    //1st layer arr = Array[];
    //2nd layer arrays = of objects that return <Components /> (result of call <Square />);

    // 1st layer arr map
    return emptyFieldCopy.map((rowItems, i) => (
      <div
        key={'row' + i}
        style={{width: '100%', height: squareSize + '%'}}
        className={styles.row}
      >
      {/*2nd layer arrays*/}
        { rowItems.map(square => square) }
      </div>
    ));
  }

  //Used when useEffect trigger it: at the end of setTimeout or key press.
  const snakePositionStateUpdating = () => {
    let nextRenderLayout = snakeProps.layout;
    //detect new square based on direction
    const nextFirstSquare = snakeNewSquareDetect(snakeDirection, snakeProps.layout[0]);
    //if next render first square out of layout - back to menu(cause of out of layout);
    if (nextFirstSquare.find(value => value < 0 || value > 19)) toggleGameModeToMenu(nextRenderLayout.length);

    //if next render first square it is snake - bak to menu(cause of crash within);
    const nextSquareProps = memorizedField[nextFirstSquare[0]][nextFirstSquare[1]].props;
    if (nextSquareProps.isSnakePart) toggleGameModeToMenu(nextRenderLayout.length);

    const isNextSquareBooty = nextSquareProps.isBooty;

    const lastSquareToModify = nextRenderLayout[nextRenderLayout.length - 1];
    //if !isNextSquareBooty ? delete last snake square : leave in the structure to 'adding new last square effect'
    if (!isNextSquareBooty) nextRenderLayout.pop();
    //add new first square to state for next rendering update
    nextRenderLayout.unshift(nextFirstSquare);

    setSnakeProps({
      layout: nextRenderLayout,
      lastSquareToModify,
      isLastSquareAdd: isNextSquareBooty,
    })
  };

  //Adding Booty after old booty is given
  useEffect(() => {
    snakeProps.isLastSquareAdd && randomBootyGeneration();
  }, [snakeProps.isLastSquareAdd])

  //Set timeout at every rerender for updating snake state and 'moving' in next render.
  useEffect(() => {
    const snakeMoveTimeout = setTimeout(snakePositionStateUpdating, difficultyTimeout);
    return () => clearTimeout(snakeMoveTimeout);
  }, [snakeProps]);

  //immediate snake state updating while(when) key pressed
  useEffect(snakePositionStateUpdating, [snakeDirection]);

  //Changing snake direction that trigger useEffect => snakePositionStateUpdating();
  const onKeyPressed = (event, snakeDirection) => {
    setTimeout(() => {
      switch (event.code) {
        case 'ArrowUp':
          if (snakeDirection === 'down') return;
          return setSnakeDirection('up');
        case 'ArrowRight':
          if (snakeDirection === 'left') return;
          return setSnakeDirection('right');
        case 'ArrowDown':
          if (snakeDirection === 'up') return;
          return setSnakeDirection('down');
        case 'ArrowLeft':
          if (snakeDirection === 'right') return;
          return setSnakeDirection('left');
      }
    }, 10);
  }

  return (
      <div
        className={styles.field}
        ref={forFocusOnFieldRef}
        onKeyDown={(event) => onKeyPressed(event, snakeDirection)}
        tabIndex="0"
      >
        { snakeIntoFieldImplement() }
      </div>
  )
}

//reused square component
const Square = ({ squareSize, isSnakePart, isBooty, colorStyle }) => (
    <div
      style={{width: squareSize + '%', height: '100%', ...colorStyle}}
      className={classNames(
        //only square style - empty;
        styles.square,
        { [styles.squareFilled]: isSnakePart },
        { [styles.squareBooty]: isBooty },
      )}
    />
);
