import Player from './Player.js';

class GameController {
  constructor(mode = 'computer') {
    this.mode = mode;
    this.player = new Player('player');
    this.computer = new Player(mode === 'player' ? 'player' : 'computer');
    this.currentPlayer = this.player;
    this.gameOver = false;
    this.winner = null;

    this.setupGame();
  }

  setupGame() {
    if (this.mode === 'computer') {
      const fleet = [5, 4, 3, 3, 2];

      fleet.forEach((length) => {
        this.placeComputerShip(length);
      });
    }
  }

  placeComputerShip(length) {
    let placed = false;

    while (!placed) {
      const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';

      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);

      placed = this.computer.gameboard.placeShip(length, [x, y], direction);
    }
  }

  placePlayerShip(length, start, direction = 'horizontal') {
    return this.player.gameboard.placeShip(length, start, direction);
  }

  placeSecondPlayerShip(length, start, direction = 'horizontal') {
    return this.computer.gameboard.placeShip(length, start, direction);
  }

  playTurn(coordinates) {
    const attackingPlayer = this.currentPlayer;
    const defendingPlayer =
      attackingPlayer === this.player ? this.computer : this.player;

    const result = defendingPlayer.gameboard.receiveAttack(coordinates);

    if (result === null) {
      return null;
    }

    if (defendingPlayer.gameboard.allShipsSunk()) {
      this.gameOver = true;
      this.winner = attackingPlayer;
      return result;
    }

    // Only switch players after a miss.
    if (result === false) {
      this.currentPlayer = defendingPlayer;
    }

    if (this.mode === 'computer' && this.currentPlayer === this.computer) {
      this.playComputerTurn();
    }

    return result;
  }

  playComputerTurn() {
    const move = this.computer.getRandomMove(this.player.gameboard);

    if (!move) {
      return null;
    }

    const result = this.player.gameboard.receiveAttack(move);

    if (this.player.gameboard.allShipsSunk()) {
      this.gameOver = true;
      this.winner = this.computer;
      return result;
    }

    this.currentPlayer = this.player;
    return result;
  }
}

export default GameController;
