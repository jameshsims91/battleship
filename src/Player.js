import Gameboard from './Gameboard.js';

class Player {
  constructor(type) {
    this.type = type;
    this.gameboard = new Gameboard();
  }

  getRandomMove() {
    const availableMoves = [];

    for (let y = 0; y < 10; y += 1) {
      for (let x = 0; x < 10; x += 1) {
        if (!this.gameboard.hasBeenAttacked([x, y])) {
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
}

export default Player;
