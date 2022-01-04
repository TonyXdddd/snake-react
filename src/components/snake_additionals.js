export const snakeNewSquareDetect = (moveType, currentFirstPosition) => {
  //calculation next render first square, based on current snake direction;
  switch (moveType) {
    case 'up': return [currentFirstPosition[0] - 1, currentFirstPosition[1]];
    case 'right': return [currentFirstPosition[0], currentFirstPosition[1] + 1];
    case 'down': return [currentFirstPosition[0] + 1, currentFirstPosition[1]];
    case 'left': return [currentFirstPosition[0], currentFirstPosition[1] - 1];
    default: return '';
  }
};

export const randomBootyPositionGeneration = (squaresCount) => Math.floor(Math.random() * (squaresCount - 1));

export const randomBootyColorGeneration = () => Math.floor(Math.random()*16777215).toString(16);

export const difficulty = {
  ease: 300,
  normal: 90,
  hard: 50,
  test: 2000,
}
