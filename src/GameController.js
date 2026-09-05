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
    if (this.mode !== 'computer') {
      return;
    }

    const fleet = [5, 4, 3, 3, 2];

    fleet.forEach((length) => {
      this.placeComputerShip(length);
    });
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

    // A hit allows the same player to attack again.
    // A miss switches to the other player.
    if (result === false) {
      this.currentPlayer = defendingPlayer;
    }

    return result;
  }

  playComputerTurn() {
    const move = this.computer.getComputerMove(this.player.gameboard);

    if (!move) {
      return null;
    }

    const result = this.player.gameboard.receiveAttack(move);

    if (this.player.gameboard.allShipsSunk()) {
      this.gameOver = true;
      this.winner = this.computer;
      return result;
    }

    if (result) {
      this.computer.rememberHit(move, this.player.gameboard);

      this.currentPlayer = this.computer;
    } else {
      this.currentPlayer = this.player;
    }

    return result;
  }
}

export default GameController;
