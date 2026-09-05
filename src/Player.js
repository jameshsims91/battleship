import Gameboard from './Gameboard.js';

class Player {
  constructor(type) {
    this.type = type;
    this.gameboard = new Gameboard();

    // Computer targeting state.
    this.targetQueue = [];
    this.lastHit = null;
  }

  getRandomMove(gameboard = this.gameboard) {
    const availableMoves = [];

    for (let y = 0; y < 10; y += 1) {
      for (let x = 0; x < 10; x += 1) {
        if (!gameboard.hasBeenAttacked([x, y])) {
          availableMoves.push([x, y]);
        }
      }
    }

    if (availableMoves.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * availableMoves.length);

    return availableMoves[randomIndex];
  }

  getComputerMove(gameboard) {
    // Remove targets that have already been attacked.
    this.targetQueue = this.targetQueue.filter(
      ([x, y]) => !gameboard.hasBeenAttacked([x, y]),
    );

    // After a hit, try an adjacent cell first.
    if (this.targetQueue.length > 0) {
      return this.targetQueue.shift();
    }

    // Otherwise, search randomly.
    return this.getRandomMove(gameboard);
  }

  rememberHit(coordinates, gameboard) {
    this.lastHit = coordinates;

    const [x, y] = coordinates;

    const adjacentMoves = [
      [x, y - 1], // Up
      [x + 1, y], // Right
      [x, y + 1], // Down
      [x - 1, y], // Left
    ];

    this.targetQueue.push(
      ...adjacentMoves.filter(
        ([nextX, nextY]) =>
          nextX >= 0 &&
          nextX < 10 &&
          nextY >= 0 &&
          nextY < 10 &&
          !gameboard.hasBeenAttacked([nextX, nextY]),
      ),
    );
  }

  clearTargets() {
    this.targetQueue = [];
    this.lastHit = null;
  }
}

export default Player;
