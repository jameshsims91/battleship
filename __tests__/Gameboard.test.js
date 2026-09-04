import Gameboard from '../src/Gameboard.js';

describe('Gameboard', () => {
  test('places a ship on the board', () => {
    const gameboard = new Gameboard();

    gameboard.placeShip(3, [0, 0]);

    expect(gameboard.ships).toHaveLength(1);
  });

  test('receives an attack and hits a ship', () => {
    const gameboard = new Gameboard();

    gameboard.placeShip(3, [0, 0]);
    gameboard.receiveAttack([1, 0]);

    expect(gameboard.ships[0].hits).toBe(1);
  });

  test('records missed attacks', () => {
    const gameboard = new Gameboard();

    gameboard.receiveAttack([5, 5]);

    expect(gameboard.missedAttacks).toContainEqual([5, 5]);
  });

  test('reports whether all ships are sunk', () => {
    const gameboard = new Gameboard();

    gameboard.placeShip(2, [0, 0]);

    expect(gameboard.allShipsSunk()).toBe(false);

    gameboard.receiveAttack([0, 0]);
    gameboard.receiveAttack([1, 0]);

    expect(gameboard.allShipsSunk()).toBe(true);
  });

  test('does not allow the same coordinate to be attacked twice', () => {
    const gameboard = new Gameboard();

    gameboard.placeShip(2, [0, 0]);

    expect(gameboard.receiveAttack([0, 0])).toBe(true);
    expect(gameboard.receiveAttack([0, 0])).toBe(null);

    expect(gameboard.ships[0].hits).toBe(1);
  });

  test('does not place a ship outside the board', () => {
    const gameboard = new Gameboard();

    const result = gameboard.placeShip(4, [8, 0]);

    expect(result).toBe(false);
    expect(gameboard.ships).toHaveLength(0);
  });

  test('does not place a ship that overlaps another ship', () => {
    const gameboard = new Gameboard();

    gameboard.placeShip(4, [0, 0]);

    const result = gameboard.placeShip(3, [2, 0]);

    expect(result).toBe(false);
    expect(gameboard.ships).toHaveLength(1);
  });

  test('places a ship successfully when the coordinates are valid', () => {
    const gameboard = new Gameboard();

    const result = gameboard.placeShip(3, [0, 0]);

    expect(result).toBe(true);
    expect(gameboard.ships).toHaveLength(1);
  });
});
