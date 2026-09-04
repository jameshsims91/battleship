import Player from './Player.js';

class GameController {
  constructor() {
    this.player = new Player('real');
    this.computer = new Player('computer');
    this.currentPlayer = this.player;
    this.gameOver = false;
    this.winner = null;

    this.setupGame();
  }

  setupGame() {
    const shipLengths = [5, 4, 3, 3, 2];

    shipLengths.forEach((length) => {
      this.placeComputerShip(length);
    });
  }

  placeComputerShip(length) {
    let placed = false;

    while (!placed) {
      const direction = Math.random() < 0.5 ? 'horizonal' : 'vertical';

      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);

      placed = this.computer.gameboard.placeShip(length, [x, y], direction);
    }
  }

  placePlayerShip(length, start, direction = 'horizontal') {
    return this.player.gameboard.placeShip(length, start, direction);
  }

  playTurn(coordinates) {
    if (this.gameOver || this.currentPlayer !== this.player) {
      return null;
    }
    const result = this.computer.gameboard.receiveAttack(coordinates);

    if (result === null) {
      return null;
    }

    if (this.computer.gameboard.allShipsSunk()) {
      this.gameOver = true;
      this.winner = this.player;
      return result;
    }

    this.currentPlayer = this.computer;

    this.playComputerTurn();

    return result;
  }

  playComputerTurn() {
    if (this.gameOver) {
      return;
    }

    const move = this.computer.getRandomMove();

    if (move === null) {
      return;
    }

    this.player.gameboard.receiveAttack(move);

    if (this.player.gameboard.allShipsSunk()) {
      this.gameOver = true;
      this.winner = this.computer;
      return;
    }

    this.currentPlayer = this.player;
  }
}

export default GameController;
