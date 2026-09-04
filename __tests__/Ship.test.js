import Ship from '../src/Ship.js';

describe('Ship', ()=> {
  test('creates a ship with the correct length', () => {
    const ship = new Ship(3);

    expect(ship.length).toBe(3);
  });

  test('starts with zero hits', () => {
    const ship = new Ship(3);

    expect(ship.hits).toBe(0);
  });

  test('hit() increases the number of hits', () => {
    const ship = new Ship(3);

    ship.hit();

    expect(ship.hits).toBe(1);
  });

  test('isSunk() returns false when hits are less than length', () => {
    const ship = new Ship(3);

    ship.hit();
    ship.hit();

    expect(ship.isSunk()).toBe(false);
  });

  test('isSunk() returns true when hits equal length', () => {
    const ship = new Ship(3);

    ship.hit();
    ship.hit();
    ship.hit();

    expect(ship.isSunk()).toBe(true);
  });
});
