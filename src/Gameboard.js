import Ship from './Ship.js';

class Gameboard {
  constructor() {
    this.ships = [];
    this.missedAttacks = [];
    this.board = Array.from({ length: 10 }, () => Array(10).fill(null));
    this.attackedCoordinates = [];
  }

  placeShip(length, start, direction = 'horizontal') {
    const [x, y] = start;
    const coordinates = [];

    for (let i = 0; i < length; i += 1) {
      const currentX = direction === 'horizontal' ? x + i : x;
      const currentY = direction === 'horizontal' ? y : y + i;

      if (currentX < 0 || currentX >= 10 || currentY < 0 || currentY >= 10) {
        return false;
      }

      if (this.board[currentY][currentX] !== null) {
        return false;
      }

      coordinates.push([currentX, currentY]);
    }

    const ship = new Ship(length);

    coordinates.forEach(([currentX, currentY]) => {
      this.board[currentY][currentX] = ship;
    });

    this.ships.push(ship);

    return true;
  }

  receiveAttack(coordinates) {
    const [x, y] = coordinates;
    if (this.hasBeenAttacked(coordinates)) {
      return null;
    }

    this.attackedCoordinates.push(coordinates);

    const ship = this.board[y][x];

    if (ship) {
      ship.hit();
      return true;
    }

    this.missedAttacks.push(coordinates);
    return false;
  }

  hasBeenAttacked(coordinates) {
    return this.attackedCoordinates.some(
      ([x, y]) => x === coordinates[0] && y === coordinates[1],
    );
  }

  allShipsSunk() {
    return this.ships.every((ship) => ship.isSunk());
  }
}

export default Gameboard;
