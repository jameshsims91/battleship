import Player from '../src/Player.js';

describe('Player', () => {
  test('creates a player with a gameboard', () => {
    const player = new Player('real');
    expect(player.gameboard).toBeDefined();
  });

  test('computer can generate a legal move', () => {
    const computer = new Player('computer');

    const move = computer.getRandomMove();

    expect(move).toHaveLength(2);
    expect(computer.gameboard.hasBeenAttacked(move)).toBe(false);
  });

  test('computer does not choose an already attacked coordinate', () => {
    const computer = new Player('computer');

    computer.gameboard.receiveAttack([0, 0]);

    const move = computer.getRandomMove();

    expect(move).not.toEqual([0, 0]);
  });
});
